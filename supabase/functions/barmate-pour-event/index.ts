/*
 * Invepin BarMate / Invepin Ecosystem Firmware
 * © 2025 Invepin International LLC. All rights reserved.
 * Invepin®, Invepin BarMate™, Colony Hub™, and The Hive™
 * are trademarks or registered trademarks of Invepin International LLC.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-uuid, x-device-signature',
};

interface PourEventRequest {
  device_uuid: string;
  volume_ml: number;
  flow_rate?: number;
  duration_seconds?: number;
  product_name?: string;
  authorized_method?: string; // facial_id, thumbprint, qr_code, manual
  user_id?: string; // Optional: if authorized by specific user
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

    const { 
      device_uuid, 
      volume_ml, 
      flow_rate, 
      duration_seconds, 
      product_name, 
      authorized_method, 
      user_id,
      timestamp 
    }: PourEventRequest = await req.json();

    console.log(`Pour event from device: ${device_uuid}`, { volume_ml, product_name });

    // Authenticate device
    const deviceSignature = req.headers.get('X-Device-Signature');
    if (!deviceSignature) {
      return new Response(
        JSON.stringify({ error: 'Device signature required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get device
    const { data: deviceAuth, error: authError } = await supabase
      .from('device_auth')
      .select('*, devices!inner(id, device_id, organization_id, device_type_id, device_types!inner(name, model))')
      .eq('device_uuid', device_uuid)
      .single();

    if (authError || !deviceAuth || deviceAuth.is_locked) {
      console.error('Device auth failed:', device_uuid);
      return new Response(
        JSON.stringify({ error: 'Device authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify device is a BarMate
    if (!deviceAuth.devices.device_types.model.includes('BarMate')) {
      return new Response(
        JSON.stringify({ error: 'Pour events only supported for BarMate devices' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert pour event
    const { data: pourEvent, error: insertError } = await supabase
      .from('pour_events')
      .insert({
        device_id: deviceAuth.devices.id,
        organization_id: deviceAuth.devices.organization_id,
        user_id: user_id || null,
        volume_ml,
        flow_rate,
        duration_seconds,
        product_name,
        authorized_method: authorized_method || 'manual',
        tamper_detected: false,
        timestamp: timestamp || new Date().toISOString(),
        metadata: {
          device_type: deviceAuth.devices.device_types.name,
          device_model: deviceAuth.devices.device_types.model
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting pour event:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log pour event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device last_seen
    await supabase
      .from('devices')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', deviceAuth.devices.id);

    console.log(`Pour event logged: ${pourEvent.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        event_id: pourEvent.id,
        message: 'Pour event logged successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing pour event:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
