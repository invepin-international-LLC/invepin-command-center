import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { supabase } from "@/lib/supabaseClient";

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
  }, [searchParams, user]);

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