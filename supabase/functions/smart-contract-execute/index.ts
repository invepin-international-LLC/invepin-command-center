import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractType, contractData, organizationId } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Simulate smart contract execution
    const gasEquivalent = Math.floor(Math.random() * 100000) + 50000;
    
    // Create smart contract log
    const { data: contractLog, error: contractError } = await supabase
      .from('smart_contract_logs')
      .insert({
        organization_id: organizationId,
        contract_type: contractType,
        contract_data: contractData,
        status: 'executed',
        executed_at: new Date().toISOString(),
        executed_by: user.id,
        gas_equivalent: gasEquivalent,
      })
      .select()
      .single();

    if (contractError) throw contractError;

    // Log to blockchain audit trail
    const supabaseService = createClient(
      supabaseUrl, 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: previousLog } = await supabaseService
      .from('blockchain_audit_logs')
      .select('data_hash')
      .eq('organization_id', organizationId)
      .order('block_number', { ascending: false })
      .limit(1)
      .single();

    const eventData = {
      type: 'smart_contract_executed',
      contract_id: contractLog.id,
      contract_type: contractType,
      executed_by: user.id,
      timestamp: new Date().toISOString(),
      data: contractData,
    };

    // Calculate hash for blockchain integrity
    const hashInput = JSON.stringify(eventData) + (previousLog?.data_hash || '0');
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const dataHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await supabaseService.from('blockchain_audit_logs').insert({
      organization_id: organizationId,
      user_id: user.id,
      event_type: 'smart_contract_executed',
      event_data: eventData,
      data_hash: dataHash,
      previous_hash: previousLog?.data_hash || null,
    });

    console.log('Smart contract executed:', contractType);

    return new Response(
      JSON.stringify({ 
        success: true,
        contractId: contractLog.id,
        gasEquivalent,
        blockchainHash: dataHash,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in smart-contract-execute:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
