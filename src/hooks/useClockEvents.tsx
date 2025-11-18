import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClockEventData {
  userId: string;
  organizationId: string;
  eventType: 'clock_in' | 'clock_out';
  method: 'face_recognition' | 'manual' | 'rfid' | 'pin';
  confidence?: number;
  deviceId?: string;
  location?: { lat: number; lng: number };
  notes?: string;
}

export const useClockEvents = (organizationId?: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeShifts, setActiveShifts] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  const createClockEvent = useCallback(async (eventData: ClockEventData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clock_events')
        .insert({
          user_id: eventData.userId,
          organization_id: eventData.organizationId,
          event_type: eventData.eventType,
          method: eventData.method,
          confidence: eventData.confidence,
          device_id: eventData.deviceId,
          location: eventData.location,
          notes: eventData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: eventData.eventType === 'clock_in' ? 'Clocked In' : 'Clocked Out',
        description: `Successfully ${eventData.eventType === 'clock_in' ? 'clocked in' : 'clocked out'} at ${new Date().toLocaleTimeString()}`,
      });

      return data;
    } catch (error) {
      console.error('Error creating clock event:', error);
      toast({
        title: 'Clock Error',
        description: 'Failed to record clock event. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getActiveShifts = useCallback(async () => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('shift_records')
        .select(`
          id,
          user_id,
          clock_in_time,
          duration_minutes,
          profiles!inner(
            full_name,
            employee_id
          )
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('clock_in_time', { ascending: false });

      if (error) throw error;
      setActiveShifts(data || []);
    } catch (error) {
      console.error('Error fetching active shifts:', error);
    }
  }, [organizationId]);

  const getRecentClockEvents = useCallback(async (limit: number = 10) => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('clock_events')
        .select(`
          id,
          user_id,
          event_type,
          method,
          timestamp,
          confidence,
          profiles!inner(
            full_name,
            employee_id
          )
        `)
        .eq('organization_id', organizationId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setRecentEvents(data || []);
    } catch (error) {
      console.error('Error fetching recent clock events:', error);
    }
  }, [organizationId]);

  const getUserActiveShift = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('shift_records')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user active shift:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (organizationId) {
      getActiveShifts();
      getRecentClockEvents();
    }
  }, [organizationId, getActiveShifts, getRecentClockEvents]);

  return {
    createClockEvent,
    getActiveShifts,
    getRecentClockEvents,
    getUserActiveShift,
    activeShifts,
    recentEvents,
    isLoading,
  };
};
