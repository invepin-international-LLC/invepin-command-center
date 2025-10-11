-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'company_admin', 'manager', 'bartender', 'staff');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Create stores table
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  app_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage stores"
  ON public.stores FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Company admins can view stores"
  ON public.stores FOR SELECT
  USING (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create colony_hub_data table
CREATE TABLE public.colony_hub_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  hub_id TEXT NOT NULL,
  status TEXT,
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.colony_hub_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage colony hub data"
  ON public.colony_hub_data FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Company admins can view colony hub data"
  ON public.colony_hub_data FOR SELECT
  USING (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create invepin_data table
CREATE TABLE public.invepin_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  invepin_id TEXT NOT NULL,
  item_name TEXT,
  location TEXT,
  last_detected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  battery_level INTEGER,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.invepin_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage invepin data"
  ON public.invepin_data FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Company admins can view invepin data"
  ON public.invepin_data FOR SELECT
  USING (public.has_role(auth.uid(), 'company_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to stores table
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();