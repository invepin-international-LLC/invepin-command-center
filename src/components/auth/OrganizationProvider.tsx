import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Organization, OrganizationMember, OrganizationContextType } from '@/types/organization';
import { toast } from '@/hooks/use-toast';

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrganizationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const organizationId = user.user_metadata?.organization_id;
      
      if (!organizationId) {
        setIsLoading(false);
        return;
      }

      // Load organization data - silently fail if table doesn't exist
      // Using any to bypass TypeScript checks for tables that may not exist
      const { data: orgData, error: orgError } = await (supabase as any)
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .maybeSingle();

      if (orgError) {
        console.log('Organizations table not configured:', orgError.message);
        setIsLoading(false);
        return;
      }

      // Load member role - silently fail if table doesn't exist
      const { data: memberData, error: memberError } = await (supabase as any)
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (memberError) {
        console.log('Organization members table not configured:', memberError.message);
      }

      setOrganization(orgData as Organization | null);
      setMemberRole(memberData?.role || user.user_metadata?.role || null);
    } catch (error) {
      console.log('Error in loadOrganizationData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizationData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadOrganizationData();
      } else if (event === 'SIGNED_OUT') {
        setOrganization(null);
        setMemberRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const switchOrganization = async (organizationId: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { organization_id: organizationId }
      });
      
      if (error) throw error;
      
      await loadOrganizationData();
      
      toast({
        title: "Organization Switched",
        description: "Successfully switched to the new organization",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshOrganization = async (): Promise<void> => {
    await loadOrganizationData();
  };

  return (
    <OrganizationContext.Provider value={{
      organization,
      memberRole,
      isLoading,
      switchOrganization,
      refreshOrganization,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}