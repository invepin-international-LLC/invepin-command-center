import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Database, Wifi, Activity, Users, BarChart3, ArrowLeft, Shield } from "lucide-react";
import { StoreManagement } from "@/components/hive/StoreManagement";
import { ColonyHubMonitor } from "@/components/hive/ColonyHubMonitor";
import { InvepinTracker } from "@/components/hive/InvepinTracker";
import { UserRoleManagement } from "@/components/hive/UserRoleManagement";
import { HiveAnalytics } from "@/components/hive/HiveAnalytics";

export default function Hive() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10 animate-slide-in-from-top">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl blur opacity-75 animate-pulse-glow group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-xl shadow-glow hover:scale-110 transition-transform duration-300">
                  <Database className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    Invepin HIVE Command Center
                  </h1>
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Portal
                  </Badge>
                </div>
                <p className="text-sm lg:text-base text-muted-foreground">Multi-store cloud management system</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/dashboard')} 
                className="hover:shadow-card hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Invepin App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Store className="h-4 w-4" />
                Active Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground mt-1">Across 3 regions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Colony Hubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">24</div>
              <p className="text-xs text-success mt-1">All online</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Invepins Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">1,847</div>
              <p className="text-xs text-muted-foreground mt-1">Real-time monitoring</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                System Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">156</div>
              <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="colony">Colony Hubs</TabsTrigger>
            <TabsTrigger value="invepins">Invepins</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <HiveAnalytics />
          </TabsContent>

          <TabsContent value="stores">
            <StoreManagement />
          </TabsContent>

          <TabsContent value="colony">
            <ColonyHubMonitor />
          </TabsContent>

          <TabsContent value="invepins">
            <InvepinTracker />
          </TabsContent>

          <TabsContent value="users">
            <UserRoleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}
