import { useState, useCallback } from 'react';
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
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Map, 
  ZoomIn, 
  ZoomOut, 
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

import { DeviceNode } from './nodes/DeviceNode';
import { ItemNode } from './nodes/ItemNode';
import { ZoneNode } from './nodes/ZoneNode';

const nodeTypes = {
  device: DeviceNode,
  item: ItemNode,
  zone: ZoneNode,
};

const initialNodes: Node[] = [
  // Zone nodes (background areas)
  {
    id: 'zone-entrance',
    type: 'zone',
    position: { x: 50, y: 50 },
    data: {
      id: 'zone-entrance',
      name: 'Main Entrance',
      type: 'entrance',
      deviceCount: 2,
      itemCount: 0,
    },
    draggable: false,
    selectable: true,
  },
  {
    id: 'zone-retail-a',
    type: 'zone',
    position: { x: 300, y: 50 },
    data: {
      id: 'zone-retail-a',
      name: 'Electronics Section',
      type: 'retail',
      deviceCount: 8,
      itemCount: 12,
      alertCount: 1,
    },
    draggable: false,
    selectable: true,
  },
  {
    id: 'zone-retail-b',
    type: 'zone',
    position: { x: 550, y: 50 },
    data: {
      id: 'zone-retail-b',
      name: 'Jewelry Counter',
      type: 'retail',
      deviceCount: 6,
      itemCount: 8,
    },
    draggable: false,
    selectable: true,
  },
  {
    id: 'zone-storage',
    type: 'zone',
    position: { x: 50, y: 250 },
    data: {
      id: 'zone-storage',
      name: 'Storage Room B',
      type: 'storage',
      deviceCount: 4,
      itemCount: 15,
      alertCount: 2,
    },
    draggable: false,
    selectable: true,
  },
  {
    id: 'zone-checkout',
    type: 'zone',
    position: { x: 550, y: 250 },
    data: {
      id: 'zone-checkout',
      name: 'Checkout Area',
      type: 'checkout',
      deviceCount: 3,
      itemCount: 0,
    },
    draggable: false,
    selectable: true,
  },

  // Device nodes
  {
    id: 'device-001',
    type: 'device',
    position: { x: 320, y: 100 },
    data: {
      id: 'inv-001',
      name: 'Invepin Pro #001',
      battery: 87,
      status: 'connected',
      rssi: -45,
      attachedItem: 'iPad Pro 12.9"',
    },
    parentId: 'zone-retail-a',
  },
  {
    id: 'device-002',
    type: 'device',
    position: { x: 570, y: 100 },
    data: {
      id: 'inv-002',
      name: 'Invepin Pro #002',
      battery: 45,
      status: 'connected',
      rssi: -62,
      attachedItem: 'Rolex Submariner',
    },
    parentId: 'zone-retail-b',
  },
  {
    id: 'device-003',
    type: 'device',
    position: { x: 80, y: 300 },
    data: {
      id: 'inv-003',
      name: 'Invepin Lite #003',
      battery: 23,
      status: 'disconnected',
      rssi: -78,
      attachedItem: 'Designer Handbag',
    },
    parentId: 'zone-storage',
  },
  {
    id: 'device-004',
    type: 'device',
    position: { x: 430, y: 120 },
    data: {
      id: 'inv-004',
      name: 'Invepin Pro #004',
      battery: 91,
      status: 'connected',
      rssi: -55,
      attachedItem: 'Premium Whiskey',
    },
    parentId: 'zone-retail-a',
  },

  // Item nodes
  {
    id: 'item-001',
    type: 'item',
    position: { x: 350, y: 180 },
    data: {
      id: 'item-001',
      name: 'MacBook Pro 16"',
      category: 'Electronics',
      status: 'secure',
      value: '$2,499',
      lastUpdate: '2 min ago',
    },
  },
  {
    id: 'item-002',
    type: 'item',
    position: { x: 600, y: 180 },
    data: {
      id: 'item-002',
      name: 'Diamond Ring Set',
      category: 'Jewelry',
      status: 'moving',
      value: '$5,299',
      lastUpdate: 'Just now',
    },
  },
  {
    id: 'item-003',
    type: 'item',
    position: { x: 150, y: 380 },
    data: {
      id: 'item-003',
      name: 'Louis Vuitton Bag',
      category: 'Fashion',
      status: 'alert',
      value: '$1,850',
      lastUpdate: '1 hour ago',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'device-item-1',
    source: 'device-001',
    target: 'item-001',
    type: 'straight',
    style: { stroke: 'hsl(var(--success))', strokeWidth: 2 },
    animated: false,
  },
  {
    id: 'device-item-2',
    source: 'device-002',
    target: 'item-002',
    type: 'straight',
    style: { stroke: 'hsl(var(--warning))', strokeWidth: 2 },
    animated: true,
  },
  {
    id: 'device-item-3',
    source: 'device-003',
    target: 'item-003',
    type: 'straight',
    style: { stroke: 'hsl(var(--danger))', strokeWidth: 2, strokeDasharray: '5,5' },
    animated: false,
  },
];

export const FloorPlan = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showMinimap, setShowMinimap] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'devices' | 'items' | 'zones'>('all');
  const [trackedDevice, setTrackedDevice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleFilterChange = (type: typeof filterType) => {
    setFilterType(type);
    
    // Filter nodes based on type
    let filteredNodes = initialNodes;
    if (type !== 'all') {
      filteredNodes = initialNodes.map(node => ({
        ...node,
        hidden: type === 'devices' ? !node.type?.includes('device') :
                type === 'items' ? !node.type?.includes('item') :
                type === 'zones' ? !node.type?.includes('zone') : false
      }));
    }
    
    setNodes(filteredNodes);
    
    toast({
      title: "Filter Applied",
      description: `Showing ${type === 'all' ? 'all elements' : type}`,
    });
  };

  const resetView = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setFilterType('all');
    setTrackedDevice(null);
    setSearchQuery('');
    toast({
      title: "View Reset",
      description: "Floor plan restored to default view",
    });
  };

  const trackDevice = (deviceId: string) => {
    const device = initialNodes.find(node => node.id === deviceId && node.type === 'device');
    if (device) {
      setTrackedDevice(deviceId);
      
      // Highlight the tracked device
      const updatedNodes = nodes.map(node => ({
        ...node,
        style: {
          ...node.style,
          ...(node.id === deviceId ? {
            border: '3px solid hsl(var(--primary))',
            boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
            transform: 'scale(1.1)',
            zIndex: 1000,
          } : {})
        }
      }));
      
      setNodes(updatedNodes);
      
      toast({
        title: "Device Located",
        description: `Tracking ${(device.data as { name?: string })?.name || deviceId}`,
      });
    }
  };

  const getDeviceList = () => {
    return initialNodes
      .filter(node => node.type === 'device')
      .filter(node => {
        const deviceData = node.data as { name?: string; id?: string };
        return searchQuery === '' || 
               (deviceData.name && deviceData.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
               (deviceData.id && deviceData.id.toLowerCase().includes(searchQuery.toLowerCase()));
      });
  };

  const getNodeColor = (node: Node) => {
    if (node.id === trackedDevice) return '#ff6b6b';
    if (node.type === 'device') return '#3b82f6';
    if (node.type === 'item') return '#10b981';
    if (node.type === 'zone') return '#6366f1';
    return '#6b7280';
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
              className="bg-card/50 border-border hover:bg-card"
            >
              <Layers className="h-4 w-4 mr-2" />
              {showMinimap ? 'Hide' : 'Show'} Minimap
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
                  onClick={() => handleFilterChange(type as typeof filterType)}
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
                      <p className="text-sm font-medium text-foreground">
                        {(device.data as { name?: string })?.name || 'Unknown Device'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(device.data as { id?: string })?.id || device.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={(device.data as { status?: string })?.status === 'connected' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {(device.data as { status?: string })?.status || 'unknown'}
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
                  Currently tracking: {(initialNodes.find(n => n.id === trackedDevice)?.data as { name?: string })?.name || 'Unknown Device'}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTrackedDevice(null);
                  setNodes(initialNodes);
                }}
                className="bg-card/50 border-border hover:bg-card"
              >
                Stop Tracking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floor Plan Canvas */}
      <div className="bg-gradient-card border border-border rounded-xl overflow-hidden shadow-elevated hover-card">
        <div style={{ width: '100%', height: '600px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            attributionPosition="bottom-left"
            style={{ 
              backgroundColor: 'hsl(var(--background))',
              borderRadius: '12px'
            }}
          >
            <Controls
              position="top-right"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="hsl(var(--border))"
            />
            {showMinimap && (
              <MiniMap
                nodeColor={getNodeColor}
                nodeStrokeWidth={2}
                zoomable
                pannable
                position="bottom-right"
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-card)',
                }}
              />
            )}
          </ReactFlow>
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
              Item Status
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-success rounded-full"></div>
                <span className="text-muted-foreground">Secure</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-warning rounded-full"></div>
                <span className="text-muted-foreground">Moving</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-danger rounded-full"></div>
                <span className="text-muted-foreground">Alert/Missing</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Connections
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-[3px] bg-gradient-success rounded-full"></div>
                <span className="text-muted-foreground">Secure Link</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[3px] bg-gradient-warning rounded-full"></div>
                <span className="text-muted-foreground">Active Link</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[3px] bg-gradient-danger rounded-full opacity-60" 
                     style={{ background: 'repeating-linear-gradient(90deg, hsl(var(--danger)) 0px, hsl(var(--danger)) 4px, transparent 4px, transparent 8px)' }}></div>
                <span className="text-muted-foreground">Alert Link</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              Interaction
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Drag to pan view
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Scroll to zoom
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Click nodes for details
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">•</span> Connect devices to items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};