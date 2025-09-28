-- Invepin Security System Database Setup
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security (RLS) for all tables

-- Create organizations table for multi-tenant isolation
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own organization
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
  );

-- Create organization_members table to link users to organizations
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'staff', 'bartender')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Enable RLS on organization_members
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see memberships for their organization
CREATE POLICY "Users can view org memberships" ON organization_members
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
  );

-- Create inventory_items table with organization isolation
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  sku TEXT,
  barcode TEXT,
  current_stock DECIMAL DEFAULT 0,
  min_stock DECIMAL DEFAULT 0,
  max_stock DECIMAL DEFAULT 0,
  unit_cost DECIMAL DEFAULT 0,
  selling_price DECIMAL DEFAULT 0,
  supplier_id UUID,
  location TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on inventory_items
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access inventory for their organization
CREATE POLICY "Organization inventory access" ON inventory_items
  FOR ALL USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
  );

-- Create stock_movements table with organization isolation
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'pour')),
  quantity DECIMAL NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on stock_movements
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access stock movements for their organization
CREATE POLICY "Organization stock movements access" ON stock_movements
  FOR ALL USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
  );

-- Create staff_messages table for the chat system
CREATE TABLE IF NOT EXISTS staff_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('admin', 'manager', 'staff', 'bartender')),
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on staff_messages
ALTER TABLE staff_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read messages from their organization only
CREATE POLICY "Users can read org messages" ON staff_messages
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'role' IN ('admin', 'manager', 'staff', 'bartender')
    )
  );

-- Policy: Users can insert messages in their organization only
CREATE POLICY "Users can insert org messages" ON staff_messages
  FOR INSERT WITH CHECK (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
    AND auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'role' IN ('admin', 'manager', 'staff', 'bartender')
    )
  );

-- Create security_logs table for audit trail
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins and managers can read security logs from their organization
CREATE POLICY "Org admins can read security logs" ON security_logs
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'role' IN ('admin', 'manager')
    )
  );

-- Create camera_access_logs table
CREATE TABLE IF NOT EXISTS camera_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  camera_id TEXT NOT NULL,
  camera_name TEXT,
  action TEXT NOT NULL CHECK (action IN ('view', 'record', 'export')),
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on camera_access_logs  
ALTER TABLE camera_access_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read camera logs from their organization only
CREATE POLICY "Org camera access logs policy" ON camera_access_logs
  FOR SELECT USING (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
    AND (auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'role' IN ('admin', 'manager')
    ))
  );

-- Policy: Users can insert camera access logs for their organization
CREATE POLICY "Users can log org camera access" ON camera_access_logs
  FOR INSERT WITH CHECK (
    organization_id = (auth.jwt() -> 'user_metadata' ->> 'organization_id')::UUID
    AND auth.uid() = user_id
  );

-- Create user_sessions table for active session tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address INET,
  is_mobile BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Enable RLS on user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can manage own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  urgent_only BOOLEAN DEFAULT FALSE,
  inventory_alerts BOOLEAN DEFAULT TRUE,
  security_alerts BOOLEAN DEFAULT TRUE,
  chat_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notification_preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own notification preferences
CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create preferences for new users
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON auth.users;
CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_preferences();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_org_id ON inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);

CREATE INDEX IF NOT EXISTS idx_stock_movements_org_id ON stock_movements(organization_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item_id ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_staff_messages_org_id ON staff_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_staff_messages_created_at ON staff_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_messages_user_id ON staff_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_messages_urgent ON staff_messages(is_urgent) WHERE is_urgent = true;

CREATE INDEX IF NOT EXISTS idx_security_logs_org_id ON security_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_action ON security_logs(action);

CREATE INDEX IF NOT EXISTS idx_camera_access_logs_org_id ON camera_access_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_camera_access_logs_created_at ON camera_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_camera_access_logs_user_id ON camera_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_camera_access_logs_camera_id ON camera_access_logs(camera_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Note: You may want to set up a periodic job to call cleanup_expired_sessions()
-- This can be done with pg_cron if available in your Supabase instance

COMMENT ON TABLE organizations IS 'Organizations for multi-tenant data isolation';
COMMENT ON TABLE organization_members IS 'Links users to organizations with their roles';
COMMENT ON TABLE inventory_items IS 'Inventory items isolated by organization';
COMMENT ON TABLE stock_movements IS 'Stock movement history isolated by organization';
COMMENT ON TABLE staff_messages IS 'Chat messages between staff members with role-based and organization access';
COMMENT ON TABLE security_logs IS 'Audit trail for security-related actions and events per organization';
COMMENT ON TABLE camera_access_logs IS 'Log of camera access and usage by users per organization';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security monitoring';
COMMENT ON TABLE notification_preferences IS 'User preferences for different types of notifications';