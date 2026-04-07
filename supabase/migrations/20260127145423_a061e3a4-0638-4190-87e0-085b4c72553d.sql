-- Create webinar registrations table
CREATE TABLE public.webinar_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sequence_step INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Create program registrations table
CREATE TABLE public.program_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin_profile TEXT,
  course_objective TEXT,
  payment_status TEXT DEFAULT 'pending',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Enable RLS
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can register)
CREATE POLICY "Anyone can register for webinar"
ON public.webinar_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can register for program"
ON public.program_registrations
FOR INSERT
WITH CHECK (true);

-- Authenticated read policies (admin can view)
CREATE POLICY "Authenticated users can view webinar registrations"
ON public.webinar_registrations
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view program registrations"
ON public.program_registrations
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Authenticated update policies
CREATE POLICY "Authenticated users can update webinar registrations"
ON public.webinar_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update program registrations"
ON public.program_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Authenticated delete policies
CREATE POLICY "Authenticated users can delete webinar registrations"
ON public.webinar_registrations
FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete program registrations"
ON public.program_registrations
FOR DELETE
USING (auth.uid() IS NOT NULL);