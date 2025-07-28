import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Map, 
  RotateCcw,
  Layers,
  Filter,
  Search,
  MapPin,
  Navigation,
  Target,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeviceData {
  id: string;
  name: string;
  battery: number;
  status: 'connected' | 'disconnected' | 'connecting';
  rssi: number;
  attachedItem?: string;
}

const mockDevices: DeviceData[] = [
  {
    id: 'inv-001',
    name: 'Invepin Pro #001',
    battery: 87,
    status: 'connected',
    rssi: -45,
    attachedItem: 'iPad Pro 12.9"',
  },
  {
    id: 'inv-002',
    name: 'Invepin Pro #002',
    battery: 45,
    status: 'connected',
    rssi: -62,
    attachedItem: 'Rolex Submariner',
  },
  {
    id: 'inv-003',
    name: 'Invepin Lite #003',
    battery: 23,
    status: 'disconnected',
    rssi: -78,
    attachedItem: 'Designer Handbag',
  },
  {
    id: 'inv-004',
    name: 'Invepin Pro #004',
    battery: 91,
    status: 'connected',
    rssi: -55,
    attachedItem: 'Premium Whiskey',
  },
];

export const FloorPlan = () => {
  const [trackedDevice, setTrackedDevice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'devices' | 'items' | 'zones'>('all');
  const { toast } = useToast();

  const trackDevice = (deviceId: string) => {
    const device = mockDevices.find(d => d.id === deviceId);
    if (device) {
      setTrackedDevice(deviceId);
      toast({
        title: "Device Located",
        description: `Tracking ${device.name}`,
      });
    }
  };

  const resetView = () => {
    setTrackedDevice(null);
    setSearchQuery('');
    toast({
      title: "View Reset",
      description: "Floor plan restored to default view",
    });
  };

  const getDeviceList = () => {
    return mockDevices.filter(device => 
      searchQuery === '' || 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      {/* Floor Plan Header */}
      <div className="bg-gradient-card border border-border rounded-xl p-6 hover-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-primary p-3 rounded-lg shadow-glow">
              <Map className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Interactive Floor Plan</h2>
              <p className="text-sm text-muted-foreground">Real-time visualization of devices and tracked items</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-card/50 border-border hover:bg-card"
            >
              <Layers className="h-4 w-4 mr-2" />
              Show Minimap
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="bg-card/50 border-border hover:bg-card"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gradient-card border border-border rounded-xl p-4 hover-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Filter View:</span>
            </div>
            <div className="flex gap-2">
              {['all', 'zones', 'devices', 'items'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type as typeof filterType)}
                  className={`${
                    filterType === type 
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                      : 'bg-card/50 border-border hover:bg-card'
                  } transition-smooth`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device Tracking Panel */}
      <div className="bg-gradient-card border border-border rounded-xl p-4 hover-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Navigation className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Device Tracker</h3>
            </div>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for Invepin devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {getDeviceList().map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-2 bg-background/30 rounded-lg border border-border/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={device.status === 'connected' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {device.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant={trackedDevice === device.id ? 'default' : 'outline'}
                        onClick={() => trackDevice(device.id)}
                        className={`${
                          trackedDevice === device.id 
                            ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                            : 'bg-card/50 border-border hover:bg-card'
                        } transition-smooth`}
                      >
                        {trackedDevice === device.id ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <Target className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {trackedDevice && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Currently tracking: {mockDevices.find(d => d.id === trackedDevice)?.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTrackedDevice(null)}
                className="bg-card/50 border-border hover:bg-card"
              >
                Stop Tracking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floor Plan Canvas - Simplified */}
      <div className="bg-gradient-card border border-border rounded-xl overflow-hidden shadow-elevated hover-card">
        <div className="p-6">
          <div className="bg-background/20 rounded-lg border-2 border-dashed border-border/50 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Floor Plan View</h3>
              <p className="text-sm text-muted-foreground mb-4">Interactive floor plan will be displayed here</p>
              {trackedDevice && (
                <Badge className="bg-gradient-primary text-primary-foreground">
                  🎯 Tracking: {mockDevices.find(d => d.id === trackedDevice)?.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-card border border-border rounded-xl p-6 hover-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          Legend & Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
              Device Status
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-success rounded-full"></div>
                <span className="text-muted-foreground">Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-warning rounded-full animate-pulse-glow"></div>
                <span className="text-muted-foreground">Connecting</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-danger rounded-full"></div>
                <span className="text-muted-foreground">Disconnected</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-success rounded-full"></div>
              Tracking Features
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Search devices by name/ID
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Real-time status updates
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Visual device highlighting
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Location guidance system
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Device Info
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Battery levels
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Signal strength
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Attached items
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Connection status
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              Quick Actions
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Track specific devices
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Filter by type
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Reset view
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Search and locate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};