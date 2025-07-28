import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertThreshold, LossPreventionSettings, LossPreventionStats } from '@/types/alerts';
import { PourEvent, Bottle, BLEDevice } from '@/types/bar';
import { useToast } from '@/hooks/use-toast';

export const useLossPrevention = () => {
  const { toast } = useToast();
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<LossPreventionSettings>({
    overpourThreshold: 20, // 20% over standard pour
    theftDetectionSensitivity: 'medium',
    unusualActivityThreshold: 10, // pours per minute
    alertCooldown: 5, // 5 minutes
    autoResolveAfter: 24, // 24 hours
    notificationChannels: {
      email: true,
      sms: true,
      push: true,
      inApp: true
    }
  });

  const [thresholds, setThresholds] = useState<AlertThreshold[]>([
    {
      id: 'overpour',
      type: 'overpour',
      name: 'Overpour Detection',
      enabled: true,
      threshold: 20,
      unit: '% over standard',
      description: 'Alert when pours exceed standard amount by this percentage'
    },
    {
      id: 'theft',
      type: 'theft',
      name: 'Theft Detection', 
      enabled: true,
      threshold: 100,
      unit: 'ml without pour',
      description: 'Alert when liquid level drops without registered pour'
    },
    {
      id: 'unusual',
      type: 'unusual_activity',
      name: 'Unusual Activity',
      enabled: true,
      threshold: 8,
      unit: 'pours/minute',
      description: 'Alert when pour rate exceeds normal patterns'
    }
  ]);

  // Mock initial alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        type: 'overpour',
        severity: 'medium',
        title: 'Overpour Detected',
        description: 'Grey Goose pour exceeded standard by 25%',
        timestamp: '2 min ago',
        bottleId: 'b1',
        bartenderId: '1',
        data: {
          expectedAmount: 1.5,
          actualAmount: 1.9,
          threshold: 20
        },
        acknowledged: false
      },
      {
        id: 'alert-2',
        type: 'theft',
        severity: 'high',
        title: 'Possible Theft',
        description: 'Macallan 18 level dropped 150ml without registered pour',
        timestamp: '15 min ago',
        bottleId: 'b2',
        data: {
          actualAmount: 150,
          threshold: 100
        },
        acknowledged: false
      },
      {
        id: 'alert-3',
        type: 'device_offline',
        severity: 'low',
        title: 'Sensor Offline',
        description: 'Smart Scale #1 has been offline for 10 minutes',
        timestamp: '10 min ago',
        deviceId: 'ble-002',
        acknowledged: true,
        resolvedAt: '5 min ago',
        resolvedBy: 'Manager'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const createAlert = useCallback((newAlert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const alert: Alert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      acknowledged: false
    };

    setAlerts(prev => [alert, ...prev]);

    // Show toast notification
    if (settings.notificationChannels.inApp) {
      toast({
        title: `🚨 ${alert.title}`,
        description: alert.description,
        variant: alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'default'
      });
    }

    return alert;
  }, [settings.notificationChannels.inApp, toast]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  }, []);

  const resolveAlert = useCallback((alertId: string, resolvedBy: string = 'Manager') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            acknowledged: true,
            resolvedAt: 'Just now',
            resolvedBy 
          }
        : alert
    ));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Monitor pour events for violations
  const monitorPourEvent = useCallback((pourEvent: PourEvent, standardPour: number = 1.5) => {
    const overpourPercentage = ((pourEvent.amount - standardPour) / standardPour) * 100;
    
    if (overpourPercentage > settings.overpourThreshold) {
      createAlert({
        type: 'overpour',
        severity: overpourPercentage > 50 ? 'high' : 'medium',
        title: 'Overpour Detected',
        description: `Pour exceeded standard by ${overpourPercentage.toFixed(1)}%`,
        bottleId: pourEvent.bottleId,
        bartenderId: pourEvent.bartenderId,
        data: {
          expectedAmount: standardPour,
          actualAmount: pourEvent.amount,
          threshold: settings.overpourThreshold
        }
      });
    }
  }, [settings.overpourThreshold, createAlert]);

  // Monitor bottle levels for theft
  const monitorBottleLevel = useCallback((bottle: Bottle, previousLevel: number) => {
    const levelDrop = previousLevel - bottle.level;
    const mlDrop = levelDrop * 7.5; // Assuming 750ml bottle
    
    if (mlDrop > thresholds.find(t => t.type === 'theft')?.threshold! && bottle.isActive) {
      createAlert({
        type: 'theft',
        severity: mlDrop > 200 ? 'critical' : 'high',
        title: 'Possible Theft',
        description: `${bottle.name} level dropped ${mlDrop.toFixed(0)}ml without registered pour`,
        bottleId: bottle.id,
        data: {
          actualAmount: mlDrop,
          threshold: thresholds.find(t => t.type === 'theft')?.threshold
        }
      });
    }
  }, [thresholds, createAlert]);

  // Monitor device connectivity
  const monitorDeviceStatus = useCallback((device: BLEDevice, wasConnected: boolean) => {
    if (wasConnected && !device.connected) {
      createAlert({
        type: 'device_offline',
        severity: 'low',
        title: 'Sensor Offline',
        description: `${device.name} has gone offline`,
        deviceId: device.id
      });
    }
  }, [createAlert]);

  // Calculate stats
  const getStats = useCallback((): LossPreventionStats => {
    const activeAlerts = alerts.filter(a => !a.resolvedAt);
    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estimate monetary loss (simplified calculation)
    const estimatedLoss = alerts
      .filter(a => a.type === 'overpour' || a.type === 'theft')
      .reduce((total, alert) => {
        if (alert.type === 'overpour' && alert.data?.actualAmount && alert.data?.expectedAmount) {
          const waste = alert.data.actualAmount - alert.data.expectedAmount;
          return total + (waste * 8); // $8 per oz average
        }
        if (alert.type === 'theft' && alert.data?.actualAmount) {
          return total + (alert.data.actualAmount * 0.3); // $0.30 per ml average
        }
        return total;
      }, 0);

    return {
      totalAlerts: alerts.length,
      activeAlerts: activeAlerts.length,
      alertsByType,
      estimatedLoss,
      preventedLoss: estimatedLoss * 0.7, // Assume 70% prevention rate
      averageResponseTime: 3.2 // Mock average
    };
  }, [alerts]);

  const updateThreshold = useCallback((thresholdId: string, updates: Partial<AlertThreshold>) => {
    setThresholds(prev => prev.map(threshold => 
      threshold.id === thresholdId 
        ? { ...threshold, ...updates }
        : threshold
    ));
  }, []);

  return {
    alerts,
    settings,
    thresholds,
    stats: getStats(),
    createAlert,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    monitorPourEvent,
    monitorBottleLevel,
    monitorDeviceStatus,
    updateThreshold,
    updateSettings: setSettings
  };
};