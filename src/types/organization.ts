export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'admin' | 'manager' | 'staff' | 'bartender';
  created_at: string;
}

export interface OrganizationContextType {
  organization: Organization | null;
  memberRole: string | null;
  isLoading: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganization: () => Promise<void>;
}