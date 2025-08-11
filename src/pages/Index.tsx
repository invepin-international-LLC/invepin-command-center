import { useEffect, useState } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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
  }, []);

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

export default Index;
