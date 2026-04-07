
-- Table for external contacts (CSV uploads)
CREATE TABLE public.newsletter_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'csv',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

ALTER TABLE public.newsletter_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage newsletter contacts"
  ON public.newsletter_contacts FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Table for newsletters (composed emails)
CREATE TABLE public.newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  audience TEXT NOT NULL DEFAULT 'all',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage newsletters"
  ON public.newsletters FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Table for individual send tracking
CREATE TABLE public.newsletter_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id UUID NOT NULL REFERENCES public.newsletters(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_source TEXT NOT NULL DEFAULT 'lead',
  status TEXT NOT NULL DEFAULT 'pending',
  resend_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage newsletter sends"
  ON public.newsletter_sends FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX idx_newsletter_sends_newsletter_id ON public.newsletter_sends(newsletter_id);
CREATE INDEX idx_newsletter_sends_status ON public.newsletter_sends(status);
CREATE INDEX idx_newsletter_contacts_email ON public.newsletter_contacts(email);
