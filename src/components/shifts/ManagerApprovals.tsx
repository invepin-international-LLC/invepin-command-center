import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  X,
  AlertTriangle,
  DollarSign,
  User
} from "lucide-react";
import { PourApproval, ManagerAlert } from "@/types/shifts";

interface ManagerApprovalsProps {
  pendingApprovals: PourApproval[];
  managerAlerts: ManagerAlert[];
  onApprovePour: (approvalId: string, notes?: string) => void;
  onDenyPour: (approvalId: string, reason: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

export const ManagerApprovals = ({ 
  pendingApprovals, 
  managerAlerts, 
  onApprovePour, 
  onDenyPour, 
  onAcknowledgeAlert 
}: ManagerApprovalsProps) => {
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleApprove = (approvalId: string) => {
    onApprovePour(approvalId, approvalNotes);
    setSelectedApproval(null);
    setApprovalNotes("");
  };

  const handleDeny = (approvalId: string) => {
    if (!denyReason.trim()) return;
    onDenyPour(approvalId, denyReason);
    setSelectedApproval(null);
    setDenyReason("");
  };

  const urgentAlerts = managerAlerts.filter(alert => !alert.acknowledged && alert.requiresAction);
  const pendingPourApprovals = pendingApprovals.filter(approval => approval.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-500">{pendingPourApprovals.length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent Alerts</p>
                <p className="text-2xl font-bold text-red-500">{urgentAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Cost Impact</p>
                <p className="text-2xl font-bold">
                  ${pendingPourApprovals.reduce((sum, approval) => 
                    sum + ((approval.requestedAmount - approval.standardAmount) * 8), 0
                  ).toFixed(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">2.3m</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Pour Approvals */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Pour Approval Requests
          </CardTitle>
          <CardDescription>Staff requesting authorization for excessive pours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingPourApprovals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No pending pour approvals</p>
            </div>
          ) : (
            pendingPourApprovals.map((approval) => (
              <div key={approval.id} className={`p-4 rounded-lg border ${getUrgencyColor(approval.urgency)}`}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{approval.bottleName}</h3>
                        <Badge className={getUrgencyColor(approval.urgency)}>
                          {approval.urgency.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {approval.bartenderId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {approval.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pour Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-background/30 rounded">
                      <p className="text-xs text-muted-foreground">Standard Pour</p>
                      <p className="font-bold">{approval.standardAmount}oz</p>
                    </div>
                    <div className="text-center p-2 bg-orange-500/10 rounded border border-orange-500/20">
                      <p className="text-xs text-muted-foreground">Requested Pour</p>
                      <p className="font-bold text-orange-500">{approval.requestedAmount}oz</p>
                    </div>
                    <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                      <p className="text-xs text-muted-foreground">Overage</p>
                      <p className="font-bold text-red-500">
                        +{((approval.requestedAmount - approval.standardAmount) / approval.standardAmount * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="p-3 bg-background/20 rounded">
                    <p className="text-sm font-medium mb-1">Reason:</p>
                    <p className="text-sm">{approval.reason}</p>
                    {approval.customerRequest && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Customer Request:</p>
                        <p className="text-sm text-muted-foreground italic">"{approval.customerRequest}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {selectedApproval === approval.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add notes (optional)..."
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Input
                        placeholder="Reason for denial (required if denying)..."
                        value={denyReason}
                        onChange={(e) => setDenyReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(approval.id)}
                          className="bg-gradient-primary flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Pour
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeny(approval.id)}
                          disabled={!denyReason.trim()}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Deny Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedApproval(null);
                            setDenyReason("");
                            setApprovalNotes("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedApproval(approval.id)}
                        className="bg-gradient-primary"
                      >
                        Review Request
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Other Manager Alerts */}
      {urgentAlerts.filter(alert => alert.type !== 'pour_approval').length > 0 && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Urgent System Alerts
            </CardTitle>
            <CardDescription>Other issues requiring management attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentAlerts
              .filter(alert => alert.type !== 'pour_approval')
              .map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                        {alert.bartenderName && (
                          <>
                            <span>•</span>
                            <span>{alert.bartenderName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
