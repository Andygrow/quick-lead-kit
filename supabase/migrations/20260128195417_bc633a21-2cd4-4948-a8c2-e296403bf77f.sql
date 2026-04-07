-- Remove the overly permissive public policies now that we use edge function
DROP POLICY IF EXISTS "Anyone can read own lead by email" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON public.leads;

-- Keep only the INSERT policy for edge cases where direct insert might still be needed
-- But the main flow now uses the edge function with service role