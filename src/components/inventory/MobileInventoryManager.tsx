import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Scan, Package, Plus, Minus, CheckCircle } from "lucide-react";

interface MobileInventoryManagerProps {
  onStockUpdate: (itemId: string, quantity: number, reason: string, type: 'in' | 'out' | 'adjustment') => void;
}

export const MobileInventoryManager = ({ onStockUpdate }: MobileInventoryManagerProps) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock inventory for barcode lookup
  const mockInventory = [
    { id: 'inv1', name: 'Grey Goose Vodka', barcode: '3760070281176', currentStock: 8, unit: 'bottles' },
    { id: 'inv2', name: 'Macallan 18', barcode: '5010314700072', currentStock: 3, unit: 'bottles' },
    { id: 'inv3', name: 'Hendricks Gin', barcode: '5060194550023', currentStock: 15, unit: 'bottles' },
    { id: 'inv4', name: 'Fresh Lime', barcode: '1234567890123', currentStock: 2, unit: 'kg' }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Back camera for barcode scanning
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera for barcode scanning",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleBarcodeInput = (barcode: string) => {
    const item = mockInventory.find(inv => inv.barcode === barcode);
    
    if (item) {
      setScannedItem(item);
      setScannedBarcode(barcode);
      stopCamera();
      toast({
        title: "Item Found",
        description: `${item.name} - Current stock: ${item.currentStock} ${item.unit}`,
      });
    } else {
      toast({
        title: "Item Not Found",
        description: "Barcode not recognized in inventory system",
        variant: "destructive"
      });
    }
  };

  const handleStockAdjustment = (type: 'in' | 'out') => {
    if (!scannedItem) return;

    const reason = type === 'in' ? 'Mobile stock receipt' : 'Mobile stock adjustment';
    onStockUpdate(scannedItem.id, adjustmentQuantity, reason, type);
    
    toast({
      title: "Stock Updated",
      description: `${type === 'in' ? 'Added' : 'Removed'} ${adjustmentQuantity} ${scannedItem.unit} of ${scannedItem.name}`,
    });
    
    // Reset for next scan
    setScannedItem(null);
    setScannedBarcode("");
    setAdjustmentQuantity(1);
  };

  useEffect(() => {
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Camera Scanner */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
          <CardDescription>Scan product barcodes to update inventory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <Button onClick={startCamera} className="bg-gradient-primary">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary w-64 h-32 relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                    
                    {/* Scanning line animation */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-primary animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={stopCamera} className="w-full">
                Stop Scanner
              </Button>
            </div>
          )}
          
          {/* Manual Input */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or enter barcode manually:</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter barcode..."
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
              />
              <Button onClick={() => handleBarcodeInput(scannedBarcode)}>
                Lookup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Item Details */}
      {scannedItem && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {scannedItem.name}
            </CardTitle>
            <CardDescription>Adjust stock levels for this item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-background/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Stock</p>
                  <p className="text-sm text-muted-foreground">
                    {scannedItem.currentStock} {scannedItem.unit}
                  </p>
                </div>
                <Badge variant="outline">
                  Barcode: {scannedItem.barcode}
                </Badge>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Adjustment Quantity</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAdjustmentQuantity(Math.max(1, adjustmentQuantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <Input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  min="1"
                />
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAdjustmentQuantity(adjustmentQuantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <span className="text-sm text-muted-foreground ml-2">
                  {scannedItem.unit}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleStockAdjustment('in')}
                className="bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleStockAdjustment('out')}
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove Stock
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setScannedItem(null);
                setScannedBarcode("");
                setAdjustmentQuantity(1);
              }}
              className="w-full"
            >
              Scan Next Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex-col">
            <Package className="h-6 w-6 mb-1" />
            <span className="text-sm">Inventory Count</span>
          </Button>
          
          <Button variant="outline" className="h-16 flex-col">
            <CheckCircle className="h-6 w-6 mb-1" />
            <span className="text-sm">Receive Order</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};