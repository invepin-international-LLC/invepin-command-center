import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Bluetooth, Battery, Wifi, WifiOff, Search } from "lucide-react";
import { useBLEDevices } from "@/hooks/useBLEDevices";
import { Bottle } from "@/types/bar";

interface BLEDeviceManagerProps {
  bottles: Bottle[];
}

export const BLEDeviceManager = ({ bottles }: BLEDeviceManagerProps) => {
  const { 
    devices, 
    isScanning, 
    livePourData,
    scanForDevices, 
    connectDevice, 
    disconnectDevice, 
    assignBottle 
  } = useBLEDevices();

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'pour-spout': return '🥃';
      case 'scale': return '⚖️';
      case 'temperature': return '🌡️';
      default: return '📱';
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'pour-spout': return 'bg-blue-500/10 text-blue-500';
      case 'scale': return 'bg-green-500/10 text-green-500';
      case 'temperature': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* BLE Device Management */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bluetooth className="h-5 w-5" />
                BLE Devices
              </CardTitle>
              <CardDescription>Manage Bluetooth sensors and hardware</CardDescription>
            </div>
            <Button 
              onClick={scanForDevices} 
              disabled={isScanning}
              className="bg-gradient-primary"
            >
              <Search className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="p-4 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getDeviceTypeIcon(device.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{device.name}</p>
                      <Badge className={getDeviceTypeColor(device.type)}>
                        {device.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Last seen: {device.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.connected ? (
                    <Wifi className="h-4 w-4 text-success" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge variant={device.connected ? "default" : "secondary"}>
                    {device.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>

              {device.batteryLevel && (
                <div className="flex items-center gap-2 mb-3">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Battery</span>
                      <span>{device.batteryLevel}%</span>
                    </div>
                    <Progress value={device.batteryLevel} className="h-2" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select 
                    value={device.assignedBottle || ""} 
                    onValueChange={(value) => assignBottle(device.id, value || undefined)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Assign to bottle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {bottles.map((bottle) => (
                        <SelectItem key={bottle.id} value={bottle.id}>
                          {bottle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  {device.connected ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectDevice(device.id)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => connectDevice(device.id)}
                      className="bg-gradient-primary"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Pour Data */}
      {livePourData.length > 0 && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-primary animate-pulse" />
              Live Pour Detection
            </CardTitle>
            <CardDescription>Real-time data from connected sensors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {livePourData.map((data) => {
              const device = devices.find(d => d.id === data.deviceId);
              const bottle = bottles.find(b => b.id === data.bottleId);
              
              return (
                <div key={data.deviceId} className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">🔴 LIVE POUR</p>
                      <p className="text-sm">{bottle?.name} via {device?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{data.currentWeight.toFixed(1)}g</p>
                      <p className="text-sm text-muted-foreground">{data.pourRate.toFixed(1)} ml/s</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};