export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  subscription_tier: 'demo' | 'starter' | 'professional' | 'enterprise';
  customer_status: 'demo' | 'trial' | 'active' | 'suspended' | 'cancelled';
  trial_ends_at?: string;
  onboarding_completed: boolean;
  purchased_at?: string;
  setup_completed_at?: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'admin' | 'manager' | 'staff' | 'bartender';
  created_at: string;
}

export interface OnboardingProgress {
  id: string;
  organization_id: string;
  step_name: string;
  completed: boolean;
  completed_at?: string;
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationContextType {
  organization: Organization | null;
  memberRole: string | null;
  isLoading: boolean;
  isDemoMode: boolean;
  isPaidCustomer: boolean;
  isTrialCustomer: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganization: () => Promise<void>;
}