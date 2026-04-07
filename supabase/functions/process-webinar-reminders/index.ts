import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Masterclass: Martes 7 de Abril 2026, 19:00 hrs Chile
const MASTERCLASS_CONFIG = {
  date: "2026-04-07T19:00:00-04:00",
};

const MEET_LINK = "https://meet.google.com/isv-uxdg-fwg";

// AndyGrow brand colors
const AG = {
  green: "#39e75f",
  greenDark: "#2bc94d",
  bg: "#0a0a0a",
  cardBg: "#111318",
  borderGreen: "rgba(57, 231, 95, 0.25)",
  textWhite: "#f5f5f5",
  textMuted: "#888888",
  gradientGreen: "linear-gradient(135deg, #39e75f 0%, #2bc94d 100%)",
};

const agHeader = `
  <div style="background: ${AG.bg}; padding: 32px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 1px solid ${AG.borderGreen};">
    <p style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 0;">Andy<span style="color: ${AG.green};">Grow</span></p>
    <p style="color: ${AG.textMuted}; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Sistemas de Venta con IA</p>
  </div>
`;

const agFooter = `
  <div style="background: ${AG.bg}; padding: 24px 30px; text-align: center; border-top: 1px solid ${AG.borderGreen};">
    <p style="font-size: 16px; font-weight: 900; color: #ffffff; margin: 0 0 4px 0;">Andy<span style="color: ${AG.green};">Grow</span></p>
    <p style="color: ${AG.textMuted}; font-size: 11px; margin: 0;">Arquitecto de Sistemas de Venta con IA</p>
  </div>
`;

interface WebinarRegistration {
  id: string;
  name: string;
  email: string;
  email_sequence_step: number | null;
  last_email_sent_at: string | null;
}

const getResendApiKey = async (supabase: any): Promise<string | null> => {
  const envKey = Deno.env.get("RESEND_API_KEY");
  if (envKey) return envKey;

  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "resend_api_key")
      .maybeSingle();

    return (data as { value: string } | null)?.value || null;
  } catch {
    return null;
  }
};

const getEmailTemplate = (step: number, name: string) => {
  const templates: Record<number, { subject: string; html: string }> = {
    // Step 2: Tips email (sent morning before - ~10h before)
    2: {
      subject: "💡 3 estrategias de IA que verás HOY en la Masterclass",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d;">
          ${agHeader}
          <div style="background: ${AG.cardBg}; padding: 32px;">
            <p style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0;">Hola ${name},</p>
            <p style="color: ${AG.textMuted}; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
              ¡Hoy es el día! La Masterclass es <strong style="color: ${AG.green};">hoy martes 7 de abril a las 19:00 hrs</strong>. Aquí tienes un adelanto de <strong style="color: #ffffff;">3 estrategias</strong> que cubriremos:
            </p>
            <div style="margin-bottom: 24px;">
              <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">1. IA como asistente de diseño</h3>
                <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Genera layouts profesionales sin saber diseño ni código.</p>
              </div>
              <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">2. Automatización de captación</h3>
                <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Formularios inteligentes que califican y nutren leads automáticamente.</p>
              </div>
              <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px;">
                <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">3. De landing a sistema de ventas</h3>
                <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Convierte una landing en un motor de ventas 24/7.</p>
              </div>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${MEET_LINK}" 
                 style="display: inline-block; background: ${AG.gradientGreen}; color: #0a0a0a; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px;">
                📅 Agregar a mi calendario
              </a>
            </div>
            <p style="color: #ffffff; font-size: 16px; text-align: center; margin: 0;">
              <strong style="color: ${AG.green};">¡Nos vemos hoy a las 19:00!</strong>
            </p>
          </div>
          ${agFooter}
        </div>
      `,
    },
    // Step 3: 1 hour before
    3: {
      subject: "🚨 ¡En 1 hora comienza la Masterclass!",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d;">
          ${agHeader}
          <div style="background: ${AG.cardBg}; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="font-size: 48px; margin: 0;">🚨</p>
              <h1 style="color: #ffffff; font-size: 26px; margin: 8px 0 0 0;">¡Comenzamos en 1 hora!</h1>
            </div>
            <p style="color: ${AG.textMuted}; font-size: 16px; text-align: center; margin: 0 0 24px 0;">
              ${name}, <strong style="color: ${AG.green};">en 60 minutos</strong> comienza la Masterclass de Landing Pages con IA.
            </p>
            <div style="background: rgba(57, 231, 95, 0.15); border: 3px solid ${AG.green}; border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 24px;">
              <p style="color: ${AG.green}; font-size: 22px; font-weight: bold; margin: 0 0 8px 0;">🕖 HOY a las 19:00 hrs</p>
              <p style="color: ${AG.textMuted}; font-size: 14px; margin: 0;">(Hora Chile)</p>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${MEET_LINK}" 
                 style="display: inline-block; background: ${AG.gradientGreen}; color: #0a0a0a; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: 800; font-size: 18px;">
                🎥 UNIRSE A LA MASTERCLASS
              </a>
            </div>
            <p style="color: ${AG.textMuted}; font-size: 13px; text-align: center; margin: 0;">
              Te recomiendo unirte 5 minutos antes.
            </p>
          </div>
          ${agFooter}
        </div>
      `,
    },
  };

  return templates[step] || null;
};

