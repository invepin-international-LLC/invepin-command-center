import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function HiveAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$8.4M</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+12.5% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Loss Prevention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">94.7%</div>
            <Progress value={94.7} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Reduction in shrinkage</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">7</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">99.9%</div>
            <p className="text-xs text-success mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
            <CardDescription>By inventory accuracy and loss prevention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Downtown Bar & Grill", accuracy: 98.5, savings: "$45.2K" },
              { name: "Riverside Restaurant", accuracy: 97.2, savings: "$38.7K" },
              { name: "Harbor View Pub", accuracy: 96.8, savings: "$35.1K" },
            ].map((store, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-success">{store.savings} saved</span>
                </div>
                <Progress value={store.accuracy} />
                <p className="text-xs text-muted-foreground">{store.accuracy}% accuracy</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle>Recent System Events</CardTitle>
            <CardDescription>Latest activity across the HIVE network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: "success", event: "Colony Hub HUB-012 came online", time: "2 mins ago" },
              { type: "warning", event: "Low battery alert for 3 Invepins", time: "15 mins ago" },
              { type: "info", event: "New store 'Ocean Breeze Bar' added", time: "1 hour ago" },
              { type: "success", event: "Daily sync completed for all hubs", time: "2 hours ago" },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <div className={`h-2 w-2 rounded-full mt-1.5 ${
                  event.type === 'success' ? 'bg-success' :
                  event.type === 'warning' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{event.event}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
