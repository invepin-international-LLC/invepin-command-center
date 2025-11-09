import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, Link2 } from "lucide-react";
import { blockchainService } from "@/services/blockchainService";
import { useOrganization } from "@/components/auth/OrganizationProvider";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export const BlockchainAuditViewer = () => {
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIntegrityValid, setIsIntegrityValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (organization?.id) {
      loadAuditLogs();
    }
  }, [organization?.id]);

  const loadAuditLogs = async () => {
    if (!organization?.id) return;
    
    try {
      const auditLogs = await blockchainService.getAuditLogs(organization.id, 50);
      setLogs(auditLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load blockchain audit logs",
        variant: "destructive",
      });
    }
  };

  const verifyIntegrity = async () => {
    if (!organization?.id) return;
    
    setIsVerifying(true);
    try {
      const isValid = await blockchainService.verifyChainIntegrity(organization.id);
      setIsIntegrityValid(isValid);
      
      toast({
        title: isValid ? "Chain Verified" : "Chain Compromised",
        description: isValid 
          ? "All blockchain records are verified and intact"
          : "Blockchain integrity check failed - tampering detected",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error verifying integrity:', error);
      toast({
        title: "Error",
        description: "Failed to verify blockchain integrity",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Blockchain Audit Trail
            </CardTitle>
            <CardDescription>
              Immutable record of all critical system events
            </CardDescription>
          </div>
          <Button
            onClick={verifyIntegrity}
            disabled={isVerifying}
            variant="outline"
            size="sm"
          >
            {isVerifying ? "Verifying..." : "Verify Integrity"}
          </Button>
        </div>
        {isIntegrityValid !== null && (
          <div className="flex items-center gap-2 mt-2">
            {isIntegrityValid ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Chain Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Integrity Issue Detected
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No audit logs yet. Events will be recorded here as they occur.
              </p>
            ) : (
              logs.map((log, index) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Block #{log.block_number}</Badge>
                        <span className="text-sm font-medium">{log.event_type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        Hash: {log.data_hash.substring(0, 16)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                    {index < logs.length - 1 && (
                      <Link2 className="h-4 w-4 text-muted-foreground" />
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
