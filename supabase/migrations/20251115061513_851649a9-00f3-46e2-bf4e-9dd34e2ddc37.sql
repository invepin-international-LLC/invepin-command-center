-- Drop the restrictive communication_protocol check constraint
ALTER TABLE public.device_types 
  DROP CONSTRAINT IF EXISTS device_types_communication_protocol_check;

-- Add a less restrictive check that allows text (we'll validate in application layer)
ALTER TABLE public.device_types 
  ADD CONSTRAINT device_types_communication_protocol_check 
  CHECK (char_length(communication_protocol) > 0);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'device_types_manufacturer_model_key'
  ) THEN
    ALTER TABLE public.device_types 
    ADD CONSTRAINT device_types_manufacturer_model_key UNIQUE (manufacturer, model);
  END IF;
END $$;

-- Insert Invepin device types
INSERT INTO public.device_types (name, manufacturer, model, category, communication_protocol, capabilities, data_schema, command_schema) VALUES
('Invepin V1 Tag', 'Invepin', 'V1', 'tag', 'BLE', 
 '{"ble": true, "tag_detection": true, "proximity": true, "inventory_pings": true}'::jsonb,
 '{"rssi": "number", "battery": "number", "proximity_events": "array", "tag_detections": "array"}'::jsonb,
 '{"locate": {}, "identify": {}, "configure": {"ping_interval": "number"}}'::jsonb),

('Invepin V2 Tag', 'Invepin', 'V2', 'tag', 'BLE+NFC',
 '{"ble": true, "nfc": true, "shelf_sensing": true, "enhanced_diagnostics": true}'::jsonb,
 '{"rssi": "number", "battery": "number", "nfc_taps": "array", "shelf_position": "string", "diagnostics": "object"}'::jsonb,
 '{"locate": {}, "identify": {}, "configure": {"tap_logging": "boolean", "sensing_mode": "string"}}'::jsonb),

('Invepin BarMate', 'Invepin', 'BarMate', 'actuator', 'WiFi+BLE',
 '{"wifi": true, "ble": true, "flow_sensor": true, "level_sensor": true, "facial_id": true, "thumb_lock": true, "tamper_detection": true}'::jsonb,
 '{"flow_rate": "number", "volume": "number", "level_percent": "number", "lock_status": "string", "tamper_status": "boolean", "pour_events": "array"}'::jsonb,
 '{"lock": {}, "unlock": {}, "pour": {"volume_ml": "number"}, "calibrate": {}, "reset": {}}'::jsonb),

('Colony Hub E', 'Invepin', 'Persephone 3.0', 'gateway', 'BLE+LoRa+WiFi',
 '{"ble": true, "lora": true, "wifi": true, "ethernet": true, "mesh_manager": true, "ota_orchestrator": true, "dashboard": true}'::jsonb,
 '{"connected_devices": "array", "mesh_status": "object", "ota_status": "object", "dashboard_url": "string"}'::jsonb,
 '{"ota_update": {"device_ids": "array", "firmware_version": "string"}, "mesh_scan": {}, "reboot": {}}'::jsonb)
ON CONFLICT (manufacturer, model) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  communication_protocol = EXCLUDED.communication_protocol,
  capabilities = EXCLUDED.capabilities,
  data_schema = EXCLUDED.data_schema,
  command_schema = EXCLUDED.command_schema;

-- Create device authentication table
CREATE TABLE IF NOT EXISTS public.device_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  device_uuid text NOT NULL UNIQUE,
  secret_key_hash text NOT NULL,
  public_key text,
  auth_method text NOT NULL DEFAULT 'hmac',
  last_auth_at timestamptz,
  failed_auth_attempts integer DEFAULT 0,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(device_id)
);

-- Create firmware versions table
CREATE TABLE IF NOT EXISTS public.firmware_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_type_id uuid NOT NULL REFERENCES public.device_types(id) ON DELETE CASCADE,
  version text NOT NULL,
  build_number integer NOT NULL,
  release_channel text NOT NULL DEFAULT 'stable',
  file_url text NOT NULL,
  file_hash text NOT NULL,
  file_size_bytes bigint NOT NULL,
  signature text NOT NULL,
  changelog text,
  min_battery_level integer DEFAULT 30,
  requires_backup boolean DEFAULT true,
  rollback_version text,
  is_mandatory boolean DEFAULT false,
  released_at timestamptz DEFAULT now(),
  deprecated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(device_type_id, version)
);

