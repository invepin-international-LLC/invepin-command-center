import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Truck
} from "lucide-react";
import { InventoryAnalytics } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";

interface InventoryOverviewProps {
  analytics: InventoryAnalytics;
  onReceiveInventory?: () => void;
}


export const InventoryOverview = ({ analytics, onReceiveInventory }: InventoryOverviewProps) => {
  const { toast } = useToast();
  const profitColor = analytics.profitMargin >= 45 ? 'text-success' : analytics.profitMargin >= 35 ? 'text-warning' : 'text-danger';
  const turnoverColor = analytics.turnoverRate >= 3 ? 'text-success' : analytics.turnoverRate >= 2 ? 'text-warning' : 'text-danger';

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inventory Overview</h2>
          <p className="text-muted-foreground">Real-time stock analytics and performance metrics</p>
        </div>
        <Button className="bg-gradient-success hover:shadow-glow" onClick={() => {
          if (onReceiveInventory) {
            onReceiveInventory();
          } else {
            toast({
              title: "Receive Inventory",
              description: "Go to Stock Levels and use Adjust to add received stock.",
            });
          }
        }}>
          <Package className="h-4 w-4 mr-2" />
          Receive Inventory
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">Total Inventory Value</p>
                <p className="text-xl sm:text-2xl font-bold">${analytics.totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{analytics.totalItems} items</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">Low Stock Alerts</p>
                <p className={`text-xl sm:text-2xl font-bold ${analytics.lowStockItems > 0 ? 'text-orange-500' : 'text-success'}`}>
                  {analytics.lowStockItems}
                </p>
                <p className="text-xs text-red-500">{analytics.criticalStockItems} critical</p>
              </div>
              <AlertTriangle className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ${analytics.lowStockItems > 0 ? 'text-orange-500' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">Profit Margin</p>
                <p className={`text-xl sm:text-2xl font-bold ${profitColor}`}>{analytics.profitMargin}%</p>
                <p className="text-xs text-muted-foreground">Monthly avg</p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">Turnover Rate</p>
                <p className={`text-xl sm:text-2xl font-bold ${turnoverColor}`}>{analytics.turnoverRate}x</p>
                <p className="text-xs text-muted-foreground">Per month</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Inventory by Category
          </CardTitle>
          <CardDescription>Stock distribution across product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryBreakdown.map((category) => {
              const percentage = (category.value / analytics.totalValue) * 100;
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{category.category}</span>
                      <Badge variant="outline">{category.count} items</Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">${category.value.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Highest revenue generators this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {analytics.topSellingItems.map((item, index) => (
              <div key={item.item.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.item.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.item.brand}</p>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold">${item.revenue.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">{(item.volume / 1000).toFixed(1)}L sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Supplier Performance
          </CardTitle>
          <CardDescription>Delivery reliability and order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.supplierPerformance.map((perf) => (
              <div key={perf.supplier.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{perf.supplier.name}</p>
                    <p className="text-sm text-muted-foreground">{perf.totalOrders} orders placed</p>
                  </div>
                  {perf.supplier.isPreferred && (
                    <Badge variant="default" className="flex-shrink-0">Preferred</Badge>
                  )}
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm">On-time:</span>
                    <span className={`font-bold ${perf.onTimeDelivery >= 90 ? 'text-success' : perf.onTimeDelivery >= 80 ? 'text-warning' : 'text-danger'}`}>
                      {perf.onTimeDelivery}%
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xs ${i < Math.floor(perf.supplier.rating) ? 'text-warning' : 'text-muted-foreground'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{perf.supplier.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="text-xl font-bold">${analytics.monthlyCost.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-xl font-bold text-success">${analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wastage Value</p>
                <p className="text-xl font-bold text-orange-500">${analytics.wastageValue.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};