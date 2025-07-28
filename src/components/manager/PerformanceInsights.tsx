import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Target, 
  Clock, 
  Star,
  AlertTriangle,
  Trophy,
  Activity
} from "lucide-react";
import { StaffPerformance, OperationalMetrics } from "@/types/manager";

interface PerformanceInsightsProps {
  staff: StaffPerformance[];
  operational: OperationalMetrics;
}

export const PerformanceInsights = ({ staff, operational }: PerformanceInsightsProps) => {
  const getPerformanceColor = (value: number, type: 'accuracy' | 'efficiency' | 'rating') => {
    switch (type) {
      case 'accuracy':
        if (value >= 95) return 'text-success';
        if (value >= 90) return 'text-warning';
        return 'text-danger';
      case 'efficiency':
        if (value >= 90) return 'text-success';
        if (value >= 80) return 'text-warning';
        return 'text-danger';
      case 'rating':
        if (value >= 4.8) return 'text-success';
        if (value >= 4.5) return 'text-warning';
        return 'text-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPerformanceBadge = (value: number, type: 'accuracy' | 'efficiency') => {
    const threshold = type === 'accuracy' ? 95 : 90;
    return value >= threshold ? 'default' : value >= (threshold - 10) ? 'secondary' : 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Operational Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff Utilization</p>
                <p className="text-2xl font-bold">{operational.staffUtilization}%</p>
                <Progress value={operational.staffUtilization} className="h-2 mt-1" />
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(operational.averageAccuracy, 'accuracy')}`}>
                  {operational.averageAccuracy}%
                </p>
                <Progress value={operational.averageAccuracy} className="h-2 mt-1" />
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{operational.responseTime}m</p>
                <p className="text-xs text-muted-foreground mt-1">Alert resolution</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Device Uptime</p>
                <p className="text-2xl font-bold text-success">{operational.deviceUptime}%</p>
                <Progress value={operational.deviceUptime} className="h-2 mt-1" />
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Staff Performance
          </CardTitle>
          <CardDescription>Individual bartender metrics and rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member, index) => (
              <div key={member.bartenderId} className="p-4 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg`} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{member.name}</h3>
                        {index === 0 && <Trophy className="h-4 w-4 text-warning" />}
                        {member.incidents > 0 && <AlertTriangle className="h-4 w-4 text-danger" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.hoursWorked}h worked • {member.poursServed} pours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">${member.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning" />
                        <span className={`text-sm ${getPerformanceColor(member.customerRating, 'rating')}`}>
                          {member.customerRating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(member.accuracy, 'accuracy')}`}>
                        {member.accuracy}%
                      </span>
                    </div>
                    <Progress value={member.accuracy} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Efficiency</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(member.efficiency, 'efficiency')}`}>
                        {member.efficiency}%
                      </span>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                  </div>

                  <div className="flex items-center justify-center">
                    <Badge variant={getPerformanceBadge(member.accuracy, 'accuracy')}>
                      {member.accuracy >= 95 ? 'Excellent' : member.accuracy >= 90 ? 'Good' : 'Needs Training'}
                    </Badge>
                  </div>
                </div>

                {member.incidents > 0 && (
                  <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/20">
                    <p className="text-sm text-red-500">
                      ⚠️ {member.incidents} incident{member.incidents > 1 ? 's' : ''} reported
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Peak Performance Hours</CardTitle>
          <CardDescription>Busiest and most efficient periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Peak Hours</h4>
              <div className="space-y-2">
                {operational.peakHours.map((hour) => (
                  <Badge key={hour} variant="default" className="mr-2">
                    {hour}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Utilization Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bottle Utilization</span>
                  <span className="font-medium">{operational.bottleUtilization}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Alert Resolution Rate</span>
                  <span className="font-medium">{operational.alertResolutionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};