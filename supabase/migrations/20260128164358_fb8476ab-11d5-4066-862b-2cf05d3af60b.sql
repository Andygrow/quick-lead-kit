-- Add columns to store quiz data in leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS quiz_score integer,
ADD COLUMN IF NOT EXISTS quiz_level text,
ADD COLUMN IF NOT EXISTS quiz_answers jsonb;

-- Add comment to explain the columns
COMMENT ON COLUMN public.leads.quiz_score IS 'Total score from CI+7 quiz (out of 35)';
COMMENT ON COLUMN public.leads.quiz_level IS 'Quiz result level: beginner, intermediate, advanced';
COMMENT ON COLUMN public.leads.quiz_answers IS 'JSON object with answers for each step {1: 3, 2: 4, ...}';