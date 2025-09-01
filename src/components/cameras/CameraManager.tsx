import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Eye, Settings, Wifi, WifiOff, Play, Square } from "lucide-react";
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

export const CameraManager = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  // Mock camera data - in real app, this would come from your API
  useEffect(() => {
    const mockCameras: CameraDevice[] = [
      {
        id: 'cam-001',
        name: 'Bar Counter Camera',
        location: 'Main Bar',
        type: 'bartender',
        status: 'online',
        lastSeen: new Date().toISOString(),
        resolution: '1080p',
      },
      {
        id: 'cam-002',
        name: 'Entrance Security',
        location: 'Front Door',
        type: 'entrance',
        status: 'online',
        lastSeen: new Date().toISOString(),
        resolution: '720p',
      },
      {
        id: 'cam-003',
        name: 'Inventory Room',
        location: 'Storage Area',
        type: 'inventory',
        status: 'recording',
        lastSeen: new Date().toISOString(),
        resolution: '1080p',
      },
      {
        id: 'cam-004',
        name: 'VIP Section',
        location: 'Upper Level',
        type: 'security',
        status: 'offline',
        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        resolution: '4K',
      },
    ];
    setCameras(mockCameras);
  }, []);

  const scanForCameras = async () => {
    setIsScanning(true);
    try {
      // Simulate scanning for new cameras
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a new "discovered" camera
      const newCamera: CameraDevice = {
        id: `cam-${Date.now()}`,
        name: 'New Camera Device',
        location: 'Unknown Location',
        type: 'security',
        status: 'online',
        lastSeen: new Date().toISOString(),
        resolution: '1080p',
      };
      
      setCameras(prev => [...prev, newCamera]);
      toast({
        title: "Camera Discovered",
        description: `Found new camera: ${newCamera.name}`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to scan for cameras",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = (status: CameraDevice['status']) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'recording': return 'bg-blue-500';
      case 'offline': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getCameraIcon = (type: CameraDevice['type']) => {
    return <Camera className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Camera Management</h2>
          <p className="text-muted-foreground">Monitor all Invepin cameras across your venue</p>
        </div>
        <Button onClick={scanForCameras} disabled={isScanning} className="bg-gradient-primary">
          {isScanning ? (
            <>
              <Settings className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Scan for Cameras
            </>
          )}
        </Button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <Card key={camera.id} className="bg-gradient-card border-border hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCameraIcon(camera.type)}
                  <CardTitle className="text-lg">{camera.name}</CardTitle>
                </div>
                <Badge 
                  className={`${getStatusColor(camera.status)} text-white`}
                  variant="secondary"
                >
                  {camera.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{camera.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="text-foreground">{camera.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground capitalize">{camera.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Seen:</span>
                  <span className="text-foreground">
                    {new Date(camera.lastSeen).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={camera.status === 'offline'}
                      onClick={() => setSelectedCamera(camera)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Feed
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getCameraIcon(camera.type)}
                        {camera.name} - Live Feed
                      </DialogTitle>
                    </DialogHeader>
                    {selectedCamera && (
                      <CameraViewer camera={selectedCamera} />
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Summary */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {cameras.filter(c => c.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {cameras.filter(c => c.status === 'recording').length}
              </div>
              <div className="text-sm text-muted-foreground">Recording</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {cameras.filter(c => c.status === 'offline').length}
              </div>
              <div className="text-sm text-muted-foreground">Offline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {cameras.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};