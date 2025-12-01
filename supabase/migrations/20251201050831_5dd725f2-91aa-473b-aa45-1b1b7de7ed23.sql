-- Add subscription tier and customer status to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'demo' CHECK (subscription_tier IN ('demo', 'starter', 'professional', 'enterprise')),
ADD COLUMN IF NOT EXISTS customer_status TEXT DEFAULT 'demo' CHECK (customer_status IN ('demo', 'trial', 'active', 'suspended', 'cancelled')),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS setup_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_organizations_customer_status ON public.organizations(customer_status);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_tier ON public.organizations(subscription_tier);

-- Add onboarding progress tracking
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, step_name)
);

-- Enable RLS on onboarding_progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their organization's onboarding progress
CREATE POLICY "Users can view their organization's onboarding progress"
  ON public.onboarding_progress
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Admins can manage onboarding progress
CREATE POLICY "Admins can manage onboarding progress"
  ON public.onboarding_progress
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager', 'company_admin')
    )
  );

-- Update trigger for onboarding_progress
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.organizations.subscription_tier IS 'Subscription plan: demo, starter, professional, enterprise';
COMMENT ON COLUMN public.organizations.customer_status IS 'Customer status: demo (unpaid), trial, active (paying), suspended, cancelled';
COMMENT ON COLUMN public.organizations.trial_ends_at IS 'When trial period ends';
COMMENT ON COLUMN public.organizations.onboarding_completed IS 'Whether customer has completed initial setup';
COMMENT ON TABLE public.onboarding_progress IS 'Tracks customer onboarding steps completion';