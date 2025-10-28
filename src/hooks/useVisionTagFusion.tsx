import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  InvepinPin,
  ScanResult,
  DetectedItem,
  ShelfZone,
  ProductSignature,
  FusionConfig,
  ScanAlert,
  VisualDetection,
  RSSICluster
} from '@/types/visionTagFusion';

const DEFAULT_CONFIG: FusionConfig = {
  visionWeight: 0.6,
  tagWeight: 0.4,
  minimumConfidence: 0.85,
  rssiThreshold: -70,
  enableRSSIClustering: true,
  enableVisualVerification: true,
  scanTimeout: 5
};

// Mock product signatures for demo
const mockProductSignatures: ProductSignature[] = [
  { sku: 'VW-001', name: 'Vitamin Water - Tropical', imageUrl: '', category: 'Beverages' },
  { sku: 'SD-002', name: 'Sparkling Water - Lemon', imageUrl: '', category: 'Beverages' },
  { sku: 'EN-003', name: 'Energy Drink - Blue', imageUrl: '', category: 'Beverages' },
  { sku: 'JC-004', name: 'Orange Juice - Premium', imageUrl: '', category: 'Beverages' },
];

export function useVisionTagFusion() {
  const [isScanning, setIsScanning] = useState(false);
  const [zones, setZones] = useState<ShelfZone[]>([
    {
      id: 'zone-1',
      name: 'Aisle 3 - Shelf 2',
      location: 'Store 1, Aisle 3',
      cameraEnabled: true,
      bleEnabled: true,
      itemCount: 0,
      status: 'active'
    },
    {
      id: 'zone-2',
      name: 'Aisle 5 - Shelf 1',
      location: 'Store 1, Aisle 5',
      cameraEnabled: true,
      bleEnabled: true,
      itemCount: 0,
      status: 'active'
    }
  ]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [activePins, setActivePins] = useState<InvepinPin[]>([]);
  const [config, setConfig] = useState<FusionConfig>(DEFAULT_CONFIG);

  // Simulate BLE tag scanning
  const scanBLETags = useCallback(async (zoneId: string): Promise<InvepinPin[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTags: InvepinPin[] = Array.from({ length: Math.floor(Math.random() * 15) + 10 }, (_, i) => ({
          id: `pin-${zoneId}-${i}`,
          tagType: 'BLE',
          macAddress: `AA:BB:CC:DD:${String(i).padStart(2, '0')}:${String(Math.floor(Math.random() * 99)).padStart(2, '0')}`,
          rssi: -50 - Math.random() * 40, // -50 to -90 dBm
          batteryLevel: 60 + Math.random() * 40,
          lastSeen: new Date(),
          productSKU: mockProductSignatures[Math.floor(Math.random() * mockProductSignatures.length)].sku
        }));
        resolve(mockTags);
      }, 1000);
    });
  }, []);

  // Simulate visual detection using AI
  const performVisualScan = useCallback(async (zoneId: string): Promise<VisualDetection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const detections: VisualDetection[] = Array.from({ length: Math.floor(Math.random() * 12) + 8 }, (_, i) => ({
          id: `visual-${zoneId}-${i}`,
          sku: mockProductSignatures[Math.floor(Math.random() * mockProductSignatures.length)].sku,
          confidence: 0.85 + Math.random() * 0.14,
          boundingBox: {
            x: Math.random() * 800,
            y: Math.random() * 600,
            width: 80 + Math.random() * 40,
            height: 120 + Math.random() * 60
          },
          timestamp: new Date()
        }));
        resolve(detections);
      }, 1500);
    });
  }, []);

  // RSSI clustering for quantity estimation
  const clusterByRSSI = useCallback((tags: InvepinPin[]): RSSICluster[] => {
    if (!config.enableRSSIClustering) return [];

    const clusters: RSSICluster[] = [];
    const sortedTags = [...tags].sort((a, b) => (b.rssi || -100) - (a.rssi || -100));

    let currentCluster: InvepinPin[] = [];
    let lastRSSI = sortedTags[0]?.rssi || -100;

    sortedTags.forEach(tag => {
      if (Math.abs((tag.rssi || -100) - lastRSSI) < 10) {
        currentCluster.push(tag);
      } else {
        if (currentCluster.length > 0) {
          clusters.push({
            centroid: currentCluster.reduce((sum, t) => sum + (t.rssi || -100), 0) / currentCluster.length,
            tags: currentCluster,
            estimatedQuantity: currentCluster.length
          });
        }
        currentCluster = [tag];
      }
      lastRSSI = tag.rssi || -100;
    });

    if (currentCluster.length > 0) {
      clusters.push({
        centroid: currentCluster.reduce((sum, t) => sum + (t.rssi || -100), 0) / currentCluster.length,
        tags: currentCluster,
        estimatedQuantity: currentCluster.length
      });
    }

    return clusters;
  }, [config]);

  // Fusion logic: combine vision + tag data
  const fuseData = useCallback((
    tags: InvepinPin[],
    visualDetections: VisualDetection[]
  ): DetectedItem[] => {
    const itemMap = new Map<string, DetectedItem>();

    // Process tags
    tags.forEach(tag => {
      if (!tag.productSKU) return;
      
      const existing = itemMap.get(tag.productSKU);
      if (existing) {
        existing.quantity += 1;
        existing.tagIds?.push(tag.id);
      } else {
        const product = mockProductSignatures.find(p => p.sku === tag.productSKU);
        itemMap.set(tag.productSKU, {
          sku: tag.productSKU,
          name: product?.name || 'Unknown Product',
          quantity: 1,
          confidence: 0.95,
          verificationMethod: 'tag',
          tagIds: [tag.id],
          status: 'correct'
        });
      }
    });

    // Process visual detections
    visualDetections.forEach(detection => {
      const existing = itemMap.get(detection.sku);
      if (existing) {
        // Fusion: both methods detected this item
        existing.verificationMethod = 'both';
        existing.confidence = (existing.confidence * config.tagWeight + detection.confidence * config.visionWeight);
        existing.visualDetections = [...(existing.visualDetections || []), detection];
      } else {
        const product = mockProductSignatures.find(p => p.sku === detection.sku);
        itemMap.set(detection.sku, {
          sku: detection.sku,
          name: product?.name || 'Unknown Product',
          quantity: 1,
          confidence: detection.confidence,
          verificationMethod: 'vision',
          visualDetections: [detection],
          status: 'correct'
        });
      }
    });

    return Array.from(itemMap.values());
  }, [config]);

  // Generate alerts based on detected items
  const generateAlerts = useCallback((items: DetectedItem[]): ScanAlert[] => {
    const alerts: ScanAlert[] = [];

    items.forEach(item => {
      if (item.quantity < 3) {
        alerts.push({
          id: `alert-low-${item.sku}`,
          type: 'low-stock',
          severity: 'medium',
          message: `Low stock detected for ${item.name} (${item.quantity} remaining)`,
          item,
          timestamp: new Date()
        });
      }

      if (item.confidence < config.minimumConfidence) {
        alerts.push({
          id: `alert-conf-${item.sku}`,
          type: 'unknown-item',
          severity: 'low',
          message: `Low confidence detection for ${item.name} (${(item.confidence * 100).toFixed(1)}%)`,
          item,
          timestamp: new Date()
        });
      }

      if (item.verificationMethod === 'vision' && !item.tagIds) {
        alerts.push({
          id: `alert-notag-${item.sku}`,
          type: 'missing',
          severity: 'high',
          message: `${item.name} detected visually but no tag found - possible missing tag`,
          item,
          timestamp: new Date()
        });
      }
    });

    return alerts;
  }, [config]);

  // Main scan function triggered by button press
  const triggerScan = useCallback(async (zoneId: string): Promise<ScanResult> => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) throw new Error('Zone not found');

    setIsScanning(true);
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, status: 'scanning' } : z));

    toast({
      title: "Scan Started",
      description: `Scanning ${zone.name}...`,
    });

    const startTime = Date.now();

    try {
      // Parallel execution of BLE and vision scanning
      const [tags, visualDetections] = await Promise.all([
        scanBLETags(zoneId),
        performVisualScan(zoneId)
      ]);

      setActivePins(tags);

      // Perform RSSI clustering if enabled
      if (config.enableRSSIClustering) {
        clusterByRSSI(tags);
      }

      // Fuse the data
      const items = fuseData(tags, visualDetections);

      // Generate alerts
      const alerts = generateAlerts(items);

      const duration = (Date.now() - startTime) / 1000;

      const result: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: new Date(),
        location: {
          zone: zone.name,
          shelf: zone.location
        },
        items,
        accuracy: items.reduce((sum, item) => sum + item.confidence, 0) / items.length,
        duration,
        alerts,
        method: 'fusion'
      };

      setScanResults(prev => [result, ...prev]);
      setZones(prev => prev.map(z => 
        z.id === zoneId 
          ? { ...z, status: 'active', lastScan: new Date(), itemCount: items.reduce((sum, item) => sum + item.quantity, 0) }
          : z
      ));

      toast({
        title: "Scan Complete",
        description: `Found ${items.reduce((sum, item) => sum + item.quantity, 0)} items in ${duration.toFixed(1)}s with ${(result.accuracy * 100).toFixed(1)}% accuracy`,
      });

      return result;
    } catch (error) {
      setZones(prev => prev.map(z => z.id === zoneId ? { ...z, status: 'error' } : z));
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsScanning(false);
    }
  }, [zones, scanBLETags, performVisualScan, fuseData, generateAlerts, clusterByRSSI, config]);

  return {
    isScanning,
    zones,
    scanResults,
    activePins,
    config,
    triggerScan,
    setConfig
  };
}
