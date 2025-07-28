export interface Bartender {
  id: string;
  name: string;
  isOnShift: boolean;
  shiftStart?: string;
  pourAccuracy: number;
  todayPours: number;
  avatar?: string;
}

export interface Bottle {
  id: string;
  name: string;
  brand: string;
  level: number; // percentage
  lastPour: string;
  assignedBartender?: string;
  pourCount: number;
  isActive: boolean;
  sensorId?: string; // BLE sensor identifier
}

export interface PourEvent {
  id: string;
  bottleId: string;
  bartenderId: string;
  amount: number; // ounces
  timestamp: string;
  accuracy: number; // percentage vs standard pour
  sensorData?: {
    weight: number;
    temperature: number;
    tiltAngle: number;
  };
}

export interface BLEDevice {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel?: number;
  lastSeen: string;
  type: 'pour-spout' | 'scale' | 'temperature';
  assignedBottle?: string;
}

export interface LivePourData {
  deviceId: string;
  bottleId: string;
  currentWeight: number;
  pourRate: number; // ml/second
  isPouring: boolean;
  startTime?: number;
}