import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  EyeOff,
  DollarSign,
  TrendingDown,
  Activity
} from "lucide-react";
import { useLossPrevention } from "@/hooks/useLossPrevention";
import { AlertSettings } from "./AlertSettings";

export const LossPreventionDashboard = () => {
  const {
    alerts,
    stats,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert
  } = useLossPrevention();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overpour': return '💧';
      case 'theft': return '🚨';
      case 'unusual_activity': return '⚡';
      case 'low_stock': return '📦';
      case 'device_offline': return '📱';
      default: return '⚠️';
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolvedAt);
  const resolvedAlerts = alerts.filter(a => a.resolvedAt);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-500">{stats.activeAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Loss</p>
                <p className="text-2xl font-bold text-red-500">${stats.estimatedLoss.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loss Prevented</p>
                <p className="text-2xl font-bold text-success">${stats.preventedLoss.toFixed(0)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{stats.averageResponseTime}m</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Active Alerts
              </CardTitle>
              <CardDescription>Alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p className="text-lg font-medium">All Clear!</p>
                  <p>No active alerts at this time</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{alert.title}</h3>
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {getSeverityIcon(alert.severity)} {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>

                    {alert.data && (
                      <div className="mb-3 p-2 bg-background/30 rounded text-sm">
                        {alert.type === 'overpour' && alert.data.expectedAmount && alert.data.actualAmount && (
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-muted-foreground">Expected</p>
                              <p className="font-medium">{alert.data.expectedAmount}oz</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Actual</p>
                              <p className="font-medium">{alert.data.actualAmount}oz</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Overage</p>
                              <p className="font-medium text-orange-500">
                                +{((alert.data.actualAmount - alert.data.expectedAmount) / alert.data.expectedAmount * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        )}
                        {alert.type === 'theft' && alert.data.actualAmount && (
                          <div className="text-center">
                            <p className="text-muted-foreground">Amount Missing</p>
                            <p className="font-medium text-red-500">{alert.data.actualAmount.toFixed(0)}ml</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => resolveAlert(alert.id)}
                        className="bg-gradient-primary"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Resolved Alerts
              </CardTitle>
              <CardDescription>Previously resolved alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resolvedAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-background/30 rounded-lg border border-border/50 opacity-75">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{getTypeIcon(alert.type)}</div>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Resolved {alert.resolvedAt}</p>
                      <p>by {alert.resolvedBy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <AlertSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};