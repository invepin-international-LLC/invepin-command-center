import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const calculateRemainingShots = (level: number, totalCapacity: number = 750) => {
    const remainingML = (level / 100) * totalCapacity;
    const shotsRemaining = Math.floor(remainingML / 30); // Standard shot is 30ml
    return { remainingML, shotsRemaining };
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5" />
              Active Bottles
            </CardTitle>
            <CardDescription>Real-time inventory tracking with shot counters</CardDescription>
          </div>
          <Button variant="success" size="sm" className="bg-gradient-success hover:shadow-glow">
            <Wine className="h-4 w-4 mr-2" />
            Add Bottle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bottles.map((bottle) => {
          const assignedBartender = bartenders.find(b => b.id === bottle.assignedBartender);
          const { remainingML, shotsRemaining } = calculateRemainingShots(bottle.level);
          
          return (
            <div key={bottle.id} className="p-4 bg-background/30 rounded-lg border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{bottle.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{bottle.brand}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Badge variant={bottle.isActive ? "default" : "secondary"}>
                    {bottle.isActive ? "Active" : "Idle"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{bottle.pourCount} pours today</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Remaining Shots - Prominent Display */}
                <div className="p-3 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">Remaining Shots</span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{shotsRemaining}</p>
                      <p className="text-xs text-muted-foreground">{remainingML.toFixed(0)}ml left</p>
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Level</span>
                    <span className={`font-medium ${getBottleLevelColor(bottle.level)}`}>
                      {bottle.level}%
                    </span>
                  </div>
                  <Progress value={bottle.level} className="h-3" />
                </div>
                
                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between sm:justify-start">
                    <span>Last pour:</span>
                    <span className="ml-1 truncate">{bottle.lastPour}</span>
                  </div>
                  {assignedBartender && (
                    <div className="flex items-center justify-between sm:justify-start">
                      <span>Assigned:</span>
                      <span className="ml-1 truncate">{assignedBartender.name}</span>
                    </div>
                  )}
                </div>
                
                {bottle.sensorId && (
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Sensor: {bottle.sensorId}</span>
                    <Badge variant="outline" className="text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      BLE Connected
                    </Badge>
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