import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scan, AlertTriangle, Navigation, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface InvepinDevice {
  id: string;
  name: string;
  sku: string;
  location: { x: number; y: number };
  velocity: { x: number; y: number };
  rssi: number;
  lastSeen: string;
  status: 'normal' | 'moving' | 'checkout-unpaid' | 'suspicious';
  price: number;
  category: string;
}

export const InvepinTracker = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<InvepinDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const scanAllInvepins = () => {
    setIsScanning(true);
    toast.success("Scanning for Invepins in vicinity...");

    // Simulate scanning and discovering devices
    setTimeout(() => {
      const mockDevices: InvepinDevice[] = [
        {
          id: "INV-001",
          name: "Premium Wireless Headphones",
          sku: "ELEC-WH-001",
          location: { x: 120, y: 45 },
          velocity: { x: 0, y: 0 },
          rssi: -45,
          lastSeen: "Just now",
          status: 'normal',
          price: 299.99,
          category: "Electronics"
        },
        {
          id: "INV-002",
          name: "Designer Handbag",
          sku: "FASH-BAG-042",
          location: { x: 200, y: 80 },
          velocity: { x: 2.5, y: 1.2 },
          rssi: -52,
          lastSeen: "2 sec ago",
          status: 'moving',
          price: 489.99,
          category: "Fashion"
        },
        {
          id: "INV-003",
          name: "Smart Watch Pro",
          sku: "ELEC-SW-018",
          location: { x: 350, y: 120 },
          velocity: { x: 5.8, y: 3.2 },
          rssi: -38,
          lastSeen: "1 sec ago",
          status: 'checkout-unpaid',
          price: 599.99,
          category: "Electronics"
        },
        {
          id: "INV-004",
          name: "Leather Wallet",
          sku: "ACC-WAL-025",
          location: { x: 180, y: 200 },
          velocity: { x: 8.5, y: 4.3 },
          rssi: -60,
          lastSeen: "Just now",
          status: 'suspicious',
          price: 129.99,
          category: "Accessories"
        },
        {
          id: "INV-005",
          name: "Running Shoes",
          sku: "SHOE-RUN-112",
          location: { x: 90, y: 150 },
          velocity: { x: 0, y: 0 },
          rssi: -42,
          lastSeen: "5 sec ago",
          status: 'normal',
          price: 159.99,
          category: "Footwear"
        }
      ];

      setDevices(mockDevices);
      setIsScanning(false);
      toast.success(`Found ${mockDevices.length} Invepins`);
    }, 2000);
  };

  // Simulate live tracking updates
  useEffect(() => {
    if (devices.length === 0) return;

    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device.status === 'moving' || device.status === 'suspicious' || device.status === 'checkout-unpaid') {
            return {
              ...device,
              location: {
                x: device.location.x + device.velocity.x,
                y: device.location.y + device.velocity.y
              },
              lastSeen: "Just now"
            };
          }
          return device;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [devices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success text-success-foreground';
      case 'moving': return 'bg-warning text-warning-foreground';
      case 'checkout-unpaid': return 'bg-danger text-danger-foreground animate-pulse';
      case 'suspicious': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <Package className="h-4 w-4" />;
      case 'moving': return <Navigation className="h-4 w-4" />;
      case 'checkout-unpaid': return <ShoppingCart className="h-4 w-4" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { bars: 4, color: 'text-success' };
    if (rssi > -60) return { bars: 3, color: 'text-success' };
    if (rssi > -70) return { bars: 2, color: 'text-warning' };
    return { bars: 1, color: 'text-danger' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-6 w-6 text-primary" />
                Invepin Tracker
              </CardTitle>
              <CardDescription>
                Scan and track all Invepins in the vicinity
              </CardDescription>
            </div>
            <Button 
              onClick={scanAllInvepins}
              disabled={isScanning}
              className="bg-gradient-primary hover:shadow-glow"
            >
              {isScanning ? (
                <>
                  <Scan className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan All Invepins
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <Scan className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No Invepins detected. Click "Scan All Invepins" to start.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Live Tracking Map */}
              <Card className="lg:col-span-2 bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Live Tracking Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-background rounded-lg p-4 h-[400px] border-2 border-border overflow-hidden">
                    {/* Grid background */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                    
                    {/* Device markers */}
                    {devices.map(device => (
                      <div
                        key={device.id}
                        className={`absolute transition-all duration-1000 cursor-pointer hover:scale-125 ${
                          selectedDevice === device.id ? 'scale-125 z-10' : ''
                        }`}
                        style={{
                          left: `${Math.min(Math.max(device.location.x, 10), 90)}%`,
                          top: `${Math.min(Math.max(device.location.y, 10), 90)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => setSelectedDevice(device.id)}
                      >
                        <div className={`relative ${device.status === 'suspicious' || device.status === 'checkout-unpaid' ? 'animate-pulse' : ''}`}>
                          {/* Ping animation for suspicious items */}
                          {(device.status === 'suspicious' || device.status === 'checkout-unpaid') && (
                            <div className="absolute inset-0 -m-2">
                              <div className="absolute inset-0 bg-danger rounded-full animate-ping opacity-75" />
                            </div>
                          )}
                          
                          {/* Device marker */}
                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                            device.status === 'normal' ? 'bg-success' :
                            device.status === 'moving' ? 'bg-warning' :
                            'bg-danger'
                          }`}>
                            {getStatusIcon(device.status)}
                          </div>
                          
                          {/* Velocity indicator */}
                          {(device.velocity.x !== 0 || device.velocity.y !== 0) && (
                            <div 
                              className="absolute top-1/2 left-1/2 w-12 h-1 bg-primary/50"
                              style={{
                                transform: `translate(-50%, -50%) rotate(${Math.atan2(device.velocity.y, device.velocity.x) * 180 / Math.PI}deg)`
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device List */}
              {devices.map(device => (
                <Card 
                  key={device.id} 
                  className={`cursor-pointer transition-all hover:shadow-elevated ${
                    selectedDevice === device.id ? 'ring-2 ring-primary shadow-elevated scale-105' : ''
                  }`}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base">{device.name}</CardTitle>
                        <CardDescription className="text-xs">SKU: {device.sku}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(device.status)}>
                        {getStatusIcon(device.status)}
                        <span className="ml-1 capitalize">{device.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">ID</p>
                        <p className="font-mono font-semibold">{device.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">${device.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{device.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Signal</p>
                        <p className={`font-semibold ${getSignalStrength(device.rssi).color}`}>
                          {getSignalStrength(device.rssi).bars}/4 bars
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-mono">
                          X: {device.location.x.toFixed(0)}, Y: {device.location.y.toFixed(0)}
                        </span>
                      </div>
                      {(device.velocity.x !== 0 || device.velocity.y !== 0) && (
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-muted-foreground">Velocity:</span>
                          <span className="font-mono">
                            {Math.sqrt(device.velocity.x ** 2 + device.velocity.y ** 2).toFixed(1)} units/s
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted-foreground">Last seen:</span>
                        <span>{device.lastSeen}</span>
                      </div>
                    </div>

                    {(device.status === 'suspicious' || device.status === 'checkout-unpaid') && (
                      <div className={`flex items-center gap-2 p-2 rounded text-xs ${
                        device.status === 'checkout-unpaid' ? 'bg-danger/10 text-danger' : 'bg-danger/10 text-danger'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">
                          {device.status === 'checkout-unpaid' 
                            ? 'Unpaid item detected near checkout!' 
                            : 'Suspicious movement pattern detected!'}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
