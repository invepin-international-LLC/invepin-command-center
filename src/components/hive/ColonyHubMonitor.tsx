import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wifi, Activity, Signal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ColonyHubMonitor() {
  const hubs = [
    { id: "HUB-001", store: "Downtown Bar & Grill", status: "online", lastSync: "2 mins ago", connectedDevices: 24, signalStrength: 95 },
    { id: "HUB-002", store: "Riverside Restaurant", status: "online", lastSync: "1 min ago", connectedDevices: 18, signalStrength: 88 },
    { id: "HUB-003", store: "Downtown Bar & Grill", status: "online", lastSync: "5 mins ago", connectedDevices: 12, signalStrength: 92 },
    { id: "HUB-004", store: "Mountain View Cafe", status: "offline", lastSync: "2 hours ago", connectedDevices: 0, signalStrength: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Online Hubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23/24</div>
            <Progress value={95.8} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Signal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">91.7%</div>
            <p className="text-xs text-success mt-1">Excellent</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Synced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1.2TB</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Colony Hub Status
          </CardTitle>
          <CardDescription>Real-time monitoring of all mesh network hubs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hub ID</TableHead>
                <TableHead>Store Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Connected Devices</TableHead>
                <TableHead>Signal Strength</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hubs.map((hub) => (
                <TableRow key={hub.id}>
                  <TableCell className="font-mono font-medium">{hub.id}</TableCell>
                  <TableCell>{hub.store}</TableCell>
                  <TableCell>
                    {hub.status === 'online' ? (
                      <Badge className="bg-gradient-success text-success-foreground flex items-center gap-1 w-fit">
                        <Activity className="h-3 w-3 animate-pulse" />
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Offline</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{hub.lastSync}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{hub.connectedDevices}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Signal className={`h-4 w-4 ${hub.signalStrength > 80 ? 'text-success' : 'text-warning'}`} />
                      <span className="text-sm">{hub.signalStrength}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
