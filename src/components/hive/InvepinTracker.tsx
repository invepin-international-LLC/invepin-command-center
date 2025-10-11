import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Activity, Battery, MapPin, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function InvepinTracker() {
  const invepins = [
    { id: "INV-1847", item: "Grey Goose Vodka", store: "Downtown Bar & Grill", location: "Bar Station 1", lastDetected: "Just now", battery: 87 },
    { id: "INV-1846", item: "Jack Daniels", store: "Downtown Bar & Grill", location: "Bar Station 2", lastDetected: "1 min ago", battery: 92 },
    { id: "INV-1845", item: "Hendricks Gin", store: "Riverside Restaurant", location: "Back Bar", lastDetected: "3 mins ago", battery: 78 },
    { id: "INV-1844", item: "Patron Silver", store: "Downtown Bar & Grill", location: "Bar Station 1", lastDetected: "5 mins ago", battery: 45 },
    { id: "INV-1843", item: "Crown Royal", store: "Riverside Restaurant", location: "Storage", lastDetected: "8 mins ago", battery: 65 },
  ];

  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-success";
    if (level > 30) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invepins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,847</div>
            <p className="text-xs text-success mt-1">All tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,842</div>
            <Progress value={99.7} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">12</div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">84%</div>
            <p className="text-xs text-success mt-1">Healthy</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Invepin Tracking
              </CardTitle>
              <CardDescription>Real-time location and status monitoring</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by ID or item..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invepin ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Detected</TableHead>
                <TableHead>Battery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invepins.map((invepin) => (
                <TableRow key={invepin.id}>
                  <TableCell className="font-mono font-medium">{invepin.id}</TableCell>
                  <TableCell className="font-medium">{invepin.item}</TableCell>
                  <TableCell className="text-muted-foreground">{invepin.store}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {invepin.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Activity className="h-3 w-3 animate-pulse text-success" />
                      {invepin.lastDetected}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Battery className={`h-4 w-4 ${getBatteryColor(invepin.battery)}`} />
                      <span className={`text-sm font-medium ${getBatteryColor(invepin.battery)}`}>
                        {invepin.battery}%
                      </span>
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
