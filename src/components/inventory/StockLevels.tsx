import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Search, 
  Filter,
  Edit,
  Plus,
  Minus,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Bluetooth
} from "lucide-react";
import { InventoryItem } from "@/types/inventory";

interface StockLevelsProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, quantity: number, reason: string, type: 'in' | 'out' | 'adjustment') => void;
}

export const StockLevels = ({ inventory, onUpdateStock }: StockLevelsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && item.currentStock <= item.minThreshold) ||
                        (stockFilter === 'critical' && item.currentStock <= item.minThreshold * 0.5) ||
                        (stockFilter === 'overstock' && item.currentStock >= item.maxThreshold) ||
                        (stockFilter === 'normal' && item.currentStock > item.minThreshold && item.currentStock < item.maxThreshold);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minThreshold * 0.5) return { status: 'critical', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
    if (item.currentStock <= item.minThreshold) return { status: 'low', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
    if (item.currentStock >= item.maxThreshold) return { status: 'overstock', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    return { status: 'normal', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'overstock': return <BarChart3 className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleQuickAdjust = (itemId: string, change: number) => {
    const reason = change > 0 ? 'Quick stock increase' : 'Quick stock decrease';
    const type = change > 0 ? 'in' : 'out';
    onUpdateStock(itemId, Math.abs(change), reason, type);
  };

  const calculateStockPercentage = (item: InventoryItem) => {
    return ((item.currentStock - 0) / (item.maxThreshold - 0)) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Level Management
          </CardTitle>
          <CardDescription>Monitor and adjust inventory levels in real-time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md"
            >
              <option value="all">All Stock Levels</option>
              <option value="critical">Critical Stock</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal Stock</option>
              <option value="overstock">Overstock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          const stockPercentage = calculateStockPercentage(item);
          
          return (
            <Card key={item.id} className="bg-gradient-card border-border">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.pourSpoutId && (
                          <Badge variant="outline" className="text-xs">
                            <Bluetooth className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.brand} • {item.sku}</p>
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    </div>
                    
                    <Badge className={stockStatus.color}>
                      {getStockIcon(stockStatus.status)}
                      <span className="ml-1 capitalize">{stockStatus.status}</span>
                    </Badge>
                  </div>

                  {/* Stock Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current Stock</span>
                      <span className="font-medium">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(stockPercentage, 100)} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Min: {item.minThreshold}</span>
                      <span>Max: {item.maxThreshold}</span>
                    </div>
                  </div>

                  {/* Live Tracking (for connected items) */}
                  {item.pourSpoutId && item.estimatedRemaining && (
                    <div className="p-2 bg-primary/10 rounded border border-primary/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary">Live Remaining</span>
                        <span className="font-medium">
                          {(item.estimatedRemaining / 1000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(item.totalPoured || 0) / 1000}L poured today
                      </div>
                    </div>
                  )}

                  {/* Financial Info */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-medium">${item.costPerUnit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sell Price</p>
                      <p className="font-medium">${item.sellPrice}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Margin</p>
                      <p className="font-medium text-success">{item.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdjust(item.id, -1)}
                      disabled={item.currentStock <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium px-2">
                      {item.currentStock}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdjust(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="default"
                      className="ml-auto bg-gradient-primary"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Adjust
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Items Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};