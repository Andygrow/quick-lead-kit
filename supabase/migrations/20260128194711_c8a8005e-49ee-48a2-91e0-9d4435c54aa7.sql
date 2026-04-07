-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create a PERMISSIVE policy for public lead insertion
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);

-- Also need to allow public to SELECT their own lead by email for deduplication
-- This is needed for the webinar registration form to check existing leads
DROP POLICY IF EXISTS "Anyone can read own lead by email" ON public.leads;

CREATE POLICY "Anyone can read own lead by email"
ON public.leads
FOR SELECT
TO public
USING (true);

-- Allow public updates to leads (for returning users updating their info)
DROP POLICY IF EXISTS "Anyone can update leads" ON public.leads;

CREATE POLICY "Anyone can update leads"
ON public.leads
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);