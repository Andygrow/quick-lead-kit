
CREATE POLICY "Authenticated users can upload email assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'email-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can read email assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'email-assets');
