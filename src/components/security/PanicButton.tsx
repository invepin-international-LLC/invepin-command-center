import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

interface PanicAlert {
  id: string;
  location: string;
  reason: string;
  timestamp: string;
  status: 'active' | 'responding' | 'resolved';
  respondingOfficers: string[];
  estimatedArrival?: string;
}

export const PanicButton = () => {
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");

  const locations = [
    "Main Entrance",
    "Electronics Section",
    "Jewelry Counter",
    "Clothing Department",
    "Checkout Area",
    "Storage Room",
    "Parking Lot",
    "Customer Service"
  ];

  const reasons = [
    "Suspected Theft in Progress",
    "Aggressive Customer",
    "Medical Emergency",
    "Suspicious Activity",
    "Equipment Malfunction",
    "Fire/Safety Hazard",
    "Unauthorized Access",
    "Other Emergency"
  ];

  const sendPanicAlert = () => {
    if (!selectedLocation || !selectedReason) {
      toast.error("Please select both location and reason");
      return;
    }

    const newAlert: PanicAlert = {
      id: `PANIC-${Date.now()}`,
      location: selectedLocation,
      reason: selectedReason,
      timestamp: new Date().toLocaleString(),
      status: 'active',
      respondingOfficers: []
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    // Simulate security response
    toast.error(`🚨 PANIC ALERT SENT: ${selectedReason} at ${selectedLocation}`, {
      duration: 10000,
    });

    // Simulate security team dispatch
    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === newAlert.id 
          ? { 
              ...alert, 
              status: 'responding', 
              respondingOfficers: ['Officer Johnson', 'Officer Smith'],
              estimatedArrival: '2 minutes'
            }
          : alert
      ));
      toast.success(`Security team dispatched to ${selectedLocation}`);
    }, 3000);

    // Simulate arrival
    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === newAlert.id 
          ? { ...alert, status: 'resolved', estimatedArrival: undefined }
          : alert
      ));
      toast.success(`Situation resolved at ${selectedLocation}`);
    }, 10000);

    setSelectedLocation("");
    setSelectedReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-danger text-danger-foreground animate-pulse';
      case 'responding': return 'bg-warning text-warning-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4" />;
      case 'responding': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <ShieldAlert className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Panic Button */}
      <Card className="shadow-elevated border-2 border-danger/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <ShieldAlert className="h-6 w-6" />
            Emergency Response System
          </CardTitle>
          <CardDescription>
            Send immediate alerts to security personnel for theft or emergency situations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Emergency Type</label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map(reason => (
                    <SelectItem key={reason} value={reason}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {reason}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="w-full bg-danger hover:bg-danger/90 text-danger-foreground h-16 text-lg font-bold shadow-glow"
                disabled={!selectedLocation || !selectedReason}
              >
                <ShieldAlert className="h-6 w-6 mr-2" />
                SEND EMERGENCY ALERT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-danger flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Confirm Emergency Alert
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>You are about to send an emergency alert to security personnel:</p>
                  <div className="bg-muted p-4 rounded-lg space-y-2 mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Location:</span>
                      <span>{selectedLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                      <span className="font-semibold">Emergency:</span>
                      <span>{selectedReason}</span>
                    </div>
                  </div>
                  <p className="text-danger font-semibold mt-4">
                    Security will be immediately dispatched to this location.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={sendPanicAlert}
                  className="bg-danger hover:bg-danger/90"
                >
                  Send Alert
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Alert History
            </CardTitle>
            <CardDescription>Recent emergency alerts and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <Card 
                  key={alert.id} 
                  className={`transition-all ${
                    alert.status === 'active' ? 'border-2 border-danger shadow-lg' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(alert.status)}>
                            {getStatusIcon(alert.status)}
                            <span className="ml-1 capitalize">{alert.status}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Alert ID: {alert.id}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-danger" />
                            <span>{alert.reason}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>

                        {alert.respondingOfficers.length > 0 && (
                          <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">Responding:</span>
                            <span>{alert.respondingOfficers.join(', ')}</span>
                          </div>
                        )}

                        {alert.estimatedArrival && (
                          <div className="flex items-center gap-2 text-sm text-warning font-semibold">
                            <Clock className="h-4 w-4" />
                            <span>ETA: {alert.estimatedArrival}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How to Use Emergency Response</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Select the specific location where help is needed</p>
          <p>• Choose the type of emergency from the dropdown</p>
          <p>• Press the red "SEND EMERGENCY ALERT" button</p>
          <p>• Security personnel will be immediately notified and dispatched</p>
          <p>• Track response status in the Alert History section</p>
          <p className="text-danger font-semibold pt-2">
            ⚠️ Only use for genuine emergencies. False alarms may result in disciplinary action.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
