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
      <CardContent className="space-y-6">
        {bottles.map((bottle) => {
          const assignedBartender = bartenders.find(b => b.id === bottle.assignedBartender);
          const { remainingML, shotsRemaining } = calculateRemainingShots(bottle.level);
          
          return (
            <div key={bottle.id} className="p-6 bg-background/30 rounded-lg border border-border/50">
              {/* Header Section */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg mb-1">{bottle.name}</h3>
                    <p className="text-muted-foreground">{bottle.brand}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={bottle.isActive ? "default" : "secondary"} className="whitespace-nowrap">
                      {bottle.isActive ? "Active" : "Idle"}
                    </Badge>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{bottle.pourCount} pours today</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Remaining Shots - Prominent Display */}
                <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">Remaining Shots</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{shotsRemaining}</p>
                      <p className="text-sm text-muted-foreground">{remainingML.toFixed(0)}ml remaining</p>
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Level</span>
                    <span className={`font-bold text-lg ${getBottleLevelColor(bottle.level)}`}>
                      {bottle.level}%
                    </span>
                  </div>
                  <Progress value={bottle.level} className="h-4" />
                </div>
                
                {/* Additional Info */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Last Pour</span>
                    <span className="font-medium">{bottle.lastPour}</span>
                  </div>
                  {assignedBartender && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Assigned To</span>
                      <span className="font-medium">{assignedBartender.name}</span>
                    </div>
                  )}
                </div>
                
                {bottle.sensorId && (
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Sensor ID: {bottle.sensorId}</span>
                    <Badge variant="outline" className="text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
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