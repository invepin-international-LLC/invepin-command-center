-- Create face_embeddings table to store worker facial data
CREATE TABLE IF NOT EXISTS public.face_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  embedding JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  enrollment_confidence NUMERIC,
  UNIQUE(user_id, organization_id)
);

-- Create clock_events table for punch in/out logging
CREATE TABLE IF NOT EXISTS public.clock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('clock_in', 'clock_out')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  method TEXT NOT NULL CHECK (method IN ('face_recognition', 'manual', 'rfid', 'pin')),
  confidence NUMERIC,
  device_id TEXT,
  location JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create shift_records table for calculated work periods
CREATE TABLE IF NOT EXISTS public.shift_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  clock_in_id UUID REFERENCES public.clock_events(id),
  clock_out_id UUID REFERENCES public.clock_events(id),
  clock_in_time TIMESTAMPTZ NOT NULL,
  clock_out_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  break_duration_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clock_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for face_embeddings
CREATE POLICY "Users can view their own face embeddings"
  ON public.face_embeddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own face embeddings"
  ON public.face_embeddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own face embeddings"
  ON public.face_embeddings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Org managers can view all face embeddings"
  ON public.face_embeddings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = face_embeddings.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for clock_events
CREATE POLICY "Users can view their own clock events"
  ON public.clock_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clock events"
  ON public.clock_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Org members can view org clock events"
  ON public.clock_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = clock_events.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for shift_records
CREATE POLICY "Users can view their own shift records"
  ON public.shift_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Org managers can view all shift records"
  ON public.shift_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = shift_records.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "System can manage shift records"
  ON public.shift_records FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to automatically create/update shift records
CREATE OR REPLACE FUNCTION public.process_clock_event()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  active_shift_id UUID;
  clock_in_time TIMESTAMPTZ;
  duration_mins INTEGER;
BEGIN
  IF NEW.event_type = 'clock_in' THEN
    -- Create new shift record
    INSERT INTO public.shift_records (
      user_id,
      organization_id,
      clock_in_id,
      clock_in_time,
      is_active
    ) VALUES (
      NEW.user_id,
      NEW.organization_id,
      NEW.id,
      NEW.timestamp,
      true
    );
  
  ELSIF NEW.event_type = 'clock_out' THEN
    -- Find active shift and close it
    SELECT id, clock_in_time
    INTO active_shift_id, clock_in_time
    FROM public.shift_records
    WHERE user_id = NEW.user_id
    AND organization_id = NEW.organization_id
    AND is_active = true
    ORDER BY clock_in_time DESC
    LIMIT 1;
    
    IF active_shift_id IS NOT NULL THEN
      duration_mins := EXTRACT(EPOCH FROM (NEW.timestamp - clock_in_time)) / 60;
      
      UPDATE public.shift_records
      SET 
        clock_out_id = NEW.id,
        clock_out_time = NEW.timestamp,
        duration_minutes = duration_mins,
        is_active = false,
        updated_at = now()
      WHERE id = active_shift_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to process clock events
CREATE TRIGGER process_clock_event_trigger
  AFTER INSERT ON public.clock_events
  FOR EACH ROW
  EXECUTE FUNCTION public.process_clock_event();

-- Trigger for updated_at on face_embeddings
CREATE TRIGGER update_face_embeddings_updated_at
  BEFORE UPDATE ON public.face_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on shift_records
CREATE TRIGGER update_shift_records_updated_at
  BEFORE UPDATE ON public.shift_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_face_embeddings_user_id ON public.face_embeddings(user_id);
CREATE INDEX idx_face_embeddings_org_id ON public.face_embeddings(organization_id);
CREATE INDEX idx_clock_events_user_id ON public.clock_events(user_id);
CREATE INDEX idx_clock_events_org_id ON public.clock_events(organization_id);
CREATE INDEX idx_clock_events_timestamp ON public.clock_events(timestamp DESC);
CREATE INDEX idx_shift_records_user_id ON public.shift_records(user_id);
CREATE INDEX idx_shift_records_org_id ON public.shift_records(organization_id);
CREATE INDEX idx_shift_records_active ON public.shift_records(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE public.face_embeddings IS 'Stores facial recognition embeddings for workers';
COMMENT ON TABLE public.clock_events IS 'Logs all clock in/out punch events';
COMMENT ON TABLE public.shift_records IS 'Calculated work shift periods with durations';