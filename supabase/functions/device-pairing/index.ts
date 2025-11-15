import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PairingSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organization_id) {
      return new Response(
        JSON.stringify({ error: 'User not associated with an organization' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const rawBody = await req.json();
    const validation = PairingSchema.safeParse(rawBody);
    
    if (!validation.success) {
      console.error('Pairing validation failed:', validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid pairing payload', 
          details: validation.error.issues 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { device_id, device_type, name, mac_address, serial_number, metadata } = validation.data;

    console.log(`Pairing device: ${device_id}`, { device_type, name });

    // Get device type
    const { data: deviceType, error: typeError } = await supabase
      .from('device_types')
      .select('id')
      .eq('category', device_type)
      .eq('manufacturer', 'Invepin')
      .single();

    if (typeError || !deviceType) {
      return new Response(
        JSON.stringify({ error: 'Device type not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if device already exists
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('id, organization_id')
      .eq('device_id', device_id)
      .single();

    if (existingDevice) {
      if (existingDevice.organization_id && existingDevice.organization_id !== profile.organization_id) {
        return new Response(
          JSON.stringify({ error: 'Device already paired to another organization' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update existing device
      const { data: updatedDevice, error: updateError } = await supabase
        .from('devices')
        .update({
          organization_id: profile.organization_id,
          name: name || `Device ${device_id}`,
          mac_address,
          serial_number,
          metadata: metadata || {},
          paired_at: new Date().toISOString(),
          paired_by: user.id,
          status: 'online'
        })
        .eq('id', existingDevice.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating device:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to pair device' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          device: updatedDevice,
          message: 'Device paired successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new device
    const { data: newDevice, error: createError } = await supabase
      .from('devices')
      .insert({
        device_type_id: deviceType.id,
        organization_id: profile.organization_id,
        device_id,
        name: name || `Device ${device_id}`,
        mac_address,
        serial_number,
        metadata: metadata || {},
        paired_at: new Date().toISOString(),
        paired_by: user.id,
        status: 'online',
        firmware_version: '1.0.0'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating device:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to pair device' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Device paired: ${newDevice.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        device: newDevice,
        message: 'Device paired successfully'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error pairing device:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
