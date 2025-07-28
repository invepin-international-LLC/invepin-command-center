import { useState, useEffect, useCallback } from 'react';
import { BLEDevice, LivePourData } from '@/types/bar';
import { useToast } from '@/hooks/use-toast';

export const useBLEDevices = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [livePourData, setLivePourData] = useState<LivePourData[]>([]);

  // Mock BLE devices for demo - replace with actual Web Bluetooth API
  const mockDevices: BLEDevice[] = [
    {
      id: 'ble-001',
      name: 'PourSpout Pro #1',
      connected: true,
      batteryLevel: 87,
      lastSeen: 'Just now',
      type: 'pour-spout',
      assignedBottle: 'b1'
    },
    {
      id: 'ble-002', 
      name: 'Smart Scale #1',
      connected: false,
      batteryLevel: 23,
      lastSeen: '5 min ago',
      type: 'scale',
      assignedBottle: 'b2'
    },
    {
      id: 'ble-003',
      name: 'TempSensor #1',
      connected: true,
      batteryLevel: 94,
      lastSeen: 'Just now',
      type: 'temperature'
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setDevices(mockDevices);
  }, []);

  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // In real implementation, use Web Bluetooth API:
      // const device = await navigator.bluetooth.requestDevice({
      //   filters: [{ services: ['pour-detection-service'] }]
      // });
      
      // Mock scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate finding new device
      const newDevice: BLEDevice = {
        id: `ble-${Date.now()}`,
        name: `New Device #${devices.length + 1}`,
        connected: false,
        lastSeen: 'Just discovered',
        type: 'pour-spout'
      };
      
      setDevices(prev => [...prev, newDevice]);
      toast({
        title: "Device Found",
        description: `Found ${newDevice.name}`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan for BLE devices",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [devices.length, toast]);

  const connectDevice = useCallback(async (deviceId: string) => {
    try {
      // Mock connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSeen: 'Just now' }
          : device
      ));
      
      const device = devices.find(d => d.id === deviceId);
      toast({
        title: "Device Connected",
        description: `${device?.name} is now connected`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to device",
        variant: "destructive"
      });
    }
  }, [devices, toast]);

  const disconnectDevice = useCallback(async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false }
        : device
    ));
    
    const device = devices.find(d => d.id === deviceId);
    toast({
      title: "Device Disconnected", 
      description: `${device?.name} has been disconnected`,
    });
  }, [devices, toast]);

  const assignBottle = useCallback((deviceId: string, bottleId: string | undefined) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, assignedBottle: bottleId }
        : device
    ));
  }, []);

  // Simulate live pour data
  useEffect(() => {
    const interval = setInterval(() => {
      const connectedSpouts = devices.filter(d => d.connected && d.type === 'pour-spout' && d.assignedBottle);
      
      // Randomly simulate pour events
      if (Math.random() < 0.1 && connectedSpouts.length > 0) {
        const randomSpout = connectedSpouts[Math.floor(Math.random() * connectedSpouts.length)];
        
        const pourData: LivePourData = {
          deviceId: randomSpout.id,
          bottleId: randomSpout.assignedBottle!,
          currentWeight: Math.random() * 100,
          pourRate: Math.random() * 50,
          isPouring: true,
          startTime: Date.now()
        };
        
        setLivePourData(prev => {
          const filtered = prev.filter(p => p.deviceId !== randomSpout.id);
          return [...filtered, pourData];
        });
        
        // Stop pouring after 3-8 seconds
        setTimeout(() => {
          setLivePourData(prev => prev.filter(p => p.deviceId !== randomSpout.id));
        }, 3000 + Math.random() * 5000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [devices]);

  return {
    devices,
    isScanning,
    livePourData,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    assignBottle
  };
};