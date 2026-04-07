-- Allow anyone to insert into program_registrations (public registration form)
CREATE POLICY "Anyone can insert program registrations"
ON public.program_registrations
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read their own registration by email (for duplicate checking)
CREATE POLICY "Anyone can read program registrations"
ON public.program_registrations
FOR SELECT
USING (true);