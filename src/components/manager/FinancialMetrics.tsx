import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  ShieldCheck,
  Clock
} from "lucide-react";
import { FinancialMetrics } from "@/types/manager";

interface FinancialMetricsProps {
  financial: FinancialMetrics;
}

export const FinancialMetricsComponent = ({ financial }: FinancialMetricsProps) => {
  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-success' : 'text-danger';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">${financial.dailyRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {financial.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-danger" />
                  )}
                  <span className={`text-xs ${getGrowthColor(financial.revenueGrowth)}`}>
                    {financial.revenueGrowth >= 0 ? '+' : ''}{financial.revenueGrowth}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold">{financial.profitMargin}%</p>
                <div className="mt-1">
                  <Progress value={financial.profitMargin} className="h-2" />
                </div>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loss Prevented</p>
                <p className="text-2xl font-bold text-success">${financial.preventedLoss.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold text-primary">${financial.costSavings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">From efficiency</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Revenue leaders and growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financial.topSellingProducts.map((product, index) => {
              const GrowthIcon = getGrowthIcon(product.growth);
              return (
                <div key={product.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} pours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">${product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{product.margin}% margin</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <GrowthIcon className={`h-4 w-4 ${getGrowthColor(product.growth)}`} />
                      <span className={`text-sm font-medium ${getGrowthColor(product.growth)}`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Revenue Chart */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Hourly Performance</CardTitle>
          <CardDescription>Revenue and efficiency by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financial.hourlyRevenue.map((hour) => (
              <div key={hour.hour} className="grid grid-cols-4 gap-4 items-center p-3 bg-background/30 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">{hour.hour}</p>
                  <p className="text-sm text-muted-foreground">{hour.pours} pours</p>
                </div>
                
                <div>
                  <p className="font-bold">${hour.revenue}</p>
                  <div className="mt-1">
                    <Progress value={(hour.revenue / 650) * 100} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">{hour.efficiency}%</p>
                  <p className="text-sm text-muted-foreground">efficiency</p>
                </div>
                
                <div className="text-right">
                  <Badge variant={hour.efficiency >= 90 ? "default" : "secondary"}>
                    {hour.efficiency >= 90 ? "Peak" : "Normal"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};