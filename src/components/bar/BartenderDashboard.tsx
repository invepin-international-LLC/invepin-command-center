import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Clock, Trophy } from "lucide-react";
import { Bartender } from "@/types/bar";

interface BartenderDashboardProps {
  bartenders: Bartender[];
  onClockIn: (bartenderId: string, method?: 'face_recognition' | 'manual', confidence?: number) => void;
  onClockOut: (bartenderId: string, method?: 'face_recognition' | 'manual', confidence?: number) => void;
}

export const BartenderDashboard = ({ bartenders, onClockIn, onClockOut }: BartenderDashboardProps) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-success';
    if (accuracy >= 85) return 'text-warning';
    return 'text-danger';
  };

  return (
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
          <div key={bartender.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-background/30 rounded-lg border border-border/50">
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
                  onClick={() => onClockOut(bartender.id)}
                >
                  Clock Out
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onClockIn(bartender.id)}
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
  );
};