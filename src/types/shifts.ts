export interface ShiftReport {
  id: string;
  bartenderId: string;
  bartenderName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  summary: ShiftSummary;
  performance: ShiftPerformance;
  violations: ShiftViolation[];
  approvals: PourApproval[];
  financials: ShiftFinancials;
  status: 'active' | 'completed' | 'reviewed';
  managerNotes?: string;
  generatedAt: string;
}

export interface ShiftSummary {
  totalPours: number;
  totalRevenue: number;
  averagePourAccuracy: number;
  customersServed: number;
  busyPeriods: string[];
  topDrinks: { name: string; quantity: number; revenue: number }[];
}

export interface ShiftPerformance {
  accuracyScore: number;
  speedScore: number;
  customerSatisfaction: number;
  efficiencyRating: number;
  improvementAreas: string[];
  achievements: string[];
  comparison: {
    vsLastShift: number;
    vsAverage: number;
    ranking: number; // among all bartenders
  };
}

export interface ShiftViolation {
  id: string;
  type: 'overpour' | 'underpour' | 'unauthorized_pour' | 'waste' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  bottleId: string;
  amount: number;
  cost: number;
  status: 'pending' | 'approved' | 'denied' | 'resolved';
  managerResponse?: string;
}

export interface PourApproval {
  id: string;
  bartenderId: string;
  bartenderName: string;
  bottleId: string;
  bottleName: string;
  requestedAmount: number;
  standardAmount: number;
  reason: string;
  customerRequest?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string;
  approvalTime?: string;
  managerNotes?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface ShiftFinancials {
  grossRevenue: number;
  netRevenue: number;
  costOfGoods: number;
  tips: number;
  waste: number;
  comps: number;
  profitMargin: number;
  revenuePerHour: number;
  averageTicket: number;
}

export interface ManagerAlert {
  id: string;
  type: 'pour_approval' | 'shift_violation' | 'performance_issue' | 'inventory_critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  bartenderId?: string;
  bartenderName?: string;
  data: any;
  timestamp: string;
  requiresAction: boolean;
  expiresAt?: string;
  acknowledged: boolean;
  resolvedAt?: string;
}