-- Add RLS policy to allow service role to insert into user_roles during signup
CREATE POLICY "System can insert default roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (true);