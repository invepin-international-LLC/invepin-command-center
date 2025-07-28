import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCamera } from "@/hooks/useCamera";
import { faceRecognitionService } from "@/services/faceRecognition";
import { useState, useEffect } from "react";
import { Camera, UserCheck, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FaceClockInProps {
  onClockIn: (bartenderId: string, method: 'face_recognition', confidence: number) => void;
  onClockOut: (bartenderId: string, method: 'face_recognition', confidence: number) => void;
  knownFaces: { bartenderId: string, name: string, embedding: number[] }[];
  currentlyActive: { bartenderId: string, name: string }[];
}

export const FaceClockIn = ({ onClockIn, onClockOut, knownFaces, currentlyActive }: FaceClockInProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRecognition, setLastRecognition] = useState<{
    name: string;
    confidence: number;
    isActive: boolean;
  } | null>(null);
  const [scanningMode, setScanningMode] = useState<'idle' | 'scanning' | 'recognized'>('idle');

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const performRecognition = async () => {
    if (!isActive || isProcessing) return;

    setIsProcessing(true);
    setScanningMode('scanning');

    try {
      const photo = await capturePhoto();
      const result = await faceRecognitionService.recognizeFace(photo, knownFaces);

      if (result.recognized && result.bartenderId && result.name) {
        const isCurrentlyActive = currentlyActive.some(active => active.bartenderId === result.bartenderId);
        
        setLastRecognition({
          name: result.name,
          confidence: result.confidence,
          isActive: isCurrentlyActive
        });
        setScanningMode('recognized');

        // Show recognition toast
        toast({
          title: `Hello, ${result.name}!`,
          description: `Recognized with ${(result.confidence * 100).toFixed(1)}% confidence`,
        });

        // Auto clock in/out after 2 seconds
        setTimeout(() => {
          if (isCurrentlyActive) {
            onClockOut(result.bartenderId!, 'face_recognition', result.confidence);
            toast({
              title: "Clocked Out",
              description: `${result.name} has been clocked out`,
            });
          } else {
            onClockIn(result.bartenderId!, 'face_recognition', result.confidence);
            toast({
              title: "Clocked In",
              description: `${result.name} has been clocked in`,
            });
          }
          
          setScanningMode('idle');
          setLastRecognition(null);
        }, 2000);

      } else {
        toast({
          title: "Recognition Failed",
          description: "Face not recognized. Please try again or use manual clock in.",
          variant: "destructive"
        });
        setScanningMode('idle');
      }
    } catch (error) {
      console.error('Recognition error:', error);
      toast({
        title: "Error",
        description: "Face recognition failed. Please try again.",
        variant: "destructive"
      });
      setScanningMode('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={startCamera} className="bg-gradient-primary">
            <Camera className="h-4 w-4 mr-2" />
            Enable Camera
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserCheck className="h-6 w-6" />
          Face Recognition Clock In/Out
        </CardTitle>
        <CardDescription>
          Look at the camera to clock in or out automatically
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Camera Feed */}
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Overlay indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              {scanningMode === 'scanning' && (
                <div className="bg-blue-500/20 border-2 border-blue-500 rounded-full p-4">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              )}
              
              {scanningMode === 'recognized' && lastRecognition && (
                <div className="bg-success/20 border-2 border-success rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-success font-medium">{lastRecognition.name}</p>
                  <p className="text-xs text-success/80">
                    {(lastRecognition.confidence * 100).toFixed(1)}% confidence
                  </p>
                  <Badge variant={lastRecognition.isActive ? "destructive" : "default"} className="mt-2">
                    {lastRecognition.isActive ? "Clocking Out..." : "Clocking In..."}
                  </Badge>
                </div>
              )}
            </div>

            {/* Face detection frame */}
            <div className="absolute inset-4 border-2 border-primary/50 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
            </div>
          </div>
        </div>

        {/* Recognition Button */}
        <div className="text-center">
          <Button
            onClick={performRecognition}
            disabled={!isActive || isProcessing || scanningMode !== 'idle'}
            size="lg"
            className="bg-gradient-primary w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Recognizing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Scan Face to Clock In/Out
              </>
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          {knownFaces.length} enrolled faces • {currentlyActive.length} staff currently active
        </div>
      </CardContent>
    </Card>
  );
};