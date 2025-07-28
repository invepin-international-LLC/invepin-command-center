import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PourDetectionEngine } from "./PourDetectionEngine";
import { StatsOverview } from "./StatsOverview";
import { BartenderDashboard } from "./BartenderDashboard";
import { BottleInventory } from "./BottleInventory";
import { RecentActivity } from "./RecentActivity";
import { BLEDeviceManager } from "@/components/devices/BLEDeviceManager";
import { LossPreventionDashboard } from "@/components/alerts/LossPreventionDashboard";
import { ManagerDashboard } from "@/components/manager/ManagerDashboard";
import { MobileBartenderInterface } from "@/components/mobile/MobileBartenderInterface";
import { InventoryManagementDashboard } from "@/components/inventory/InventoryManagementDashboard";
import { Bartender, Bottle, PourEvent } from "@/types/bar";
import { useLossPrevention } from "@/hooks/useLossPrevention";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";

export const BarManagement = () => {
  const { toast } = useToast();
  const { monitorPourEvent, monitorBottleLevel } = useLossPrevention();
  const { processPouredItem } = useInventoryManagement();
  
  // Mock data - in real app this would come from your API
  const [bartenders, setBartenders] = useState<Bartender[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      isOnShift: true,
      shiftStart: '18:00',
      pourAccuracy: 94,
      todayPours: 47,
      avatar: '/placeholder.svg'
    },
    {
      id: '2', 
      name: 'Sarah Chen',
      isOnShift: true,
      shiftStart: '19:30',
      pourAccuracy: 98,
      todayPours: 23,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Mike Johnson', 
      isOnShift: false,
      shiftStart: undefined,
      pourAccuracy: 89,
      todayPours: 0,
      avatar: '/placeholder.svg'
    }
  ]);

  const [bottles, setBottles] = useState<Bottle[]>([
    {
      id: 'b1',
      name: 'Grey Goose Vodka',
      brand: 'Grey Goose',
      level: 73,
      lastPour: '2 min ago',
      assignedBartender: '1',
      pourCount: 12,
      isActive: true,
      sensorId: 'ble-001'
    },
    {
      id: 'b2', 
      name: 'Macallan 18',
      brand: 'Macallan',
      level: 28,
      lastPour: '45 min ago', 
      assignedBartender: '2',
      pourCount: 8,
      isActive: true,
      sensorId: 'ble-002'
    },
    {
      id: 'b3',
      name: 'Hendricks Gin',
      brand: 'Hendricks', 
      level: 91,
      lastPour: '3 hours ago',
      assignedBartender: '1',
      pourCount: 3,
      isActive: false
    }
  ]);

  const [recentPours, setRecentPours] = useState<PourEvent[]>([
    {
      id: 'p1',
      bottleId: 'b1',
      bartenderId: '1', 
      amount: 1.5,
      timestamp: '2 min ago',
      accuracy: 96,
      sensorData: {
        weight: 750.2,
        temperature: 18,
        tiltAngle: 45
      }
    },
    {
      id: 'p2',
      bottleId: 'b2',
      bartenderId: '2',
      amount: 2.0,
      timestamp: '45 min ago', 
      accuracy: 89,
      sensorData: {
        weight: 825.7,
        temperature: 19,
        tiltAngle: 52
      }
    }
  ]);

  const handleClockIn = (bartenderId: string, method: 'face_recognition' | 'manual' = 'manual', confidence?: number) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: true, shiftStart: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    const methodText = method === 'face_recognition' ? 'via face recognition' : 'manually';
    const confidenceText = confidence ? ` (${(confidence * 100).toFixed(1)}% confidence)` : '';
    
    toast({
      title: "Shift Started",
      description: `${bartender?.name} clocked in ${methodText}${confidenceText}`,
    });
  };

  const handleClockOut = (bartenderId: string, method: 'face_recognition' | 'manual' = 'manual', confidence?: number) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: false, shiftStart: undefined }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    const methodText = method === 'face_recognition' ? 'via face recognition' : 'manually';
    const confidenceText = confidence ? ` (${(confidence * 100).toFixed(1)}% confidence)` : '';
    
    toast({
      title: "Shift Ended", 
      description: `${bartender?.name} clocked out ${methodText}${confidenceText}`,
    });
  };

  // Simulate monitoring integration with inventory updates
  const simulatePourEvent = () => {
    const mockPour: PourEvent = {
      id: `pour-${Date.now()}`,
      bottleId: 'b1',
      bartenderId: '1',
      amount: 2.1, // Overpour example
      timestamp: 'Just now',
      accuracy: 85,
      sensorData: {
        weight: 650.3,
        temperature: 18,
        tiltAngle: 48
      }
    };
    
    setRecentPours(prev => [mockPour, ...prev.slice(0, 9)]);
    monitorPourEvent(mockPour, 1.5); // Monitor for violations
    
    // Update inventory automatically
    const amountML = mockPour.amount * 29.5735; // Convert oz to ML
    processPouredItem('inv1', amountML); // Update Grey Goose inventory
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pour-detection">Live Pours</TabsTrigger>
        <TabsTrigger value="ble-devices">BLE Devices</TabsTrigger>
        <TabsTrigger value="loss-prevention">Loss Prevention</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="mobile">Mobile Staff</TabsTrigger>
        <TabsTrigger value="manager">Manager</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <StatsOverview bartenders={bartenders} bottles={bottles} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BartenderDashboard 
            bartenders={bartenders} 
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />
          <BottleInventory bottles={bottles} bartenders={bartenders} />
        </div>

        <RecentActivity 
          recentPours={recentPours} 
          bottles={bottles} 
          bartenders={bartenders} 
        />
      </TabsContent>

      <TabsContent value="pour-detection">
        <PourDetectionEngine />
      </TabsContent>

      <TabsContent value="ble-devices">
        <BLEDeviceManager bottles={bottles} />
      </TabsContent>

      <TabsContent value="loss-prevention">
        <LossPreventionDashboard />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryManagementDashboard />
      </TabsContent>

      <TabsContent value="mobile">
        <div className="max-w-md mx-auto">
          <MobileBartenderInterface 
            bartenders={bartenders}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />
        </div>
      </TabsContent>

      <TabsContent value="manager">
        <ManagerDashboard />
      </TabsContent>

      <TabsContent value="analytics">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Advanced analytics and reporting features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will include detailed analytics, loss prevention reports, 
                reorder predictions, and performance insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};