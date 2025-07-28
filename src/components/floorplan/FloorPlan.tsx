import { useState, useEffect, useCallback } from 'react';
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
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DeviceNode } from './nodes/DeviceNode';
import { ItemNode } from './nodes/ItemNode';
import { ZoneNode } from './nodes/ZoneNode';

interface DeviceData {
  id: string;
  name: string;
  battery: number;
  status: 'connected' | 'disconnected' | 'connecting';
  rssi: number;
  attachedItem?: string;
  itemValue?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastMovement?: Date;
  movementPattern?: 'normal' | 'suspicious' | 'critical';
  [key: string]: unknown; // Index signature for ReactFlow compatibility
}

const mockDevices: DeviceData[] = [
  {
    id: 'inv-001',
    name: 'Invepin Pro #001',
    battery: 87,
    status: 'connected',
    rssi: -45,
    attachedItem: 'iPad Pro 12.9"',
    itemValue: 1299,
    riskLevel: 'high',
    lastMovement: new Date(Date.now() - 2 * 60 * 1000),
    movementPattern: 'normal',
  },
  {
    id: 'inv-002',
    name: 'Invepin Pro #002',
    battery: 45,
    status: 'connected',
    rssi: -62,
    attachedItem: 'Rolex Submariner',
    itemValue: 15000,
    riskLevel: 'critical',
    lastMovement: new Date(Date.now() - 5 * 60 * 1000),
    movementPattern: 'suspicious',
  },
  {
    id: 'inv-003',
    name: 'Invepin Lite #003',
    battery: 23,
    status: 'disconnected',
    rssi: -78,
    attachedItem: 'Designer Handbag',
    itemValue: 2500,
    riskLevel: 'medium',
    lastMovement: new Date(Date.now() - 15 * 60 * 1000),
    movementPattern: 'critical',
  },
  {
    id: 'inv-004',
    name: 'Invepin Pro #004',
    battery: 91,
    status: 'connected',
    rssi: -55,
    attachedItem: 'Premium Whiskey',
    itemValue: 500,
    riskLevel: 'medium',
    lastMovement: new Date(Date.now() - 1 * 60 * 1000),
    movementPattern: 'normal',
  },
];

// Node types for ReactFlow
const nodeTypes = {
  device: DeviceNode,
  item: ItemNode,
  zone: ZoneNode,
};

// Initial nodes for the floor plan
const initialNodes: Node[] = [
  {
    id: 'zone-1',
    type: 'zone',
    position: { x: 50, y: 50 },
    data: { name: 'Entrance Hall', type: 'entrance', deviceCount: 2, itemCount: 3 },
    style: { width: 200, height: 150 },
  },
  {
    id: 'zone-2',
    type: 'zone',
    position: { x: 300, y: 50 },
    data: { name: 'High Security', type: 'security', deviceCount: 3, itemCount: 5, alertCount: 1 },
    style: { width: 250, height: 200 },
  },
  {
    id: 'zone-3',
    type: 'zone',
    position: { x: 600, y: 100 },
    data: { name: 'Storage Area', type: 'storage', deviceCount: 1, itemCount: 2 },
    style: { width: 180, height: 120 },
  },
  {
    id: 'inv-001',
    type: 'device',
    position: { x: 120, y: 120 },
    data: mockDevices[0],
  },
  {
    id: 'inv-002',
    type: 'device',
    position: { x: 400, y: 150 },
    data: mockDevices[1],
  },
  {
    id: 'inv-003',
    type: 'device',
    position: { x: 350, y: 200 },
    data: mockDevices[2],
  },
  {
    id: 'inv-004',
    type: 'device',
    position: { x: 650, y: 150 },
    data: mockDevices[3],
  },
];

const initialEdges: Edge[] = [];

