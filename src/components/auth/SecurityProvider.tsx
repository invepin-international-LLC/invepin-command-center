import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface SecurityContextType {
  user: any | null;
  userRole: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  isAuthorized: (requiredRoles: string[]) => boolean;
  updatePhoneNumber: (phone: string) => Promise<void>;
  updateEmailNotifications: (enabled: boolean) => Promise<void>;
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

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user?.user_metadata?.role) {
        const role = user.user_metadata.role;
        setUserRole(role);
        setPermissions(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.role) {
        const role = session.user.user_metadata.role;
        setUserRole(role);
        setPermissions(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []);
      } else {
        setUserRole(null);
        setPermissions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes('all') || permissions.includes(permission);
  };

  const isAuthorized = (requiredRoles: string[]): boolean => {
    return userRole ? requiredRoles.includes(userRole) : false;
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

  return (
    <SecurityContext.Provider value={{
      user,
      userRole,
      permissions,
      hasPermission,
      isAuthorized,
      updatePhoneNumber,
      updateEmailNotifications,
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