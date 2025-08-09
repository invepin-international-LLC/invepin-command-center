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
  // Optional heatmap fields
  heatLevel?: 'low' | 'medium' | 'high';
  showHeat?: boolean;
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
      case 'retail': return 'bg-primary/10 border-primary/40 text-primary shadow-glow';
      case 'storage': return 'bg-warning/10 border-warning/40 text-warning shadow-card';
      case 'office': return 'bg-success/10 border-success/40 text-success shadow-card';
      case 'security': return 'bg-danger/10 border-danger/40 text-danger shadow-card';
      case 'entrance': return 'bg-accent/10 border-accent/40 text-accent-foreground shadow-card';
      case 'checkout': return 'bg-secondary/10 border-secondary/40 text-secondary-foreground shadow-card';
      default: return 'bg-muted/10 border-muted/40 text-muted-foreground shadow-card';
    }
  };

  const getHeatClasses = (level: ZoneNodeData['heatLevel']) => {
    if (!level) return '';
    switch (level) {
      case 'high':
        return 'ring-2 ring-danger/60 bg-danger/10';
      case 'medium':
        return 'ring-2 ring-warning/50 bg-warning/10';
      case 'low':
        return 'ring-2 ring-success/40 bg-success/10';
      default:
        return '';
    }
  };

  return (
    <div className={`border-2 border-dashed rounded-2xl p-5 min-w-[220px] min-h-[140px] transition-smooth hover-card ${getZoneColor(data.type)} ${data.showHeat ? getHeatClasses(data.heatLevel) : ''}`}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-4 !h-4 !bg-transparent !border-2 !border-current !rounded-full !shadow-glow" 
      />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-current/15 p-3 rounded-xl shadow-card">
          {getZoneIcon(data.type)}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold">{data.name}</p>
          <p className="text-sm opacity-80 capitalize">{data.type} Zone</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-background/30 rounded-xl p-3 text-center border border-current/20">
          <p className="text-lg font-bold">{data.deviceCount}</p>
          <p className="opacity-80 text-xs">Devices</p>
        </div>
        <div className="bg-background/30 rounded-xl p-3 text-center border border-current/20">
          <p className="text-lg font-bold">{data.itemCount}</p>
          <p className="opacity-80 text-xs">Items</p>
        </div>
      </div>

      {data.alertCount && data.alertCount > 0 && (
        <div className="mt-3">
          <Badge 
            variant="destructive" 
            className="text-xs px-3 py-1 bg-gradient-danger text-danger-foreground animate-pulse-glow"
          >
            {data.alertCount} Alert{data.alertCount > 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-4 !h-4 !bg-transparent !border-2 !border-current !rounded-full !shadow-glow" 
      />
    </div>
  );
});