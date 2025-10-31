import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Camera, CameraOff, Package, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScannedProduct {
  id: string;
  upc: string;
  name: string;
  category?: string;
  manufacturer?: string;
  created_at: string;
}

export function UPCScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualUPC, setManualUPC] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [recentScans, setRecentScans] = useState<ScannedProduct[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    loadRecentScans();
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
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
      toast.error("Failed to access camera devices");
    }
  };

  const loadRecentScans = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentScans(data || []);
    } catch (error) {
      console.error("Error loading recent scans:", error);
    }
  };

  const startScanning = async () => {
    try {
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      const codeReader = codeReaderRef.current;

      await codeReader.decodeFromVideoDevice(
        selectedCamera || undefined,
        videoRef.current!,
        (result, error) => {
          if (result) {
            handleScanResult(result.getText());
          }
        }
      );

      setIsScanning(true);
      toast.success("Scanner started");
    } catch (error) {
      console.error("Error starting scanner:", error);
      toast.error("Failed to start scanner");
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
    toast.info("Scanner stopped");
  };

  const handleScanResult = async (upc: string) => {
    setManualUPC(upc);
    stopScanning();
    
    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('*')
      .eq('upc', upc)
      .single();

    if (existing) {
      toast.info(`Product "${existing.name}" already in database`, {
        description: `UPC: ${upc}`
      });
      loadRecentScans();
    } else {
      toast.success(`UPC ${upc} scanned! Please enter product details.`);
    }
  };

  const handleManualEntry = async () => {
    if (!manualUPC.trim()) {
      toast.error("Please enter a UPC code");
      return;
    }

    await saveProduct(manualUPC);
  };

  const saveProduct = async (upc: string) => {
    if (!productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          upc: upc.trim(),
          name: productName.trim(),
          category: category.trim() || null,
          manufacturer: manufacturer.trim() || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("This UPC is already in the database");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Product added to database!", {
        description: `${productName} (UPC: ${upc})`
      });

      // Reset form
      setManualUPC("");
      setProductName("");
      setCategory("");
      setManufacturer("");
      loadRecentScans();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product to database");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            UPC Scanner
          </CardTitle>
          <CardDescription>
            Scan barcodes to add products to your database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="space-y-2">
            {availableCameras.length > 1 && (
              <div className="space-y-1">
                <Label>Select Camera</Label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="destructive" className="flex-1">
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Scanner
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Manual Entry */}
          <div className="space-y-3">
            <Label>Manual Entry</Label>
            <div className="space-y-2">
              <Input
                placeholder="Enter UPC code"
                value={manualUPC}
                onChange={(e) => setManualUPC(e.target.value)}
              />
              <Input
                placeholder="Product name *"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <Input
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Input
                placeholder="Manufacturer (optional)"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
              <Button onClick={handleManualEntry} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Add to Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Products
          </CardTitle>
          <CardDescription>
            Recently added UPC codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {recentScans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">No products scanned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((product) => (
                  <Card key={product.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <h4 className="font-medium truncate">{product.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          UPC: {product.upc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.category && (
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          )}
                          {product.manufacturer && (
                            <Badge variant="outline" className="text-xs">
                              {product.manufacturer}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added: {new Date(product.created_at).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
