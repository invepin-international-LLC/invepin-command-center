-- Fix security warning: Add search_path to functions

-- Update generate_company_code function with search_path
CREATE OR REPLACE FUNCTION generate_company_code(company_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update handle_updated_at function with search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;