import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, DropletIcon } from "lucide-react";
import { PourEvent, Bottle, Bartender } from "@/types/bar";

interface RecentActivityProps {
  recentPours: PourEvent[];
  bottles: Bottle[];
  bartenders: Bartender[];
}

export const RecentActivity = ({ recentPours, bottles, bartenders }: RecentActivityProps) => {
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recent Pour Activity
        </CardTitle>
        <CardDescription>Live pour tracking and accuracy monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentPours.map((pour) => {
            const bottle = bottles.find(b => b.id === pour.bottleId);
            const bartender = bartenders.find(b => b.id === pour.bartenderId);
            
            return (
              <div key={pour.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <DropletIcon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{bottle?.name}</p>
                    <p className="text-sm text-muted-foreground">by {bartender?.name}</p>
                    {pour.sensorData && (
                      <p className="text-xs text-muted-foreground">
                        Weight: {pour.sensorData.weight.toFixed(1)}g | Temp: {pour.sensorData.temperature}°C
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pour.amount}oz</span>
                    <Badge 
                      variant={pour.accuracy >= 95 ? "default" : pour.accuracy >= 85 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {pour.accuracy}% accuracy
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{pour.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};