import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ItemNodeData {
  id: string;
  name: string;
  category: string;
  status: 'secure' | 'moving' | 'alert' | 'missing';
  value: string;
  lastUpdate: string;
}

interface ItemNodeProps {
  data: ItemNodeData;
}

export const ItemNode = memo(({ data }: ItemNodeProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle2 className="h-3 w-3 text-success" />;
      case 'moving': return <Clock className="h-3 w-3 text-warning animate-pulse" />;
      case 'alert': return <AlertTriangle className="h-3 w-3 text-danger animate-pulse" />;
      case 'missing': return <AlertTriangle className="h-3 w-3 text-danger" />;
      default: return <Package className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-gradient-success border-success/50 text-success-foreground shadow-elevated';
      case 'moving': return 'bg-gradient-warning border-warning/50 text-warning-foreground shadow-elevated';
      case 'alert': return 'bg-gradient-danger border-danger/50 text-danger-foreground shadow-elevated animate-status-pulse';
      case 'missing': return 'bg-gradient-danger border-danger/50 text-danger-foreground shadow-elevated';
      default: return 'bg-gradient-card border-border text-foreground shadow-card';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 min-w-[180px] transition-smooth hover-card ${getStatusColor(data.status)}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-gradient-success !border-2 !border-success-foreground !shadow-glow" 
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-background/30 p-2 rounded-lg">
          <Package className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold truncate">{data.name}</p>
          <p className="text-xs opacity-80">{data.category}</p>
        </div>
        <div className="animate-status-pulse">
          {getStatusIcon(data.status)}
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center bg-background/20 rounded-lg p-2">
          <span className="opacity-80">Value:</span>
          <span className="font-semibold">{data.value}</span>
        </div>
        <div className="flex justify-between items-center bg-background/20 rounded-lg p-2">
          <span className="opacity-80">Updated:</span>
          <span className="font-medium">{data.lastUpdate}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-current/30">
        <Badge 
          variant="outline" 
          className="text-xs px-2 py-1 capitalize bg-background/30 border-current/50"
        >
          {data.status}
        </Badge>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-gradient-success !border-2 !border-success-foreground !shadow-glow" 
      />
    </div>
  );
});