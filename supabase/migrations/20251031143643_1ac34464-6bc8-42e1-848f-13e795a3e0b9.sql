-- Create products table for UPC tracking
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upc TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  manufacturer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add UPC field to invepin_data table
ALTER TABLE public.invepin_data
ADD COLUMN IF NOT EXISTS upc TEXT,
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Company admins can view products"
ON public.products
FOR SELECT
USING (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Company admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'company_admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can manage products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger for updated_at on products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on UPC for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_upc ON public.products(upc);
CREATE INDEX IF NOT EXISTS idx_invepin_data_upc ON public.invepin_data(upc);