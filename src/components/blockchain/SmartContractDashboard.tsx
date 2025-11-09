import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { smartContractService } from "@/services/smartContractService";
import { useOrganization } from "@/components/auth/OrganizationProvider";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SmartContractDashboard = () => {
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    if (organization?.id) {
      loadContracts();
    }
  }, [organization?.id]);

  const loadContracts = async () => {
    if (!organization?.id) return;
    
    try {
      const logs = await smartContractService.getContractLogs(organization.id, 30);
      setContracts(logs);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load smart contract logs",
        variant: "destructive",
      });
    }
  };

  const getContractIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4" />;
      case 'inventory_transfer': return <FileText className="h-4 w-4" />;
      case 'access_grant': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      executed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Smart Contract Activity
        </CardTitle>
        <CardDescription>
          Blockchain-ready contract execution logs (ready for mainnet deployment)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {contracts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No smart contracts executed yet
              </p>
            ) : (
              contracts.map((contract) => (
                <Card key={contract.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getContractIcon(contract.contract_type)}
                      <span className="font-medium text-sm">
                        {contract.contract_type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Gas Equivalent: {contract.gas_equivalent?.toLocaleString()} units</p>
                    <p>Created: {new Date(contract.created_at).toLocaleString()}</p>
                    {contract.executed_at && (
                      <p>Executed: {new Date(contract.executed_at).toLocaleString()}</p>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
