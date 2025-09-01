import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCamera } from "@/hooks/useCamera";
import { 
  Play, 
  Square, 
  Camera, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Wifi,
  WifiOff,
  Circle,
  Eye
} from "lucide-react";
import { CameraViewer } from "./CameraViewer";
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

interface MultiCameraViewerProps {
  cameras: CameraDevice[];
}

interface CameraFeedProps {
  camera: CameraDevice;
  onExpand: () => void;
}

const CameraFeed = ({ camera, onExpand }: CameraFeedProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (camera.status !== 'offline') {
      startCamera();
    }
    return () => stopCamera();
  }, [camera.status, startCamera, stopCamera]);

  const getStatusColor = (status: CameraDevice['status']) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'recording': return 'bg-red-500';
      case 'offline': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  if (camera.status === 'offline') {
    return (
      <Card className="bg-gradient-card border-border h-full">
        <CardContent className="p-3 sm:p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-medium truncate">{camera.name}</h4>
            <Badge className={`${getStatusColor(camera.status)} text-white text-xs`}>
              OFFLINE
            </Badge>
          </div>
          <div className="flex-1 bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white/60">
              <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
              <p className="text-xs">Camera Offline</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">{camera.location}</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-border h-full">
        <CardContent className="p-3 sm:p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-medium truncate">{camera.name}</h4>
            <Badge className="bg-destructive text-white text-xs">
              ERROR
            </Badge>
          </div>
          <div className="flex-1 bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white/60">
              <Camera className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
              <p className="text-xs">Camera Error</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">{camera.location}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border h-full hover:shadow-elegant transition-all group">
      <CardContent className="p-2 sm:p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs sm:text-sm font-medium truncate">{camera.name}</h4>
          <Badge className={`${getStatusColor(camera.status)} text-white text-xs`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
            {camera.status === 'recording' ? 'REC' : 'LIVE'}
          </Badge>
        </div>
        
        <div className="flex-1 relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => isActive ? stopCamera() : startCamera()}
                    className="bg-black/50 hover:bg-black/70 h-6 w-6 p-0"
                  >
                    {isActive ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-black/50 hover:bg-black/70 h-6 w-6 p-0"
                  >
                    {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onExpand}
                  className="bg-black/50 hover:bg-black/70 h-6 w-6 p-0"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="absolute top-2 left-2">
              <Badge 
                variant="secondary" 
                className="bg-black/50 text-white border-none text-xs"
              >
                <Wifi className="h-2 w-2 mr-1" />
                {camera.resolution}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground truncate flex-1">{camera.location}</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={onExpand}
            className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const MultiCameraViewer = ({ cameras }: MultiCameraViewerProps) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);

  if (cameras.length === 0) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-8 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Cameras Available</h3>
          <p className="text-muted-foreground mb-4">
            No online cameras detected. Please check your camera connections or scan for new devices.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">Live Camera Grid</h3>
          <p className="text-sm text-muted-foreground">
            {cameras.length} camera{cameras.length !== 1 ? 's' : ''} online
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          Auto-updating
        </Badge>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {cameras.map((camera) => (
          <div key={camera.id} className="h-48 sm:h-52">
            <Dialog>
              <DialogTrigger asChild>
                <div className="h-full cursor-pointer">
                  <CameraFeed
                    camera={camera}
                    onExpand={() => setSelectedCamera(camera)}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-none">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="truncate">{camera.name} - Live Feed</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                  {selectedCamera && (
                    <CameraViewer camera={selectedCamera} />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-success">
                {cameras.filter(c => c.status === 'online').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Online</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-red-500">
                {cameras.filter(c => c.status === 'recording').length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Recording</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-primary">
                {cameras.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};