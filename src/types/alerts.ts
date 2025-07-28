export interface Alert {
  id: string;
  type: 'overpour' | 'theft' | 'unusual_activity' | 'low_stock' | 'device_offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  bottleId?: string;
  bartenderId?: string;
  deviceId?: string;
  data?: {
    expectedAmount?: number;
    actualAmount?: number;
    threshold?: number;
    duration?: number;
    location?: string;
  };
  acknowledged: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AlertThreshold {
  id: string;
  type: 'overpour' | 'theft' | 'unusual_activity';
  name: string;
  enabled: boolean;
  threshold: number;
  unit: string;
  description: string;
}

export interface LossPreventionSettings {
  overpourThreshold: number; // percentage over standard pour
  theftDetectionSensitivity: 'low' | 'medium' | 'high';
  unusualActivityThreshold: number; // pours per minute
  alertCooldown: number; // minutes between same type alerts
  autoResolveAfter: number; // hours
  notificationChannels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface LossPreventionStats {
  totalAlerts: number;
  activeAlerts: number;
  alertsByType: Record<string, number>;
  estimatedLoss: number; // in currency
  preventedLoss: number; // in currency
  averageResponseTime: number; // minutes
}