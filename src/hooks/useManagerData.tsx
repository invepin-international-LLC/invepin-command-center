import { useState, useEffect } from 'react';
import { ManagerInsights } from '@/types/manager';

export const useManagerData = () => {
  const [insights, setInsights] = useState<ManagerInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would come from your analytics API
    const mockInsights: ManagerInsights = {
      financial: {
        dailyRevenue: 2847.50,
        weeklyRevenue: 18965.00,
        monthlyRevenue: 78542.00,
        estimatedLoss: 245.30,
        preventedLoss: 1247.80,
        costSavings: 892.50,
        profitMargin: 68.5,
        revenueGrowth: 12.3,
        topSellingProducts: [
          { id: '1', name: 'Grey Goose Vodka', quantity: 45, revenue: 675.00, margin: 72, growth: 8.5 },
          { id: '2', name: 'Macallan 18', quantity: 12, revenue: 720.00, margin: 85, growth: 15.2 },
          { id: '3', name: 'Hendricks Gin', quantity: 28, revenue: 420.00, margin: 65, growth: -3.1 }
        ],
        hourlyRevenue: [
          { hour: '6PM', revenue: 180, pours: 12, efficiency: 88 },
          { hour: '7PM', revenue: 285, pours: 19, efficiency: 92 },
          { hour: '8PM', revenue: 425, pours: 28, efficiency: 95 },
          { hour: '9PM', revenue: 520, pours: 34, efficiency: 89 },
          { hour: '10PM', revenue: 610, pours: 41, efficiency: 93 },
          { hour: '11PM', revenue: 485, pours: 32, efficiency: 86 },
          { hour: '12AM', revenue: 342, pours: 23, efficiency: 84 }
        ]
      },
      staff: [
        {
          bartenderId: '1',
          name: 'Alex Rodriguez',
          hoursWorked: 8.5,
          poursServed: 94,
          accuracy: 94.2,
          revenue: 1420.50,
          efficiency: 92,
          customerRating: 4.8,
          incidents: 0
        },
        {
          bartenderId: '2',
          name: 'Sarah Chen',
          hoursWorked: 7.0,
          poursServed: 67,
          accuracy: 97.8,
          revenue: 1185.30,
          efficiency: 96,
          customerRating: 4.9,
          incidents: 0
        },
        {
          bartenderId: '3',
          name: 'Mike Johnson',
          hoursWorked: 0,
          poursServed: 0,
          accuracy: 89.1,
          revenue: 0,
          efficiency: 0,
          customerRating: 4.6,
          incidents: 1
        }
      ],
      operational: {
        totalPours: 161,
        averageAccuracy: 94.8,
        deviceUptime: 98.5,
        responseTime: 2.1,
        alertResolutionRate: 87.5,
        staffUtilization: 85.3,
        peakHours: ['8PM-10PM', '9PM-11PM'],
        bottleUtilization: 73.2
      },
      systemHealth: {
        connectedDevices: 8,
        totalDevices: 10,
        batteryLevels: [
          { deviceId: 'ble-001', name: 'PourSpout Pro #1', level: 87, status: 'good' },
          { deviceId: 'ble-002', name: 'Smart Scale #1', level: 23, status: 'low' },
          { deviceId: 'ble-003', name: 'TempSensor #1', level: 94, status: 'good' }
        ],
        networkStatus: 'excellent',
        dataQuality: 96.2,
        lastBackup: '2 hours ago',
        uptime: 99.8
      },
      alerts: [
        { id: '1', type: 'overpour', severity: 'medium', count: 3, trend: 'down' },
        { id: '2', type: 'theft', severity: 'high', count: 1, trend: 'stable' },
        { id: '3', type: 'device_offline', severity: 'low', count: 2, trend: 'up' }
      ],
      recommendations: [
        {
          id: '1',
          type: 'cost_saving',
          priority: 'high',
          title: 'Optimize Pour Standards',
          description: 'Reduce average pour by 0.2oz to save $145/week',
          impact: '$7,540 annual savings',
          effort: 'low'
        },
        {
          id: '2',
          type: 'performance',
          priority: 'medium',
          title: 'Staff Training for Mike',
          description: 'Additional training could improve accuracy from 89% to 93%',
          impact: '15% less waste',
          effort: 'medium'
        },
        {
          id: '3',
          type: 'maintenance',
          priority: 'medium',
          title: 'Replace Low Battery Devices',
          description: 'Smart Scale #1 battery at 23% - replace within 2 days',
          impact: 'Prevent downtime',
          effort: 'low'
        }
      ]
    };

    // Simulate loading delay
    setTimeout(() => {
      setInsights(mockInsights);
      setLoading(false);
    }, 1500);
  }, []);

  const refreshData = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    insights,
    loading,
    refreshData
  };
};