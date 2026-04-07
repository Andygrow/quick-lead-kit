-- Add tags column to newsletter_contacts for segmentation
ALTER TABLE public.newsletter_contacts ADD COLUMN tags text[] DEFAULT '{}';

-- Add index for tag-based queries
CREATE INDEX idx_newsletter_contacts_tags ON public.newsletter_contacts USING GIN(tags);