-- Create OTA update jobs table  
CREATE TABLE IF NOT EXISTS public.ota_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  firmware_version_id uuid NOT NULL REFERENCES public.firmware_versions(id),
  status text NOT NULL DEFAULT 'pending',
  initiated_by uuid REFERENCES auth.users(id),
  priority integer DEFAULT 0,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  progress_percent integer DEFAULT 0,
  error_message text,
  rollback_version text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pour events table
CREATE TABLE IF NOT EXISTS public.pour_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  volume_ml numeric NOT NULL,
  flow_rate numeric,
  duration_seconds numeric,
  product_name text,
  authorized_method text,
  tamper_detected boolean DEFAULT false,
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb
);

-- Create tamper events table
CREATE TABLE IF NOT EXISTS public.tamper_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  severity text NOT NULL,
  details jsonb,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Create device diagnostics table
CREATE TABLE IF NOT EXISTS public.device_diagnostics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  diagnostic_type text NOT NULL,
  status text NOT NULL,
  metrics jsonb NOT NULL,
  recommendations text[],
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firmware_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ota_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pour_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tamper_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_diagnostics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "System can manage device auth" ON public.device_auth;
CREATE POLICY "System can manage device auth" ON public.device_auth FOR ALL USING (true);

DROP POLICY IF EXISTS "Anyone can view firmware versions" ON public.firmware_versions;
CREATE POLICY "Anyone can view firmware versions" ON public.firmware_versions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage firmware" ON public.firmware_versions;
CREATE POLICY "Admins can manage firmware" ON public.firmware_versions FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Org managers can view OTA updates" ON public.ota_updates;
CREATE POLICY "Org managers can view OTA updates" ON public.ota_updates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM devices d
    JOIN organization_members om ON om.organization_id = d.organization_id
    WHERE d.id = ota_updates.device_id AND om.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Org managers can create OTA updates" ON public.ota_updates;
CREATE POLICY "Org managers can create OTA updates" ON public.ota_updates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM devices d
    JOIN organization_members om ON om.organization_id = d.organization_id
    WHERE d.id = ota_updates.device_id AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
  )
);

DROP POLICY IF EXISTS "System can update OTA status" ON public.ota_updates;
CREATE POLICY "System can update OTA status" ON public.ota_updates FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Org members can view pour events" ON public.pour_events;
CREATE POLICY "Org members can view pour events" ON public.pour_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = pour_events.organization_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "System can insert pour events" ON public.pour_events;
CREATE POLICY "System can insert pour events" ON public.pour_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Org members can view tamper events" ON public.tamper_events;
CREATE POLICY "Org members can view tamper events" ON public.tamper_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = tamper_events.organization_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "System can insert tamper events" ON public.tamper_events;
CREATE POLICY "System can insert tamper events" ON public.tamper_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Org admins can update tamper events" ON public.tamper_events;
CREATE POLICY "Org admins can update tamper events" ON public.tamper_events FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = tamper_events.organization_id AND user_id = auth.uid()
    AND role IN ('owner', 'admin', 'manager')
  )
);

DROP POLICY IF EXISTS "Org members can view diagnostics" ON public.device_diagnostics;
CREATE POLICY "Org members can view diagnostics" ON public.device_diagnostics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM devices d
    JOIN organization_members om ON om.organization_id = d.organization_id
    WHERE d.id = device_diagnostics.device_id AND om.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "System can insert diagnostics" ON public.device_diagnostics;
CREATE POLICY "System can insert diagnostics" ON public.device_diagnostics FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_device_auth_device_uuid ON public.device_auth(device_uuid);
CREATE INDEX IF NOT EXISTS idx_device_auth_device_id ON public.device_auth(device_id);
CREATE INDEX IF NOT EXISTS idx_firmware_versions_device_type ON public.firmware_versions(device_type_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_ota_updates_device_status ON public.ota_updates(device_id, status);
CREATE INDEX IF NOT EXISTS idx_ota_updates_scheduled ON public.ota_updates(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_pour_events_device_timestamp ON public.pour_events(device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pour_events_org_timestamp ON public.pour_events(organization_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tamper_events_unresolved ON public.tamper_events(device_id, timestamp DESC) WHERE NOT resolved;
CREATE INDEX IF NOT EXISTS idx_device_diagnostics_device ON public.device_diagnostics(device_id, timestamp DESC);

-- Add triggers
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_device_auth_updated_at') THEN
    CREATE TRIGGER update_device_auth_updated_at BEFORE UPDATE ON public.device_auth
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ota_updates_updated_at') THEN
    CREATE TRIGGER update_ota_updates_updated_at BEFORE UPDATE ON public.ota_updates
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;