export const FloorPlan = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showMinimap, setShowMinimap] = useState(false);
  const [trackedDevice, setTrackedDevice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'devices' | 'items' | 'zones'>('all');
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState(true);
  const [trackingReason, setTrackingReason] = useState<string>('');
  const { toast } = useToast();

  // Get priority device based on risk and value
  const getPriorityDevice = () => {
    const connectedDevices = mockDevices.filter(d => d.status === 'connected');
    
    // First priority: critical movement patterns
    const criticalMovement = connectedDevices.find(d => d.movementPattern === 'critical');
    if (criticalMovement) return { device: criticalMovement, reason: 'Critical movement detected' };
    
    // Second priority: suspicious movements
    const suspiciousMovement = connectedDevices.find(d => d.movementPattern === 'suspicious');
    if (suspiciousMovement) return { device: suspiciousMovement, reason: 'Suspicious movement pattern' };
    
    // Third priority: high-value items (>$10k)
    const highValueItems = connectedDevices
      .filter(d => (d.itemValue || 0) > 10000)
      .sort((a, b) => (b.itemValue || 0) - (a.itemValue || 0));
    if (highValueItems.length > 0) return { device: highValueItems[0], reason: 'High-value item monitoring' };
    
    // Fourth priority: critical risk level
    const criticalRisk = connectedDevices.find(d => d.riskLevel === 'critical');
    if (criticalRisk) return { device: criticalRisk, reason: 'Critical risk level' };
    
    // Default: highest value item
    const sortedByValue = connectedDevices.sort((a, b) => (b.itemValue || 0) - (a.itemValue || 0));
    if (sortedByValue.length > 0) return { device: sortedByValue[0], reason: 'Highest value item' };
    
    return null;
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update node data when devices change
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'device') {
          const deviceData = mockDevices.find(d => d.id === node.id);
          if (deviceData) {
            return { ...node, data: deviceData };
          }
        }
        return node;
      })
    );
  }, [setNodes]);

  // Highlight tracked device
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'device') {
          const isTracked = node.id === trackedDevice;
          return {
            ...node,
            style: {
              ...node.style,
              border: isTracked ? '3px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
              boxShadow: isTracked ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none',
            },
          };
        }
        return node;
      })
    );
  }, [trackedDevice, setNodes]);

  // Auto-tracking effect
  useEffect(() => {
    if (autoTrackingEnabled && !trackedDevice) {
      const priority = getPriorityDevice();
      if (priority) {
        setTrackedDevice(priority.device.id);
        setTrackingReason(priority.reason);
        toast({
          title: "Auto-Tracking Active",
          description: `${priority.reason}: ${priority.device.attachedItem}`,
        });
      }
    }
  }, [autoTrackingEnabled, trackedDevice, toast]);

  // Simulate movement pattern updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update movement patterns to simulate real-time monitoring
      const randomDevice = mockDevices[Math.floor(Math.random() * mockDevices.length)];
      const patterns = ['normal', 'suspicious', 'critical'] as const;
      const newPattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      if (randomDevice.movementPattern !== newPattern && Math.random() > 0.8) {
        randomDevice.movementPattern = newPattern;
        randomDevice.lastMovement = new Date();
        
        // Auto-switch tracking if higher priority emerges
        if (autoTrackingEnabled && (newPattern === 'critical' || newPattern === 'suspicious')) {
          const priority = getPriorityDevice();
          if (priority && priority.device.id !== trackedDevice) {
            setTrackedDevice(priority.device.id);
            setTrackingReason(priority.reason);
            toast({
              title: "Priority Alert",
              description: `Switched to tracking: ${priority.device.attachedItem}`,
            });
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoTrackingEnabled, trackedDevice, toast]);

  const trackDevice = (deviceId: string) => {
    const device = mockDevices.find(d => d.id === deviceId);
    if (device) {
      setTrackedDevice(deviceId);
      setAutoTrackingEnabled(false); // Disable auto-tracking when manually selecting
      setTrackingReason('Manual selection');
      toast({
        title: "Device Located",
        description: `Manually tracking ${device.name}`,
      });
    }
  };

  const resetView = () => {
    setTrackedDevice(null);
    setSearchQuery('');
    setAutoTrackingEnabled(true); // Re-enable auto-tracking
    setTrackingReason('');
    toast({
      title: "View Reset",
      description: "Auto-tracking re-enabled",
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
              onClick={() => setShowMinimap(!showMinimap)}
              className={`${
                showMinimap 
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                  : 'bg-card/50 border-border hover:bg-card'
              } transition-smooth`}
            >
              <Layers className="h-4 w-4 mr-2" />
              {showMinimap ? 'Hide Minimap' : 'Show Minimap'}
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
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs text-muted-foreground">${device.itemValue?.toLocaleString()}</span>
                         <Badge 
                           variant={device.riskLevel === 'critical' ? 'destructive' : device.riskLevel === 'high' ? 'default' : 'secondary'}
                           className="text-xs px-1 py-0"
                         >
                           {device.riskLevel}
                         </Badge>
                         {device.movementPattern !== 'normal' && (
                           <Badge 
                             variant={device.movementPattern === 'critical' ? 'destructive' : 'default'}
                             className="text-xs px-1 py-0 animate-pulse"
                           >
                             {device.movementPattern}
                           </Badge>
                         )}
                       </div>
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
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary">
                    Currently tracking: {mockDevices.find(d => d.id === trackedDevice)?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Reason: {trackingReason}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={autoTrackingEnabled ? 'default' : 'outline'}
                  onClick={() => setAutoTrackingEnabled(!autoTrackingEnabled)}
                  className={autoTrackingEnabled ? 'bg-gradient-primary text-primary-foreground' : 'bg-card/50 border-border hover:bg-card'}
                >
                  Auto
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTrackedDevice(null)}
                  className="bg-card/50 border-border hover:bg-card"
                >
                  Stop
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Floor Plan with ReactFlow */}
      <div className="bg-gradient-card border border-border rounded-xl overflow-hidden shadow-elevated hover-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Map className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Interactive Floor Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {trackedDevice ? `Tracking: ${mockDevices.find(d => d.id === trackedDevice)?.attachedItem}` : 'Real-time device monitoring'}
                </p>
              </div>
            </div>
            {trackedDevice && (
              <Badge className="bg-gradient-primary text-primary-foreground animate-pulse">
                🎯 ACTIVE
              </Badge>
            )}
          </div>
          
          <div className="bg-background/20 rounded-lg border border-border h-96 overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background/10"
              style={{ backgroundColor: 'hsl(var(--background) / 0.1)' }}
            >
              <Controls className="bg-card border-border" />
              <Background color="hsl(var(--muted-foreground) / 0.2)" gap={20} />
              {showMinimap && (
                <MiniMap 
                  className="bg-card border border-border rounded-lg"
                  nodeColor="hsl(var(--primary))"
                  maskColor="hsl(var(--background) / 0.9)"
                />
              )}
            </ReactFlow>
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