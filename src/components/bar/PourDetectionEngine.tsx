import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  DropletIcon, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Timer,
  Trophy,
  Activity,
  Zap,
  BarChart3
} from "lucide-react";

interface SensorData {
  bottleId: string;
  angle: number;
  duration: number;
  isPouring: boolean;
  timestamp: string;
  rssi: number;
}

interface PourEvent {
  id: string;
  bottleId: string;
  bartenderId: string;
  startTime: string;
  endTime: string;
  duration: number; // seconds
  angle: number; // degrees
  calculatedAmount: number; // ounces
  targetAmount: number; // standard pour
  accuracy: number; // percentage
  status: 'perfect' | 'good' | 'over' | 'under';
}

interface PourAnalytics {
  avgAccuracy: number;
  totalPours: number;
  perfectPours: number;
  overPours: number;
  underPours: number;
  wasteAmount: number; // ounces
}

export const PourDetectionEngine = () => {
  const { toast } = useToast();
  
  // Real-time sensor data simulation
  const [activeSensors, setActiveSensors] = useState<SensorData[]>([]);
  const [recentPours, setRecentPours] = useState<PourEvent[]>([]);
  const [analytics, setAnalytics] = useState<PourAnalytics>({
    avgAccuracy: 0,
    totalPours: 0,
    perfectPours: 0,
    overPours: 0,
    underPours: 0,
    wasteAmount: 0
  });
  
  // Standard pour amounts by bottle type
  const standardPours = {
    'vodka': 1.5,
    'whiskey': 1.5,
    'gin': 1.5,
    'rum': 1.5,
    'wine': 5.0,
    'beer': 12.0
  };

  // Pour calculation algorithm
  const calculatePourAmount = (angle: number, duration: number): number => {
    // Physics-based calculation: flow rate based on angle and time
    // This is a simplified model - real implementation would be calibrated per bottle
    const flowRate = Math.sin(Math.abs(angle) * Math.PI / 180) * 0.5; // oz/second
    const amount = flowRate * duration;
    return Math.round(amount * 100) / 100; // Round to 2 decimal places
  };

  const calculateAccuracy = (actual: number, target: number): number => {
    const variance = Math.abs(actual - target) / target;
    const accuracy = Math.max(0, 100 - (variance * 100));
    return Math.round(accuracy);
  };

  const getPourStatus = (accuracy: number): 'perfect' | 'good' | 'over' | 'under' => {
    if (accuracy >= 95) return 'perfect';
    if (accuracy >= 85) return 'good';
    // Could add logic to detect over vs under pours
    return accuracy < 85 ? 'under' : 'over';
  };

  // Simulate real-time sensor data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random sensor activity
      if (Math.random() < 0.1) { // 10% chance of new pour event
        const bottleTypes = ['vodka', 'whiskey', 'gin', 'rum'];
        const randomBottle = bottleTypes[Math.floor(Math.random() * bottleTypes.length)];
        const randomAngle = -45 + (Math.random() * 30); // -45 to -15 degrees
        const randomDuration = 2 + (Math.random() * 4); // 2-6 seconds
        
        const newSensor: SensorData = {
          bottleId: `bottle-${randomBottle}-1`,
          angle: randomAngle,
          duration: randomDuration,
          isPouring: true,
          timestamp: new Date().toISOString(),
          rssi: -40 - (Math.random() * 20) // -40 to -60 dBm
        };

        // Process the pour
        processPourEvent(newSensor);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const processPourEvent = useCallback((sensorData: SensorData) => {
    const calculatedAmount = calculatePourAmount(sensorData.angle, sensorData.duration);
    const bottleType = sensorData.bottleId.split('-')[1] as keyof typeof standardPours;
    const targetAmount = standardPours[bottleType] || 1.5;
    const accuracy = calculateAccuracy(calculatedAmount, targetAmount);
    const status = getPourStatus(accuracy);

    const newPour: PourEvent = {
      id: `pour-${Date.now()}`,
      bottleId: sensorData.bottleId,
      bartenderId: 'bartender-1', // In real app, get from active bartender
      startTime: new Date(Date.now() - sensorData.duration * 1000).toISOString(),
      endTime: sensorData.timestamp,
      duration: sensorData.duration,
      angle: sensorData.angle,
      calculatedAmount,
      targetAmount,
      accuracy,
      status
    };

    setRecentPours(prev => [newPour, ...prev.slice(0, 9)]); // Keep last 10 pours

    // Update analytics
    setAnalytics(prev => {
      const newTotalPours = prev.totalPours + 1;
      const newPerfectPours = prev.perfectPours + (status === 'perfect' ? 1 : 0);
      const newOverPours = prev.overPours + (status === 'over' ? 1 : 0);
      const newUnderPours = prev.underPours + (status === 'under' ? 1 : 0);
      const wasteAmount = calculatedAmount > targetAmount ? calculatedAmount - targetAmount : 0;
      
      return {
        avgAccuracy: Math.round(((prev.avgAccuracy * prev.totalPours) + accuracy) / newTotalPours),
        totalPours: newTotalPours,
        perfectPours: newPerfectPours,
        overPours: newOverPours,
        underPours: newUnderPours,
        wasteAmount: prev.wasteAmount + wasteAmount
      };
    });

    // Show toast notification
    toast({
      title: "Pour Detected",
      description: `${calculatedAmount}oz poured (${accuracy}% accuracy)`,
      variant: status === 'perfect' ? "default" : "destructive"
    });
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'text-success';
      case 'good': return 'text-primary';
      case 'over': return 'text-warning';
      case 'under': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'perfect': return 'default';
      case 'good': return 'secondary';
      case 'over': return 'destructive';
      case 'under': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold text-success">{analytics.avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pours</p>
                <p className="text-2xl font-bold">{analytics.totalPours}</p>
              </div>
              <DropletIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Perfect Pours</p>
                <p className="text-2xl font-bold text-success">{analytics.perfectPours}</p>
              </div>
              <Trophy className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Over Pours</p>
                <p className="text-2xl font-bold text-warning">{analytics.overPours}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waste (oz)</p>
                <p className="text-2xl font-bold text-danger">{analytics.wasteAmount.toFixed(1)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Pour Detection */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Pour Detection
            </CardTitle>
            <CardDescription>Real-time sensor monitoring and pour analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPours.length > 0 ? (
              recentPours.slice(0, 5).map((pour) => (
                <div key={pour.id} className="p-3 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DropletIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{pour.bottleId.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(pour.status)}
                      className="text-xs"
                    >
                      {pour.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount Poured</p>
                      <p className="font-medium">{pour.calculatedAmount}oz</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-medium">{pour.targetAmount}oz</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className={`font-medium ${getStatusColor(pour.status)}`}>
                        {pour.accuracy}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{pour.duration.toFixed(1)}s</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Pour Accuracy</span>
                      <span>{pour.accuracy}%</span>
                    </div>
                    <Progress value={pour.accuracy} className="h-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for pour activity...</p>
                <p className="text-xs">Sensors are monitoring for bottle movement</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pour Analytics */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pour Performance Analytics
            </CardTitle>
            <CardDescription>Detailed accuracy and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Accuracy Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium">Pour Quality Distribution</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-sm">Perfect (95%+)</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.perfectPours}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">Good (85-94%)</span>
                  </div>
                  <span className="text-sm font-medium">
                    {analytics.totalPours - analytics.perfectPours - analytics.overPours - analytics.underPours}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="text-sm">Over Pour</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.overPours}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <span className="text-sm">Under Pour</span>
                  </div>
                  <span className="text-sm font-medium">{analytics.underPours}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium mb-3">Key Metrics</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-2 bg-background/30 rounded">
                  <p className="text-muted-foreground">Consistency Score</p>
                  <p className="font-medium text-lg">
                    {analytics.totalPours > 0 ? Math.round((analytics.perfectPours / analytics.totalPours) * 100) : 0}%
                  </p>
                </div>
                
                <div className="p-2 bg-background/30 rounded">
                  <p className="text-muted-foreground">Waste Reduction</p>
                  <p className="font-medium text-lg text-success">
                    {analytics.wasteAmount < 2 ? 'Excellent' : analytics.wasteAmount < 5 ? 'Good' : 'Needs Work'}
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Status */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sensor Status</span>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};