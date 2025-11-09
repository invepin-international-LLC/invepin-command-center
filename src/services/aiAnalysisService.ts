import { supabase } from "@/integrations/supabase/client";

export interface AIAnalysisResult {
  success: boolean;
  analysis: string;
  timestamp: string;
}

export const aiAnalysisService = {
  /**
   * Analyze data for theft patterns using AI
   */
  async analyzeTheftPatterns(
    data: any,
    organizationId: string
  ): Promise<AIAnalysisResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-loss-prevention',
      {
        body: {
          analysisType: 'theft_detection',
          data,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Predict future inventory needs using AI
   */
  async predictInventoryNeeds(
    inventoryData: any,
    organizationId: string
  ): Promise<AIAnalysisResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-loss-prevention',
      {
        body: {
          analysisType: 'inventory_prediction',
          data: inventoryData,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Detect anomalies in operational data
   */
  async detectAnomalies(
    operationalData: any,
    organizationId: string
  ): Promise<AIAnalysisResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-loss-prevention',
      {
        body: {
          analysisType: 'anomaly_detection',
          data: operationalData,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Get cached predictions for display
   */
  async getPredictions(
    organizationId: string,
    predictionType: string
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from('predictive_analytics')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('prediction_type', predictionType)
      .gt('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
