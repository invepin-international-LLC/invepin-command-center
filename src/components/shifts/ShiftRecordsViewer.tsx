import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useShiftRecords } from '@/hooks/useShiftRecords';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface ShiftRecordsViewerProps {
  organizationId: string;
  userId?: string;
}

export const ShiftRecordsViewer = ({ organizationId, userId }: ShiftRecordsViewerProps) => {
  const { getShiftRecords, getUserShiftRecords, calculateTotalHours, isLoading } = useShiftRecords();
  const [shifts, setShifts] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const loadShifts = async () => {
      const data = userId 
        ? await getUserShiftRecords(userId)
        : await getShiftRecords(organizationId);
      setShifts(data);
      setTotalHours(calculateTotalHours(data));
    };
    loadShifts();
  }, [organizationId, userId, getShiftRecords, getUserShiftRecords, calculateTotalHours]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'In Progress';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shifts.filter(s => s.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shift History</CardTitle>
          <CardDescription>Complete record of all clock in/out events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading shifts...</div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No shifts recorded yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">
                      {shift.profiles?.full_name || 'Unknown'}
                      <div className="text-sm text-muted-foreground">
                        {shift.profiles?.employee_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(shift.clock_in_time), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell>
                      {shift.clock_out_time 
                        ? format(new Date(shift.clock_out_time), 'MMM d, h:mm a')
                        : '-'}
                    </TableCell>
                    <TableCell>{formatDuration(shift.duration_minutes)}</TableCell>
                    <TableCell>
                      <Badge variant={shift.is_active ? 'default' : 'secondary'}>
                        {shift.is_active ? 'Active' : 'Completed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
