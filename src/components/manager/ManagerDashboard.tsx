import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  RefreshCw, 
  Download, 
  Crown,
  TrendingUp,
  DollarSign,
  Users,
  Shield
} from "lucide-react";
import { useManagerData } from "@/hooks/useManagerData";
import { FinancialMetricsComponent } from "./FinancialMetrics";
import { PerformanceInsights } from "./PerformanceInsights";
import { SystemHealthComponent } from "./SystemHealth";

export const ManagerDashboard = () => {
  const { insights, loading, refreshData } = useManagerData();

  if (loading || !insights) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-warning" />
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights and strategic analytics for business operations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-gradient-primary text-xs sm:text-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold">${insights.financial.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+{insights.financial.revenueGrowth}% vs last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <p className="text-2xl font-bold">{insights.staff.filter(s => s.hoursWorked > 0).length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {insights.operational.staffUtilization}% utilization
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loss Prevention</p>
                <p className="text-2xl font-bold text-success">
                  ${insights.financial.preventedLoss.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Saved this month</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-success">{insights.systemHealth.uptime}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {insights.systemHealth.connectedDevices}/{insights.systemHealth.totalDevices} devices online
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Alerts */}
      {insights.alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length > 0 && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-500">⚠️ Attention Required</CardTitle>
            <CardDescription>Critical issues need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {insights.alerts
                .filter(a => a.severity === 'high' || a.severity === 'critical')
                .map((alert) => (
                  <Badge key={alert.id} variant="destructive">
                    {alert.count} {alert.type.replace('_', ' ')} alerts
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance & Staff</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialMetricsComponent financial={insights.financial} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceInsights 
            staff={insights.staff} 
            operational={insights.operational} 
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemHealthComponent 
            systemHealth={insights.systemHealth}
            alerts={insights.alerts}
            recommendations={insights.recommendations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};