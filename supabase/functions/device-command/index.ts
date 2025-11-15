import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandRequest {
  device_id: string;
  command_type: string;
  payload?: Record<string, any>;
  priority?: number;
  expires_in?: number; // seconds
}

interface CommandAcknowledge {
  command_id: string;
  status: 'acknowledged' | 'failed';
  result?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Issue a new command
    if (req.method === 'POST' && path === 'device-command') {
      const { device_id, command_type, payload, priority, expires_in }: CommandRequest = await req.json();

      console.log(`Issuing command to device: ${device_id}`, { command_type, payload });

      // Get device UUID from device_id
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select('id, organization_id')
        .eq('device_id', device_id)
        .single();

      if (deviceError || !device) {
        return new Response(
          JSON.stringify({ error: 'Device not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: { user } } = await supabase.auth.getUser();

      const expiresAt = expires_in 
        ? new Date(Date.now() + expires_in * 1000).toISOString()
        : new Date(Date.now() + 300000).toISOString(); // Default 5 minutes

      const { data: command, error: commandError } = await supabase
        .from('device_commands')
        .insert({
          device_id: device.id,
          command_type,
          payload: payload || {},
          priority: priority || 0,
          issued_by: user?.id,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (commandError) {
        console.error('Error creating command:', commandError);
        return new Response(
          JSON.stringify({ error: 'Failed to create command' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Command created: ${command.id}`);

      return new Response(
        JSON.stringify({
          success: true,
          command_id: command.id,
          message: 'Command queued for device'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Acknowledge command execution (from device)
    if (req.method === 'POST' && path === 'acknowledge') {
      const { command_id, status, result }: CommandAcknowledge = await req.json();

      console.log(`Acknowledging command: ${command_id}`, { status, result });

      const { error: updateError } = await supabase
        .from('device_commands')
        .update({
          status,
          acknowledged_at: new Date().toISOString(),
          result: result || {}
        })
        .eq('id', command_id);

      if (updateError) {
        console.error('Error acknowledging command:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to acknowledge command' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing command:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
