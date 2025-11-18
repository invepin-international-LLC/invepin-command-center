import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCamera } from "@/hooks/useCamera";
import { faceRecognitionService } from "@/services/faceRecognition";
import { useState, useEffect } from "react";
import { Camera, UserCheck, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFaceEmbeddings } from "@/hooks/useFaceEmbeddings";
import { useClockEvents } from "@/hooks/useClockEvents";
import { supabase } from "@/integrations/supabase/client";

interface FaceClockInProps {
  organizationId: string;
  onClockIn?: (userId: string, method: 'face_recognition', confidence: number) => void;
  onClockOut?: (userId: string, method: 'face_recognition', confidence: number) => void;
}

export const FaceClockIn = ({ organizationId, onClockIn, onClockOut }: FaceClockInProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const { toast } = useToast();
  const { getOrganizationFaces } = useFaceEmbeddings();
  const { createClockEvent, getUserActiveShift } = useClockEvents(organizationId);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRecognition, setLastRecognition] = useState<{
    name: string;
    confidence: number;
    isActive: boolean;
  } | null>(null);
  const [scanningMode, setScanningMode] = useState<'idle' | 'scanning' | 'recognized'>('idle');
  const [knownFaces, setKnownFaces] = useState<Array<{ userId: string; name: string; embedding: number[] }>>([]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const loadKnownFaces = async () => {
      const faces = await getOrganizationFaces(organizationId);
      setKnownFaces(faces);
    };
    loadKnownFaces();
  }, [organizationId, getOrganizationFaces]);

  const performRecognition = async () => {
    if (!isActive || isProcessing || knownFaces.length === 0) return;

    setIsProcessing(true);
    setScanningMode('scanning');

    try {
      const photo = await capturePhoto();
      const result = await faceRecognitionService.recognizeFace(
        photo,
        knownFaces.map(f => ({
          bartenderId: f.userId,
          name: f.name,
          embedding: f.embedding,
        }))
      );

      if (result.recognized && result.bartenderId && result.name) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: 'Error',
            description: 'Please log in to use facial recognition',
            variant: 'destructive',
          });
          setScanningMode('idle');
          return;
        }

        const activeShift = await getUserActiveShift(result.bartenderId);
        const isCurrentlyActive = !!activeShift;
        
        setLastRecognition({
          name: result.name,
          confidence: result.confidence,
          isActive: isCurrentlyActive
        });
        setScanningMode('recognized');

        toast({
          title: `Hello, ${result.name}!`,
          description: `Recognized with ${(result.confidence * 100).toFixed(1)}% confidence`,
        });

        setTimeout(async () => {
          if (isCurrentlyActive) {
            await createClockEvent({
              userId: result.bartenderId!,
              organizationId,
              eventType: 'clock_out',
              method: 'face_recognition',
              confidence: result.confidence,
            });
            onClockOut?.(result.bartenderId!, 'face_recognition', result.confidence);
          } else {
            await createClockEvent({
              userId: result.bartenderId!,
              organizationId,
              eventType: 'clock_in',
              method: 'face_recognition',
              confidence: result.confidence,
            });
            onClockIn?.(result.bartenderId!, 'face_recognition', result.confidence);
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Face Recognition Clock In/Out
          </CardTitle>
          <CardDescription>Camera access required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={startCamera} size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Face Recognition Clock In/Out
        </CardTitle>
        <CardDescription>
          Position your face in the camera frame
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {scanningMode === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-2" />
                <p className="text-white text-sm">Scanning face...</p>
              </div>
            </div>
          )}

          {scanningMode === 'recognized' && lastRecognition && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-white font-semibold">{lastRecognition.name}</p>
                <p className="text-white text-sm">
                  {(lastRecognition.confidence * 100).toFixed(1)}% match
                </p>
                <Badge className="mt-2" variant={lastRecognition.isActive ? "destructive" : "default"}>
                  {lastRecognition.isActive ? "Clocking Out..." : "Clocking In..."}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={performRecognition}
          disabled={!isActive || isProcessing || knownFaces.length === 0}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Scan Face
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            {knownFaces.length} faces enrolled
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
