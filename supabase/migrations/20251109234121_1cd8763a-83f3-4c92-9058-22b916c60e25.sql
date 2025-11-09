-- Create blockchain audit log table for immutable records
CREATE TABLE IF NOT EXISTS public.blockchain_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  data_hash text NOT NULL, -- SHA-256 hash for integrity verification
  previous_hash text, -- Link to previous record for chain integrity
  block_number bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  blockchain_tx_id text, -- For future blockchain integration
  is_synced_to_chain boolean DEFAULT false
);

-- Create AI learning data table for pattern recognition
CREATE TABLE IF NOT EXISTS public.ai_learning_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  data_type text NOT NULL, -- 'theft_pattern', 'inventory_trend', 'behavior_anomaly'
  features jsonb NOT NULL, -- Feature vector for ML
  label text, -- Classification label
  confidence_score numeric(5,2),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone,
  model_version text
);

-- Create smart contract simulations table
CREATE TABLE IF NOT EXISTS public.smart_contract_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  contract_type text NOT NULL, -- 'approval', 'inventory_transfer', 'access_grant'
  contract_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'executed', 'failed'
  executed_at timestamp with time zone,
  executed_by uuid REFERENCES auth.users(id),
  gas_equivalent integer, -- Simulated gas cost for future chain deployment
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create predictive analytics cache table
CREATE TABLE IF NOT EXISTS public.predictive_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  prediction_type text NOT NULL, -- 'stock_forecast', 'theft_risk', 'demand_prediction'
  target_date date NOT NULL,
  predictions jsonb NOT NULL,
  confidence_score numeric(5,2),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  valid_until timestamp with time zone NOT NULL
);

-- Enable RLS
ALTER TABLE public.blockchain_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contract_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blockchain_audit_logs
CREATE POLICY "Organization members can view audit logs"
  ON public.blockchain_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = blockchain_audit_logs.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs"
  ON public.blockchain_audit_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ai_learning_data
CREATE POLICY "Admins can view AI learning data"
  ON public.ai_learning_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = ai_learning_data.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "System can manage AI learning data"
  ON public.ai_learning_data FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for smart_contract_logs
CREATE POLICY "Organization members can view contracts"
  ON public.smart_contract_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = smart_contract_logs.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can execute contracts"
  ON public.smart_contract_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = smart_contract_logs.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for predictive_analytics
CREATE POLICY "Organization members can view predictions"
  ON public.predictive_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = predictive_analytics.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage predictions"
  ON public.predictive_analytics FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_blockchain_audit_logs_org ON public.blockchain_audit_logs(organization_id);
CREATE INDEX idx_blockchain_audit_logs_block ON public.blockchain_audit_logs(block_number);
CREATE INDEX idx_blockchain_audit_logs_hash ON public.blockchain_audit_logs(data_hash);
CREATE INDEX idx_ai_learning_data_org ON public.ai_learning_data(organization_id);
CREATE INDEX idx_ai_learning_data_type ON public.ai_learning_data(data_type);
CREATE INDEX idx_smart_contract_logs_org ON public.smart_contract_logs(organization_id);
CREATE INDEX idx_smart_contract_logs_status ON public.smart_contract_logs(status);
CREATE INDEX idx_predictive_analytics_org ON public.predictive_analytics(organization_id);
CREATE INDEX idx_predictive_analytics_type_date ON public.predictive_analytics(prediction_type, target_date);

-- Function to calculate data hash for blockchain integrity
CREATE OR REPLACE FUNCTION calculate_audit_hash(event_data jsonb, previous_hash text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hash_input text;
BEGIN
  hash_input := event_data::text || COALESCE(previous_hash, '0');
  RETURN encode(digest(hash_input, 'sha256'), 'hex');
END;
$$;