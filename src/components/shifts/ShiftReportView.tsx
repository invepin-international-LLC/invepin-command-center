import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  DollarSign, 
  Target, 
  TrendingUp,
  Users,
  Trophy,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { ShiftReport } from "@/types/shifts";

interface ShiftReportViewProps {
  shift: ShiftReport;
}

export const ShiftReportView = ({ shift }: ShiftReportViewProps) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-danger';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Shift Report - {shift.bartenderName}
              </CardTitle>
              <CardDescription>
                {shift.shiftDate} • {shift.startTime} - {shift.endTime || 'Active'} • {formatDuration(shift.duration)}
              </CardDescription>
            </div>
            <Badge variant={shift.status === 'active' ? 'default' : 'secondary'}>
              {shift.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${shift.financials.grossRevenue.toLocaleString()}</p>
                <p className="text-xs text-success">+{shift.performance.comparison.vsLastShift}% vs last</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pour Accuracy</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(shift.summary.averagePourAccuracy)}`}>
                  {shift.summary.averagePourAccuracy}%
                </p>
                <p className="text-xs text-muted-foreground">{shift.summary.totalPours} pours</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers Served</p>
                <p className="text-2xl font-bold">{shift.summary.customersServed}</p>
                <p className="text-xs text-muted-foreground">${shift.financials.averageTicket.toFixed(2)} avg ticket</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Rating</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(shift.performance.efficiencyRating)}`}>
                  {shift.performance.efficiencyRating}%
                </p>
                <p className="text-xs text-muted-foreground">Rank #{shift.performance.comparison.ranking}</p>
              </div>
              <Trophy className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Detailed performance metrics and comparisons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Performance Scores */}
            <div className="space-y-4">
              <h3 className="font-medium">Performance Scores</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Accuracy Score</span>
                    <span className={`font-medium ${getPerformanceColor(shift.performance.accuracyScore)}`}>
                      {shift.performance.accuracyScore}%
                    </span>
                  </div>
                  <Progress value={shift.performance.accuracyScore} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Speed Score</span>
                    <span className={`font-medium ${getPerformanceColor(shift.performance.speedScore)}`}>
                      {shift.performance.speedScore}%
                    </span>
                  </div>
                  <Progress value={shift.performance.speedScore} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium text-success">{shift.performance.customerSatisfaction}/5.0</span>
                  </div>
                  <Progress value={shift.performance.customerSatisfaction * 20} className="h-2" />
                </div>
              </div>
            </div>

            {/* Achievements & Areas for Improvement */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-success mb-2">Achievements</h3>
                <div className="space-y-1">
                  {shift.performance.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Trophy className="h-3 w-3 text-warning" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {shift.performance.improvementAreas.length > 0 && (
                <div>
                  <h3 className="font-medium text-orange-500 mb-2">Areas for Improvement</h3>
                  <div className="space-y-1">
                    {shift.performance.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Gross Revenue</p>
              <p className="text-xl font-bold">${shift.financials.grossRevenue.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Net Revenue</p>
              <p className="text-xl font-bold text-success">${shift.financials.netRevenue.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Cost of Goods</p>
              <p className="text-xl font-bold text-orange-500">${shift.financials.costOfGoods.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="text-xl font-bold text-success">{shift.financials.profitMargin.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-2 bg-background/20 rounded">
              <p className="text-xs text-muted-foreground">Tips</p>
              <p className="font-medium">${shift.financials.tips.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-2 bg-background/20 rounded">
              <p className="text-xs text-muted-foreground">Waste</p>
              <p className="font-medium text-orange-500">${shift.financials.waste.toFixed(2)}</p>
            </div>
            
            <div className="text-center p-2 bg-background/20 rounded">
              <p className="text-xs text-muted-foreground">Comps</p>
              <p className="font-medium">${shift.financials.comps.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Drinks */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Performing Drinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shift.summary.topDrinks.map((drink, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    #{index + 1}
                  </div>
                  <span className="font-medium">{drink.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">${drink.revenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{drink.quantity} sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violations (if any) */}
      {shift.violations.length > 0 && (
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Violations & Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shift.violations.map((violation) => (
                <div key={violation.id} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{violation.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {violation.timestamp} • Cost: ${violation.cost.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant={violation.status === 'approved' ? 'default' : 'destructive'}>
                      {violation.status}
                    </Badge>
                  </div>
                  {violation.managerResponse && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      Manager: {violation.managerResponse}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};