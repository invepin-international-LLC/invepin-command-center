-- Create organizations table with company details
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  industry text NOT NULL,
  company_size text NOT NULL,
  location text NOT NULL,
  company_code text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#3b82f6',
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  employee_id text,
  department text,
  position text,
  phone text,
  avatar_url text,
  is_approved boolean DEFAULT false,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(organization_id, employee_id)
);

-- Create pending approvals table
CREATE TABLE IF NOT EXISTS public.pending_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id text NOT NULL,
  department text NOT NULL,
  position text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Create organization_members table for role management
CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'staff', 'bartender')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Public can view active organizations"
  ON public.organizations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Organization admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Organization members can view colleague profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS my_profile
      WHERE my_profile.id = auth.uid()
      AND my_profile.organization_id = profiles.organization_id
    )
  );

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for pending_approvals
CREATE POLICY "Users can view their own pending approval"
  ON public.pending_approvals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view pending approvals in their organization"
  ON public.pending_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = pending_approvals.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Users can insert their own pending approval"
  ON public.pending_approvals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can update pending approvals"
  ON public.pending_approvals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = pending_approvals.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for organization_members
CREATE POLICY "Users can view their own membership"
  ON public.organization_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Organization admins can view all members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS my_membership
      WHERE my_membership.organization_id = organization_members.organization_id
      AND my_membership.user_id = auth.uid()
      AND my_membership.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Organization admins can manage members"
  ON public.organization_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members AS my_membership
      WHERE my_membership.organization_id = organization_members.organization_id
      AND my_membership.user_id = auth.uid()
      AND my_membership.role IN ('owner', 'admin')
    )
  );

-- Function to generate unique company code
CREATE OR REPLACE FUNCTION generate_company_code(company_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_code text;
  final_code text;
  counter int := 0;
BEGIN
  -- Create base code from first 3 letters + random 4 digits
  base_code := UPPER(SUBSTRING(REGEXP_REPLACE(company_name, '[^a-zA-Z]', '', 'g') FROM 1 FOR 3));
  final_code := base_code || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.organizations WHERE company_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique company code';
    END IF;
  END LOOP;
  
  RETURN final_code;
END;
$$;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    organization_id,
    employee_id,
    department,
    position,
    phone,
    is_approved
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    (NEW.raw_user_meta_data->>'organization_id')::uuid,
    NEW.raw_user_meta_data->>'employee_id',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'position',
    NEW.raw_user_meta_data->>'phone',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger for profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();