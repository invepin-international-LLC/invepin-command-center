export interface FinancialMetrics {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  estimatedLoss: number;
  preventedLoss: number;
  costSavings: number;
  profitMargin: number;
  revenueGrowth: number;
  topSellingProducts: ProductSale[];
  hourlyRevenue: HourlyData[];
}

export interface ProductSale {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  margin: number;
  growth: number;
}

export interface HourlyData {
  hour: string;
  revenue: number;
  pours: number;
  efficiency: number;
}

export interface StaffPerformance {
  bartenderId: string;
  name: string;
  hoursWorked: number;
  poursServed: number;
  accuracy: number;
  revenue: number;
  efficiency: number;
  customerRating: number;
  incidents: number;
}

export interface OperationalMetrics {
  totalPours: number;
  averageAccuracy: number;
  deviceUptime: number;
  responseTime: number;
  alertResolutionRate: number;
  staffUtilization: number;
  peakHours: string[];
  bottleUtilization: number;
}

export interface SystemHealth {
  connectedDevices: number;
  totalDevices: number;
  batteryLevels: DeviceBattery[];
  networkStatus: 'excellent' | 'good' | 'poor' | 'offline';
  dataQuality: number;
  lastBackup: string;
  uptime: number;
}

export interface DeviceBattery {
  deviceId: string;
  name: string;
  level: number;
  status: 'good' | 'low' | 'critical';
}

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ManagerInsights {
  financial: FinancialMetrics;
  staff: StaffPerformance[];
  operational: OperationalMetrics;
  systemHealth: SystemHealth;
  alerts: Alert[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: 'cost_saving' | 'performance' | 'security' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}