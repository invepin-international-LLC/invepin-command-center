-- Add security tracking to user profiles
CREATE TABLE IF NOT EXISTS public.user_security (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  password_last_changed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  password_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '3 months'),
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_phone_verified BOOLEAN DEFAULT false,
  mfa_phone TEXT,
  last_mfa_verification TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_security ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_security
CREATE POLICY "Users can view their own security settings"
ON public.user_security
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
ON public.user_security
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
ON public.user_security
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Super admins can view all security settings
CREATE POLICY "Super admins can view all security settings"
ON public.user_security
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Function to create user security record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_security (user_id, password_last_changed, password_expires_at)
  VALUES (NEW.id, now(), now() + interval '3 months')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create security record for new users
DROP TRIGGER IF EXISTS on_auth_user_created_security ON auth.users;
CREATE TRIGGER on_auth_user_created_security
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_security();

-- Function to check if password has expired
CREATE OR REPLACE FUNCTION public.is_password_expired(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT password_expires_at < now() FROM public.user_security WHERE user_security.user_id = _user_id),
    false
  )
$$;

-- Function to record failed login attempt
CREATE OR REPLACE FUNCTION public.record_failed_login(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_security
  SET 
    failed_login_attempts = failed_login_attempts + 1,
    account_locked_until = CASE 
      WHEN failed_login_attempts + 1 >= 5 
      THEN now() + interval '30 minutes'
      ELSE account_locked_until
    END,
    updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Function to reset failed login attempts
CREATE OR REPLACE FUNCTION public.reset_failed_logins(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_security
  SET 
    failed_login_attempts = 0,
    account_locked_until = NULL,
    updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Add trigger on updated_at for user_security
CREATE TRIGGER update_user_security_updated_at
  BEFORE UPDATE ON public.user_security
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_security_user_id ON public.user_security(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_password_expires ON public.user_security(password_expires_at);
CREATE INDEX IF NOT EXISTS idx_user_security_account_locked ON public.user_security(account_locked_until);

-- Grant permissions
GRANT SELECT, UPDATE, INSERT ON public.user_security TO authenticated;