import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShiftManagement } from "@/hooks/useShiftManagement";
import { ShiftReportView } from "./ShiftReportView";
import { ManagerApprovals } from "./ManagerApprovals";
import { 
  Clock, 
  FileText, 
  Bell,
  TrendingUp,
  Download,
  AlertTriangle
} from "lucide-react";

export const ShiftManagementDashboard = () => {
  const {
    activeShifts,
    completedShifts,
    pendingApprovals,
    managerAlerts,
    approvePour,
    denyPour,
    acknowledgeAlert,
    generateShiftReport
  } = useShiftManagement();

  const urgentAlerts = managerAlerts.filter(alert => !alert.acknowledged && alert.requiresAction).length;
  const pendingCount = pendingApprovals.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Shift Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive shift reports and real-time management approvals
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {urgentAlerts > 0 && (
            <Badge variant="destructive" className="animate-pulse text-xs">
              {urgentAlerts} Alert{urgentAlerts > 1 ? 's' : ''}
            </Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button className="bg-gradient-primary text-xs sm:text-sm px-3 py-2">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Shifts</p>
                <p className="text-2xl font-bold">{activeShifts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className={`text-2xl font-bold ${pendingCount > 0 ? 'text-orange-500' : 'text-success'}`}>
                  {pendingCount}
                </p>
              </div>
              <Bell className={`h-8 w-8 ${pendingCount > 0 ? 'text-orange-500' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">
                  ${activeShifts.reduce((sum, shift) => sum + shift.financials.grossRevenue, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold text-success">
                  {activeShifts.length > 0 
                    ? Math.round(activeShifts.reduce((sum, shift) => sum + shift.performance.efficiencyRating, 0) / activeShifts.length)
                    : 0}%
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Manager Approvals
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active-shifts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Active Shifts
          </TabsTrigger>
          <TabsTrigger value="completed-shifts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Shift Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <ManagerApprovals
            pendingApprovals={pendingApprovals}
            managerAlerts={managerAlerts}
            onApprovePour={approvePour}
            onDenyPour={denyPour}
            onAcknowledgeAlert={acknowledgeAlert}
          />
        </TabsContent>

        <TabsContent value="active-shifts">
          <div className="space-y-6">
            {activeShifts.length === 0 ? (
              <Card className="bg-gradient-card border-border">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Shifts</h3>
                  <p className="text-muted-foreground">All staff are currently off duty</p>
                </CardContent>
              </Card>
            ) : (
              activeShifts.map((shift) => (
                <ShiftReportView key={shift.id} shift={shift} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed-shifts">
          <div className="space-y-6">
            {completedShifts.length === 0 ? (
              <Card className="bg-gradient-card border-border">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Completed Shifts</h3>
                  <p className="text-muted-foreground">Shift reports will appear here when shifts are completed</p>
                  <Button 
                    className="mt-4 bg-gradient-primary"
                    onClick={() => generateShiftReport('1')}
                  >
                    Generate Sample Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              completedShifts.map((shift) => (
                <ShiftReportView key={shift.id} shift={shift} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};