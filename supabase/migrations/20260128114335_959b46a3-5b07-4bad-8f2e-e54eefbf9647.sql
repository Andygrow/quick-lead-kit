-- Drop the existing constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS valid_pipeline_stage;

-- Add the updated constraint with all valid pipeline stages
ALTER TABLE public.leads ADD CONSTRAINT valid_pipeline_stage 
CHECK (pipeline_stage IN ('new', 'in_progress', 'qualified', 'closed'));