import { Card, CardContent } from "@/components/ui/card";
import { Users, DropletIcon, Target, AlertTriangle } from "lucide-react";
import { Bartender, Bottle } from "@/types/bar";

interface StatsOverviewProps {
  bartenders: Bartender[];
  bottles: Bottle[];
}

export const StatsOverview = ({ bartenders, bottles }: StatsOverviewProps) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-success';
    if (accuracy >= 85) return 'text-warning';
    return 'text-danger';
  };

  const activeBartenders = bartenders.filter(b => b.isOnShift);
  const totalPours = bartenders.reduce((sum, b) => sum + b.todayPours, 0);
  const avgAccuracy = bartenders.length > 0 
    ? Math.round(bartenders.reduce((sum, b) => sum + b.pourAccuracy, 0) / bartenders.length)
    : 0;
  const lowStockBottles = bottles.filter(b => b.level < 30).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Bartenders</p>
              <p className="text-2xl font-bold">{activeBartenders.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Pours</p>
              <p className="text-2xl font-bold">{totalPours}</p>
            </div>
            <DropletIcon className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className={`text-2xl font-bold ${getAccuracyColor(avgAccuracy)}`}>{avgAccuracy}%</p>
            </div>
            <Target className="h-8 w-8 text-success" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className={`text-2xl font-bold ${lowStockBottles > 0 ? 'text-danger' : 'text-success'}`}>
                {lowStockBottles}
              </p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${lowStockBottles > 0 ? 'text-danger' : 'text-success'}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};