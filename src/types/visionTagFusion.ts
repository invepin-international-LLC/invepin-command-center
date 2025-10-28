export interface InvepinPin {
  id: string;
  tagType: 'BLE' | 'NFC';
  macAddress: string;
  rssi?: number;
  batteryLevel: number;
  lastSeen: Date;
  productSKU?: string;
  location?: {
    zone: string;
    shelf: string;
    position?: { x: number; y: number };
  };
}

export interface VisualDetection {
  id: string;
  sku: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: Date;
}

export interface ProductSignature {
  sku: string;
  name: string;
  imageUrl: string;
  visualFingerprint?: string;
  category: string;
  expectedLocation?: {
    zone: string;
    shelf: string;
  };
}

export interface ScanResult {
  id: string;
  timestamp: Date;
  location: {
    zone: string;
    shelf: string;
  };
  items: DetectedItem[];
  accuracy: number;
  duration: number; // in seconds
  alerts: ScanAlert[];
  method: 'vision' | 'tag' | 'fusion';
}

export interface DetectedItem {
  sku: string;
  name: string;
  quantity: number;
  confidence: number;
  verificationMethod: 'vision' | 'tag' | 'both';
  tagIds?: string[];
  visualDetections?: VisualDetection[];
  status: 'correct' | 'misplaced' | 'low-stock' | 'missing';
}

export interface ScanAlert {
  id: string;
  type: 'missing' | 'misplaced' | 'low-stock' | 'unknown-item' | 'duplicate';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  item?: DetectedItem;
  timestamp: Date;
}

export interface ShelfZone {
  id: string;
  name: string;
  location: string;
  cameraEnabled: boolean;
  bleEnabled: boolean;
  lastScan?: Date;
  itemCount: number;
  status: 'active' | 'scanning' | 'offline' | 'error';
}

export interface RSSICluster {
  centroid: number;
  tags: InvepinPin[];
  estimatedQuantity: number;
}

export interface FusionConfig {
  visionWeight: number; // 0-1
  tagWeight: number; // 0-1
  minimumConfidence: number; // 0-1
  rssiThreshold: number; // dBm
  enableRSSIClustering: boolean;
  enableVisualVerification: boolean;
  scanTimeout: number; // seconds
}
