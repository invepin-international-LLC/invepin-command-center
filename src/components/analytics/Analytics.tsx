import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Filter,
  AlertTriangle,
  Shield,
  Battery,
  Activity,
  DollarSign,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for analytics
const inventoryTrends = [
  { date: '2024-01-01', tracked: 245, alerts: 12, theft: 2, value: 125000 },
  { date: '2024-01-02', tracked: 250, alerts: 8, theft: 1, value: 127500 },
  { date: '2024-01-03', tracked: 255, alerts: 15, theft: 3, value: 130000 },
  { date: '2024-01-04', tracked: 248, alerts: 6, theft: 0, value: 126000 },
  { date: '2024-01-05', tracked: 252, alerts: 10, theft: 2, value: 128000 },
  { date: '2024-01-06', tracked: 260, alerts: 9, theft: 1, value: 132000 },
  { date: '2024-01-07', tracked: 265, alerts: 7, theft: 0, value: 135000 }
];

const devicePerformance = [
  { name: 'Zone A', devices: 12, uptime: 98.5, battery: 85, alerts: 3 },
  { name: 'Zone B', devices: 8, uptime: 99.2, battery: 92, alerts: 1 },
  { name: 'Zone C', devices: 15, uptime: 97.8, battery: 78, alerts: 5 },
  { name: 'Zone D', devices: 6, uptime: 99.8, battery: 95, alerts: 0 },
  { name: 'Zone E', devices: 10, uptime: 98.9, battery: 88, alerts: 2 }
];

const securityEvents = [
  { time: '00:00', movement: 5, alerts: 1, theft: 0 },
  { time: '04:00', movement: 2, alerts: 0, theft: 0 },
  { time: '08:00', movement: 25, alerts: 3, theft: 1 },
  { time: '12:00', movement: 45, alerts: 5, theft: 0 },
  { time: '16:00', movement: 38, alerts: 4, theft: 2 },
  { time: '20:00', movement: 30, alerts: 2, theft: 1 },
];

const categoryBreakdown = [
  { name: 'Electronics', value: 35, color: '#3b82f6' },
  { name: 'Jewelry', value: 25, color: '#f59e0b' },
  { name: 'Fashion', value: 20, color: '#10b981' },
  { name: 'Accessories', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 8, color: '#6b7280' }
];

