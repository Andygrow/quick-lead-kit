CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: email_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email_send_id uuid NOT NULL,
    event_type text NOT NULL,
    event_data jsonb,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_sends; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_sends (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    sequence_id uuid,
    step_id uuid,
    resend_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_sequence_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_sequence_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sequence_id uuid NOT NULL,
    step_order integer NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    delay_hours integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_sequences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_sequences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    trigger_event text DEFAULT 'lead_created'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text NOT NULL,
    role text NOT NULL,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_term text,
    is_corporate_email boolean DEFAULT false NOT NULL,
    lead_quality text DEFAULT 'low'::text NOT NULL,
    pipeline_stage text DEFAULT 'new'::text NOT NULL,
    close_status text,
    closed_at timestamp with time zone,
    notes text,
    phone text,
    CONSTRAINT valid_close_status CHECK (((close_status IS NULL) OR (close_status = ANY (ARRAY['won'::text, 'lost'::text])))),
    CONSTRAINT valid_pipeline_stage CHECK ((pipeline_stage = ANY (ARRAY['new'::text, 'in_progress'::text, 'closed'::text])))
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_events email_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_pkey PRIMARY KEY (id);


--
-- Name: email_sends email_sends_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sends
    ADD CONSTRAINT email_sends_pkey PRIMARY KEY (id);


--
-- Name: email_sequence_steps email_sequence_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sequence_steps
    ADD CONSTRAINT email_sequence_steps_pkey PRIMARY KEY (id);


--
-- Name: email_sequences email_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sequences
    ADD CONSTRAINT email_sequences_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_key UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: idx_leads_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at DESC);


--
-- Name: idx_leads_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_email ON public.leads USING btree (email);


--
-- Name: email_sequence_steps update_email_sequence_steps_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_sequence_steps_updated_at BEFORE UPDATE ON public.email_sequence_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: email_sequences update_email_sequences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON public.email_sequences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: settings update_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: email_events email_events_email_send_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_email_send_id_fkey FOREIGN KEY (email_send_id) REFERENCES public.email_sends(id) ON DELETE CASCADE;


--
-- Name: email_sends email_sends_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sends
    ADD CONSTRAINT email_sends_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: email_sends email_sends_sequence_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sends
    ADD CONSTRAINT email_sends_sequence_id_fkey FOREIGN KEY (sequence_id) REFERENCES public.email_sequences(id) ON DELETE SET NULL;


--
-- Name: email_sends email_sends_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sends
    ADD CONSTRAINT email_sends_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.email_sequence_steps(id) ON DELETE SET NULL;


--
-- Name: email_sequence_steps email_sequence_steps_sequence_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_sequence_steps
    ADD CONSTRAINT email_sequence_steps_sequence_id_fkey FOREIGN KEY (sequence_id) REFERENCES public.email_sequences(id) ON DELETE CASCADE;


--
-- Name: leads Anyone can insert leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);


--
-- Name: leads Authenticated users can delete leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete leads" ON public.leads FOR DELETE TO authenticated USING ((auth.uid() IS NOT NULL));


--
-- Name: settings Authenticated users can delete settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete settings" ON public.settings FOR DELETE TO authenticated USING ((auth.uid() IS NOT NULL));


--
-- Name: settings Authenticated users can insert settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert settings" ON public.settings FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: email_events Authenticated users can manage email events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage email events" ON public.email_events USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: email_sends Authenticated users can manage email sends; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage email sends" ON public.email_sends USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: email_sequence_steps Authenticated users can manage sequence steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage sequence steps" ON public.email_sequence_steps USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: email_sequences Authenticated users can manage sequences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage sequences" ON public.email_sequences USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: leads Authenticated users can read leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read leads" ON public.leads FOR SELECT TO authenticated USING ((auth.uid() IS NOT NULL));


--
-- Name: settings Authenticated users can read settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read settings" ON public.settings FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: leads Authenticated users can update leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE USING ((auth.uid() IS NOT NULL)) WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: settings Authenticated users can update settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update settings" ON public.settings FOR UPDATE USING ((auth.uid() IS NOT NULL));


--
-- Name: email_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

--
-- Name: email_sends; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;

--
-- Name: email_sequence_steps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;

--
-- Name: email_sequences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;