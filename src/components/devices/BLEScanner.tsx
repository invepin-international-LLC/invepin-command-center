import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bluetooth, 
  Battery, 
  Wifi, 
  MapPin, 
  Settings, 
  RefreshCw,
  Signal,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BLEScannerProps {
  industry?: string;
}

interface BLEDevice {
  id: string;
  name: string;
  address: string;
  rssi: number;
  battery: number;
  status: 'connected' | 'disconnected' | 'connecting';
  location?: string;
  lastSeen: string;
  firmwareVersion: string;
  attachedItem?: string;
}

export const BLEScanner = ({ industry = 'retail' }: BLEScannerProps = {}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const { toast } = useToast();

  // Mock BLE devices
  const mockDevices: BLEDevice[] = [
    {
      id: "inv-001",
      name: "Invepin Pro #001",
      address: "AA:BB:CC:DD:EE:01",
      rssi: -45,
      battery: 87,
      status: "connected",
      location: "Electronics Aisle A",
      lastSeen: "Just now",
      firmwareVersion: "v2.1.3",
      attachedItem: "iPad Pro 12.9\""
    },
    {
      id: "inv-002", 
      name: "Invepin Pro #002",
      address: "AA:BB:CC:DD:EE:02",
      rssi: -62,
      battery: 45,
      status: "connected",
      location: "Jewelry Counter",
      lastSeen: "2 min ago",
      firmwareVersion: "v2.1.3",
      attachedItem: "Rolex Submariner"
    },
    {
      id: "inv-003",
      name: "Invepin Lite #003", 
      address: "AA:BB:CC:DD:EE:03",
      rssi: -78,
      battery: 23,
      status: "disconnected",
      location: "Storage Room B",
      lastSeen: "1 hour ago",
      firmwareVersion: "v2.0.1",
      attachedItem: "Designer Handbag"
    },
    {
      id: "inv-004",
      name: "Invepin Pro #004",
      address: "AA:BB:CC:DD:EE:04", 
      rssi: -55,
      battery: 91,
      status: "connected",
      location: "Liquor Section",
      lastSeen: "Just now",
      firmwareVersion: "v2.1.3",
      attachedItem: "Premium Whiskey"
    }
  ];

  const startScan = async () => {
    setIsScanning(true);
    toast({
      title: "Scanning Started",
      description: "Searching for nearby Invepin devices...",
    });

    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDevices(mockDevices);
    setIsScanning(false);
    
    toast({
      title: "Scan Complete",
      description: `Found ${mockDevices.length} Invepin devices`,
    });
  };

  const connectDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'connecting' as const }
        : device
    ));

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'connected' as const, lastSeen: 'Just now' }
        : device
    ));

    toast({
      title: "Device Connected",
      description: "Device is now online and tracking",
    });
  };

  const disconnectDevice = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'disconnected' as const }
        : device
    ));

    toast({
      title: "Device Disconnected", 
      description: "Device connection terminated",
      variant: "destructive"
    });
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { strength: 'excellent', color: 'text-success', bars: 4 };
    if (rssi > -60) return { strength: 'good', color: 'text-primary', bars: 3 };
    if (rssi > -70) return { strength: 'fair', color: 'text-warning', bars: 2 };
    return { strength: 'weak', color: 'text-danger', bars: 1 };
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-success';
    if (battery > 20) return 'text-warning';
    return 'text-danger';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'connecting': return <RefreshCw className="h-4 w-4 text-warning animate-spin" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-danger" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  useEffect(() => {
    // Auto-start scan on component mount
    startScan();
  }, []);

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Bluetooth className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>BLE Device Scanner</CardTitle>
                <CardDescription>Discover and manage Invepin devices</CardDescription>
              </div>
            </div>
            <Button 
              onClick={startScan}
              disabled={isScanning}
              className="bg-gradient-primary"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Device List */}
      <div className="grid gap-4">
        {devices.map((device) => {
          const signal = getSignalStrength(device.rssi);
          return (
            <Card key={device.id} className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(device.status)}
                      <h3 className="font-semibold">{device.name}</h3>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={device.status === 'connected' ? 'bg-success/20 text-success' : 
                                device.status === 'connecting' ? 'bg-warning/20 text-warning' :
                                'bg-danger/20 text-danger'}
                    >
                      {device.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {device.status === 'connected' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => disconnectDevice(device.id)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => connectDevice(device.id)}
                        disabled={device.status === 'connecting'}
                        className="bg-gradient-primary"
                      >
                        {device.status === 'connecting' ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* Signal Strength */}
                  <div className="flex items-center gap-2">
                    <Signal className={`h-4 w-4 ${signal.color}`} />
                    <div>
                      <p className="text-sm font-medium">{device.rssi} dBm</p>
                      <p className="text-xs text-muted-foreground capitalize">{signal.strength}</p>
                    </div>
                  </div>

                  {/* Battery */}
                  <div className="flex items-center gap-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                    <div>
                      <p className="text-sm font-medium">{device.battery}%</p>
                      <Progress value={device.battery} className="w-16 h-1" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{device.location || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">Last seen: {device.lastSeen}</p>
                    </div>
                  </div>

                  {/* Attached Item */}
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">{device.attachedItem || 'No item'}</p>
                      <p className="text-xs text-muted-foreground">FW: {device.firmwareVersion}</p>
                    </div>
                  </div>
                </div>

                {/* Device Details */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Address: {device.address} • Firmware: {device.firmwareVersion}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {devices.length === 0 && !isScanning && (
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-8 text-center">
            <Bluetooth className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Devices Found</h3>
            <p className="text-muted-foreground mb-4">
              Make sure your Invepin devices are powered on and within range
            </p>
            <Button onClick={startScan} className="bg-gradient-primary">
              Start Scanning
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};