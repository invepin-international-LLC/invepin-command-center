import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  User, 
  Target, 
  DollarSign, 
  TrendingUp,
  DropletIcon,
  Trophy,
  LogOut
} from "lucide-react";
import { MobileBartenderSession } from "@/types/mobile";

interface MobileBartenderDashboardProps {
  session: MobileBartenderSession | null;
  onManualClockOut: () => void;
}

export const MobileBartenderDashboard = ({ session, onManualClockOut }: MobileBartenderDashboardProps) => {
  if (!session) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Clocked In</h3>
          <p className="text-muted-foreground">Use face recognition or manual login to start your shift</p>
        </CardContent>
      </Card>
    );
  }

  const shiftDuration = new Date().getTime() - new Date(session.clockedInAt).getTime();
  const hoursWorked = Math.floor(shiftDuration / (1000 * 60 * 60));
  const minutesWorked = Math.floor((shiftDuration % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <Card className="bg-gradient-primary text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-white/20 text-white">
                {session.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Welcome, {session.name}!</h2>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span>Shift: {hoursWorked}h {minutesWorked}m</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onManualClockOut}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Clock Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pours Today</p>
                <p className="text-2xl font-bold">{session.currentShift.pours}</p>
              </div>
              <DropletIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-success">{session.currentShift.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${session.currentShift.revenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span className="text-lg font-bold">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Progress */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Today's Performance</CardTitle>
          <CardDescription>Your accuracy and efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pour Accuracy</span>
              <span className="text-sm text-success">{session.currentShift.accuracy}%</span>
            </div>
            <Progress value={session.currentShift.accuracy} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Goal</span>
              <span className="text-sm">{session.currentShift.pours}/50 pours</span>
            </div>
            <Progress value={(session.currentShift.pours / 50) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Revenue Target</span>
              <span className="text-sm">${session.currentShift.revenue}/800</span>
            </div>
            <Progress value={(session.currentShift.revenue / 800) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex-col">
            <DropletIcon className="h-6 w-6 mb-1" />
            <span className="text-sm">Pour Log</span>
          </Button>
          
          <Button variant="outline" className="h-16 flex-col">
            <Target className="h-6 w-6 mb-1" />
            <span className="text-sm">Training</span>
          </Button>
          
          <Button variant="outline" className="h-16 flex-col">
            <TrendingUp className="h-6 w-6 mb-1" />
            <span className="text-sm">My Stats</span>
          </Button>
          
          <Button variant="outline" className="h-16 flex-col">
            <User className="h-6 w-6 mb-1" />
            <span className="text-sm">Profile</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};