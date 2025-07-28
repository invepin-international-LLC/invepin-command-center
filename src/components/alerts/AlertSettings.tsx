import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Mail, Phone, Smartphone } from "lucide-react";
import { useLossPrevention } from "@/hooks/useLossPrevention";
import { useToast } from "@/hooks/use-toast";

export const AlertSettings = () => {
  const { settings, thresholds, updateThreshold, updateSettings } = useLossPrevention();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Loss prevention settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Thresholds */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Alert Thresholds
          </CardTitle>
          <CardDescription>Configure when alerts should be triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {thresholds.map((threshold) => (
            <div key={threshold.id} className="space-y-3 p-4 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{threshold.name}</h3>
                  <p className="text-sm text-muted-foreground">{threshold.description}</p>
                </div>
                <Switch
                  checked={threshold.enabled}
                  onCheckedChange={(enabled) => updateThreshold(threshold.id, { enabled })}
                />
              </div>
              
              {threshold.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`threshold-${threshold.id}`}>Threshold Value</Label>
                    <div className="flex mt-1">
                      <Input
                        id={`threshold-${threshold.id}`}
                        type="number"
                        value={threshold.threshold}
                        onChange={(e) => updateThreshold(threshold.id, { threshold: Number(e.target.value) })}
                        className="rounded-r-none"
                      />
                      <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        {threshold.unit}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure system behavior and timing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="theft-sensitivity">Theft Detection Sensitivity</Label>
              <Select
                value={settings.theftDetectionSensitivity}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  updateSettings(prev => ({ ...prev, theftDetectionSensitivity: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Less sensitive</SelectItem>
                  <SelectItem value="medium">Medium - Balanced</SelectItem>
                  <SelectItem value="high">High - Very sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cooldown">Alert Cooldown (minutes)</Label>
              <Input
                id="cooldown"
                type="number"
                value={settings.alertCooldown}
                onChange={(e) => updateSettings(prev => ({ ...prev, alertCooldown: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="auto-resolve">Auto-resolve After (hours)</Label>
              <Input
                id="auto-resolve"
                type="number"
                value={settings.autoResolveAfter}
                onChange={(e) => updateSettings(prev => ({ ...prev, autoResolveAfter: Number(e.target.value) }))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
          <CardDescription>Choose how you want to receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">Show alerts in the application</p>
                </div>
              </div>
              <Switch
                checked={settings.notificationChannels.inApp}
                onCheckedChange={(inApp) => 
                  updateSettings(prev => ({ 
                    ...prev, 
                    notificationChannels: { ...prev.notificationChannels, inApp }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
              </div>
              <Switch
                checked={settings.notificationChannels.email}
                onCheckedChange={(email) => 
                  updateSettings(prev => ({ 
                    ...prev, 
                    notificationChannels: { ...prev.notificationChannels, email }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                </div>
              </div>
              <Switch
                checked={settings.notificationChannels.sms}
                onCheckedChange={(sms) => 
                  updateSettings(prev => ({ 
                    ...prev, 
                    notificationChannels: { ...prev.notificationChannels, sms }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.notificationChannels.push}
                onCheckedChange={(push) => 
                  updateSettings(prev => ({ 
                    ...prev, 
                    notificationChannels: { ...prev.notificationChannels, push }
                  }))
                }
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-gradient-primary">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};