const riskAssessment = [
  { category: 'High Risk', items: 45, value: '$125,000', trend: 'up' },
  { category: 'Medium Risk', items: 128, value: '$85,000', trend: 'down' },
  { category: 'Low Risk', items: 234, value: '$45,000', trend: 'stable' }
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

const MetricCard = ({ title, value, change, trend, icon: Icon }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change}</span>
            </div>
          </div>
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const { toast } = useToast();

  const handleExport = (type: 'pdf' | 'csv' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Generating ${type.toUpperCase()} report...`,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Analytics report downloaded as ${type.toUpperCase()}`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Comprehensive insights and performance metrics</CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Value Tracked"
          value="$1.2M"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Devices"
          value="127"
          change="+3.2%"
          trend="up"
          icon={Package}
        />
        <MetricCard
          title="Security Alerts"
          value="23"
          change="-15.3%"
          trend="down"
          icon={AlertTriangle}
        />
        <MetricCard
          title="System Uptime"
          value="99.2%"
          change="+0.5%"
          trend="up"
          icon={Shield}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Inventory Trends */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Trends</CardTitle>
                <CardDescription>Tracked items and alerts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={inventoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="tracked" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                      name="Tracked Items"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="alerts" 
                      stackId="2"
                      stroke="hsl(var(--warning))" 
                      fill="hsl(var(--warning))"
                      fillOpacity={0.6}
                      name="Alerts"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
                <CardDescription>Tracked items by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
              <CardDescription>Items categorized by security risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {riskAssessment.map((risk, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{risk.category}</h3>
                      <Badge variant={
                        risk.category === 'High Risk' ? 'destructive' :
                        risk.category === 'Medium Risk' ? 'default' : 'secondary'
                      }>
                        {risk.trend === 'up' ? '↗' : risk.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{risk.items}</p>
                    <p className="text-sm text-muted-foreground">items</p>
                    <p className="text-lg font-medium text-primary mt-2">{risk.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Device Performance */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Device Performance by Zone</CardTitle>
                <CardDescription>Uptime and battery status across zones</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={devicePerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="uptime" fill="hsl(var(--success))" name="Uptime %" />
                    <Bar dataKey="battery" fill="hsl(var(--warning))" name="Battery %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Battery Health */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Battery Health Trends</CardTitle>
                <CardDescription>Average battery levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={inventoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tracked" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))' }}
                      name="Avg Battery %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4 text-center">
                <Battery className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Avg Battery</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">99.2%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">2.3s</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">Active Devices</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Security Events Timeline</CardTitle>
              <CardDescription>Movement and alert patterns throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={securityEvents}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="movement" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Movement Events"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="alerts" 
                    stackId="2"
                    stroke="hsl(var(--warning))" 
                    fill="hsl(var(--warning))"
                    fillOpacity={0.8}
                    name="Security Alerts"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="theft" 
                    stackId="3"
                    stroke="hsl(var(--danger))" 
                    fill="hsl(var(--danger))"
                    fillOpacity={0.9}
                    name="Theft Incidents"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Interactive Heatmap */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Interactive Activity Heatmap</CardTitle>
              <CardDescription>Real-time visualization of security events and device activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Heatmap Grid */}
                <div className="grid grid-cols-12 gap-1 p-4 bg-muted/20 rounded-lg">
                  {Array.from({ length: 144 }, (_, i) => {
                    const intensity = Math.random();
                    const getHeatColor = (intensity: number) => {
                      if (intensity > 0.8) return 'bg-destructive/80 border-destructive/20';
                      if (intensity > 0.6) return 'bg-warning/70 border-warning/20';
                      if (intensity > 0.4) return 'bg-accent/60 border-accent/20';
                      if (intensity > 0.2) return 'bg-success/50 border-success/20';
                      return 'bg-primary/30 border-primary/20';
                    };
                    
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg border ${getHeatColor(intensity)}`}
                        title={`Zone ${Math.floor(i / 12) + 1}-${(i % 12) + 1}: ${(intensity * 100).toFixed(0)}% activity`}
                      />
                    );
                  })}
                </div>
                
                {/* Heatmap Legend */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Activity Level:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary/30 border border-primary/20 rounded-sm"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-success/50 border border-success/20 rounded-sm"></div>
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-accent/60 border border-accent/20 rounded-sm"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-warning/70 border border-warning/20 rounded-sm"></div>
                      <span>Very High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-destructive/80 border border-destructive/20 rounded-sm"></div>
                      <span>Critical</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Heatmap Controls */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Select defaultValue="activity">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity Level</SelectItem>
                      <SelectItem value="alerts">Security Alerts</SelectItem>
                      <SelectItem value="battery">Battery Health</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter Zones
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Heatmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Predictive Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-medium">High Risk Prediction</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Zone C shows 23% increase in alerts. Consider additional security measures.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="h-4 w-4 text-danger" />
                    <span className="font-medium">Maintenance Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    5 devices will need battery replacement within 7 days.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-medium">Performance Improvement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    System efficiency increased by 15% after recent optimizations.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
                <CardDescription>Actionable suggestions for optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border rounded-lg p-3">
                  <h4 className="font-medium mb-2">Device Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Redistribute 3 devices from Zone D to Zone C for better coverage.
                  </p>
                  <Button size="sm" className="mt-2 bg-gradient-primary">
                    Apply Suggestion
                  </Button>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <h4 className="font-medium mb-2">Alert Reduction</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust sensitivity settings to reduce false positives by 30%.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Configure Settings
                  </Button>
                </div>
                
                <div className="border border-border rounded-lg p-3">
                  <h4 className="font-medium mb-2">Cost Savings</h4>
                  <p className="text-sm text-muted-foreground">
                    Power management optimization could save $1,200/month.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};