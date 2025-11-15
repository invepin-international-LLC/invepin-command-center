import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDeviceManager } from '@/hooks/useDeviceManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bluetooth,
  Wifi,
  Battery,
  MapPin,
  Activity,
  Settings,
  Plus,
  Search,
  RefreshCw,
} from 'lucide-react';

interface DeviceManagementDashboardProps {
  organizationId: string;
}

export const DeviceManagementDashboard: React.FC<DeviceManagementDashboardProps> = ({
  organizationId,
}) => {
  const { devices, isLoading, fetchDevices, pairDevice, sendCommand } = useDeviceManager(organizationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.device_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tagDevices = filteredDevices.filter(d => d.device_type.category === 'tag');
  const gatewayDevices = filteredDevices.filter(d => d.device_type.category === 'gateway');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'low_battery': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBatteryIcon = (level: number | null) => {
    if (!level) return <Battery className="h-4 w-4" />;
    if (level < 20) return <Battery className="h-4 w-4 text-red-500" />;
    if (level < 50) return <Battery className="h-4 w-4 text-yellow-500" />;
    return <Battery className="h-4 w-4 text-green-500" />;
  };

  const handleLocateDevice = async (deviceId: string) => {
    await sendCommand(deviceId, 'locate', {}, 1);
  };

  const handleIdentifyDevice = async (deviceId: string) => {
    await sendCommand(deviceId, 'identify', {}, 1);
  };

  const DeviceCard = ({ device }: { device: any }) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedDevice === device.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedDevice(device.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {device.device_type.category === 'tag' ? (
              <Bluetooth className="h-5 w-5 text-primary" />
            ) : (
              <Wifi className="h-5 w-5 text-primary" />
            )}
            <div>
              <CardTitle className="text-base">{device.name}</CardTitle>
              <CardDescription className="text-xs">{device.device_id}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(device.status)}>
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getBatteryIcon(device.battery_level)}
            <span>{device.battery_level || 'N/A'}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>{device.signal_strength || 'N/A'} dBm</span>
          </div>
        </div>

        {device.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
            </span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Last seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleLocateDevice(device.device_id);
            }}
            className="flex-1"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Locate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleIdentifyDevice(device.device_id);
            }}
            className="flex-1"
          >
            Identify
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>
                Manage and monitor your Invepin tags and Colony Hub gateways
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchDevices} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Pair Device
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Devices ({devices.length})
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Bluetooth className="h-4 w-4 mr-2" />
            Tags ({tagDevices.length})
          </TabsTrigger>
          <TabsTrigger value="hubs">
            <Wifi className="h-4 w-4 mr-2" />
            Hubs ({gatewayDevices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">Loading devices...</div>
          ) : filteredDevices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No devices found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tagDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hubs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gatewayDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
