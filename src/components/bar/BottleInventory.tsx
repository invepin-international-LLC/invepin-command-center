import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wine } from "lucide-react";
import { Bottle, Bartender } from "@/types/bar";

interface BottleInventoryProps {
  bottles: Bottle[];
  bartenders: Bartender[];
}

export const BottleInventory = ({ bottles, bartenders }: BottleInventoryProps) => {
  const getBottleLevelColor = (level: number) => {
    if (level > 50) return 'text-success';
    if (level > 20) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wine className="h-5 w-5" />
          Active Bottles
        </CardTitle>
        <CardDescription>Real-time inventory tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bottles.map((bottle) => {
          const assignedBartender = bartenders.find(b => b.id === bottle.assignedBartender);
          return (
            <div key={bottle.id} className="p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{bottle.name}</p>
                  <p className="text-sm text-muted-foreground">{bottle.brand}</p>
                </div>
                <div className="text-right">
                  <Badge variant={bottle.isActive ? "default" : "secondary"} className="mb-1">
                    {bottle.isActive ? "Active" : "Idle"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{bottle.pourCount} pours today</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Level</span>
                  <span className={`font-medium ${getBottleLevelColor(bottle.level)}`}>
                    {bottle.level}%
                  </span>
                </div>
                <Progress value={bottle.level} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last pour: {bottle.lastPour}</span>
                  {assignedBartender && (
                    <span>Assigned: {assignedBartender.name}</span>
                  )}
                </div>
                {bottle.sensorId && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Sensor: {bottle.sensorId}</span>
                    <Badge variant="outline" className="text-xs">BLE Connected</Badge>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};