import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCamera } from "@/hooks/useCamera";
import { 
  Play, 
  Square, 
  Camera, 
  Download, 
  Maximize, 
  Volume2, 
  VolumeX,
  Settings,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraDevice {
  id: string;
  name: string;
  location: string;
  type: 'security' | 'bartender' | 'inventory' | 'entrance';
  status: 'online' | 'offline' | 'recording';
  lastSeen: string;
  resolution: string;
  deviceId?: string;
}

interface CameraViewerProps {
  camera: CameraDevice;
}

export const CameraViewer = ({ camera }: CameraViewerProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-start camera when component mounts
    if (camera.status !== 'offline') {
      startCamera();
    }
    return () => stopCamera();
  }, [camera.status, startCamera, stopCamera]);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: `${camera.name} ${isRecording ? 'stopped' : 'started'} recording`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Camera footage is being prepared for download",
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        toast({
          title: "Fullscreen Failed",
          description: "Unable to enter fullscreen mode",
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  if (camera.status === 'offline') {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-8 text-center">
          <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Camera Offline</h3>
          <p className="text-muted-foreground mb-4">
            {camera.name} is currently offline. Last seen: {new Date(camera.lastSeen).toLocaleString()}
          </p>
          <Button variant="outline" onClick={startCamera}>
            <Wifi className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-8 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Camera Access Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={startCamera} className="bg-gradient-primary">
            <Camera className="h-4 w-4 mr-2" />
            Retry Camera Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3 sm:space-y-4">
      {/* Camera Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge 
            className={`${camera.status === 'online' ? 'bg-success' : 'bg-blue-500'} text-white text-xs`}
            variant="secondary"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 sm:mr-2 animate-pulse"></div>
            {camera.status === 'recording' ? 'LIVE REC' : 'LIVE'}
          </Badge>
          <div>
            <h3 className="text-sm sm:text-base font-semibold truncate">{camera.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{camera.location} • {camera.resolution}</p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Video Feed */}
      <Card className="bg-black border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black touch-manipulation">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            />
            
            {/* Video Overlay Controls - Always visible on mobile, hover on desktop */}
            <div className="absolute inset-0 bg-black/20 opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => isActive ? stopCamera() : startCamera()}
                    className="bg-black/50 hover:bg-black/70 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                  >
                    {isActive ? <Square className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-black/50 hover:bg-black/70 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                  >
                    {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleFullscreen}
                  className="bg-black/50 hover:bg-black/70 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                >
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                <Badge className="bg-red-500 text-white animate-pulse text-xs">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 sm:mr-2"></div>
                  REC
                </Badge>
              </div>
            )}

            {/* Connection Status */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <Badge 
                variant="secondary" 
                className="bg-black/50 text-white border-none text-xs"
              >
                <Wifi className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecord}
            className={`${isRecording ? "bg-red-500 text-white border-red-500" : ""} text-xs sm:text-sm`}
          >
            {isRecording ? (
              <>
                <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Stop Recording</span>
                <span className="sm:hidden">Stop</span>
              </>
            ) : (
              <>
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Start Recording</span>
                <span className="sm:hidden">Record</span>
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Settings</span>
          <span className="sm:hidden">Config</span>
        </Button>
      </div>

      {/* Stream Info */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="text-center">
          <div className="text-foreground font-medium">Resolution</div>
          <div className="text-muted-foreground">{camera.resolution}</div>
        </div>
        <div className="text-center">
          <div className="text-foreground font-medium">FPS</div>
          <div className="text-muted-foreground">30</div>
        </div>
        <div className="text-center">
          <div className="text-foreground font-medium">Bitrate</div>
          <div className="text-muted-foreground">2.5 Mbps</div>
        </div>
      </div>
    </div>
  );
};