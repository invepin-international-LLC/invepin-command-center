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

interface DiagnosticsRequest {
  device_uuid: string;
  diagnostic_type: 'health_check' | 'performance' | 'connectivity' | 'sensor_calibration';
  metrics: {
    uptime_seconds?: number;
    memory_usage_percent?: number;
    cpu_usage_percent?: number;
    network_latency_ms?: number;
    ble_connection_count?: number;
    lora_signal_quality?: number;
    sensor_readings?: Record<string, number>;
    error_counts?: Record<string, number>;
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

    const { device_uuid, diagnostic_type, metrics }: DiagnosticsRequest = await req.json();

    console.log(`Diagnostics from device: ${device_uuid}`, { diagnostic_type });

    // Authenticate device
    const deviceSignature = req.headers.get('X-Device-Signature');
    if (!deviceSignature) {
      return new Response(
        JSON.stringify({ error: 'Device signature required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: deviceAuth } = await supabase
      .from('device_auth')
      .select('*, devices!inner(id, device_id, organization_id)')
      .eq('device_uuid', device_uuid)
      .single();

    if (!deviceAuth) {
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze metrics and determine status
    let status = 'healthy';
    const recommendations: string[] = [];

    if (metrics.memory_usage_percent && metrics.memory_usage_percent > 90) {
      status = 'warning';
      recommendations.push('High memory usage detected. Consider reboot or reduce buffer sizes.');
    }

    if (metrics.cpu_usage_percent && metrics.cpu_usage_percent > 85) {
      status = 'warning';
      recommendations.push('High CPU usage. Check for background tasks or reduce sampling rates.');
    }

    if (metrics.network_latency_ms && metrics.network_latency_ms > 1000) {
      status = 'warning';
      recommendations.push('High network latency. Check WiFi signal or switch to ethernet.');
    }

    if (metrics.error_counts) {
      const totalErrors = Object.values(metrics.error_counts).reduce((sum: number, count) => sum + (count as number), 0);
      if (totalErrors > 10) {
        status = 'error';
        recommendations.push(`${totalErrors} errors detected. Review device logs.`);
      }
    }

    if (diagnostic_type === 'sensor_calibration' && metrics.sensor_readings) {
      // Check if sensors are within expected ranges
      const readings = metrics.sensor_readings;
      if (readings.flow_sensor && (readings.flow_sensor < 0 || readings.flow_sensor > 1000)) {
        status = 'error';
        recommendations.push('Flow sensor out of range. Calibration required.');
      }
      if (readings.level_sensor && (readings.level_sensor < 0 || readings.level_sensor > 100)) {
        status = 'error';
        recommendations.push('Level sensor out of range. Calibration required.');
      }
    }

    // Insert diagnostic record
    const { data: diagnostic, error: insertError } = await supabase
      .from('device_diagnostics')
      .insert({
        device_id: deviceAuth.devices.id,
        diagnostic_type,
        status,
        metrics,
        recommendations
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting diagnostic:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to log diagnostic' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device health status
    await supabase
      .from('devices')
      .update({ 
        status: status === 'error' || status === 'critical' ? 'error' : 'online',
        last_seen: new Date().toISOString()
      })
      .eq('id', deviceAuth.devices.id);

    console.log(`Diagnostics logged: ${diagnostic.id} - Status: ${status}`);

    return new Response(
      JSON.stringify({
        success: true,
        diagnostic_id: diagnostic.id,
        status,
        recommendations,
        message: 'Diagnostic logged successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing diagnostics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
