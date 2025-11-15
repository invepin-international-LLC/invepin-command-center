import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { TelemetrySchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-api-key',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    const rawBody = await req.json();
    const validation = TelemetrySchema.safeParse(rawBody);
    
    if (!validation.success) {
      console.error('Telemetry validation failed:', validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid telemetry payload', 
          details: validation.error.issues 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { device_id, data_type, payload, timestamp } = validation.data;

    // Verify device API key
    const apiKey = req.headers.get('X-Device-API-Key');
    if (!apiKey) {
      console.error('Missing device API key for:', device_id);
      return new Response(
        JSON.stringify({ error: 'Device authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify device exists and validate API key
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id, status, organization_id, metadata')
      .eq('device_id', device_id)
      .single();

    if (deviceError || !device) {
      console.error('Device not found:', device_id);
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify API key matches device
    const expectedApiKey = device.metadata?.api_key || Deno.env.get('DEVICE_API_KEY');
    if (apiKey !== expectedApiKey) {
      console.error('Invalid API key for device:', device_id);
      return new Response(
        JSON.stringify({ error: 'Invalid device credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Authenticated telemetry from device: ${device_id}`, { data_type });

    // Insert telemetry data
    const { error: insertError } = await supabase
      .from('device_data')
      .insert({
        device_id: device.id,
        data_type,
        payload,
        timestamp: timestamp || new Date().toISOString(),
        rssi: payload.rssi,
        battery_level: payload.battery,
        gps_location: payload.gps ? {
          type: 'Point',
          coordinates: [payload.gps.lng, payload.gps.lat],
          accuracy: payload.gps.accuracy,
          altitude: payload.gps.altitude,
          speed: payload.gps.speed
        } : null
      });

    if (insertError) {
      console.error('Error inserting telemetry:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store telemetry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device status and last_seen
    const newStatus = payload.battery && payload.battery < 20 ? 'low_battery' : 'online';
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        status: newStatus,
        last_seen: new Date().toISOString(),
        battery_level: payload.battery,
        signal_strength: payload.rssi,
        location: payload.gps ? {
          lat: payload.gps.lat,
          lng: payload.gps.lng,
          accuracy: payload.gps.accuracy,
          timestamp: timestamp || new Date().toISOString()
        } : undefined
      })
      .eq('id', device.id);

    if (updateError) {
      console.error('Error updating device:', updateError);
    }

    // Check for pending commands
    const { data: commands } = await supabase
      .from('device_commands')
      .select('*')
      .eq('device_id', device.id)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(5);

    console.log(`Telemetry processed for device: ${device_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        commands: commands || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing telemetry:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
