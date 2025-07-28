import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  Battery, 
  Shield, 
  Database,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { SystemHealth, Alert, Recommendation } from "@/types/manager";

interface SystemHealthProps {
  systemHealth: SystemHealth;
  alerts: Alert[];
  recommendations: Recommendation[];
}

export const SystemHealthComponent = ({ systemHealth, alerts, recommendations }: SystemHealthProps) => {
  const getNetworkColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'poor': return 'text-warning';
      case 'offline': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 50) return 'text-success';
    if (level >= 20) return 'text-warning';
    return 'text-danger';
  };

  const getBatteryIcon = (status: string) => {
    switch (status) {
      case 'good': return '🔋';
      case 'low': return '🪫';
      case 'critical': return '⚠️';
      default: return '🔋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'cost_saving': return '💰';
      case 'performance': return '⚡';
      case 'security': return '🛡️';
      case 'maintenance': return '🔧';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Device Connectivity</p>
                <p className="text-2xl font-bold">
                  {systemHealth.connectedDevices}/{systemHealth.totalDevices}
                </p>
                <Progress value={(systemHealth.connectedDevices / systemHealth.totalDevices) * 100} className="h-2 mt-1" />
              </div>
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Status</p>
                <p className={`text-2xl font-bold ${getNetworkColor(systemHealth.networkStatus)}`}>
                  {systemHealth.networkStatus}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Connection quality</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Quality</p>
                <p className="text-2xl font-bold">{systemHealth.dataQuality}%</p>
                <Progress value={systemHealth.dataQuality} className="h-2 mt-1" />
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-success">{systemHealth.uptime}%</p>
                <p className="text-xs text-muted-foreground mt-1">Last backup: {systemHealth.lastBackup}</p>
              </div>
              <Server className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Battery Status */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            Device Battery Status
          </CardTitle>
          <CardDescription>Monitor device health and battery levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.batteryLevels.map((device) => (
              <div key={device.deviceId} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getBatteryIcon(device.status)}</div>
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {device.deviceId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getBatteryColor(device.level)}`}>
                      {device.level}%
                    </p>
                    <Progress value={device.level} className="w-20 h-2" />
                  </div>
                  
                  <Badge variant={device.status === 'good' ? 'default' : device.status === 'low' ? 'secondary' : 'destructive'}>
                    {device.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Summary
          </CardTitle>
          <CardDescription>System-wide alert patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{alert.type.replace('_', ' ')}</h4>
                  <Badge variant={alert.severity === 'high' || alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.count}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trend</span>
                  <div className="flex items-center gap-1">
                    {alert.trend === 'up' && <TrendingUp className="h-3 w-3 text-danger" />}
                    {alert.trend === 'down' && <TrendingDown className="h-3 w-3 text-success" />}
                    {alert.trend === 'stable' && <RefreshCw className="h-3 w-3 text-muted-foreground" />}
                    <span className={
                      alert.trend === 'up' ? 'text-danger' : 
                      alert.trend === 'down' ? 'text-success' : 'text-muted-foreground'
                    }>
                      {alert.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            System Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions to optimize operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getRecommendationIcon(rec.type)}</div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                    {rec.priority} priority
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Impact:</span>
                    <p className="font-medium">{rec.impact}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Effort:</span>
                    <p className="font-medium capitalize">{rec.effort}</p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="outline">
                      Implement
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};