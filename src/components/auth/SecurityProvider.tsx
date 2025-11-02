import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useOrganization } from './OrganizationProvider';

interface UserSecurity {
  mfa_enabled: boolean;
  mfa_phone_verified: boolean;
  password_expires_at: string;
  account_locked_until: string | null;
  failed_login_attempts: number;
}

interface SecurityContextType {
  user: any | null;
  userRole: string | null;
  permissions: string[];
  userSecurity: UserSecurity | null;
  hasPermission: (permission: string) => boolean;
  isAuthorized: (requiredRoles: string[]) => boolean;
  updatePhoneNumber: (phone: string) => Promise<void>;
  updateEmailNotifications: (enabled: boolean) => Promise<void>;
  checkPasswordExpiry: () => boolean;
  isAccountLocked: () => boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

const ROLE_PERMISSIONS = {
  admin: ['all'],
  manager: ['view_cameras', 'manage_inventory', 'view_reports', 'manage_staff', 'chat_access'],
  staff: ['view_cameras', 'basic_inventory', 'chat_access'],
  bartender: ['view_cameras', 'pour_tracking', 'inventory_alerts', 'chat_access']
};

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userSecurity, setUserSecurity] = useState<UserSecurity | null>(null);
  const { memberRole, organization } = useOrganization();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      // Use organization role if available, otherwise fall back to user metadata
      const role = memberRole || user?.user_metadata?.role;
      if (role) {
        setUserRole(role);
        setPermissions(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []);
      }
      
      // Load user security settings
      if (user) {
        loadUserSecurity(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      const role = memberRole || session?.user?.user_metadata?.role;
      if (role) {
        setUserRole(role);
        setPermissions(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []);
      } else {
        setUserRole(null);
        setPermissions([]);
      }
      
      // Load user security settings
      if (session?.user) {
        loadUserSecurity(session.user.id);
      } else {
        setUserSecurity(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [memberRole]);

  // Update role when organization member role changes
  useEffect(() => {
    if (memberRole && user) {
      setUserRole(memberRole);
      setPermissions(ROLE_PERMISSIONS[memberRole as keyof typeof ROLE_PERMISSIONS] || []);
    }
  }, [memberRole, user]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes('all') || permissions.includes(permission);
  };

  const isAuthorized = (requiredRoles: string[]): boolean => {
    // Check if user has valid organization membership
    if (!organization || !memberRole) return false;
    return requiredRoles.includes(memberRole);
  };

  const updatePhoneNumber = async (phone: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        phone: phone,
        data: { phone_verified: false }
      });
      
      if (error) throw error;
      
      toast({
        title: "Phone Updated",
        description: "Phone number updated successfully. Verification SMS sent.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateEmailNotifications = async (enabled: boolean): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { email_notifications: enabled }
      });
      
      if (error) throw error;
      
      toast({
        title: "Settings Updated",
        description: `Email notifications ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadUserSecurity = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_security')
        .select('mfa_enabled, mfa_phone_verified, password_expires_at, account_locked_until, failed_login_attempts')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (data) setUserSecurity(data);
    } catch (error) {
      console.error('Error loading user security:', error);
    }
  };

  const checkPasswordExpiry = (): boolean => {
    if (!userSecurity) return false;
    const expiryDate = new Date(userSecurity.password_expires_at);
    return expiryDate < new Date();
  };

  const isAccountLocked = (): boolean => {
    if (!userSecurity?.account_locked_until) return false;
    const lockoutDate = new Date(userSecurity.account_locked_until);
    return lockoutDate > new Date();
  };

  return (
    <SecurityContext.Provider value={{
      user,
      userRole,
      permissions,
      userSecurity,
      hasPermission,
      isAuthorized,
      updatePhoneNumber,
      updateEmailNotifications,
      checkPasswordExpiry,
      isAccountLocked,
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}