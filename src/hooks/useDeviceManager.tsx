import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Device {
  id: string;
  device_id: string;
  name: string;
  device_type: {
    name: string;
    category: string;
    capabilities: any;
  };
  status: 'online' | 'offline' | 'error' | 'maintenance' | 'low_battery';
  battery_level: number | null;
  signal_strength: number | null;
  last_seen: string | null;
  location: any;
  metadata: any;
}

export interface DeviceData {
  id: string;
  timestamp: string;
  data_type: string;
  payload: any;
  rssi: number | null;
  battery_level: number | null;
  gps_location: any;
}

export const useDeviceManager = (organizationId?: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDevices = useCallback(async () => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          device_type:device_types(name, category, capabilities)
        `)
        .eq('organization_id', organizationId)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setDevices(data as Device[]);
    } catch (error: any) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load devices',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, toast]);

  useEffect(() => {
    fetchDevices();

    // Subscribe to real-time device updates
    if (!organizationId) return;

    const channel = supabase
      .channel('device-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `organization_id=eq.${organizationId}`
        },
        () => {
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, fetchDevices]);

  const pairDevice = async (deviceData: {
    device_id: string;
    device_type: 'tag' | 'gateway';
    name?: string;
    mac_address?: string;
    serial_number?: string;
    metadata?: any;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('device-pairing', {
        body: deviceData
      });

      if (error) throw error;

      toast({
        title: 'Device Paired',
        description: `${deviceData.name || deviceData.device_id} has been successfully paired`,
      });

      fetchDevices();
      return data;
    } catch (error: any) {
      console.error('Error pairing device:', error);
      toast({
        title: 'Pairing Failed',
        description: error.message || 'Failed to pair device',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const sendCommand = async (
    deviceId: string,
    commandType: string,
    payload?: any,
    priority?: number
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('device-command', {
        body: {
          device_id: deviceId,
          command_type: commandType,
          payload,
          priority,
        }
      });

      if (error) throw error;

      toast({
        title: 'Command Sent',
        description: `Command "${commandType}" sent to device`,
      });

      return data;
    } catch (error: any) {
      console.error('Error sending command:', error);
      toast({
        title: 'Command Failed',
        description: error.message || 'Failed to send command',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getDeviceData = async (deviceUuid: string, limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('device_data')
        .select('*')
        .eq('device_id', deviceUuid)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as DeviceData[];
    } catch (error: any) {
      console.error('Error fetching device data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load device data',
        variant: 'destructive',
      });
      return [];
    }
  };

  const subscribeToDeviceData = (deviceUuid: string, callback: (data: DeviceData) => void) => {
    const channel = supabase
      .channel(`device-data-${deviceUuid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'device_data',
          filter: `device_id=eq.${deviceUuid}`
        },
        (payload) => {
          callback(payload.new as DeviceData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    devices,
    isLoading,
    fetchDevices,
    pairDevice,
    sendCommand,
    getDeviceData,
    subscribeToDeviceData,
  };
};
