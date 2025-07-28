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
import { 
  Map, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layers,
  Filter,
  Search,
  MapPin
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
    toast({
      title: "View Reset",
      description: "Floor plan restored to default view",
    });
  };

  const getNodeColor = (node: Node) => {
    if (node.type === 'device') return '#3b82f6';
    if (node.type === 'item') return '#10b981';
    if (node.type === 'zone') return '#6366f1';
    return '#6b7280';
  };

  return (
    <div className="space-y-6">
      {/* Floor Plan Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Map className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Interactive Floor Plan</CardTitle>
                <CardDescription>Real-time visualization of devices and tracked items</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMinimap(!showMinimap)}
              >
                <Layers className="h-4 w-4 mr-1" />
                {showMinimap ? 'Hide' : 'Show'} Minimap
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Controls */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter View:</span>
              <div className="flex gap-1">
                {['all', 'zones', 'devices', 'items'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange(type as typeof filterType)}
                    className={filterType === type ? 'bg-gradient-primary' : ''}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Devices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>Items</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>Zones</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floor Plan Canvas */}
      <Card className="bg-gradient-card border-border overflow-hidden">
        <div style={{ width: '100%', height: '600px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            <Controls
              position="top-right"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
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
                  borderRadius: '8px',
                }}
              />
            )}
          </ReactFlow>
        </div>
      </Card>

      {/* Legend */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="font-medium mb-1">Device Status:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span>Connecting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger rounded-full"></div>
                  <span>Disconnected</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-1">Item Status:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Moving</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger rounded-full"></div>
                  <span>Alert/Missing</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">Connections:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-success"></div>
                  <span>Secure Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-warning"></div>
                  <span>Active Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-danger border-dashed border-t-2 bg-transparent"></div>
                  <span>Alert Link</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">Interaction:</p>
              <div className="space-y-1 text-muted-foreground">
                <p>• Drag to pan view</p>
                <p>• Scroll to zoom</p>
                <p>• Click nodes for details</p>
                <p>• Connect devices to items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};