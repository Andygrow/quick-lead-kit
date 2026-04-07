import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendWebinarEmailRequest {
  name: string;
  email: string;
  step: number;
  leadId?: string;
}

const getResendApiKey = async (): Promise<string | null> => {
  const envKey = Deno.env.get("RESEND_API_KEY");
  if (envKey) return envKey;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "resend_api_key")
      .maybeSingle();

    return data?.value || null;
  } catch {
    return null;
  }
};

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
    <p style="color: ${AG.textMuted}; font-size: 10px; margin: 8px 0 0 0;">© ${new Date().getFullYear()} AndyGrow. Todos los derechos reservados.</p>
  </div>
`;

const emailTemplates = {
  1: {
    subject: "✅ ¡Confirmado! Tu lugar en la Masterclass está reservado",
    getHtml: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d;">
        ${agHeader}
        
        <div style="background: ${AG.cardBg}; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <p style="font-size: 40px; margin: 0;">🎉</p>
            <h1 style="color: #ffffff; font-size: 24px; margin: 8px 0 4px 0;">¡Bienvenido/a, ${name}!</h1>
            <p style="color: ${AG.green}; font-size: 16px; margin: 0; font-weight: 600;">Tu lugar está confirmado</p>
          </div>

          <div style="background: rgba(57, 231, 95, 0.08); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: ${AG.green}; font-size: 16px; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 1px;">📅 Detalles del evento</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="color: ${AG.textMuted}; padding: 6px 0; font-size: 14px;">Masterclass</td><td style="color: #ffffff; padding: 6px 0; font-size: 14px; font-weight: 600;">Crea tu Landing Page con IA</td></tr>
              <tr><td style="color: ${AG.textMuted}; padding: 6px 0; font-size: 14px;">Fecha</td><td style="color: #ffffff; padding: 6px 0; font-size: 14px; font-weight: 600;">Martes 7 de Abril, 2026</td></tr>
              <tr><td style="color: ${AG.textMuted}; padding: 6px 0; font-size: 14px;">Hora</td><td style="color: #ffffff; padding: 6px 0; font-size: 14px; font-weight: 600;">19:00 hrs (Chile)</td></tr>
              <tr><td style="color: ${AG.textMuted}; padding: 6px 0; font-size: 14px;">Modalidad</td><td style="color: #ffffff; padding: 6px 0; font-size: 14px; font-weight: 600;">Online en vivo (Google Meet)</td></tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://meet.google.com/isv-uxdg-fwg" 
               style="display: inline-block; background: ${AG.gradientGreen}; color: #0a0a0a; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 800; font-size: 16px;">
              🎥 Link de acceso a la Masterclass
            </a>
            <p style="color: ${AG.textMuted}; font-size: 12px; margin: 8px 0 0 0;">Guarda este enlace, lo necesitarás el día del evento</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Lo que aprenderás:</h3>
            <div style="background: rgba(57, 231, 95, 0.05); border-left: 3px solid ${AG.green}; padding: 16px 20px; margin-bottom: 8px; border-radius: 0 8px 8px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 0;">🤖 Cómo crear landing pages con IA en minutos</p>
            </div>
            <div style="background: rgba(57, 231, 95, 0.05); border-left: 3px solid ${AG.green}; padding: 16px 20px; margin-bottom: 8px; border-radius: 0 8px 8px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 0;">⚡ Automatiza tu captación de leads desde el día 1</p>
            </div>
            <div style="background: rgba(57, 231, 95, 0.05); border-left: 3px solid ${AG.green}; padding: 16px 20px; border-radius: 0 8px 8px 0;">
              <p style="color: #ffffff; font-size: 14px; margin: 0;">🎁 Llévate una plantilla de landing page lista para usar</p>
            </div>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://andygrow.lovable.app" 
               style="display: inline-block; background: ${AG.gradientGreen}; color: #0a0a0a; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 800; font-size: 16px;">
              Ver más detalles →
            </a>
          </div>

          <p style="color: ${AG.textMuted}; font-size: 13px; text-align: center; margin: 0;">
            Te enviaremos un recordatorio antes del evento con el link de acceso.
          </p>
        </div>
        
        ${agFooter}
      </div>
    `,
  },
  2: {
    subject: "💡 3 estrategias de IA que verás en la Masterclass",
    getHtml: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d;">
        ${agHeader}
        
        <div style="background: ${AG.cardBg}; padding: 32px;">
          <p style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0;">Hola ${name},</p>
          <p style="color: ${AG.textMuted}; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Falta poco para la Masterclass del <strong style="color: ${AG.green};">martes 7 de abril</strong>. Mientras tanto, quiero adelantarte <strong style="color: #ffffff;">3 estrategias</strong> que cubriremos:
          </p>

          <div style="margin-bottom: 24px;">
            <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
              <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">1. IA como tu asistente de diseño</h3>
              <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Aprende a usar IA para generar layouts profesionales sin saber diseño ni código.</p>
            </div>
            
            <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
              <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">2. Automatización de captación</h3>
              <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Configura formularios inteligentes que califican y nutren leads automáticamente.</p>
            </div>
            
            <div style="background: rgba(57, 231, 95, 0.06); border: 1px solid ${AG.borderGreen}; border-radius: 12px; padding: 20px;">
              <h3 style="color: ${AG.green}; font-size: 15px; margin: 0 0 8px 0;">3. De landing a sistema de ventas</h3>
              <p style="color: ${AG.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Convierte una simple landing page en un motor de ventas que trabaja 24/7.</p>
            </div>
          </div>

          <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            Todo esto y más en la Masterclass gratuita.<br>
            <strong style="color: ${AG.green};">¡Nos vemos el martes 7 de abril a las 19:00 hrs!</strong>
          </p>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 0;">Andy</p>
            <p style="color: ${AG.textMuted}; font-size: 12px; margin: 4px 0 0 0;">AndyGrow · Sistemas de Venta con IA</p>
          </div>
        </div>
        
        ${agFooter}
      </div>
    `,
  },
  3: {
    subject: "⏰ ¡Mañana es la Masterclass de Landing Pages con IA!",
    getHtml: (name: string) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d;">
        ${agHeader}
        
        <div style="background: ${AG.cardBg}; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <p style="font-size: 48px; margin: 0 0 8px 0;">⏰</p>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">¡Mañana es el día, ${name}!</h1>
          </div>

          <div style="background: rgba(57, 231, 95, 0.1); border: 2px solid ${AG.green}; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h2 style="color: ${AG.green}; font-size: 18px; margin: 0 0 12px 0;">Masterclass: Landing Pages con IA</h2>
            <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0 0 4px 0;">📅 Martes 7 de Abril, 2026</p>
            <p style="color: #ffffff; font-size: 16px; margin: 0;">🕖 19:00 hrs (Chile)</p>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://meet.google.com/isv-uxdg-fwg" 
               style="display: inline-block; background: ${AG.gradientGreen}; color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 800; font-size: 18px;">
              🎥 UNIRSE A LA MASTERCLASS
            </a>
          </div>

          <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.08);">
            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">📋 Checklist para mañana:</h3>
            <ul style="color: ${AG.textMuted}; line-height: 2.2; padding-left: 20px; margin: 0; font-size: 14px;">
              <li>✅ Conéctate unos minutos antes</li>
              <li>✅ Ten tu computador listo para seguir los pasos</li>
              <li>✅ Prepara tus preguntas para la sesión de Q&A</li>
              <li>✅ Busca un lugar tranquilo sin distracciones</li>
            </ul>
          </div>

          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; margin: 0;">
            <strong style="color: ${AG.green};">¡Te espero mañana a las 19:00 hrs!</strong>
          </p>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 24px;">
            <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 0;">Andy</p>
            <p style="color: ${AG.textMuted}; font-size: 12px; margin: 4px 0 0 0;">AndyGrow · Sistemas de Venta con IA</p>
          </div>
        </div>
        
        ${agFooter}
      </div>
    `,
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = await getResendApiKey();
    
    if (!resendApiKey) {
      console.log("Resend API Key not configured - skipping email send");
      return new Response(
        JSON.stringify({ message: "Email sending skipped - Resend not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, step, leadId }: SendWebinarEmailRequest = await req.json();
    console.log(`Sending webinar email step ${step} to ${email}`);

    const template = emailTemplates[step as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Invalid email step: ${step}`);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AndyGrow <noreply@mail1.andygrow.cl>",
        to: [email],
        subject: template.subject,
        html: template.getHtml(name),
      }),
    });

    const result = await res.json();
    console.log("Email sent:", result);

    // Update the registration with the last email sent
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase
      .from("webinar_registrations")
      .update({
        email_sequence_step: step,
        last_email_sent_at: new Date().toISOString(),
      })
      .eq("email", email);

    // Record email send in database for analytics
    if (leadId) {
      const { data: sequence } = await supabase
        .from("email_sequences")
        .select("id")
        .eq("trigger_event", "webinar_registration")
        .eq("is_active", true)
        .maybeSingle();

      let stepId = null;
      if (sequence) {
        const { data: stepData } = await supabase
          .from("email_sequence_steps")
          .select("id")
          .eq("sequence_id", sequence.id)
          .eq("step_order", step)
          .maybeSingle();
        stepId = stepData?.id || null;

        await supabase
          .from("email_sends")
          .insert({
            lead_id: leadId,
            sequence_id: sequence.id,
            step_id: stepId,
            status: result?.id ? 'sent' : 'failed',
            resend_id: result?.id || null,
            sent_at: new Date().toISOString(),
          });
      }
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
