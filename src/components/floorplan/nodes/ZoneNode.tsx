import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users,
  ShoppingBag,
  Home,
  Building,
  Warehouse
} from 'lucide-react';

interface ZoneNodeData {
  id: string;
  name: string;
  type: 'retail' | 'storage' | 'office' | 'security' | 'entrance' | 'checkout';
  deviceCount: number;
  itemCount: number;
  alertCount?: number;
}

interface ZoneNodeProps {
  data: ZoneNodeData;
}

export const ZoneNode = memo(({ data }: ZoneNodeProps) => {
  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'retail': return <ShoppingBag className="h-4 w-4" />;
      case 'storage': return <Warehouse className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      case 'security': return <Users className="h-4 w-4" />;
      case 'entrance': return <Home className="h-4 w-4" />;
      case 'checkout': return <ShoppingBag className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'retail': return 'bg-primary/10 border-primary/20 text-primary';
      case 'storage': return 'bg-warning/10 border-warning/20 text-warning';
      case 'office': return 'bg-success/10 border-success/20 text-success';
      case 'security': return 'bg-danger/10 border-danger/20 text-danger';
      case 'entrance': return 'bg-accent/10 border-accent/20 text-accent-foreground';
      case 'checkout': return 'bg-secondary/10 border-secondary/20 text-secondary-foreground';
      default: return 'bg-muted/10 border-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className={`border-2 border-dashed rounded-xl p-4 min-w-[200px] min-h-[120px] ${getZoneColor(data.type)}`}>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-current" />
      
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-current/10 p-2 rounded-lg">
          {getZoneIcon(data.type)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-xs opacity-70 capitalize">{data.type} Zone</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-background/20 rounded p-2 text-center">
          <p className="font-bold">{data.deviceCount}</p>
          <p className="opacity-70">Devices</p>
        </div>
        <div className="bg-background/20 rounded p-2 text-center">
          <p className="font-bold">{data.itemCount}</p>
          <p className="opacity-70">Items</p>
        </div>
      </div>

      {data.alertCount && data.alertCount > 0 && (
        <div className="mt-2">
          <Badge variant="destructive" className="text-[10px] px-2 py-0">
            {data.alertCount} Alert{data.alertCount > 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-current" />
    </div>
  );
});