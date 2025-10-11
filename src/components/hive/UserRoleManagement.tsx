import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, Plus } from "lucide-react";

export function UserRoleManagement() {
  const users = [
    { id: "1", name: "Alex Chen", email: "admin@invepin.com", role: "super_admin", lastLogin: "Just now" },
    { id: "2", name: "Sarah Rodriguez", email: "company@invepin.com", role: "company_admin", lastLogin: "5 mins ago" },
    { id: "3", name: "Jordan Smith", email: "manager@invepin.com", role: "manager", lastLogin: "1 hour ago" },
    { id: "4", name: "Mike Johnson", email: "bartender@invepin.com", role: "bartender", lastLogin: "2 hours ago" },
    { id: "5", name: "Emma Davis", email: "staff@invepin.com", role: "staff", lastLogin: "3 hours ago" },
  ];

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      super_admin: { color: "bg-gradient-primary text-primary-foreground", label: "Super Admin" },
      company_admin: { color: "bg-gradient-success text-success-foreground", label: "Company Admin" },
      manager: { color: "bg-gradient-warning text-warning-foreground", label: "Manager" },
      bartender: { color: "bg-blue-500/20 text-blue-400 border-blue-500/50", label: "Bartender" },
      staff: { color: "bg-muted text-muted-foreground", label: "Staff" },
    };
    const variant = variants[role] || variants.staff;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">Across all roles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">42</div>
            <p className="text-xs text-success mt-1">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">Super & Company</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User & Role Management
              </CardTitle>
              <CardDescription>Manage user access and permissions</CardDescription>
            </div>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-1" />
                      Manage
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
