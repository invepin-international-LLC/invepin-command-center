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
      case 'secure': return 'bg-success/20 text-success border-success/30';
      case 'moving': return 'bg-warning/20 text-warning border-warning/30';
      case 'alert': return 'bg-danger/20 text-danger border-danger/30';
      case 'missing': return 'bg-danger/20 text-danger border-danger/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className={`border rounded-lg p-3 min-w-[160px] shadow-card ${getStatusColor(data.status)}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-background/50 p-1 rounded">
          <Package className="h-3 w-3" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium truncate">{data.name}</p>
          <p className="text-[10px] opacity-70">{data.category}</p>
        </div>
        {getStatusIcon(data.status)}
      </div>

      <div className="space-y-1 text-[10px]">
        <div className="flex justify-between">
          <span className="opacity-70">Value:</span>
          <span className="font-medium">{data.value}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Updated:</span>
          <span>{data.lastUpdate}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-current/20">
        <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
          {data.status}
        </Badge>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
});