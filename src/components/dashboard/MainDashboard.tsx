import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLEScanner } from "@/components/devices/BLEScanner";
import { FloorPlan } from "@/components/floorplan/FloorPlan";
import { 
  Shield, 
  Smartphone, 
  Wifi, 
  Cloud, 
  AlertTriangle, 
  CheckCircle, 
  Battery, 
  MapPin,
  TrendingUp,
  Activity,
  Users,
  Package
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name: string;
}

interface MainDashboardProps {
  user: User;
  onLogout: () => void;
}

export const MainDashboard = ({ user, onLogout }: MainDashboardProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<'retail' | 'hospitality' | 'casino' | 'pharma'>('retail');
  const [activeView, setActiveView] = useState<'overview' | 'devices' | 'floorplan'>('overview');

  // Mock real-time data
  const stats = {
    connectedDevices: 127,
    activeAlerts: 3,
    inventoryAccuracy: 99.2,
    batteryHealth: 94
  };

  const recentAlerts = [
    { id: 1, type: 'movement', item: 'Premium Whiskey Bottle', location: 'Bar Section A', time: '2 min ago', severity: 'high' },
    { id: 2, type: 'low_battery', item: 'Invepin Device #47', location: 'Electronics Aisle', time: '15 min ago', severity: 'medium' },
    { id: 3, type: 'disconnect', item: 'High-Value Watch', location: 'Jewelry Counter', time: '1 hour ago', severity: 'high' }
  ];

  const quickActions = [
    { label: 'Scan Inventory', icon: Package, color: 'bg-gradient-primary' },
    { label: 'View Floor Plan', icon: MapPin, color: 'bg-gradient-success' },
    { label: 'Device Status', icon: Smartphone, color: 'bg-gradient-warning' },
    { label: 'Generate Report', icon: TrendingUp, color: 'bg-gradient-danger' }
  ];

  const industryLabels = {
    retail: { primary: 'Shrinkage Prevention', secondary: 'Loss Rate', kpi: 'Theft Alerts' },
    hospitality: { primary: 'Minibar Tracking', secondary: 'Room Service', kpi: 'Guest Usage' },
    casino: { primary: 'Chip Monitoring', secondary: 'Table Games', kpi: 'Security Events' },
    pharma: { primary: 'Drug Tracking', secondary: 'Cold Chain', kpi: 'Compliance Score' }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-danger';
      case 'manager': return 'bg-gradient-warning';
      case 'staff': return 'bg-gradient-success';
      default: return 'bg-gradient-primary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Command Center</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <Button 
              variant={activeView === 'overview' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveView('overview')}
              className={activeView === 'overview' ? 'bg-gradient-primary' : ''}
            >
              Overview
            </Button>
            <Button 
              variant={activeView === 'devices' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveView('devices')}
              className={activeView === 'devices' ? 'bg-gradient-primary' : ''}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Devices
            </Button>
            <Button 
              variant={activeView === 'floorplan' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveView('floorplan')}
              className={activeView === 'floorplan' ? 'bg-gradient-primary' : ''}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Floor Plan
            </Button>
          </div>
          <Badge className={`${getRoleColor(user.role)} text-white`}>
            <Users className="h-3 w-3 mr-1" />
            {user.role.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Wifi className="h-6 w-6 text-success animate-pulse-glow" />
            </div>
            <p className="text-sm font-medium">Colony</p>
            <p className="text-xs text-success">Connected</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Cloud className="h-6 w-6 text-primary animate-pulse-glow" />
            </div>
            <p className="text-sm font-medium">Hive</p>
            <p className="text-xs text-primary">Synced</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Smartphone className="h-6 w-6 text-warning" />
            </div>
            <p className="text-sm font-medium">Devices</p>
            <p className="text-xs text-warning">{stats.connectedDevices} Active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium">System</p>
            <p className="text-xs text-success">Operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' ? (
        <>
          {/* Industry Selector */}
          <Card className="mb-6 bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Industry Mode
              </CardTitle>
              <CardDescription>
                Configure dashboard for your industry type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['retail', 'hospitality', 'casino', 'pharma'] as const).map((industry) => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIndustry(industry)}
                    className={selectedIndustry === industry ? "bg-gradient-primary shadow-glow" : ""}
                  >
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{industryLabels[selectedIndustry].primary}</p>
                    <p className="text-2xl font-bold">{stats.inventoryAccuracy}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-danger">{stats.activeAlerts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-danger animate-status-pulse" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Connected Devices</p>
                    <p className="text-2xl font-bold">{stats.connectedDevices}</p>
                  </div>
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Battery Health</p>
                    <p className="text-2xl font-bold text-success">{stats.batteryHealth}%</p>
                  </div>
                  <Battery className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6 bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:shadow-card transition-all duration-300"
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Live security and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{alert.item}</p>
                      <p className="text-sm text-muted-foreground">{alert.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : activeView === 'devices' ? (
        <BLEScanner />
      ) : (
        <FloorPlan />
      )}
    </div>
  );
};
