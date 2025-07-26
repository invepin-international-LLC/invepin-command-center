import { useState } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MainDashboard } from "@/components/dashboard/MainDashboard";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
