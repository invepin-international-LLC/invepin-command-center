import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { AIAnalysisSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Validate request body
    const rawBody = await req.json();
    const validation = AIAnalysisSchema.safeParse(rawBody);
    
    if (!validation.success) {
      console.error('AI analysis validation failed:', validation.error.format());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid analysis request', 
          details: validation.error.issues 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { analysisType, data, organizationId } = validation.data;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user belongs to the organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !membership) {
      return new Response(
        JSON.stringify({ error: 'Access denied: not a member of this organization' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Restrict to admins/managers only
    if (!['owner', 'admin', 'manager'].includes(membership.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions for AI analysis' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'theft_detection':
        systemPrompt = `You are an AI security analyst specializing in loss prevention. Analyze patterns to detect potential theft or suspicious behavior. Return structured insights with risk scores (0-100) and actionable recommendations.`;
        userPrompt = `Analyze this security data for potential theft patterns:\n${JSON.stringify(data, null, 2)}\n\nProvide: 1) Risk score, 2) Detected patterns, 3) Recommended actions`;
        break;
      
      case 'inventory_prediction':
        systemPrompt = `You are an AI inventory analyst. Predict future stock needs based on historical patterns, seasonality, and trends.`;
        userPrompt = `Analyze this inventory data and predict stock needs for the next 30 days:\n${JSON.stringify(data, null, 2)}\n\nProvide specific quantity predictions for each item.`;
        break;
      
      case 'anomaly_detection':
        systemPrompt = `You are an AI anomaly detection system. Identify unusual patterns in operational data that could indicate problems, fraud, or inefficiencies.`;
        userPrompt = `Analyze this operational data for anomalies:\n${JSON.stringify(data, null, 2)}\n\nHighlight any unusual patterns with severity levels.`;
        break;
      
      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Store learning data for future improvements
    await supabase.from('ai_learning_data').insert({
      organization_id: organizationId,
      data_type: analysisType,
      features: data,
      confidence_score: 85, // Could be extracted from AI response
      model_version: 'gemini-2.5-flash-v1',
      processed_at: new Date().toISOString(),
    });

    console.log('AI analysis completed:', analysisType);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        timestamp: new Date().toISOString() 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ai-loss-prevention:', error);
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
