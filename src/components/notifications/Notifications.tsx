import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  BellOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Smartphone,
  Shield,
  Battery,
  Wifi,
  Package,
  Users,
  Activity,
  X,
  Filter,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationsProps {
  industry?: string;
}

interface NotificationItem {
  id: string;
  type: 'security' | 'device' | 'system' | 'maintenance' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  deviceId?: string;
  location?: string;
}

interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  securityAlerts: boolean;
  deviceAlerts: boolean;
  systemAlerts: boolean;
  maintenanceAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  alertThreshold: 'all' | 'medium' | 'high' | 'critical';
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'security',
    title: 'Unauthorized Movement Detected',
    message: 'Premium Whiskey Bottle moved outside designated area in Bar Section A',
    timestamp: '2 minutes ago',
    severity: 'high',
    read: false,
    deviceId: 'inv-004',
    location: 'Bar Section A'
  },
  {
    id: '2',
    type: 'device',
    title: 'Low Battery Warning',
    message: 'Invepin Device #003 battery level is at 23%',
    timestamp: '15 minutes ago',
    severity: 'medium',
    read: false,
    deviceId: 'inv-003',
    location: 'Storage Room B'
  },
  {
    id: '3',
    type: 'security',
    title: 'Device Disconnected',
    message: 'High-Value Watch tracker lost connection',
    timestamp: '1 hour ago',
    severity: 'critical',
    read: true,
    deviceId: 'inv-005',
    location: 'Jewelry Counter'
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update Complete',
    message: 'Invepin Command Center updated to version 2.1.4',
    timestamp: '2 hours ago',
    severity: 'low',
    read: true
  },
  {
    id: '5',
    type: 'maintenance',
    title: 'Scheduled Maintenance Reminder',
    message: '5 devices require battery replacement within 48 hours',
    timestamp: '3 hours ago',
    severity: 'medium',
    read: true
  }
];

