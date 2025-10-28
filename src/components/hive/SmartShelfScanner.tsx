import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVisionTagFusion } from '@/hooks/useVisionTagFusion';
import { 
  Camera, 
  Scan, 
  Wifi, 
  Package, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Eye,
  Radio,
  TrendingUp
} from 'lucide-react';

export function SmartShelfScanner() {
  const { isScanning, zones, scanResults, activePins, config, triggerScan } = useVisionTagFusion();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'scanning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse';
      case 'offline': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'error': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const latestScan = scanResults[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Smart Shelf Scanner
              </CardTitle>
              <CardDescription>
                Vision + Tag Fusion System - One-button instant inventory scanning
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Target className="h-3 w-3" />
              Accuracy: {config.minimumConfidence * 100}%
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Zones</p>
                <p className="text-2xl font-bold">{zones.filter(z => z.status === 'active').length}</p>
              </div>
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Pins</p>
                <p className="text-2xl font-bold">{activePins.length}</p>
              </div>
              <Radio className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{scanResults.length}</p>
              </div>
              <Scan className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Accuracy</p>
                <p className="text-2xl font-bold">
                  {scanResults.length > 0 
                    ? (scanResults.reduce((sum, r) => sum + r.accuracy, 0) / scanResults.length * 100).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones">Scan Zones</TabsTrigger>
          <TabsTrigger value="results">Recent Scans</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {zones.map((zone) => (
              <Card key={zone.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                      <CardDescription>{zone.location}</CardDescription>
                    </div>
                    <Badge className={getZoneStatusColor(zone.status)}>
                      {zone.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Camera className={`h-4 w-4 ${zone.cameraEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Vision {zone.cameraEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className={`h-4 w-4 ${zone.bleEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>BLE {zone.bleEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Items detected</span>
                      <span className="font-semibold">{zone.itemCount}</span>
                    </div>
                    {zone.lastScan && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Last scan: {zone.lastScan.toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => triggerScan(zone.id)}
                    disabled={isScanning || zone.status === 'offline'}
                    className="w-full"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    {zone.status === 'scanning' ? 'Scanning...' : 'Scan Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {scanResults.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No scans yet. Press "Scan Now" on any zone to start.
              </CardContent>
            </Card>
          ) : (
            scanResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.location.zone}</CardTitle>
                      <CardDescription>
                        {result.timestamp.toLocaleString()} • {result.duration.toFixed(1)}s scan
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Vision
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        Tags
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                        <span className="text-sm font-semibold">{(result.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={result.accuracy * 100} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Detected Items</span>
                      <span>{result.items.reduce((sum, item) => sum + item.quantity, 0)} total</span>
                    </div>
                    <div className="space-y-2">
                      {result.items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                SKU: {item.sku} • {item.verificationMethod}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">×{item.quantity}</Badge>
                            {item.verificationMethod === 'both' && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                      {result.items.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{result.items.length - 5} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {result.alerts.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      {result.alerts.length} alert{result.alerts.length > 1 ? 's' : ''} generated
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {latestScan && latestScan.alerts.length > 0 ? (
            latestScan.alerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className={getAlertSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      {alert.item && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{alert.item.name} (SKU: {alert.item.sku})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                No alerts at this time
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
