import { useState, useEffect } from "react";
import { FaceClockIn } from "./FaceClockIn";
import { MobileBartenderDashboard } from "./MobileBartenderDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone, 
  LogIn, 
  UserPlus,
  Shield,
  Camera
} from "lucide-react";
import { MobileBartenderSession, ClockEvent } from "@/types/mobile";
import { Bartender } from "@/types/bar";

interface MobileBartenderInterfaceProps {
  bartenders: Bartender[];
  organizationId: string;
  onClockIn: (bartenderId: string, method: 'face_recognition' | 'manual', confidence?: number) => void;
  onClockOut: (bartenderId: string, method: 'face_recognition' | 'manual', confidence?: number) => void;
}

export const MobileBartenderInterface = ({ 
  bartenders,
  organizationId,
  onClockIn, 
  onClockOut 
}: MobileBartenderInterfaceProps) => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<MobileBartenderSession | null>(null);
  const [selectedBartender, setSelectedBartender] = useState<string>("");

  const currentlyActive = bartenders
    .filter(b => b.isOnShift)
    .map(b => ({ bartenderId: b.id, name: b.name }));

  // Check if current user is clocked in
  useEffect(() => {
    const activeBartender = bartenders.find(b => b.isOnShift);
    if (activeBartender && !currentSession) {
      setCurrentSession({
        bartenderId: activeBartender.id,
        name: activeBartender.name,
        clockedInAt: new Date().toISOString(),
        currentShift: {
          start: activeBartender.shiftStart || new Date().toLocaleTimeString(),
          pours: activeBartender.todayPours,
          accuracy: activeBartender.pourAccuracy,
          revenue: activeBartender.todayPours * 15 // Mock revenue calculation
        }
      });
    } else if (!activeBartender && currentSession) {
      setCurrentSession(null);
    }
  }, [bartenders, currentSession]);

  const handleFaceClockIn = (bartenderId: string, method: 'face_recognition', confidence: number) => {
    const bartender = bartenders.find(b => b.id === bartenderId);
    if (bartender) {
      onClockIn(bartenderId, method, confidence);
      setCurrentSession({
        bartenderId,
        name: bartender.name,
        clockedInAt: new Date().toISOString(),
        currentShift: {
          start: new Date().toLocaleTimeString(),
          pours: 0,
          accuracy: 95,
          revenue: 0
        }
      });
    }
  };

  const handleFaceClockOut = (bartenderId: string, method: 'face_recognition', confidence: number) => {
    onClockOut(bartenderId, method, confidence);
    setCurrentSession(null);
  };

  const handleManualClockIn = () => {
    if (!selectedBartender) {
      toast({
        title: "Selection Required",
        description: "Please select your name to clock in",
        variant: "destructive"
      });
      return;
    }

    const bartender = bartenders.find(b => b.id === selectedBartender);
    if (bartender) {
      onClockIn(selectedBartender, 'manual');
      setCurrentSession({
        bartenderId: selectedBartender,
        name: bartender.name,
        clockedInAt: new Date().toISOString(),
        currentShift: {
          start: new Date().toLocaleTimeString(),
          pours: 0,
          accuracy: 95,
          revenue: 0
        }
      });
      setSelectedBartender("");
    }
  };

  const handleManualClockOut = () => {
    if (currentSession) {
      onClockOut(currentSession.bartenderId, 'manual');
      setCurrentSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Invepin Mobile</h1>
        </div>
        <p className="text-muted-foreground">Bartender Interface</p>
      </div>

      {currentSession ? (
        <MobileBartenderDashboard 
          session={currentSession}
          onManualClockOut={handleManualClockOut}
        />
      ) : (
        <Tabs defaultValue="face" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="face" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Face Recognition
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Manual Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="face">
            <FaceClockIn
              organizationId={organizationId}
              onClockIn={handleFaceClockIn}
              onClockOut={handleFaceClockOut}
            />
          </TabsContent>

          <TabsContent value="manual">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Manual Clock In
                </CardTitle>
                <CardDescription>
                  Select your name and clock in manually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Your Name</label>
                  <Select value={selectedBartender} onValueChange={setSelectedBartender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your name..." />
                    </SelectTrigger>
                    <SelectContent>
                      {bartenders
                        .filter(b => !b.isOnShift)
                        .map((bartender) => (
                          <SelectItem key={bartender.id} value={bartender.id}>
                            {bartender.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleManualClockIn}
                  disabled={!selectedBartender}
                  className="w-full bg-gradient-primary"
                  size="lg"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Clock In
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Security Badge */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full text-success text-xs">
          <Shield className="h-3 w-3" />
          Secured with Face Recognition
        </div>
      </div>
    </div>
  );
};