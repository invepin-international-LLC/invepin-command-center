-- Create device_types table for hardware definitions
CREATE TABLE IF NOT EXISTS public.device_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  manufacturer text NOT NULL,
  model text NOT NULL,
  category text NOT NULL CHECK (category IN ('tag', 'gateway', 'sensor', 'actuator')),
  capabilities jsonb NOT NULL DEFAULT '{}',
  communication_protocol text NOT NULL CHECK (communication_protocol IN ('BLE', 'WiFi', 'MQTT', 'LoRa', 'Zigbee')),
  firmware_version text,
  data_schema jsonb,
  command_schema jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create devices table for individual device instances
CREATE TABLE IF NOT EXISTS public.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_type_id uuid NOT NULL REFERENCES public.device_types(id),
  organization_id uuid REFERENCES public.organizations(id),
  device_id text NOT NULL UNIQUE,
  name text,
  mac_address text,
  serial_number text,
  firmware_version text,
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'maintenance', 'low_battery')),
  battery_level integer CHECK (battery_level >= 0 AND battery_level <= 100),
  signal_strength integer,
  last_seen timestamptz,
  location jsonb,
  metadata jsonb DEFAULT '{}',
  paired_at timestamptz,
  paired_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_data table for telemetry data
CREATE TABLE IF NOT EXISTS public.device_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  data_type text NOT NULL,
  payload jsonb NOT NULL,
  rssi integer,
  battery_level integer,
  gps_location jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create device_commands table for command queue
CREATE TABLE IF NOT EXISTS public.device_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  command_type text NOT NULL,
  payload jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'failed', 'timeout')),
  priority integer DEFAULT 0,
  issued_by uuid,
  issued_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  acknowledged_at timestamptz,
  result jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create device_firmware table for OTA updates
CREATE TABLE IF NOT EXISTS public.device_firmware (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_type_id uuid NOT NULL REFERENCES public.device_types(id),
  version text NOT NULL,
  file_url text NOT NULL,
  file_hash text NOT NULL,
  changelog text,
  is_stable boolean DEFAULT false,
  min_battery_level integer DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  released_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_device_id ON public.devices(device_id);
CREATE INDEX IF NOT EXISTS idx_devices_organization_id ON public.devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON public.devices(status);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON public.devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_device_data_device_id ON public.device_data(device_id);
CREATE INDEX IF NOT EXISTS idx_device_data_timestamp ON public.device_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_device_commands_device_id ON public.device_commands(device_id);
CREATE INDEX IF NOT EXISTS idx_device_commands_status ON public.device_commands(status);

-- Enable RLS
ALTER TABLE public.device_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_firmware ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device_types
CREATE POLICY "Anyone can view device types"
  ON public.device_types FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage device types"
  ON public.device_types FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for devices
CREATE POLICY "Organization members can view devices"
  ON public.devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = devices.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage devices"
  ON public.devices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = devices.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for device_data
CREATE POLICY "Organization members can view device data"
  ON public.device_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM devices
      JOIN organization_members ON organization_members.organization_id = devices.organization_id
      WHERE devices.id = device_data.device_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Devices can insert their own data"
  ON public.device_data FOR INSERT
  WITH CHECK (true);

-- RLS Policies for device_commands
CREATE POLICY "Organization members can view device commands"
  ON public.device_commands FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM devices
      JOIN organization_members ON organization_members.organization_id = devices.organization_id
      WHERE devices.id = device_commands.device_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization managers can issue commands"
  ON public.device_commands FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM devices
      JOIN organization_members ON organization_members.organization_id = devices.organization_id
      WHERE devices.id = device_commands.device_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Devices can update command status"
  ON public.device_commands FOR UPDATE
  USING (true);

-- RLS Policies for device_firmware
CREATE POLICY "Anyone can view firmware"
  ON public.device_firmware FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage firmware"
  ON public.device_firmware FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_device_types_updated_at
  BEFORE UPDATE ON public.device_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for device updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_commands;

-- Insert default device types for Invepin and Colony Hub
INSERT INTO public.device_types (name, manufacturer, model, category, capabilities, communication_protocol, firmware_version, data_schema, command_schema)
VALUES 
(
  'Invepin BLE Tag',
  'Invepin',
  'INV-TAG-001',
  'tag',
  '{"ble": true, "gps": true, "accelerometer": true, "temperature": true, "battery_monitoring": true}'::jsonb,
  'BLE',
  '1.0.0',
  '{"location": {"type": "object", "properties": {"lat": "number", "lng": "number", "accuracy": "number"}}, "battery": {"type": "number"}, "temperature": {"type": "number"}, "rssi": {"type": "number"}}'::jsonb,
  '{"locate": {"description": "Request current location"}, "identify": {"description": "Flash LED for identification"}, "sleep": {"description": "Enter low power mode"}}'::jsonb
),
(
  'Colony Hub Gateway',
  'Invepin',
  'COL-HUB-001',
  'gateway',
  '{"wifi": true, "ble_scanning": true, "edge_processing": true, "local_storage": true, "max_devices": 100}'::jsonb,
  'WiFi',
  '1.0.0',
  '{"connected_devices": {"type": "number"}, "uptime": {"type": "number"}, "memory_usage": {"type": "number"}}'::jsonb,
  '{"scan": {"description": "Start BLE scan"}, "pair": {"description": "Pair new device", "params": {"device_id": "string"}}, "firmware_update": {"description": "Update firmware", "params": {"version": "string"}}}'::jsonb
);