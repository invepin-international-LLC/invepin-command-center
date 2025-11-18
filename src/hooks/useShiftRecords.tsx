import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShiftRecord {
  id: string;
  user_id: string;
  clock_in_time: string;
  clock_out_time: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  break_duration_minutes: number;
  profiles?: {
    full_name: string;
    employee_id: string;
  };
}

export const useShiftRecords = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getShiftRecords = useCallback(async (
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('shift_records')
        .select('id, user_id, clock_in_time, clock_out_time, duration_minutes, is_active, break_duration_minutes')
        .eq('organization_id', organizationId)
        .order('clock_in_time', { ascending: false });

      if (startDate) {
        query = query.gte('clock_in_time', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('clock_in_time', endDate.toISOString());
      }

      const { data: shifts, error } = await query;

      if (error) throw error;

      // Fetch profile data separately
      const shiftsWithProfiles = await Promise.all(
        (shifts || []).map(async (shift) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, employee_id')
            .eq('id', shift.user_id)
            .single();

          return {
            ...shift,
            profiles: profile || { full_name: 'Unknown', employee_id: '' }
          };
        })
      );

      return shiftsWithProfiles as ShiftRecord[];
    } catch (error) {
      console.error('Error fetching shift records:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserShiftRecords = useCallback(async (
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('shift_records')
        .select('*')
        .eq('user_id', userId)
        .order('clock_in_time', { ascending: false });

      if (startDate) {
        query = query.gte('clock_in_time', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('clock_in_time', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user shift records:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateTotalHours = useCallback((shifts: ShiftRecord[]) => {
    return shifts.reduce((total, shift) => {
      if (shift.duration_minutes) {
        return total + (shift.duration_minutes / 60);
      }
      return total;
    }, 0);
  }, []);

  return {
    getShiftRecords,
    getUserShiftRecords,
    calculateTotalHours,
    isLoading,
  };
};
