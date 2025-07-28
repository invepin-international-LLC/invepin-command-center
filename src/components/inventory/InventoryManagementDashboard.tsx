import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { InventoryOverview } from "./InventoryOverview";
import { StockLevels } from "./StockLevels";
import { ReorderAlertsComponent } from "./ReorderAlerts";
import { 
  Package, 
  BarChart3, 
  AlertTriangle,
  Truck,
  Settings,
  TrendingUp
} from "lucide-react";

export const InventoryManagementDashboard = () => {
  const {
    inventory,
    reorderAlerts,
    analytics,
    updateStock,
    acknowledgeReorderAlert,
    createPurchaseOrder
  } = useInventoryManagement();

  const activeAlerts = reorderAlerts.filter(alert => !alert.acknowledged).length;

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Loading Inventory...</h3>
          <p className="text-muted-foreground">Fetching real-time stock data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Real-time stock tracking, automated reordering, and supplier management
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {activeAlerts > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {activeAlerts} Alert{activeAlerts > 1 ? 's' : ''}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            ${analytics.totalValue.toLocaleString()} Total Value
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stock-levels" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Stock Levels
          </TabsTrigger>
          <TabsTrigger value="reorder-alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reorder Alerts
            {activeAlerts > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {activeAlerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InventoryOverview analytics={analytics} />
        </TabsContent>

        <TabsContent value="stock-levels">
          <StockLevels 
            inventory={inventory}
            onUpdateStock={updateStock}
          />
        </TabsContent>

        <TabsContent value="reorder-alerts">
          <ReorderAlertsComponent
            alerts={reorderAlerts}
            onAcknowledge={acknowledgeReorderAlert}
            onCreateOrder={createPurchaseOrder}
          />
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>Order management and supplier coordination</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Purchase Orders Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced order management, supplier coordination, and delivery tracking
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};