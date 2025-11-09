import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, Mail, Phone, Briefcase, User } from "lucide-react";

interface PendingApproval {
  id: string;
  user_id: string;
  organization_id: string;
  employee_id: string;
  department: string;
  position: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
}

export const EmployeeApprovalDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingApprovals();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('pending-approvals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_approvals'
        },
        () => {
          loadPendingApprovals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_approvals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingApprovals(data || []);
    } catch (error: any) {
      console.error('Error loading approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending approvals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (approval: PendingApproval, approved: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update pending approval status
      const { error: approvalError } = await supabase
        .from('pending_approvals')
        .update({
          status: approved ? 'approved' : 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', approval.id);

      if (approvalError) throw approvalError;

      if (approved) {
        // Update profile to approved
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_approved: true,
            approved_by: user.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', approval.user_id);

        if (profileError) throw profileError;

        // Add to organization_members
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            user_id: approval.user_id,
            organization_id: approval.organization_id,
            role: 'staff'
          });

        if (memberError) throw memberError;

        // Send approval email
        await supabase.functions.invoke('send-approval-email', {
          body: {
            email: approval.email,
            fullName: approval.full_name,
            approved: true
          }
        });
      } else {
        // Send rejection email
        await supabase.functions.invoke('send-approval-email', {
          body: {
            email: approval.email,
            fullName: approval.full_name,
            approved: false
          }
        });
      }

      toast({
        title: approved ? "Employee Approved" : "Employee Rejected",
        description: `${approval.full_name} has been ${approved ? 'approved' : 'rejected'}`,
      });

      loadPendingApprovals();
    } catch (error: any) {
      console.error('Error processing approval:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process approval",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading approvals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" />
          Pending Employee Approvals
        </CardTitle>
        <CardDescription>
          Review and approve employee registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{approval.full_name}</div>
                        <div className="text-xs text-muted-foreground">{approval.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {approval.email}
                      </div>
                      {approval.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {approval.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      {approval.position}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{approval.employee_id}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(approval.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(approval, true)}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(approval, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
