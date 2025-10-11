import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Store, Plus, Edit, MapPin, Power } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function StoreManagement() {
  const [stores] = useState([
    { id: "1", name: "Downtown Bar & Grill", location: "123 Main St, City", isActive: true, appEnabled: true, devices: 24 },
    { id: "2", name: "Riverside Restaurant", location: "456 River Rd, Town", isActive: true, appEnabled: true, devices: 18 },
    { id: "3", name: "Mountain View Cafe", location: "789 Peak Ave, Village", isActive: false, appEnabled: false, devices: 0 },
  ]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Management
              </CardTitle>
              <CardDescription>Manage all Invepin-enabled locations</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                  <DialogDescription>Enter the store details to add it to the HIVE network</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Store Name</Label>
                    <Input id="name" placeholder="Enter store name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Enter address" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Active</Label>
                    <Switch id="active" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app">App Enabled</Label>
                    <Switch id="app" defaultChecked />
                  </div>
                  <Button className="w-full bg-gradient-primary">Create Store</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>App</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {store.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{store.devices} devices</Badge>
                  </TableCell>
                  <TableCell>
                    {store.isActive ? (
                      <Badge className="bg-gradient-success text-success-foreground">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Power className={`h-4 w-4 ${store.appEnabled ? 'text-success' : 'text-muted-foreground'}`} />
                      <span className="text-sm">{store.appEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
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
