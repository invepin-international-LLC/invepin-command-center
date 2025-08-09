import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Map, 
  RotateCcw,
  Layers,
  Filter,
  Search,
  MapPin,
  Navigation,
  Target,
  Eye,
  Settings,
  Package,
  Users,
  AlertTriangle,
  Activity,
  Wifi,
  Battery,
  TrendingUp,
  ShoppingBag,
  Wine,
  Shield,
  X
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
import './ReactFlowOverrides.css';
import { DeviceNode } from './nodes/DeviceNode';
import { ItemNode } from './nodes/ItemNode';
import { ZoneNode } from './nodes/ZoneNode';

interface FloorPlanProps {
  industry?: string;
}

interface ZoneManagementData {
  id: string;
  name: string;
  type: string;
  deviceCount: number;
  itemCount: number;
  alertCount?: number;
  devices: DeviceData[];
  recentActivity: Array<{
    id: string;
    type: 'movement' | 'alert' | 'connection' | 'battery';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  metrics: {
    uptime: number;
    avgSignalStrength: number;
    totalValue: number;
    lastInspection: string;
  };
}

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

// Industry-specific mock data
const getIndustryDevices = (industry: string): DeviceData[] => {
  const deviceTemplates = {
    retail: [
      {
        id: 'inv-001',
        name: 'Invepin Pro #001',
        battery: 87,
        status: 'connected' as const,
        rssi: -45,
        attachedItem: 'iPad Pro 12.9"',
        itemValue: 1299,
        riskLevel: 'high' as const,
        lastMovement: new Date(Date.now() - 2 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
      {
        id: 'inv-002',
        name: 'Invepin Pro #002',
        battery: 45,
        status: 'connected' as const,
        rssi: -62,
        attachedItem: 'Rolex Submariner',
        itemValue: 15000,
        riskLevel: 'critical' as const,
        lastMovement: new Date(Date.now() - 5 * 60 * 1000),
        movementPattern: 'suspicious' as const,
      },
      {
        id: 'inv-003',
        name: 'Invepin Lite #003',
        battery: 23,
        status: 'disconnected' as const,
        rssi: -78,
        attachedItem: 'Designer Handbag',
        itemValue: 2500,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 15 * 60 * 1000),
        movementPattern: 'critical' as const,
      },
      {
        id: 'inv-004',
        name: 'Invepin Pro #004',
        battery: 91,
        status: 'connected' as const,
        rssi: -55,
        attachedItem: 'Premium Electronics',
        itemValue: 800,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 1 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
    ],
    hospitality: [
      {
        id: 'inv-001',
        name: 'Invepin Pro #001',
        battery: 87,
        status: 'connected' as const,
        rssi: -45,
        attachedItem: 'Premium Whiskey Bottle',
        itemValue: 450,
        riskLevel: 'high' as const,
        lastMovement: new Date(Date.now() - 2 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
      {
        id: 'inv-002',
        name: 'Invepin Pro #002',
        battery: 45,
        status: 'connected' as const,
        rssi: -62,
        attachedItem: 'Champagne Dom Pérignon',
        itemValue: 300,
        riskLevel: 'critical' as const,
        lastMovement: new Date(Date.now() - 5 * 60 * 1000),
        movementPattern: 'suspicious' as const,
      },
      {
        id: 'inv-003',
        name: 'Invepin Lite #003',
        battery: 23,
        status: 'disconnected' as const,
        rssi: -78,
        attachedItem: 'Cognac Hennessy XO',
        itemValue: 250,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 15 * 60 * 1000),
        movementPattern: 'critical' as const,
      },
      {
        id: 'inv-004',
        name: 'Invepin Pro #004',
        battery: 91,
        status: 'connected' as const,
        rssi: -55,
        attachedItem: 'Vodka Grey Goose',
        itemValue: 120,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 1 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
    ],
    casino: [
      {
        id: 'inv-001',
        name: 'Invepin Pro #001',
        battery: 87,
        status: 'connected' as const,
        rssi: -45,
        attachedItem: 'High-Value Chip Stack',
        itemValue: 25000,
        riskLevel: 'high' as const,
        lastMovement: new Date(Date.now() - 2 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
      {
        id: 'inv-002',
        name: 'Invepin Pro #002',
        battery: 45,
        status: 'connected' as const,
        rssi: -62,
        attachedItem: 'VIP Tournament Chips',
        itemValue: 50000,
        riskLevel: 'critical' as const,
        lastMovement: new Date(Date.now() - 5 * 60 * 1000),
        movementPattern: 'suspicious' as const,
      },
      {
        id: 'inv-003',
        name: 'Invepin Lite #003',
        battery: 23,
        status: 'disconnected' as const,
        rssi: -78,
        attachedItem: 'Poker Cash Chips',
        itemValue: 10000,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 15 * 60 * 1000),
        movementPattern: 'critical' as const,
      },
      {
        id: 'inv-004',
        name: 'Invepin Pro #004',
        battery: 91,
        status: 'connected' as const,
        rssi: -55,
        attachedItem: 'Blackjack Chips',
        itemValue: 5000,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 1 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
    ],
    pharma: [
      {
        id: 'inv-001',
        name: 'Invepin Pro #001',
        battery: 87,
        status: 'connected' as const,
        rssi: -45,
        attachedItem: 'Controlled Substance Vial',
        itemValue: 1200,
        riskLevel: 'high' as const,
        lastMovement: new Date(Date.now() - 2 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
      {
        id: 'inv-002',
        name: 'Invepin Pro #002',
        battery: 45,
        status: 'connected' as const,
        rssi: -62,
        attachedItem: 'Rare Medication',
        itemValue: 5000,
        riskLevel: 'critical' as const,
        lastMovement: new Date(Date.now() - 5 * 60 * 1000),
        movementPattern: 'suspicious' as const,
      },
      {
        id: 'inv-003',
        name: 'Invepin Lite #003',
        battery: 23,
        status: 'disconnected' as const,
        rssi: -78,
        attachedItem: 'Insulin Batch',
        itemValue: 800,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 15 * 60 * 1000),
        movementPattern: 'critical' as const,
      },
      {
        id: 'inv-004',
        name: 'Invepin Pro #004',
        battery: 91,
        status: 'connected' as const,
        rssi: -55,
        attachedItem: 'Vaccine Doses',
        itemValue: 600,
        riskLevel: 'medium' as const,
        lastMovement: new Date(Date.now() - 1 * 60 * 1000),
        movementPattern: 'normal' as const,
      },
    ],
  };
  
  return deviceTemplates[industry as keyof typeof deviceTemplates] || deviceTemplates.retail;
};

// Node types for ReactFlow
const nodeTypes = {
  device: DeviceNode,
  item: ItemNode,
  zone: ZoneNode,
};


export const FloorPlan = ({ industry = 'retail' }: FloorPlanProps = {}) => {
  // Get industry-specific devices
  const mockDevices = getIndustryDevices(industry);
  
  // Industry-specific initial nodes
  const getInitialNodes = (industry: string): Node[] => {
    const devices = getIndustryDevices(industry);
    const baseZones = [
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
        data: { 
          name: industry === 'hospitality' ? 'Bar Area' : industry === 'casino' ? 'Gaming Floor' : industry === 'pharma' ? 'Secure Storage' : 'High Security', 
          type: 'security', 
          deviceCount: 3, 
          itemCount: 5, 
          alertCount: 1 
        },
        style: { width: 250, height: 200 },
      },
      {
        id: 'zone-3',
        type: 'zone',
        position: { x: 600, y: 100 },
        data: { 
          name: industry === 'hospitality' ? 'Wine Cellar' : industry === 'casino' ? 'VIP Area' : industry === 'pharma' ? 'Cold Storage' : 'Storage Area', 
          type: 'storage', 
          deviceCount: 1, 
          itemCount: 2 
        },
        style: { width: 180, height: 120 },
      },
    ];

    const deviceNodes = devices.map((device, index) => ({
      id: device.id,
      type: 'device',
      position: { 
        x: [120, 400, 350, 650][index] || 120, 
        y: [120, 150, 200, 150][index] || 120 
      },
      data: device,
    }));

    return [...baseZones, ...deviceNodes];
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(industry));
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMinimap, setShowMinimap] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [trackedDevice, setTrackedDevice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'devices' | 'items' | 'zones'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'disconnected' | 'connecting'>('all');
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState(true);
  const [trackingReason, setTrackingReason] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<ZoneManagementData | null>(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const { toast } = useToast();

  // Update nodes when industry changes
  useEffect(() => {
    setNodes(getInitialNodes(industry));
  }, [industry, setNodes]);

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
    setStatusFilter('all');
    setFilterType('all');
    setAutoTrackingEnabled(true); // Re-enable auto-tracking
    setTrackingReason('');
    toast({
      title: "View Reset",
      description: "Auto-tracking re-enabled",
    });
  };

  const getDeviceList = () => {
    return mockDevices.filter(device => {
      // Status filter
      if (statusFilter !== 'all' && device.status !== statusFilter) {
        return false;
      }
      
      // Search query filter
      if (searchQuery !== '' && 
          !device.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !device.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !device.attachedItem?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  };

  // Generate zone management data
  const getZoneManagementData = (zoneId: string): ZoneManagementData => {
    const baseZones = [
      {
        id: 'zone-1',
        name: 'Entrance Hall',
        type: 'entrance',
        deviceCount: 2,
        itemCount: 3,
      },
      {
        id: 'zone-2',
        name: industry === 'hospitality' ? 'Bar Area' : industry === 'casino' ? 'Gaming Floor' : industry === 'pharma' ? 'Secure Storage' : 'High Security',
        type: 'security',
        deviceCount: 3,
        itemCount: 5,
        alertCount: 1,
      },
      {
        id: 'zone-3',
        name: industry === 'hospitality' ? 'Wine Cellar' : industry === 'casino' ? 'VIP Area' : industry === 'pharma' ? 'Cold Storage' : 'Storage Area',
        type: 'storage',
        deviceCount: 1,
        itemCount: 2,
      },
    ];

    const zone = baseZones.find(z => z.id === zoneId) || baseZones[0];
    const zoneDevices = mockDevices.slice(0, zone.deviceCount);
    
    return {
      ...zone,
      devices: zoneDevices,
      recentActivity: [
        {
          id: 'act-1',
          type: 'movement',
          message: `Device ${zoneDevices[0]?.name} detected movement`,
          timestamp: '2 minutes ago',
          severity: 'medium',
        },
        {
          id: 'act-2',
          type: 'connection',
          message: `${zoneDevices[1]?.name} connected successfully`,
          timestamp: '5 minutes ago',
          severity: 'low',
        },
        {
          id: 'act-3',
          type: 'alert',
          message: 'Unauthorized access attempt detected',
          timestamp: '10 minutes ago',
          severity: 'high',
        },
        {
          id: 'act-4',
          type: 'battery',
          message: `Low battery warning for ${zoneDevices[0]?.name}`,
          timestamp: '1 hour ago',
          severity: 'medium',
        },
      ],
      metrics: {
        uptime: 98.5,
        avgSignalStrength: -52,
        totalValue: zoneDevices.reduce((sum, device) => sum + (device.itemValue || 0), 0),
        lastInspection: '2 hours ago',
      },
    };
  };

  // Handle zone click
  const handleZoneClick = (zoneId: string) => {
    const zoneData = getZoneManagementData(zoneId);
    setSelectedZone(zoneData);
    setIsZoneModalOpen(true);
    toast({
      title: "Zone Selected",
      description: `Opening management interface for ${zoneData.name}`,
    });
  };

  // Handle node clicks
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'zone') {
      handleZoneClick(node.id);
    } else if (node.type === 'device') {
      trackDevice(node.id);
    }
  }, []);

  // Heatmap utilities
  const computeZoneHeat = (data: any): 'low' | 'medium' | 'high' => {
    const alerts = (data?.alertCount ?? 0) as number;
    const devices = (data?.deviceCount ?? 0) as number;
    const score = alerts * 2 + devices;
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const toggleHeatmap = () => {
    const next = !heatmapEnabled;
    setHeatmapEnabled(next);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'zone') {
          const heat = computeZoneHeat(node.data || {});
          return { ...node, data: { ...node.data, showHeat: next, heatLevel: heat } };
        }
        return node;
      })
    );
    toast({
      title: next ? 'Heatmap Enabled' : 'Heatmap Disabled',
      description: next ? 'Zone risk visualization is now active.' : 'Returning to normal view.',
    });
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
              onClick={toggleHeatmap}
              className={`${
                heatmapEnabled
                  ? 'bg-gradient-warning text-warning-foreground shadow-glow'
                  : 'bg-card/50 border-border hover:bg-card'
              } transition-smooth`}
            >
              <Activity className="h-4 w-4 mr-2" />
              {heatmapEnabled ? 'Hide Heatmap' : 'Show Heatmap'}
            </Button>
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
                <span className="text-sm text-muted-foreground">
                  {trackedDevice ? `Tracking: ${mockDevices.find(d => d.id === trackedDevice)?.attachedItem}` : 'Real-time device monitoring'}
                </span>
              </div>
            </div>
            {trackedDevice && (
              <Badge className="bg-gradient-primary text-primary-foreground animate-pulse">
                🎯 ACTIVE
              </Badge>
            )}
          </div>
          
          <div className="bg-background/20 rounded-lg border border-border h-96 overflow-hidden relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              className="reactflow-wrapper w-full h-full"
              style={{ 
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%'
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Controls 
                className="bg-card/90 border-border shadow-lg" 
                style={{ background: 'hsl(var(--card) / 0.9)' }}
              />
              <Background 
                color="hsl(var(--muted-foreground) / 0.1)" 
                gap={20} 
                style={{ backgroundColor: 'transparent' }}
              />
              {showMinimap && (
                <MiniMap 
                  className="bg-card/90 border border-border rounded-lg shadow-lg"
                  nodeColor="hsl(var(--primary))"
                  maskColor="hsl(var(--background) / 0.8)"
                  style={{ 
                    backgroundColor: 'hsl(var(--card) / 0.9)',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
              )}
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Interactive Legend & Guide */}
      <div className="bg-gradient-card border border-border rounded-xl p-6 hover-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-foreground">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          Interactive Legend & Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
              Device Status Filters
            </p>
            <div className="space-y-2 text-xs">
              <button 
                className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth group ${statusFilter === 'connected' ? 'bg-primary/10 border border-primary/20' : ''}`}
                onClick={() => {
                  setStatusFilter('connected');
                  toast({
                    title: "Filter Applied",
                    description: "Showing only connected devices",
                  });
                }}
              >
                <div className="w-3 h-3 bg-gradient-success rounded-full"></div>
                <span className="text-muted-foreground group-hover:text-foreground">Connected Devices</span>
              </button>
              <button 
                className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth group ${statusFilter === 'connecting' ? 'bg-primary/10 border border-primary/20' : ''}`}
                onClick={() => {
                  setStatusFilter('connecting');
                  toast({
                    title: "Filter Applied", 
                    description: "Showing only connecting devices",
                  });
                }}
              >
                <div className="w-3 h-3 bg-gradient-warning rounded-full animate-pulse-glow"></div>
                <span className="text-muted-foreground group-hover:text-foreground">Connecting Devices</span>
              </button>
              <button 
                className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth group ${statusFilter === 'disconnected' ? 'bg-primary/10 border border-primary/20' : ''}`}
                onClick={() => {
                  setStatusFilter('disconnected');
                  toast({
                    title: "Filter Applied",
                    description: "Showing only disconnected devices", 
                  });
                }}
              >
                <div className="w-3 h-3 bg-gradient-danger rounded-full"></div>
                <span className="text-muted-foreground group-hover:text-foreground">Disconnected Devices</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-success rounded-full"></div>
              Quick Tracking Actions
            </p>
            <div className="space-y-2 text-xs">
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const highValueDevice = mockDevices.find(d => (d.itemValue || 0) > 10000);
                  if (highValueDevice) trackDevice(highValueDevice.id);
                }}
              >
                <span className="text-primary">🎯</span> Track High-Value Items
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => setAutoTrackingEnabled(!autoTrackingEnabled)}
              >
                <span className="text-primary">🤖</span> {autoTrackingEnabled ? 'Disable' : 'Enable'} Auto-Tracking
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => setShowMinimap(!showMinimap)}
              >
                <span className="text-primary">🗺️</span> {showMinimap ? 'Hide' : 'Show'} Mini Map
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={resetView}
              >
                <span className="text-primary">🔄</span> Reset View & Search
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Risk Level Filters
            </p>
            <div className="space-y-2 text-xs">
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const criticalDevice = mockDevices.find(d => d.riskLevel === 'critical');
                  if (criticalDevice) trackDevice(criticalDevice.id);
                }}
              >
                <span className="text-destructive">🚨</span> Track Critical Risk Items
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const suspiciousDevice = mockDevices.find(d => d.movementPattern === 'suspicious');
                  if (suspiciousDevice) trackDevice(suspiciousDevice.id);
                }}
              >
                <span className="text-warning">⚠️</span> Track Suspicious Movement
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const lowBatteryDevice = mockDevices.find(d => d.battery < 30);
                  if (lowBatteryDevice) trackDevice(lowBatteryDevice.id);
                }}
              >
                <span className="text-warning">🔋</span> Find Low Battery Devices
              </button>
               <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  toast({
                    title: "Filter Cleared",
                    description: "Showing all devices",
                  });
                }}
              >
                <span className="text-primary">👁️</span> Show All Devices
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              View Controls
            </p>
            <div className="space-y-2 text-xs">
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => setFilterType('devices')}
              >
                <span className="text-primary">📱</span> Show Only Devices
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => setFilterType('zones')}
              >
                <span className="text-primary">🏢</span> Show Only Zones
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => setFilterType('all')}
              >
                <span className="text-primary">🌐</span> Show Everything
              </button>
              <button 
                className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-background/50 transition-smooth text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const recentDevice = mockDevices
                    .filter(d => d.lastMovement)
                    .sort((a, b) => (b.lastMovement?.getTime() || 0) - (a.lastMovement?.getTime() || 0))[0];
                  if (recentDevice) trackDevice(recentDevice.id);
                }}
              >
                <span className="text-primary">⏰</span> Track Latest Movement
              </button>
            </div>
          </div>
        </div>
        
        {/* Interactive Help Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Click any button above to quickly filter, track, or control the floor plan view.
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Floor Plan Guide",
                    description: "Use the interactive legend to quickly filter devices, track specific items, and control the view settings.",
                  });
                }}
                className="text-xs"
              >
                📚 Show Help
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const priority = getPriorityDevice();
                  if (priority) {
                    trackDevice(priority.device.id);
                    toast({
                      title: "Smart Tracking",
                      description: `Auto-selected highest priority device: ${priority.device.attachedItem}`,
                    });
                  }
                }}
                className="text-xs bg-gradient-primary text-primary-foreground"
              >
                🎯 Smart Track
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Management Modal */}
      <Dialog open={isZoneModalOpen} onOpenChange={setIsZoneModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedZone?.name}</DialogTitle>
                  <DialogDescription className="text-base">
                    Manage devices, monitor activity, and configure settings for this zone
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsZoneModalOpen(false)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedZone && (
            <div className="mt-6">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Zone Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uptime</span>
                            <span className="font-bold text-success">{selectedZone.metrics.uptime}%</span>
                          </div>
                          <Progress value={selectedZone.metrics.uptime} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Wifi className="h-4 w-4" />
                          Signal Strength
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Average RSSI</span>
                            <span className="font-bold">{selectedZone.metrics.avgSignalStrength} dBm</span>
                          </div>
                          <Progress value={Math.abs(selectedZone.metrics.avgSignalStrength + 100)} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Total Value
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          ${selectedZone.metrics.totalValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Across {selectedZone.itemCount} monitored items
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Zone Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Devices</span>
                          <Badge variant="default">{selectedZone.deviceCount}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Monitored Items</span>
                          <Badge variant="secondary">{selectedZone.itemCount}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Alerts</span>
                          <Badge variant={selectedZone.alertCount ? "destructive" : "default"}>
                            {selectedZone.alertCount || 0}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Inspection</span>
                          <span className="text-sm font-medium">{selectedZone.metrics.lastInspection}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Recent Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-32">
                          <div className="space-y-2">
                            {selectedZone.recentActivity
                              .filter(activity => activity.type === 'alert')
                              .map(alert => (
                                <div key={alert.id} className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-destructive font-medium">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4">
                  <div className="grid gap-4">
                    {selectedZone.devices.map(device => (
                      <Card key={device.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${device.status === 'connected' ? 'bg-success' : device.status === 'connecting' ? 'bg-warning' : 'bg-destructive'}`}></div>
                                <span className="text-xs mt-1">{device.status}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold">{device.name}</h4>
                                <p className="text-sm text-muted-foreground">{device.attachedItem}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    <Battery className="h-3 w-3 mr-1" />
                                    {device.battery}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    <Wifi className="h-3 w-3 mr-1" />
                                    {device.rssi} dBm
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${device.itemValue?.toLocaleString()}</p>
                              <Badge variant={device.riskLevel === 'critical' ? 'destructive' : device.riskLevel === 'high' ? 'default' : 'secondary'}>
                                {device.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {selectedZone.recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/30">
                          <div className={`p-2 rounded-lg ${
                            activity.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                            activity.severity === 'high' ? 'bg-warning/20 text-warning' :
                            activity.severity === 'medium' ? 'bg-primary/20 text-primary' :
                            'bg-success/20 text-success'
                          }`}>
                            {activity.type === 'movement' && <Activity className="h-4 w-4" />}
                            {activity.type === 'alert' && <AlertTriangle className="h-4 w-4" />}
                            {activity.type === 'connection' && <Wifi className="h-4 w-4" />}
                            {activity.type === 'battery' && <Battery className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.message}</p>
                            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                          </div>
                          <Badge variant={
                            activity.severity === 'critical' ? 'destructive' :
                            activity.severity === 'high' ? 'default' :
                            'secondary'
                          }>
                            {activity.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Zone Configuration</CardTitle>
                      <CardDescription>Manage security settings and monitoring preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alert Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive alerts for this zone</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-Tracking</p>
                          <p className="text-sm text-muted-foreground">Automatically track high-value items</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Zone Access Level</p>
                          <p className="text-sm text-muted-foreground">Current security clearance level</p>
                        </div>
                        <Badge variant="secondary">Level {selectedZone.type === 'security' ? '3' : '2'}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};