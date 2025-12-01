import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, Wifi, Cloud, Activity, Database, Zap, Eye, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Link } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'manager' | 'bartender' | 'staff';
  name: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState(18);
  const [inventoryValue, setInventoryValue] = useState(847230);
  const [alertCount, setAlertCount] = useState(0);
  const { toast } = useToast();
  // Demo mode for testing
  const demoMode = new URLSearchParams(window.location.search).get('demo') === '1';

  // Simulate real-time data updates
  useEffect(() => {
    const intervals = [
      // Simulate device connections
      setInterval(() => {
        setConnectedDevices(prev => {
          const newCount = Math.min(prev + 1, 24);
          return newCount;
        });
      }, 800),
      
      // Simulate inventory value updates
      setInterval(() => {
        setInventoryValue(prev => {
          const base = 847230;
          return base + Math.floor(Math.random() * 10000);
        });
      }, 2000),
      
      // Simulate alert updates
      setInterval(() => {
        setAlertCount(Math.floor(Math.random() * 3));
      }, 3000)
    ];

    return () => intervals.forEach(clearInterval);
  }, []);

  // Mock users for demo
  const mockUsers: User[] = [
    { id: "1", email: "admin@invepin.com", role: "super_admin", name: "Alex Chen" },
    { id: "2", email: "company@invepin.com", role: "company_admin", name: "Sarah Rodriguez" },
    { id: "3", email: "manager@invepin.com", role: "manager", name: "Jordan Smith" },
    { id: "4", email: "bartender@invepin.com", role: "bartender", name: "Mike Johnson" },
    { id: "5", email: "staff@invepin.com", role: "staff", name: "Emma Davis" }
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Validate environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Configuration Error",
        description: "Supabase configuration is missing. Please contact support.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    console.log('Environment check:', {
      url: supabaseUrl,
      keyExists: !!supabaseKey,
      origin: window.location.origin
    });
    
    try {
      if (demoMode) {
        // Demo flow
        await new Promise((resolve) => setTimeout(resolve, 600));
        const user = mockUsers.find((u) => u.email === email);
        if (user && password === "demo") {
          toast({
            title: "Demo Authentication",
            description: `Welcome back, ${user.name}! (demo mode)`,
          });
          onLogin(user);
        } else {
          toast({
            title: "Authentication Failed",
            description: "Invalid demo credentials.",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error || !data.user) {
        console.error('Login error:', error);
        toast({
          title: "Authentication Failed",
          description: error?.message ?? "Invalid credentials.",
          variant: "destructive",
        });
        return;
      }

      console.log('Login successful:', data.user.id);
      const appUser: User = {
        id: data.user.id,
        email: data.user.email ?? email,
        role: (data.user.user_metadata?.role as User['role']) ?? 'staff',
        name: (data.user.user_metadata?.name as string) ?? (data.user.email?.split("@")[0] ?? "User"),
      };

      // Check if running in native app
      const isNative = (window as any).Capacitor?.isNativePlatform?.() ?? false;
      if (isNative) {
        console.log('Native app detected, navigating to dashboard');
        // For native apps, navigate to dashboard after successful login
        window.location.href = '/dashboard';
      } else {
        toast({ title: "Welcome", description: `Hello, ${appUser.name}` });
        onLogin(appUser);
      }
    } catch (err: any) {
      console.error('Unexpected login error:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        type: err.constructor.name
      });
      
      let errorMessage = "An unexpected error occurred during login.";
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({ 
        title: "Login Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Validate environment variables first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Configuration Error",
        description: "Backend configuration is missing. Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Signup environment check:', {
      url: supabaseUrl,
      keyExists: !!supabaseKey,
      origin: window.location.origin
    });
    
    // Validate password length
    if (password.length < 6) {
      toast({ 
        title: "Invalid Password", 
        description: "Password must be at least 6 characters long.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      console.log('Signup response:', { 
        hasData: !!data, 
        hasError: !!error,
        errorDetails: error 
      });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        toast({
          title: "Sign up failed", 
          description: error.message || "Unable to create account. Please try again.", 
          variant: "destructive" 
        });
        return;
      }

      console.log('Signup successful:', data);
      toast({ 
        title: "Account created!", 
        description: "You can now sign in with your credentials." 
      });
      setIsSignUp(false);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error('Unexpected signup error:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        type: err.constructor.name
      });
      
      let errorMessage = "An unexpected error occurred during signup.";
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({ 
        title: "Signup Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard`,
      });

      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'super_admin' | 'company_admin' | 'manager' | 'bartender' | 'staff') => {
    if (!demoMode) {
      toast({
        title: "Demo disabled",
        description: "Enable demo by adding ?demo=1 to the URL.",
        variant: "destructive",
      });
      return;
    }
    const user = mockUsers.find(u => u.role === role)!;
    toast({
      title: "Demo Login",
      description: `Logged in as ${role}`,
    });
    onLogin(user);
  };

  const testNetworkConnectivity = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      toast({
        title: "❌ Config Missing",
        description: "VITE_SUPABASE_URL not found",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🔍 Testing Network...",
      description: "Checking connectivity to backend"
    });

    try {
      console.log('=== NETWORK TEST START ===');
      console.log('Testing URL:', supabaseUrl);
      console.log('Browser:', navigator.userAgent);
      console.log('Origin:', window.location.origin);
      
      // Test 1: Direct fetch to Supabase health endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response OK:', response.ok);
      
      if (response.ok || response.status === 404) {
        // 404 is expected for root endpoint, means we reached the server
        toast({
          title: "✅ Network Connected",
          description: `Backend reachable (status: ${response.status})`,
          variant: "default"
        });
        console.log('=== NETWORK TEST: SUCCESS ===');
      } else {
        toast({
          title: "⚠️ Unexpected Response",
          description: `Status: ${response.status} - Check console`,
          variant: "destructive"
        });
        console.log('=== NETWORK TEST: UNEXPECTED STATUS ===');
      }
    } catch (err: any) {
      console.error('=== NETWORK TEST: FAILED ===');
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      let diagnosis = "Unknown network error";
      if (err.message.includes("Failed to fetch")) {
        diagnosis = "Network blocked - Check firewall, VPN, or CORS";
      } else if (err.message.includes("NetworkError")) {
        diagnosis = "No internet or domain unreachable";
      } else if (err.name === "TypeError") {
        diagnosis = "Request failed - Possible CORS or DNS issue";
      }
      
      toast({
        title: "❌ Network Test Failed",
        description: diagnosis,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-success/20 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-warning/20 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-60 right-10 w-28 h-28 border border-primary/20 rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Real-time dashboard preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-card p-8 flex-col justify-center">
          <div className="space-y-6">
            {/* Header with tagline */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                PINPOINT PRECISION.
              </h2>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                INFINITE PROTECTION.
              </h2>
              <p className="text-muted-foreground mt-3">
                Real-time IoT inventory tracking preventing $100B+ in retail losses
              </p>
            </div>

            {/* Live metrics preview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-background/80 border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-success rounded-lg">
                    <Activity className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Connected Devices</p>
                    <p className="font-bold text-lg text-foreground">{connectedDevices}/24</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-background/80 border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Database className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Inventory Value</p>
                    <p className="font-bold text-lg text-foreground">${inventoryValue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-background/80 border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${alertCount > 0 ? 'bg-gradient-warning animate-pulse-glow' : 'bg-gradient-success'}`}>
                    <Eye className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Alerts</p>
                    <p className="font-bold text-lg text-foreground">{alertCount}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-background/80 border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-success rounded-lg">
                    <TrendingUp className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loss Reduction</p>
                    <p className="font-bold text-lg text-foreground">94.7%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Status indicators */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gradient-success text-success-foreground animate-pulse-glow">
                <Wifi className="h-3 w-3 mr-1" />
                Colony Mesh Online
              </Badge>
              <Badge className="bg-gradient-primary text-primary-foreground">
                <Cloud className="h-3 w-3 mr-1" />
                Hive Synchronized
              </Badge>
              <Badge className="bg-gradient-warning text-warning-foreground">
                <Smartphone className="h-3 w-3 mr-1" />
                {connectedDevices} Sensors Active
              </Badge>
            </div>

            {/* Value proposition */}
            <div className="pt-6 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>Preventing theft, overpouring, and inventory shrinkage in real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
          {/* Mobile header */}
          <div className="text-center mb-8 animate-fade-in lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-glow animate-pulse-glow">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Invepin App
            </h1>
            <p className="text-muted-foreground mt-2">Store Operations Dashboard</p>
          </div>

          {/* Login Form */}
          <Card className="w-full max-w-md bg-gradient-card border-border shadow-elevated animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Secure Access
              </CardTitle>
              <CardDescription>Enter your credentials to access the command center</CardDescription>
              <div className="mt-2 text-xs text-center text-muted-foreground">
                Demo app only. <a href="mailto:support@invepin.com" className="text-primary hover:underline">Contact sales</a> to purchase.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Network Diagnostic Test Button */}
              <div className="pb-4 border-b border-border/30">
                <Button
                  onClick={testNetworkConnectivity}
                  variant="outline"
                  className="w-full"
                  type="button"
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Test Network Connection
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Diagnose connectivity issues - check console for details
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>

              <Button 
                onClick={isSignUp ? handleSignUp : handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    {isSignUp ? 'Creating account...' : 'Authenticating...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Access Command Center'
                )}
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <button type="button" className="underline hover:text-foreground" onClick={() => setIsSignUp(v => !v)}>
                    {isSignUp ? 'Have an account? Sign in' : "New here? Create an account"}
                  </button>
                  <button type="button" className="underline hover:text-foreground" onClick={() => {
                    localStorage.setItem('invepin_demo_mode','1');
                    window.location.search = '?demo=1';
                  }}>
                    Try demo
                  </button>
                </div>
                {!isSignUp && (
                  <div className="text-center">
                    <button 
                      type="button" 
                      className="text-xs underline hover:text-foreground text-muted-foreground"
                      onClick={handlePasswordReset}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Demo Login Options */}
              {demoMode && (
                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground text-center mb-3">Quick Demo Access:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('super_admin')}
                      className="text-xs hover:bg-primary/10 hover:border-primary"
                    >
                      Super Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('company_admin')}
                      className="text-xs hover:bg-primary/10 hover:border-primary"
                    >
                      Company Admin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('manager')}
                      className="text-xs hover:bg-primary/10 hover:border-primary"
                    >
                      Manager
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin('bartender')}
                      className="text-xs hover:bg-primary/10 hover:border-primary"
                    >
                      Bartender
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Separate HIVE Portal Access */}
              {demoMode && (
                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground text-center mb-2">Separate System:</p>
                  <Link to="/hive" className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border-amber-500/30 hover:shadow-glow"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Invepin HIVE Command Center
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    (Admin portal for multi-store management)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Real-time
              </span>
              <span className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                Enterprise Ready
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};