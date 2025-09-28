import React, { useState } from 'react';
import { useSecurity } from '@/components/auth/SecurityProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Bell, Shield, Smartphone, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ContactSettings() {
  const { user, updatePhoneNumber, updateEmailNotifications } = useSecurity();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [emailNotifications, setEmailNotifications] = useState(
    user?.user_metadata?.email_notifications ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(
    user?.user_metadata?.sms_notifications ?? true
  );
  const [urgentOnly, setUrgentOnly] = useState(
    user?.user_metadata?.urgent_only ?? false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePhoneUpdate = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updatePhoneNumber(phoneNumber);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailNotificationToggle = async (enabled: boolean) => {
    setEmailNotifications(enabled);
    await updateEmailNotifications(enabled);
  };

  const getPhoneStatus = () => {
    if (!user?.phone) return { status: 'none', text: 'Not Added', color: 'text-muted-foreground' };
    if (user?.phone_confirmed_at) return { status: 'verified', text: 'Verified', color: 'text-success' };
    return { status: 'pending', text: 'Pending Verification', color: 'text-warning' };
  };

  const phoneStatus = getPhoneStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Phone & SMS Settings
          </CardTitle>
          <CardDescription>
            Configure your phone number for SMS alerts and emergency notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <p className="text-sm text-muted-foreground">
                Used for SMS alerts and emergency communications
              </p>
            </div>
            <Badge variant="outline" className={phoneStatus.color}>
              <Shield className="h-3 w-3 mr-1" />
              {phoneStatus.text}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handlePhoneUpdate}
              disabled={isUpdating || !phoneNumber.trim()}
              variant="outline"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive SMS alerts for inventory and security issues
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Control when and how you receive email notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts and daily reports
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={handleEmailNotificationToggle}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="urgent-only">Urgent Only Mode</Label>
              <p className="text-sm text-muted-foreground">
                Only receive notifications for critical issues
              </p>
            </div>
            <Switch
              id="urgent-only"
              checked={urgentOnly}
              onCheckedChange={setUrgentOnly}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Communication Preferences
          </CardTitle>
          <CardDescription>
            Set your preferred communication methods for different scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-warning" />
                <div>
                  <p className="font-medium">Inventory Alerts</p>
                  <p className="text-sm text-muted-foreground">Low stock, reorder points</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">Email</Badge>
                {smsNotifications && <Badge variant="outline" className="text-xs">SMS</Badge>}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-danger" />
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">Unauthorized access, tampering</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">Email</Badge>
                <Badge variant="outline" className="text-xs">SMS</Badge>
                <Badge variant="outline" className="text-xs">App</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Staff Updates</p>
                  <p className="text-sm text-muted-foreground">Shift changes, announcements</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">App</Badge>
                <Badge variant="outline" className="text-xs">Chat</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}