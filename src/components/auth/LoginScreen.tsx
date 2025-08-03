import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, Wifi, Cloud, Activity, Database, Zap, Eye, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const { toast } = useToast();

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
    { id: "1", email: "admin@invepin.com", role: "admin", name: "Alex Chen" },
    { id: "2", email: "manager@invepin.com", role: "manager", name: "Sarah Rodriguez" },
    { id: "3", email: "staff@invepin.com", role: "staff", name: "Mike Johnson" }
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === "demo123") {
      toast({
        title: "Authentication Successful",
        description: `Welcome back, ${user.name}!`,
      });
      onLogin(user);
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials. Use demo123 as password.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: 'admin' | 'manager' | 'staff') => {
    const user = mockUsers.find(u => u.role === role)!;
    toast({
      title: "Demo Login",
      description: `Logged in as ${role}`,
    });
    onLogin(user);
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
              Invepin Command
            </h1>
            <p className="text-muted-foreground mt-2">Smart Inventory Management System</p>
          </div>

          {/* Login Form */}
          <Card className="w-full max-w-md bg-gradient-card border-border shadow-elevated animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Secure Access
              </CardTitle>
              <CardDescription>Enter your credentials to access the command center</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Access Command Center"
                )}
              </Button>

              {/* Demo Login Options */}
              <div className="pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground text-center mb-3">Quick Demo Access:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin('admin')}
                    className="text-xs hover:bg-primary/10 hover:border-primary"
                  >
                    Admin
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
                    onClick={() => handleDemoLogin('staff')}
                    className="text-xs hover:bg-primary/10 hover:border-primary"
                  >
                    Staff
                  </Button>
                </div>
              </div>
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