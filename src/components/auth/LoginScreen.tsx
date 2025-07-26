import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, Wifi, Cloud } from "lucide-react";
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
  const { toast } = useToast();

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Invepin Command
        </h1>
        <p className="text-muted-foreground mt-2">Smart Inventory Management System</p>
      </div>

      {/* Status Indicators */}
      <div className="flex gap-4 mb-8 animate-scale-in">
        <Badge variant="secondary" className="bg-gradient-success text-success-foreground">
          <Wifi className="h-3 w-3 mr-1" />
          Colony Connected
        </Badge>
        <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
          <Cloud className="h-3 w-3 mr-1" />
          Hive Online
        </Badge>
        <Badge variant="secondary" className="bg-gradient-warning text-warning-foreground">
          <Smartphone className="h-3 w-3 mr-1" />
          BLE Ready
        </Badge>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md bg-gradient-card border-border shadow-elevated animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle>Secure Access</CardTitle>
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
              className="bg-background/50"
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
              className="bg-background/50"
            />
          </div>

          <Button 
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>

          {/* Demo Login Options */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Access:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('manager')}
                className="text-xs"
              >
                Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('staff')}
                className="text-xs"
              >
                Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Secure • Real-time • Enterprise Ready</p>
      </div>
    </div>
  );
};