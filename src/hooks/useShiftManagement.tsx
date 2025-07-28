import { useState, useEffect, useCallback } from 'react';
import { ShiftReport, PourApproval, ManagerAlert, ShiftViolation } from '@/types/shifts';
import { useToast } from '@/hooks/use-toast';

export const useShiftManagement = () => {
  const { toast } = useToast();
  
  const [activeShifts, setActiveShifts] = useState<ShiftReport[]>([]);
  const [completedShifts, setCompletedShifts] = useState<ShiftReport[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PourApproval[]>([]);
  const [managerAlerts, setManagerAlerts] = useState<ManagerAlert[]>([]);

  // Mock data initialization
  useEffect(() => {
    const mockPendingApprovals: PourApproval[] = [
      {
        id: 'pa1',
        bartenderId: '1',
        bartenderName: 'Alex Rodriguez',
        bottleId: 'b1',
        bottleName: 'Grey Goose Vodka',
        requestedAmount: 2.5,
        standardAmount: 1.5,
        reason: 'Customer requested double pour',
        customerRequest: 'VIP customer celebrating anniversary',
        timestamp: '2 min ago',
        status: 'pending',
        urgency: 'high'
      },
      {
        id: 'pa2',
        bartenderId: '2',
        bartenderName: 'Sarah Chen',
        bottleId: 'b2',
        bottleName: 'Macallan 18',
        requestedAmount: 3.0,
        standardAmount: 2.0,
        reason: 'Special tasting request',
        timestamp: '5 min ago',
        status: 'pending',
        urgency: 'medium'
      }
    ];

    const mockManagerAlerts: ManagerAlert[] = [
      {
        id: 'alert1',
        type: 'pour_approval',
        severity: 'high',
        title: 'Pour Approval Required',
        description: 'Alex Rodriguez requesting approval for double Grey Goose pour',
        bartenderId: '1',
        bartenderName: 'Alex Rodriguez',
        data: mockPendingApprovals[0],
        timestamp: '2 min ago',
        requiresAction: true,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        acknowledged: false
      },
      {
        id: 'alert2',
        type: 'shift_violation',
        severity: 'medium',
        title: 'Multiple Overpours Detected',
        description: 'Sarah Chen has 3 overpour incidents in last 30 minutes',
        bartenderId: '2',
        bartenderName: 'Sarah Chen',
        data: { count: 3, timeframe: '30 min' },
        timestamp: '15 min ago',
        requiresAction: true,
        acknowledged: false
      }
    ];

    const mockActiveShift: ShiftReport = {
      id: 'shift1',
      bartenderId: '1',
      bartenderName: 'Alex Rodriguez',
      shiftDate: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '',
      duration: 180, // 3 hours so far
      summary: {
        totalPours: 47,
        totalRevenue: 1420.50,
        averagePourAccuracy: 94.2,
        customersServed: 28,
        busyPeriods: ['8:00 PM - 9:00 PM', '10:00 PM - 11:00 PM'],
        topDrinks: [
          { name: 'Old Fashioned', quantity: 12, revenue: 180.00 },
          { name: 'Manhattan', quantity: 8, revenue: 120.00 },
          { name: 'Whiskey Neat', quantity: 6, revenue: 90.00 }
        ]
      },
      performance: {
        accuracyScore: 94.2,
        speedScore: 88.5,
        customerSatisfaction: 4.8,
        efficiencyRating: 91.3,
        improvementAreas: ['Pour consistency during rush'],
        achievements: ['Zero waste', 'Highest customer ratings'],
        comparison: {
          vsLastShift: 5.2,
          vsAverage: 8.1,
          ranking: 2
        }
      },
      violations: [
        {
          id: 'v1',
          type: 'overpour',
          severity: 'medium',
          description: 'Poured 2.1oz instead of 1.5oz Grey Goose',
          timestamp: '20 min ago',
          bottleId: 'b1',
          amount: 0.6,
          cost: 4.50,
          status: 'approved',
          managerResponse: 'Approved - Customer request'
        }
      ],
      approvals: [],
      financials: {
        grossRevenue: 1420.50,
        netRevenue: 1278.45,
        costOfGoods: 355.12,
        tips: 142.05,
        waste: 12.30,
        comps: 45.00,
        profitMargin: 64.5,
        revenuePerHour: 473.50,
        averageTicket: 50.73
      },
      status: 'active',
      generatedAt: new Date().toISOString()
    };

    setPendingApprovals(mockPendingApprovals);
    setManagerAlerts(mockManagerAlerts);
    setActiveShifts([mockActiveShift]);
  }, []);

  const approvePour = useCallback((approvalId: string, notes?: string) => {
    setPendingApprovals(prev => prev.map(approval => 
      approval.id === approvalId
        ? {
            ...approval,
            status: 'approved',
            approvedBy: 'Manager',
            approvalTime: new Date().toISOString(),
            managerNotes: notes
          }
        : approval
    ));

    // Remove from manager alerts
    setManagerAlerts(prev => prev.filter(alert => 
      !(alert.type === 'pour_approval' && alert.data?.id === approvalId)
    ));

    const approval = pendingApprovals.find(a => a.id === approvalId);
    toast({
      title: "Pour Approved",
      description: `${approval?.bottleName} pour approved for ${approval?.bartenderName}`,
    });
  }, [pendingApprovals, toast]);

  const denyPour = useCallback((approvalId: string, reason: string) => {
    setPendingApprovals(prev => prev.map(approval => 
      approval.id === approvalId
        ? {
            ...approval,
            status: 'denied',
            approvedBy: 'Manager',
            approvalTime: new Date().toISOString(),
            managerNotes: reason
          }
        : approval
    ));

    // Remove from manager alerts
    setManagerAlerts(prev => prev.filter(alert => 
      !(alert.type === 'pour_approval' && alert.data?.id === approvalId)
    ));

    const approval = pendingApprovals.find(a => a.id === approvalId);
    toast({
      title: "Pour Denied",
      description: `${approval?.bottleName} pour denied - ${reason}`,
      variant: "destructive"
    });
  }, [pendingApprovals, toast]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setManagerAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const generateShiftReport = useCallback((bartenderId: string): ShiftReport => {
    // In real implementation, this would compile actual shift data
    const mockReport: ShiftReport = {
      id: `shift-${Date.now()}`,
      bartenderId,
      bartenderName: 'Alex Rodriguez',
      shiftDate: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '02:00',
      duration: 480, // 8 hours
      summary: {
        totalPours: 94,
        totalRevenue: 2847.50,
        averagePourAccuracy: 94.2,
        customersServed: 56,
        busyPeriods: ['9:00 PM - 11:00 PM'],
        topDrinks: [
          { name: 'Old Fashioned', quantity: 24, revenue: 360.00 },
          { name: 'Martini', quantity: 18, revenue: 270.00 }
        ]
      },
      performance: {
        accuracyScore: 94.2,
        speedScore: 88.5,
        customerSatisfaction: 4.8,
        efficiencyRating: 91.3,
        improvementAreas: ['Consistency during peak hours'],
        achievements: ['Zero violations', 'Customer favorite'],
        comparison: {
          vsLastShift: 5.2,
          vsAverage: 8.1,
          ranking: 1
        }
      },
      violations: [],
      approvals: [],
      financials: {
        grossRevenue: 2847.50,
        netRevenue: 2562.75,
        costOfGoods: 711.88,
        tips: 284.75,
        waste: 23.50,
        comps: 95.00,
        profitMargin: 67.2,
        revenuePerHour: 355.94,
        averageTicket: 50.85
      },
      status: 'completed',
      generatedAt: new Date().toISOString()
    };

    setCompletedShifts(prev => [mockReport, ...prev]);
    return mockReport;
  }, []);

  const createPourApprovalRequest = useCallback((request: Omit<PourApproval, 'id' | 'timestamp' | 'status'>) => {
    const approval: PourApproval = {
      ...request,
      id: `pa-${Date.now()}`,
      timestamp: 'Just now',
      status: 'pending'
    };

    setPendingApprovals(prev => [approval, ...prev]);

    // Create manager alert
    const alert: ManagerAlert = {
      id: `alert-${Date.now()}`,
      type: 'pour_approval',
      severity: approval.urgency === 'high' ? 'high' : 'medium',
      title: 'Pour Approval Required',
      description: `${request.bartenderId} requesting ${request.requestedAmount}oz ${request.bottleName}`,
      bartenderId: request.bartenderId,
      data: approval,
      timestamp: 'Just now',
      requiresAction: true,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      acknowledged: false
    };

    setManagerAlerts(prev => [alert, ...prev]);

    toast({
      title: "Approval Request Sent",
      description: "Manager will review your pour request",
    });
  }, [toast]);

  return {
    activeShifts,
    completedShifts,
    pendingApprovals,
    managerAlerts,
    approvePour,
    denyPour,
    acknowledgeAlert,
    generateShiftReport,
    createPourApprovalRequest
  };
};