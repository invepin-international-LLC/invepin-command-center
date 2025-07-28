import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Wine, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Trophy,
  DropletIcon,
  BarChart3,
  Target,
  Timer,
  Users,
  ShieldCheck
} from "lucide-react";

interface Bartender {
  id: string;
  name: string;
  isOnShift: boolean;
  shiftStart?: string;
  pourAccuracy: number;
  todayPours: number;
  avatar?: string;
}

interface Bottle {
  id: string;
  name: string;
  brand: string;
  level: number; // percentage
  lastPour: string;
  assignedBartender?: string;
  pourCount: number;
  isActive: boolean;
}

interface PourEvent {
  id: string;
  bottleId: string;
  bartenderId: string;
  amount: number; // ounces
  timestamp: string;
  accuracy: number; // percentage vs standard pour
}

export const BarManagement = () => {
  const { toast } = useToast();
  
  // Mock data - in real app this would come from your API
  const [bartenders, setBartenders] = useState<Bartender[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      isOnShift: true,
      shiftStart: '18:00',
      pourAccuracy: 94,
      todayPours: 47,
      avatar: '/placeholder.svg'
    },
    {
      id: '2', 
      name: 'Sarah Chen',
      isOnShift: true,
      shiftStart: '19:30',
      pourAccuracy: 98,
      todayPours: 23,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Mike Johnson', 
      isOnShift: false,
      shiftStart: undefined,
      pourAccuracy: 89,
      todayPours: 0,
      avatar: '/placeholder.svg'
    }
  ]);

  const [bottles, setBottles] = useState<Bottle[]>([
    {
      id: 'b1',
      name: 'Grey Goose Vodka',
      brand: 'Grey Goose',
      level: 73,
      lastPour: '2 min ago',
      assignedBartender: '1',
      pourCount: 12,
      isActive: true
    },
    {
      id: 'b2', 
      name: 'Macallan 18',
      brand: 'Macallan',
      level: 28,
      lastPour: '45 min ago', 
      assignedBartender: '2',
      pourCount: 8,
      isActive: true
    },
    {
      id: 'b3',
      name: 'Hendricks Gin',
      brand: 'Hendricks', 
      level: 91,
      lastPour: '3 hours ago',
      assignedBartender: '1',
      pourCount: 3,
      isActive: false
    }
  ]);

  const [recentPours, setRecentPours] = useState<PourEvent[]>([
    {
      id: 'p1',
      bottleId: 'b1',
      bartenderId: '1', 
      amount: 1.5,
      timestamp: '2 min ago',
      accuracy: 96
    },
    {
      id: 'p2',
      bottleId: 'b2',
      bartenderId: '2',
      amount: 2.0,
      timestamp: '45 min ago', 
      accuracy: 89
    }
  ]);

  const handleClockIn = (bartenderId: string) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: true, shiftStart: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    toast({
      title: "Shift Started",
      description: `${bartender?.name} is now on shift`,
    });
  };

  const handleClockOut = (bartenderId: string) => {
    setBartenders(prev => prev.map(b => 
      b.id === bartenderId 
        ? { ...b, isOnShift: false, shiftStart: undefined }
        : b
    ));
    
    const bartender = bartenders.find(b => b.id === bartenderId);
    toast({
      title: "Shift Ended", 
      description: `${bartender?.name} has clocked out`,
    });
  };

  const getBottleLevelColor = (level: number) => {
    if (level > 50) return 'text-success';
    if (level > 20) return 'text-warning';
    return 'text-danger';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-success';
    if (accuracy >= 85) return 'text-warning';
    return 'text-danger';
  };

  const activeBartenders = bartenders.filter(b => b.isOnShift);
  const totalPours = bartenders.reduce((sum, b) => sum + b.todayPours, 0);
  const avgAccuracy = bartenders.length > 0 
    ? Math.round(bartenders.reduce((sum, b) => sum + b.pourAccuracy, 0) / bartenders.length)
    : 0;
  const lowStockBottles = bottles.filter(b => b.level < 30).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bartenders</p>
                <p className="text-2xl font-bold">{activeBartenders.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Pours</p>
                <p className="text-2xl font-bold">{totalPours}</p>
              </div>
              <DropletIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className={`text-2xl font-bold ${getAccuracyColor(avgAccuracy)}`}>{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className={`text-2xl font-bold ${lowStockBottles > 0 ? 'text-danger' : 'text-success'}`}>
                  {lowStockBottles}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${lowStockBottles > 0 ? 'text-danger' : 'text-success'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bartender Management */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Bartender Dashboard
            </CardTitle>
            <CardDescription>Manage shifts and track performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bartenders.map((bartender) => (
              <div key={bartender.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={bartender.avatar} />
                    <AvatarFallback>{bartender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{bartender.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {bartender.isOnShift ? (
                        <>
                          <Clock className="h-3 w-3" />
                          Since {bartender.shiftStart}
                        </>
                      ) : (
                        <span>Off shift</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-warning" />
                      <span className={`text-sm font-medium ${getAccuracyColor(bartender.pourAccuracy)}`}>
                        {bartender.pourAccuracy}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{bartender.todayPours} pours</p>
                  </div>
                  {bartender.isOnShift ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleClockOut(bartender.id)}
                    >
                      Clock Out
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleClockIn(bartender.id)}
                      className="bg-gradient-primary"
                    >
                      Clock In
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottle Inventory */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5" />
              Active Bottles
            </CardTitle>
            <CardDescription>Real-time inventory tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bottles.map((bottle) => {
              const assignedBartender = bartenders.find(b => b.id === bottle.assignedBartender);
              return (
                <div key={bottle.id} className="p-3 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{bottle.name}</p>
                      <p className="text-sm text-muted-foreground">{bottle.brand}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={bottle.isActive ? "default" : "secondary"} className="mb-1">
                        {bottle.isActive ? "Active" : "Idle"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{bottle.pourCount} pours today</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Level</span>
                      <span className={`font-medium ${getBottleLevelColor(bottle.level)}`}>
                        {bottle.level}%
                      </span>
                    </div>
                    <Progress value={bottle.level} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last pour: {bottle.lastPour}</span>
                      {assignedBartender && (
                        <span>Assigned: {assignedBartender.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Pour Activity
          </CardTitle>
          <CardDescription>Live pour tracking and accuracy monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPours.map((pour) => {
              const bottle = bottles.find(b => b.id === pour.bottleId);
              const bartender = bartenders.find(b => b.id === pour.bartenderId);
              
              return (
                <div key={pour.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <DropletIcon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{bottle?.name}</p>
                      <p className="text-sm text-muted-foreground">by {bartender?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{pour.amount}oz</span>
                      <Badge 
                        variant={pour.accuracy >= 95 ? "default" : pour.accuracy >= 85 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {pour.accuracy}% accuracy
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{pour.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};