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

interface TamperAlertRequest {
  device_uuid: string;
  event_type: 'physical_tamper' | 'unauthorized_access' | 'sensor_manipulation' | 'enclosure_opened' | 'wire_cut';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: {
    sensor_readings?: any;
    timestamp_device?: string;
    location?: { lat: number; lng: number };
    [key: string]: any;
  };
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

    const { device_uuid, event_type, severity, details }: TamperAlertRequest = await req.json();

    console.log(`TAMPER ALERT from device: ${device_uuid}`, { event_type, severity });

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
      .select('*, devices!inner(id, device_id, name, organization_id)')
      .eq('device_uuid', device_uuid)
      .single();

    if (authError || !deviceAuth) {
      console.error('Device auth failed:', device_uuid);
      return new Response(
        JSON.stringify({ error: 'Device authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert tamper event
    const { data: tamperEvent, error: insertError } = await supabase
      .from('tamper_events')
      .insert({
        device_id: deviceAuth.devices.id,
        organization_id: deviceAuth.devices.organization_id,
        event_type,
        severity,
        details: {
          ...details,
          device_name: deviceAuth.devices.name,
          device_uuid: device_uuid,
          reported_at: new Date().toISOString()
        },
        resolved: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting tamper event:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log tamper event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device status to indicate tamper
    await supabase
      .from('devices')
      .update({ 
        status: 'tampered',
        last_seen: new Date().toISOString()
      })
      .eq('id', deviceAuth.devices.id);

    // Log to blockchain audit trail for tamper-evident record
    await supabase
      .from('blockchain_audit_logs')
      .insert({
        organization_id: deviceAuth.devices.organization_id,
        event_type: 'device_tamper',
        event_data: {
          device_id: deviceAuth.devices.device_id,
          device_uuid: device_uuid,
          tamper_type: event_type,
          severity: severity,
          details: details
        },
        data_hash: '', // Will be calculated by trigger
        previous_hash: null
      });

    console.log(`CRITICAL: Tamper event logged: ${tamperEvent.id} - Severity: ${severity}`);

    // For critical tampers, return immediate action command
    if (severity === 'critical') {
      return new Response(
        JSON.stringify({
          success: true,
          event_id: tamperEvent.id,
          action: 'lock_device', // Device should lock itself
          alert_level: 'critical',
          message: 'Tamper detected - device locked'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        event_id: tamperEvent.id,
        message: 'Tamper event logged'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing tamper alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
