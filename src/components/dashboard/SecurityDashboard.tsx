import React from 'react';
import { AccessControl } from '@/components/auth/AccessControl';
import { StaffChat } from '@/components/communication/StaffChat';
import { ContactSettings } from '@/components/communication/ContactSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Phone, 
  Lock, 
  Eye, 
  AlertTriangle,
  Activity,
  Camera,
  Database
} from 'lucide-react';

export function SecurityDashboard() {
  const securityStats = {
    activeUsers: 12,
    failedLogins: 0,
    activeSessions: 8,
    lastSecurityScan: '2 hours ago',
    cameraStatus: 'All Online',
    accessAttempts: 145
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Center</h2>
          <p className="text-muted-foreground">
            Monitor access, manage communications, and maintain security
          </p>
        </div>
        <Badge variant="outline" className="text-success border-success/20">
          <Shield className="h-3 w-3 mr-1" />
          All Systems Secure
        </Badge>
      </div>

      {/* Security Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-primary">{securityStats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold text-success">{securityStats.failedLogins}</p>
              </div>
              <Lock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Camera Status</p>
                <p className="text-sm font-bold text-success">{securityStats.cameraStatus}</p>
              </div>
              <Camera className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Access Attempts</p>
                <p className="text-2xl font-bold text-primary">{securityStats.accessAttempts}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="communication" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Communication</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Access Control</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact Settings</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Monitoring</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <StaffChat className="h-[600px]" />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Communications
                </CardTitle>
                <CardDescription>
                  Quick access to emergency communication tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AccessControl requiredRoles={['admin', 'manager']}>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Call All Staff
                    </Button>
                    <Button variant="outline" className="justify-start" size="lg">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Emergency Alert
                    </Button>
                    <Button variant="outline" className="justify-start" size="lg">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Trigger Security Alert
                    </Button>
                  </div>
                </AccessControl>
                
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Last emergency drill:</span>
                      <span className="text-muted-foreground">3 days ago</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Staff response time:</span>
                      <span className="text-success">2.3 minutes</span>
                    </p>
                    <p className="flex justify-between">
                      <span>System status:</span>
                      <Badge variant="outline" className="text-success border-success/20">
                        Operational
                      </Badge>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <AccessControl requiredRoles={['admin', 'manager']}>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Access Management</CardTitle>
                  <CardDescription>
                    Manage user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Camera Access</p>
                        <p className="text-sm text-muted-foreground">View security cameras</p>
                      </div>
                      <Badge variant="outline" className="text-success">12 users</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Inventory Management</p>
                        <p className="text-sm text-muted-foreground">Manage stock levels</p>
                      </div>
                      <Badge variant="outline" className="text-warning">5 users</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Financial Reports</p>
                        <p className="text-sm text-muted-foreground">View financial data</p>
                      </div>
                      <Badge variant="outline" className="text-danger">2 users</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Logs</CardTitle>
                  <CardDescription>
                    Recent security events and access attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <Shield className="h-4 w-4 text-success" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Successful login</p>
                        <p className="text-xs text-muted-foreground">john.doe@invepin.com - 2 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Eye className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Camera accessed</p>
                        <p className="text-xs text-muted-foreground">Camera 3 viewed - 5 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <Database className="h-4 w-4 text-warning" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Data export</p>
                        <p className="text-xs text-muted-foreground">Inventory report - 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccessControl>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ContactSettings />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <AccessControl requiredRoles={['admin', 'manager']}>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Monitoring</CardTitle>
                  <CardDescription>
                    Real-time monitoring of all security systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                      <Camera className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-medium">Cameras</p>
                      <p className="text-2xl font-bold text-success">8/8</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                      <Shield className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-medium">Security</p>
                      <p className="text-2xl font-bold text-success">100%</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-medium">Active Users</p>
                      <p className="text-2xl font-bold text-primary">{securityStats.activeUsers}</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccessControl>
        </TabsContent>
      </Tabs>
    </div>
  );
}