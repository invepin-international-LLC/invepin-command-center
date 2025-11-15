import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelemetryPayload {
  device_id: string;
  data_type: string;
  payload: {
    battery?: number;
    rssi?: number;
    temperature?: number;
    gps?: {
      lat: number;
      lng: number;
      accuracy: number;
      altitude?: number;
      speed?: number;
    };
    [key: string]: any;
  };
  timestamp?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { device_id, data_type, payload, timestamp }: TelemetryPayload = await req.json();

    console.log(`Received telemetry from device: ${device_id}`, { data_type, payload });

    // Verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id, status')
      .eq('device_id', device_id)
      .single();

    if (deviceError || !device) {
      console.error('Device not found:', device_id);
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
