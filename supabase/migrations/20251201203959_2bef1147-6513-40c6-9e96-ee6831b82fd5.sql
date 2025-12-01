-- Fix Critical Security Issue #1: pending_approvals - restrict access
-- Users should only see their OWN pending approval, not others' PII
DROP POLICY IF EXISTS "Users can view their own pending approval" ON public.pending_approvals;
CREATE POLICY "Users can view their own pending approval" 
ON public.pending_approvals 
FOR SELECT 
USING (auth.uid() = user_id);

-- Fix Critical Security Issue #2: face_embeddings - restrict biometric data access
-- Only the user themselves and system processes should access biometric data
DROP POLICY IF EXISTS "Org managers can view all face embeddings" ON public.face_embeddings;

-- Create a restricted policy - only for authentication matching purposes via service role
CREATE POLICY "System can read embeddings for authentication" 
ON public.face_embeddings 
FOR SELECT 
USING (
  -- Users can see their own embeddings
  auth.uid() = user_id
  -- Super admins only in emergencies (they already have this via other means if needed)
);

-- Fix Critical Security Issue #3: device_auth - remove overly permissive policy
DROP POLICY IF EXISTS "System can manage device auth" ON public.device_auth;

-- Create separate restrictive policies for device_auth
-- Only service role (edge functions) should manage device auth - no direct client access
CREATE POLICY "No direct client access to device auth" 
ON public.device_auth 
FOR SELECT 
USING (false); -- Block all direct client reads - only service role bypasses RLS

CREATE POLICY "No direct client insert to device auth" 
ON public.device_auth 
FOR INSERT 
WITH CHECK (false); -- Block all direct client inserts

CREATE POLICY "No direct client update to device auth" 
ON public.device_auth 
FOR UPDATE 
USING (false); -- Block all direct client updates

CREATE POLICY "No direct client delete to device auth" 
ON public.device_auth 
FOR DELETE 
USING (false); -- Block all direct client deletes