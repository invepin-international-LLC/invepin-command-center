import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign,
  ShoppingCart,
  CheckCircle,
  X,
  Package
} from "lucide-react";
import { ReorderAlert } from "@/types/inventory";

interface ReorderAlertsProps {
  alerts: ReorderAlert[];
  onAcknowledge: (alertId: string) => void;
  onCreateOrder: (items: { itemId: string; quantity: number }[], supplierId: string) => void;
}

export const ReorderAlertsComponent = ({ alerts, onAcknowledge, onCreateOrder }: ReorderAlertsProps) => {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleBulkOrder = () => {
    const selectedAlertItems = activeAlerts
      .filter(alert => selectedAlerts.includes(alert.id))
      .map(alert => ({
        itemId: alert.itemId,
        quantity: alert.suggestedQuantity
      }));

    if (selectedAlertItems.length > 0) {
      // Group by supplier and create orders
      const supplierGroups = selectedAlertItems.reduce((groups, item) => {
        const alert = activeAlerts.find(a => a.itemId === item.itemId);
        const supplierId = alert?.supplier.id || '';
        if (!groups[supplierId]) groups[supplierId] = [];
        groups[supplierId].push(item);
        return groups;
      }, {} as Record<string, typeof selectedAlertItems>);

      Object.entries(supplierGroups).forEach(([supplierId, items]) => {
        onCreateOrder(items, supplierId);
      });

      setSelectedAlerts([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map(urgency => {
          const count = activeAlerts.filter(alert => alert.urgency === urgency).length;
          return (
            <Card key={urgency} className={`border ${getUrgencyColor(urgency)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{urgency} Alerts</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <span className="text-2xl">{getUrgencyIcon(urgency)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedAlerts.length} alerts selected</p>
                <p className="text-sm text-muted-foreground">
                  Total cost: ${activeAlerts
                    .filter(alert => selectedAlerts.includes(alert.id))
                    .reduce((sum, alert) => sum + alert.estimatedCost, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlerts([])}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleBulkOrder}
                  className="bg-gradient-primary"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Active Reorder Alerts
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Stocked Up!</h3>
              <p className="text-muted-foreground">No reorder alerts at this time</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getUrgencyColor(alert.urgency)}`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => handleSelectAlert(alert.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{alert.itemName}</h3>
                          <Badge className={getUrgencyColor(alert.urgency)}>
                            {getUrgencyIcon(alert.urgency)} {alert.urgency.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current: {alert.currentStock} | Min: {alert.minThreshold}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Stockout: {alert.predictedStockout}
                          </span>
                          <span>Supplier: {alert.supplier.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-background/30 rounded">
                        <p className="text-xs text-muted-foreground">Suggested Qty</p>
                        <p className="font-bold">{alert.suggestedQuantity}</p>
                      </div>
                      <div className="text-center p-2 bg-background/30 rounded">
                        <p className="text-xs text-muted-foreground">Estimated Cost</p>
                        <p className="font-bold">${alert.estimatedCost.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-background/30 rounded">
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="font-bold">{alert.supplier.deliveryDays.length}d</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onCreateOrder([{ itemId: alert.itemId, quantity: alert.suggestedQuantity }], alert.supplier.id)}
                        className="bg-gradient-primary"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Acknowledged Alerts
            </CardTitle>
            <CardDescription>Recently handled reorder notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {acknowledgedAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50 opacity-75">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div>
                    <p className="font-medium">{alert.itemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Acknowledged • Suggested: {alert.suggestedQuantity} units
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Handled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};