export const Notifications = ({ industry = 'retail' }: NotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    soundEnabled: true,
    securityAlerts: true,
    deviceAlerts: true,
    systemAlerts: true,
    maintenanceAlerts: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    alertThreshold: 'medium'
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'security' | 'device' | 'system'>('all');
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const { toast } = useToast();

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      console.log('Notification API not supported. Browser:', navigator.userAgent);
      toast({
        title: "Browser Compatibility",
        description: "This browser doesn't support push notifications. Consider using Chrome, Firefox, or Safari for full functionality.",
        variant: "destructive"
      });
    }

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        generateRandomNotification();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "This browser doesn't support notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, pushEnabled: true }));
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive real-time alerts",
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in browser settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const sendPushNotification = (notification: NotificationItem) => {
    if (permissionStatus === 'granted' && settings.pushEnabled) {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        silent: !settings.soundEnabled
      });

      notif.onclick = () => {
        window.focus();
        markAsRead(notification.id);
        notif.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notif.close(), 5000);
    }
  };

  const generateRandomNotification = () => {
    const types: NotificationItem['type'][] = ['security', 'device', 'system', 'maintenance'];
    const severities: NotificationItem['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const templates = {
      security: [
        'Unauthorized movement detected in Zone A',
        'Item removed from secure area',
        'Multiple rapid movements detected'
      ],
      device: [
        'Device battery critically low',
        'Connection lost to tracking device',
        'Signal strength degraded'
      ],
      system: [
        'System performance optimized',
        'Database backup completed',
        'Network connectivity restored'
      ],
      maintenance: [
        'Device requires calibration',
        'Firmware update available',
        'Scheduled maintenance due'
      ]
    };

    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const message = templates[type][Math.floor(Math.random() * templates[type].length)];

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type,
      title: message,
      message: `${message} - Automated alert from Invepin system`,
      timestamp: 'Just now',
      severity,
      read: false,
      deviceId: type === 'device' ? `inv-${Math.floor(Math.random() * 10) + 1}` : undefined,
      location: ['Zone A', 'Zone B', 'Storage Room', 'Main Floor'][Math.floor(Math.random() * 4)]
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    
    // Send push notification if conditions are met
    if (shouldSendNotification(newNotification)) {
      sendPushNotification(newNotification);
      
      // Also show toast
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: severity === 'critical' || severity === 'high' ? 'destructive' : 'default',
      });
    }
  };

  const shouldSendNotification = (notification: NotificationItem): boolean => {
    if (!settings.pushEnabled) return false;
    
    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (currentTime >= settings.quietHours.start || currentTime <= settings.quietHours.end) {
        return false;
      }
    }

    // Check alert threshold
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const thresholdLevels = { all: 1, medium: 2, high: 3, critical: 4 };
    
    if (severityLevels[notification.severity] < thresholdLevels[settings.alertThreshold]) {
      return false;
    }

    // Check type-specific settings
    switch (notification.type) {
      case 'security': return settings.securityAlerts;
      case 'device': return settings.deviceAlerts;
      case 'system': return settings.systemAlerts;
      case 'maintenance': return settings.maintenanceAlerts;
      default: return true;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been removed",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'device': return <Smartphone className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger border-danger/20 bg-danger/10';
      case 'high': return 'text-danger border-danger/20 bg-danger/5';
      case 'medium': return 'text-warning border-warning/20 bg-warning/10';
      case 'low': return 'text-success border-success/20 bg-success/10';
      default: return 'text-muted-foreground border-border bg-background';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter !== 'all') return notif.type === filter;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg relative">
                <Bell className="h-5 w-5 text-primary-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-danger text-white text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </div>
              <div>
                <CardTitle>Push Notifications & Alerts</CardTitle>
                <CardDescription>Real-time security and system notifications</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {permissionStatus !== 'granted' && (
                <Button onClick={requestNotificationPermission} className="bg-gradient-primary">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Enable Notifications</span>
                  <span className="sm:hidden">Enable</span>
                </Button>
              )}
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mark All Read</span>
                  <span className="sm:hidden">Read All</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Permission Status */}
      {permissionStatus !== 'granted' && (
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BellOff className="h-5 w-5 text-warning" />
              <div>
                <h3 className="font-medium text-warning">Notifications Disabled</h3>
                <p className="text-sm text-muted-foreground">
                  Enable push notifications to receive real-time security alerts and system updates.
                </p>
              </div>
              <Button onClick={requestNotificationPermission} className="bg-gradient-primary ml-auto">
                Enable Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Filter Controls */}
          <Card className="bg-gradient-card border-border">
            <CardContent className="mobile-compact">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Label className="mobile-text-sm">Filter:</Label>
                  </div>
                  <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger className="w-28 sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="device">Device</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="mobile-text-xs">{filteredNotifications.length} notifications</Badge>
                  {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications} className="mobile-text-xs">
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-gradient-card border-border">
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === 'unread' ? 'All notifications have been read' : 'No notifications found'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border transition-all duration-200 mobile-card ${
                    notification.read ? 'bg-card' : 'bg-gradient-card'
                  } ${getSeverityColor(notification.severity)}`}
                >
                  <CardContent className="mobile-compact">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium mobile-text-sm mobile-truncate flex-1">{notification.title}</h4>
                            <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                              {notification.severity}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="mobile-text-xs text-muted-foreground mb-2 break-words">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{notification.timestamp}</span>
                            </div>
                            {notification.location && (
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>{notification.location}</span>
                              </div>
                            )}
                            {notification.deviceId && (
                              <div className="flex items-center gap-1">
                                <Smartphone className="h-3 w-3" />
                                <span>{notification.deviceId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">General Settings</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-enabled">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch
                    id="push-enabled"
                    checked={settings.pushEnabled && permissionStatus === 'granted'}
                    onCheckedChange={(checked) => {
                      if (checked && permissionStatus !== 'granted') {
                        requestNotificationPermission();
                      } else {
                        setSettings(prev => ({ ...prev, pushEnabled: checked }));
                      }
                    }}
                    disabled={permissionStatus === 'denied'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-enabled">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">Play sound with notifications</p>
                  </div>
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Select 
                    value={settings.alertThreshold} 
                    onValueChange={(value: any) => 
                      setSettings(prev => ({ ...prev, alertThreshold: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="medium">Medium & Above</SelectItem>
                      <SelectItem value="high">High & Critical Only</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alert Types */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Alert Types</CardTitle>
                <CardDescription>Choose which types of alerts to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-danger" />
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Theft, unauthorized movement</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, securityAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-warning" />
                    <div>
                      <Label>Device Alerts</Label>
                      <p className="text-sm text-muted-foreground">Battery, connectivity issues</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.deviceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, deviceAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Updates, performance changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, systemAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-success" />
                    <div>
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Scheduled maintenance, updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.maintenanceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, maintenanceAlerts: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiet Hours */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quiet Hours</CardTitle>
              <CardDescription>Disable notifications during specific times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                <Switch
                  id="quiet-hours"
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      quietHours: { ...prev.quietHours, enabled: checked } 
                    }))
                  }
                />
              </div>

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Select 
                      value={settings.quietHours.start} 
                      onValueChange={(value) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, start: value } 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Select 
                      value={settings.quietHours.end} 
                      onValueChange={(value) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, end: value } 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {`${i.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};