// Simplified timing: step 2 = morning (2-12h before), step 3 = 1h before (0-2h)
const getEmailStepForTiming = (hoursUntilMasterclass: number, currentStep: number): number | null => {
  if (hoursUntilMasterclass <= 2 && hoursUntilMasterclass > 0 && currentStep < 3) return 3;
  if (hoursUntilMasterclass <= 12 && hoursUntilMasterclass > 2 && currentStep < 2) return 2;
  return null;
};

const sendEmail = async (
  resendApiKey: string,
  email: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AndyGrow <noreply@mail1.andygrow.cl>",
        to: [email],
        subject,
        html,
      }),
    });

    const result = await res.json();
    if (result.id) {
      return { success: true, id: result.id };
    }
    return { success: false, error: result.message || "Unknown error" };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

interface RequestBody {
  testEmail?: string;
  forceStep?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let testEmail: string | undefined;
    let forceStep: number | undefined;
    try {
      const body: RequestBody = await req.json();
      testEmail = body.testEmail;
      forceStep = body.forceStep;
    } catch {
      // Normal mode
    }

    const resendApiKey = await getResendApiKey(supabase);
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ message: "Resend not configured", processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Test mode
    if (testEmail && forceStep) {
      const template = getEmailTemplate(forceStep, "Test User");
      if (!template) {
        return new Response(
          JSON.stringify({ error: `Invalid step: ${forceStep}` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      const result = await sendEmail(resendApiKey, testEmail, template.subject, template.html);
      return new Response(
        JSON.stringify({ testMode: true, email: testEmail, step: forceStep, ...result }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const masterclassDate = new Date(MASTERCLASS_CONFIG.date);
    const now = new Date();
    const hoursUntilMasterclass = (masterclassDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    console.log(`Hours until masterclass: ${hoursUntilMasterclass.toFixed(2)}`);

    if (hoursUntilMasterclass < 0) {
      return new Response(
        JSON.stringify({ message: "Masterclass has passed", processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { data: registrations, error: fetchError } = await supabase
      .from("webinar_registrations")
      .select("id, name, email, email_sequence_step, last_email_sent_at");

    if (fetchError) {
      throw new Error(`Failed to fetch registrations: ${fetchError.message}`);
    }

    console.log(`Found ${registrations?.length || 0} registrations to process`);

    let emailsSent = 0;
    const results: { email: string; step: number; success: boolean }[] = [];

    for (const reg of (registrations || []) as WebinarRegistration[]) {
      const currentStep = reg.email_sequence_step || 1;
      const stepToSend = getEmailStepForTiming(hoursUntilMasterclass, currentStep);

      if (!stepToSend) continue;

      // Rate limit: don't send if last email was < 2 hours ago
      if (reg.last_email_sent_at) {
        const hoursSinceLastEmail = (now.getTime() - new Date(reg.last_email_sent_at).getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastEmail < 2) continue;
      }

      const template = getEmailTemplate(stepToSend, reg.name);
      if (!template) continue;

      const result = await sendEmail(resendApiKey, reg.email, template.subject, template.html);
      results.push({ email: reg.email, step: stepToSend, success: result.success });

      if (result.success) {
        emailsSent++;
        await supabase
          .from("webinar_registrations")
          .update({
            email_sequence_step: stepToSend,
            last_email_sent_at: new Date().toISOString(),
          })
          .eq("id", reg.id);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return new Response(
      JSON.stringify({ processed: registrations?.length || 0, emailsSent, results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
