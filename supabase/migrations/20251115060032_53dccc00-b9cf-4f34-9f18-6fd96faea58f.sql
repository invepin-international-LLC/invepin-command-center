-- Restrict organizations table access to organization members only
-- Drop the public access policy
DROP POLICY IF EXISTS "Public can view active organizations" ON public.organizations;

-- Create policy allowing only organization members to view their organization
CREATE POLICY "Members can view their organization"
ON public.organizations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
  )
);