import { supabase } from "@/integrations/supabase/client";

export interface SmartContractResult {
  success: boolean;
  contractId: string;
  gasEquivalent: number;
  blockchainHash: string;
}

export const smartContractService = {
  /**
   * Execute an approval workflow as a smart contract
   */
  async executeApproval(
    approvalData: any,
    organizationId: string
  ): Promise<SmartContractResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'smart-contract-execute',
      {
        body: {
          contractType: 'approval',
          contractData: approvalData,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Execute an inventory transfer as a smart contract
   */
  async executeInventoryTransfer(
    transferData: any,
    organizationId: string
  ): Promise<SmartContractResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'smart-contract-execute',
      {
        body: {
          contractType: 'inventory_transfer',
          contractData: transferData,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Execute an access grant as a smart contract
   */
  async executeAccessGrant(
    accessData: any,
    organizationId: string
  ): Promise<SmartContractResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'smart-contract-execute',
      {
        body: {
          contractType: 'access_grant',
          contractData: accessData,
          organizationId,
        },
      }
    );

    if (error) throw error;
    return result;
  },

  /**
   * Get smart contract logs
   */
  async getContractLogs(
    organizationId: string,
    limit = 50
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from('smart_contract_logs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
