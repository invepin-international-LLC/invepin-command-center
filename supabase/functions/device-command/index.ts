import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DeviceCommandSchema, UUIDSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandAcknowledge {
  command_id: string;
  status: 'sent' | 'completed' | 'failed';
  result?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Issue a new command
    if (req.method === 'POST' && path === 'device-command') {
      // Validate input
      const rawBody = await req.json();
      const validation = DeviceCommandSchema.safeParse(rawBody);
      
      if (!validation.success) {
        console.error('Command validation failed:', validation.error.format());
        return new Response(
          JSON.stringify({ 
            error: 'Invalid command payload', 
            details: validation.error.issues 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { device_id, command_type, payload, priority, expires_in } = validation.data;

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

      // Verify user has permission for device's organization
      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', device.organization_id)
        .eq('user_id', user.id)
        .single();

      if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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
      const rawBody = await req.json();
      
      // Validate command_id is UUID
      const commandIdValidation = UUIDSchema.safeParse(rawBody.command_id);
      if (!commandIdValidation.success) {
        return new Response(
          JSON.stringify({ error: 'Invalid command_id format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { command_id, status, result }: CommandAcknowledge = rawBody;

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
