import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  StopCircle, 
  RotateCcw, 
  CheckCircle2,
  AlertCircle,
  Package,
  Scan,
  History,
  Lightbulb,
  LightbulbOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  id: string;
  code: string;
  format: string;
  timestamp: string;
  itemName?: string;
  category?: string;
  status: 'pending' | 'verified' | 'error';
}

export const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [manualCode, setManualCode] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  // Mock inventory database for demonstration
  const mockInventory = {
    '1234567890123': { name: 'iPhone 15 Pro', category: 'Electronics', price: '$999' },
    '9876543210987': { name: 'MacBook Air M3', category: 'Electronics', price: '$1,199' },
    '5555666677778': { name: 'Sony WH-1000XM4', category: 'Audio', price: '$349' },
    '1111222233334': { name: 'Samsung Galaxy Watch', category: 'Wearables', price: '$299' },
    '4444555566667': { name: 'iPad Pro 12.9"', category: 'Tablets', price: '$1,099' }
  };

  useEffect(() => {
    // Initialize code reader
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E
    ]);
    
    codeReader.current = new BrowserMultiFormatReader(hints);
    
    // Get available cameras
    getCameras();
    
    return () => {
      stopScanning();
    };
  }, []);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      
      // Select rear camera by default if available
      const rearCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      setSelectedCamera(rearCamera?.deviceId || videoDevices[0]?.deviceId || '');
    } catch (error) {
      console.error('Error getting cameras:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera devices",
        variant: "destructive"
      });
    }
  };

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current) return;

    try {
      setIsScanning(true);
      
      // Start video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: selectedCamera ? undefined : 'environment'
        }
      });
      
      setCameraStream(stream);
      videoRef.current.srcObject = stream;
      
      // Start decoding
      codeReader.current.decodeFromVideoDevice(
        selectedCamera || undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScanResult(result.getText(), result.getBarcodeFormat().toString());
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error('Scan error:', error);
          }
        }
      );

      toast({
        title: "Scanner Started",
        description: "Point camera at barcode or QR code",
      });
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      toast({
        title: "Scanner Error",
        description: "Unable to start camera scanner",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    setIsScanning(false);
    
    toast({
      title: "Scanner Stopped",
      description: "Camera scanner has been stopped",
    });
  };


  const handleScanResult = (code: string, format: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const item = mockInventory[code as keyof typeof mockInventory];
    
    const newResult: ScanResult = {
      id: `scan-${Date.now()}`,
      code,
      format,
      timestamp,
      itemName: item?.name,
      category: item?.category,
      status: item ? 'verified' : 'pending'
    };
    
    setScanResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 scans
    
    toast({
      title: item ? "Item Found!" : "Code Scanned",
      description: item ? `${item.name} - ${item.category}` : `Code: ${code}`,
      variant: item ? "default" : "destructive"
    });

    // Auto-vibrate on successful scan if supported
    if (navigator.vibrate && item) {
      navigator.vibrate(200);
    }
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) return;
    
    handleScanResult(manualCode.trim(), 'Manual Entry');
    setManualCode('');
  };

  const clearHistory = () => {
    setScanResults([]);
    toast({
      title: "History Cleared",
      description: "All scan results have been cleared",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-danger" />;
      default: return <Package className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-success/20 text-success border-success/30';
      case 'error': return 'bg-danger/20 text-danger border-danger/30';
      default: return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Scan className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Barcode & QR Scanner</CardTitle>
                <CardDescription>Scan items to add to inventory or verify tracking</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isScanning ? (
                <Button
                  onClick={stopScanning}
                  variant="destructive"
                  size="sm"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Scanner
                </Button>
              ) : (
                <Button
                  onClick={startScanning}
                  disabled={!selectedCamera}
                  className="bg-gradient-primary"
                  size="sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera View */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Camera View</CardTitle>
            {availableCameras.length > 1 && (
              <div className="flex items-center gap-2">
                <Label htmlFor="camera-select" className="text-sm">Camera:</Label>
                <select
                  id="camera-select"
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="text-sm bg-background border border-border rounded px-2 py-1"
                  disabled={isScanning}
                >
                  {availableCameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-white mx-auto mb-2 opacity-50" />
                    <p className="text-white text-sm">Camera Preview</p>
                  </div>
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-8 border-2 border-primary rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div className="mt-4 pt-4 border-t border-border">
              <Label htmlFor="manual-code" className="text-sm font-medium">Manual Entry</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="manual-code"
                  placeholder="Enter barcode manually"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                />
                <Button onClick={handleManualEntry} disabled={!manualCode.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Scan History
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                disabled={scanResults.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <CardDescription>Recently scanned codes and items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Scan className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No scans yet</p>
                  <p className="text-sm">Start scanning to see results here</p>
                </div>
              ) : (
                scanResults.map((result) => (
                  <div
                    key={result.id}
                    className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium text-sm">
                            {result.itemName || 'Unknown Item'}
                          </p>
                          <p className="text-xs opacity-70">
                            {result.category || 'Unregistered'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.format}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-mono bg-background/30 px-2 py-1 rounded">
                        {result.code}
                      </p>
                      <p className="opacity-70">Scanned at {result.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supported Formats */}
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Supported Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Badge variant="secondary">QR Code</Badge>
            <Badge variant="secondary">Code 128</Badge>
            <Badge variant="secondary">Code 39</Badge>
            <Badge variant="secondary">EAN-13</Badge>
            <Badge variant="secondary">EAN-8</Badge>
            <Badge variant="secondary">UPC-A</Badge>
            <Badge variant="secondary">UPC-E</Badge>
            <Badge variant="secondary">Manual Entry</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};