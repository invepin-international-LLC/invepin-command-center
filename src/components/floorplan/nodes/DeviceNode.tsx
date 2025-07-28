import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Battery, 
  Signal, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface DeviceNodeData {
  id: string;
  name: string;
  battery: number;
  status: 'connected' | 'disconnected' | 'connecting';
  rssi: number;
  attachedItem?: string;
}

interface DeviceNodeProps {
  data: DeviceNodeData;
}

export const DeviceNode = memo(({ data }: DeviceNodeProps) => {
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-success';
    if (battery > 20) return 'text-warning';
    return 'text-danger';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-3 w-3 text-success" />;
      case 'connecting': return <RefreshCw className="h-3 w-3 text-warning animate-spin" />;
      case 'disconnected': return <AlertTriangle className="h-3 w-3 text-danger" />;
      default: return <AlertTriangle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return 4;
    if (rssi > -60) return 3;
    if (rssi > -70) return 2;
    return 1;
  };

  return (
    <div className="bg-gradient-card border border-border rounded-lg p-3 min-w-[180px] shadow-card">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-gradient-primary p-1 rounded">
          <Smartphone className="h-3 w-3 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium truncate">{data.name}</p>
          <p className="text-[10px] text-muted-foreground">{data.id}</p>
        </div>
        {getStatusIcon(data.status)}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <Battery className={`h-3 w-3 ${getBatteryColor(data.battery)}`} />
          <span>{data.battery}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3 text-primary" />
          <div className="flex gap-[1px]">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-[2px] h-2 ${
                  i < getSignalStrength(data.rssi) ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {data.attachedItem && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            {data.attachedItem}
          </Badge>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
});