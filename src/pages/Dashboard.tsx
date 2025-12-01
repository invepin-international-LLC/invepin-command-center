import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { createClient } from '@supabase/supabase-js';

// Create supabase client with fallback values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dvqikpzjqycktlqwjkeq.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cWlrcHpqcXlja3RscXdqa2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTUwMzYsImV4cCI6MjA3NTY3MTAzNn0.ASFaYcXva1029tLkcsTVHM-5ulCI_oaxVzhpKh74wg0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'manager' | 'bartender' | 'staff';
  name: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for auto-login parameter
    const autoLogin = searchParams.get('autoLogin');
    if (autoLogin && !user) {
      const demoUsers: Record<string, User> = {
        admin: { id: 'demo-admin', email: 'admin@invepin.com', role: 'super_admin', name: 'Admin User' },
        company: { id: 'demo-company', email: 'company@invepin.com', role: 'company_admin', name: 'Company Admin' },
        manager: { id: 'demo-manager', email: 'manager@invepin.com', role: 'manager', name: 'Manager User' },
        bartender: { id: 'demo-bartender', email: 'bartender@invepin.com', role: 'bartender', name: 'Bartender User' },
        staff: { id: 'demo-staff', email: 'staff@invepin.com', role: 'staff', name: 'Staff User' },
      };
      const demoUser = demoUsers[autoLogin as keyof typeof demoUsers] || demoUsers.admin;
      setUser(demoUser);
      return;
    }

    let mounted = true;

    const mapUser = (u: any): User => ({
      id: u.id,
      email: u.email ?? "",
      role: (u.user_metadata?.role as User['role']) ?? 'staff',
      name: (u.user_metadata?.name as string) ?? (u.email?.split("@")[0] ?? "User"),
    });

    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted && data.user) setUser(mapUser(data.user));
      } catch {
        // Supabase not configured; ignore
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) setUser(mapUser(session.user));
      else setUser(null);
    });

    return () => {
      mounted = false;
      // @ts-ignore - optional chaining for older typing
      sub?.subscription?.unsubscribe?.();
    };
  }, [searchParams]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore if not configured
    }
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainDashboard user={user} onLogout={handleLogout} />;
};

export default Dashboard;