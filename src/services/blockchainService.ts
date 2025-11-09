import { supabase } from "@/integrations/supabase/client";

export interface BlockchainAuditLog {
  id: string;
  organization_id: string;
  user_id?: string;
  event_type: string;
  event_data: any;
  data_hash: string;
  previous_hash?: string;
  block_number: number;
  created_at: string;
  blockchain_tx_id?: string;
  is_synced_to_chain: boolean;
}

export const blockchainService = {
  /**
   * Log an event to the blockchain audit trail
   * This creates an immutable record with cryptographic verification
   */
  async logEvent(
    eventType: string,
    eventData: any,
    organizationId: string
  ): Promise<void> {
    try {
      // Get the latest hash for chaining
      const { data: previousLog } = await supabase
        .from('blockchain_audit_logs')
        .select('data_hash')
        .eq('organization_id', organizationId)
        .order('block_number', { ascending: false })
        .limit(1)
        .single();

      // Calculate hash client-side for verification
      const eventDataStr = JSON.stringify(eventData);
      const hashInput = eventDataStr + (previousLog?.data_hash || '0');
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const dataHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const { error } = await supabase
        .from('blockchain_audit_logs')
        .insert({
          organization_id: organizationId,
          event_type: eventType,
          event_data: eventData,
          data_hash: dataHash,
          previous_hash: previousLog?.data_hash || null,
        });

      if (error) throw error;
      
      console.log('Blockchain audit log created:', eventType, dataHash);
    } catch (error) {
      console.error('Error logging to blockchain:', error);
      throw error;
    }
  },

  /**
   * Verify blockchain integrity by checking hash chain
   */
  async verifyChainIntegrity(organizationId: string): Promise<boolean> {
    try {
      const { data: logs, error } = await supabase
        .from('blockchain_audit_logs')
        .select('*')
        .eq('organization_id', organizationId)
        .order('block_number', { ascending: true });

      if (error) throw error;
      if (!logs || logs.length === 0) return true;

      // Verify each block's hash matches expected value
      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        const eventDataStr = JSON.stringify(log.event_data);
        const hashInput = eventDataStr + (log.previous_hash || '0');
        
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (calculatedHash !== log.data_hash) {
          console.error('Chain integrity violation at block:', log.block_number);
          return false;
        }

        // Verify chain linkage
        if (i > 0 && logs[i - 1].data_hash !== log.previous_hash) {
          console.error('Chain linkage broken at block:', log.block_number);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying chain integrity:', error);
      return false;
    }
  },

  /**
   * Get audit logs for an organization
   */
  async getAuditLogs(
    organizationId: string,
    limit = 100
  ): Promise<BlockchainAuditLog[]> {
    const { data, error } = await supabase
      .from('blockchain_audit_logs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('block_number', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
