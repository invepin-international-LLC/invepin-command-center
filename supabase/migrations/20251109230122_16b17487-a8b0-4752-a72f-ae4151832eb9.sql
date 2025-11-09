-- Create user_consents table to track signed disclaimers
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version TEXT NOT NULL DEFAULT '1.0',
  UNIQUE(user_id, consent_type, version)
);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own consents
CREATE POLICY "Users can view own consents"
  ON public.user_consents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own consents
CREATE POLICY "Users can insert own consents"
  ON public.user_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add consent_signed flag to profiles
ALTER TABLE public.profiles
ADD COLUMN facial_recognition_consent_signed BOOLEAN DEFAULT false,
ADD COLUMN facial_recognition_consent_date TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_type ON public.user_consents(consent_type);