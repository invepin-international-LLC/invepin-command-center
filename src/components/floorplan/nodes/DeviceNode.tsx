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
    <div className="bg-gradient-card border border-border rounded-xl p-4 min-w-[200px] shadow-elevated hover-card transition-smooth">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-gradient-primary !border-2 !border-primary-foreground !shadow-glow" 
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-gradient-primary p-2 rounded-lg shadow-glow">
          <Smartphone className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{data.name}</p>
          <p className="text-xs text-muted-foreground">{data.id}</p>
        </div>
        <div className="animate-status-pulse">
          {getStatusIcon(data.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div className="flex items-center gap-2 bg-background/30 rounded-lg p-2">
          <Battery className={`h-4 w-4 ${getBatteryColor(data.battery)}`} />
          <span className="font-medium text-foreground">{data.battery}%</span>
        </div>
        <div className="flex items-center gap-2 bg-background/30 rounded-lg p-2">
          <Signal className="h-4 w-4 text-primary" />
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-3 rounded-full transition-smooth ${
                  i < getSignalStrength(data.rssi) ? 'bg-gradient-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {data.attachedItem && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <Badge variant="secondary" className="text-xs px-2 py-1 bg-secondary/20 text-secondary-foreground">
            {data.attachedItem}
          </Badge>
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-gradient-primary !border-2 !border-primary-foreground !shadow-glow" 
      />
    </div>
  );
});