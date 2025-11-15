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

interface OTAUpdateStatusRequest {
  device_uuid: string;
  ota_job_id: string;
  status: 'downloading' | 'verifying' | 'installing' | 'completed' | 'failed' | 'rollback';
  progress_percent?: number;
  error_message?: string;
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

    const { device_uuid, ota_job_id, status, progress_percent, error_message }: OTAUpdateStatusRequest = await req.json();

    console.log(`OTA update status from ${device_uuid}:`, { ota_job_id, status, progress_percent });

    // Authenticate device
    const { data: deviceAuth } = await supabase
      .from('device_auth')
      .select('*, devices!inner(id)')
      .eq('device_uuid', device_uuid)
      .single();

    if (!deviceAuth) {
      return new Response(
        JSON.stringify({ error: 'Device not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update OTA job status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (progress_percent !== undefined) {
      updateData.progress_percent = progress_percent;
    }

    if (status === 'downloading' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }

    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date().toISOString();
    }

    if (error_message) {
      updateData.error_message = error_message;
    }

    const { error: updateError } = await supabase
      .from('ota_updates')
      .update(updateData)
      .eq('id', ota_job_id)
      .eq('device_id', deviceAuth.devices.id);

    if (updateError) {
      console.error('Error updating OTA job:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update OTA status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update device firmware version if completed
    if (status === 'completed') {
      const { data: otaJob } = await supabase
        .from('ota_updates')
        .select('firmware_version_id, firmware_versions!inner(version)')
        .eq('id', ota_job_id)
        .single();

      if (otaJob) {
        await supabase
          .from('devices')
          .update({ 
            firmware_version: otaJob.firmware_versions.version,
            updated_at: new Date().toISOString()
          })
          .eq('id', deviceAuth.devices.id);
      }

      console.log(`OTA update completed for device ${device_uuid}`);
    }

    // Handle rollback
    if (status === 'rollback' && updateData.retry_count < (updateData.max_retries || 3)) {
      await supabase
        .from('ota_updates')
        .update({
          status: 'pending',
          retry_count: (updateData.retry_count || 0) + 1,
          error_message: error_message || 'Rollback initiated'
        })
        .eq('id', ota_job_id);

      console.log(`OTA rollback initiated for device ${device_uuid}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTA status updated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing OTA update:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
