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

interface FirmwareCheckRequest {
  device_uuid: string;
  current_version: string;
  device_type: string;
  battery_level?: number;
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

    const { device_uuid, current_version, device_type, battery_level = 100 }: FirmwareCheckRequest = await req.json();

    console.log(`Firmware check from device: ${device_uuid}`, { current_version, device_type });

    // Authenticate device
    const deviceSignature = req.headers.get('X-Device-Signature');
    if (!deviceSignature) {
      return new Response(
        JSON.stringify({ error: 'Device signature required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get device and verify signature
    const { data: deviceAuth, error: authError } = await supabase
      .from('device_auth')
      .select('*, devices!inner(id, device_id, device_type_id, organization_id)')
      .eq('device_uuid', device_uuid)
      .single();

    if (authError || !deviceAuth || deviceAuth.is_locked) {
      console.error('Device auth failed:', device_uuid);
      return new Response(
        JSON.stringify({ error: 'Device authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get device type
    const { data: deviceTypeData } = await supabase
      .from('device_types')
      .select('id, name, model')
      .eq('id', deviceAuth.devices.device_type_id)
      .single();

    // Check for available firmware updates
    const { data: latestFirmware, error: firmwareError } = await supabase
      .from('firmware_versions')
      .select('*')
      .eq('device_type_id', deviceAuth.devices.device_type_id)
      .eq('release_channel', 'stable')
      .order('build_number', { ascending: false })
      .limit(1)
      .single();

    if (firmwareError || !latestFirmware) {
      console.log('No firmware available for device type');
      return new Response(
        JSON.stringify({ 
          update_available: false,
          current_version,
          message: 'No firmware updates available'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if update is available and device meets requirements
    const updateAvailable = latestFirmware.version !== current_version;
    const batteryOk = battery_level >= (latestFirmware.min_battery_level || 30);

    if (updateAvailable && batteryOk) {
      // Create OTA update job if not exists
      const { data: existingJob } = await supabase
        .from('ota_updates')
        .select('id, status')
        .eq('device_id', deviceAuth.devices.id)
        .eq('firmware_version_id', latestFirmware.id)
        .in('status', ['pending', 'downloading', 'verifying'])
        .single();

      if (!existingJob) {
        await supabase.from('ota_updates').insert({
          device_id: deviceAuth.devices.id,
          firmware_version_id: latestFirmware.id,
          status: 'pending',
          scheduled_at: new Date().toISOString()
        });
      }

      console.log(`Firmware update available for ${device_uuid}: ${current_version} -> ${latestFirmware.version}`);

      return new Response(
        JSON.stringify({
          update_available: true,
          current_version,
          latest_version: latestFirmware.version,
          build_number: latestFirmware.build_number,
          file_url: latestFirmware.file_url,
          file_hash: latestFirmware.file_hash,
          file_size_bytes: latestFirmware.file_size_bytes,
          signature: latestFirmware.signature,
          is_mandatory: latestFirmware.is_mandatory,
          requires_backup: latestFirmware.requires_backup,
          rollback_version: latestFirmware.rollback_version,
          changelog: latestFirmware.changelog
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (updateAvailable && !batteryOk) {
      console.log(`Device ${device_uuid} battery too low for update: ${battery_level}%`);
      return new Response(
        JSON.stringify({
          update_available: true,
          update_blocked: true,
          reason: 'low_battery',
          current_version,
          latest_version: latestFirmware.version,
          required_battery: latestFirmware.min_battery_level,
          current_battery: battery_level
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Device ${device_uuid} is up to date: ${current_version}`);
    return new Response(
      JSON.stringify({
        update_available: false,
        current_version,
        message: 'Device firmware is up to date'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking firmware:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
