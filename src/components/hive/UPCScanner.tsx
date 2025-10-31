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

interface LinkedInvepin {
  invepin_id: string;
  product_name: string;
  upc: string;
  linked_at: string;
}

type ScanStep = 'upc' | 'invepin';

export function UPCScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<ScanStep>('upc');
  const [currentProduct, setCurrentProduct] = useState<ScannedProduct | null>(null);
  const [manualUPC, setManualUPC] = useState("");
  const [manualInvepinId, setManualInvepinId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [recentLinks, setRecentLinks] = useState<LinkedInvepin[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    loadRecentLinks();
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

  const loadRecentLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('invepin_data')
        .select('invepin_id, item_name, upc, created_at')
        .not('upc', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentLinks(data?.map(d => ({
        invepin_id: d.invepin_id,
        product_name: d.item_name || 'Unknown',
        upc: d.upc || '',
        linked_at: d.created_at || ''
      })) || []);
    } catch (error) {
      console.error("Error loading recent links:", error);
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

  const handleScanResult = async (code: string) => {
    stopScanning();
    
    if (scanStep === 'upc') {
      // Step 1: Scan UPC
      setManualUPC(code);
      
      // Check if product exists
      const { data: existing } = await supabase
        .from('products')
        .select('*')
        .eq('upc', code)
        .maybeSingle();

      if (existing) {
        setCurrentProduct(existing);
        setProductName(existing.name);
        setCategory(existing.category || '');
        setManufacturer(existing.manufacturer || '');
        toast.success(`Product found: ${existing.name}`, {
          description: `Now scan the Invepin sticker code`
        });
        setScanStep('invepin');
      } else {
        toast.success(`UPC ${code} scanned! Enter product details, then scan Invepin code.`);
      }
    } else {
      // Step 2: Scan Invepin ID
      setManualInvepinId(code);
      toast.success(`Invepin code ${code} scanned! Click "Link Product & Invepin" to save.`);
    }
  };

  const linkProductToInvepin = async () => {
    if (!manualUPC.trim()) {
      toast.error("Please scan or enter a UPC code first");
      return;
    }

    if (!productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!manualInvepinId.trim()) {
      toast.error("Please scan or enter an Invepin sticker code");
      return;
    }

    try {
      // First, ensure product exists in products table
      let productId = currentProduct?.id;
      
      if (!productId) {
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            upc: manualUPC.trim(),
            name: productName.trim(),
            category: category.trim() || null,
            manufacturer: manufacturer.trim() || null,
          })
          .select()
          .single();

        if (productError) {
          if (productError.code === '23505') {
            // Product exists, fetch it
            const { data: existing } = await supabase
              .from('products')
              .select('*')
              .eq('upc', manualUPC.trim())
              .single();
            productId = existing?.id;
          } else {
            throw productError;
          }
        } else {
          productId = newProduct.id;
        }
      }

      // Now link to invepin_data
      const { error: invepinError } = await supabase
        .from('invepin_data')
        .upsert({
          invepin_id: manualInvepinId.trim(),
          item_name: productName.trim(),
          upc: manualUPC.trim(),
          product_id: productId,
          location: 'Newly Tagged',
          last_detected: new Date().toISOString(),
        }, {
          onConflict: 'invepin_id'
        });

      if (invepinError) throw invepinError;

      toast.success("Product linked to Invepin successfully!", {
        description: `${productName} ↔ Invepin ${manualInvepinId}`
      });

      // Reset form
      setManualUPC("");
      setManualInvepinId("");
      setProductName("");
      setCategory("");
      setManufacturer("");
      setCurrentProduct(null);
      setScanStep('upc');
      loadRecentLinks();
    } catch (error) {
      console.error("Error linking product:", error);
      toast.error("Failed to link product to Invepin");
    }
  };

  const resetScanning = () => {
    setManualUPC("");
    setManualInvepinId("");
    setProductName("");
    setCategory("");
    setManufacturer("");
    setCurrentProduct(null);
    setScanStep('upc');
    stopScanning();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Product & Invepin Linking
          </CardTitle>
          <CardDescription>
            {scanStep === 'upc' 
              ? 'Step 1: Scan product UPC barcode' 
              : 'Step 2: Scan Invepin sticker code'}
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

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant={scanStep === 'upc' ? 'default' : 'secondary'}>
              1. UPC
            </Badge>
            <div className="h-px w-8 bg-border" />
            <Badge variant={scanStep === 'invepin' ? 'default' : 'secondary'}>
              2. Invepin
            </Badge>
          </div>

          {/* Manual Entry */}
          <div className="space-y-3">
            <Label>Manual Entry</Label>
            <div className="space-y-2">
              <Input
                placeholder="Product UPC *"
                value={manualUPC}
                onChange={(e) => setManualUPC(e.target.value)}
                disabled={scanStep === 'invepin' && !!currentProduct}
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
              <Input
                placeholder="Invepin Sticker Code *"
                value={manualInvepinId}
                onChange={(e) => setManualInvepinId(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={linkProductToInvepin} className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Link Product & Invepin
                </Button>
                <Button onClick={resetScanning} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Links
          </CardTitle>
          <CardDescription>
            Recently linked products & Invepins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {recentLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">No products linked yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLinks.map((link, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <h4 className="font-medium truncate">{link.product_name}</h4>
                        </div>
                        <div className="space-y-1 mb-2">
                          <p className="text-xs text-muted-foreground">
                            UPC: {link.upc}
                          </p>
                          <p className="text-xs font-mono text-primary">
                            Invepin: {link.invepin_id}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Linked: {new Date(link.linked_at).toLocaleString()}
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
