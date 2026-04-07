import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PROGRAM_URL = "https://growth-starter.lovable.app/programa-linkedin-2026";
const MASTERCLASS_URL = "https://growth-starter.lovable.app/masterclass";

// Email templates for steps 2 and 3 (48h and 96h)
const getEmailTemplate = (step: number, name: string) => {
  const firstName = name.split(" ")[0];

  const templates: Record<number, { subject: string; html: string }> = {
    // Step 2: 48h - Key takeaways + program intro
    2: {
      subject: `${firstName}, ¿ya aplicaste estos 3 tips de la Masterclass?`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h1 style="color: #1a1a1a; font-size: 22px; margin: 0 0 20px 0;">Hola ${firstName},</h1>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Han pasado 2 días desde que viste la Masterclass. Quiero asegurarme de que 
        estés aprovechando al máximo lo aprendido.
      </p>
      
      <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px;">🎯 Los 3 tips más importantes:</h3>
        <div style="color: #4a5568; line-height: 1.8;">
          <p style="margin: 10px 0;"><strong>1. Optimiza tu titular:</strong> Es lo primero que ven. Debe decir qué haces y para quién.</p>
          <p style="margin: 10px 0;"><strong>2. Publica con estrategia:</strong> No es cantidad, es consistencia y valor.</p>
          <p style="margin: 10px 0;"><strong>3. Activa tu red:</strong> Comenta en publicaciones de tu sector antes de esperar que comenten en las tuyas.</p>
        </div>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Si quieres <strong>implementar la metodología CI+7 completa</strong> con mi acompañamiento, 
        el <strong>Programa LinkedIn 2026</strong> es para ti.
      </p>
      
      <div style="background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 12px; padding: 25px; margin: 25px 0; color: white;">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚀 Programa LinkedIn 2026</h3>
        <p style="margin: 0 0 10px 0; opacity: 0.9; font-size: 14px;">
          4 sesiones en vivo + comunidad + acompañamiento
        </p>
        <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold;">
          🔥 $126.000 CLP <span style="text-decoration: line-through; opacity: 0.7; font-size: 14px;">$180.000</span>
        </p>
        <p style="margin: 0 0 15px 0; opacity: 0.85; font-size: 13px;">
          📍 Marzo: 13-17-24-31 • 13:00-15:00 hrs
        </p>
        <a href="${PROGRAM_URL}" style="display: inline-block; background: white; color: #ea580c; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px;">
          Ver detalles del programa →
        </a>
      </div>
      
      <p style="color: #718096; font-size: 14px; margin-top: 25px;">
        ¿Tienes dudas? Responde este email y te ayudo personalmente.
      </p>
      
      <p style="color: #4a5568; font-size: 14px; margin-top: 25px;">
        Un abrazo,<br>
        <strong>Constanza Ibieta</strong><br>
        <span style="color: #718096;">Elevate y Conecta</span>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },

    // Step 3: 96h - Final push + urgency
    3: {
      subject: `${firstName}, última oportunidad: Programa LinkedIn 2026`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h1 style="color: #1a1a1a; font-size: 22px; margin: 0 0 20px 0;">${firstName}, tengo algo importante que contarte</h1>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Sé que viste la Masterclass y que estás interesado/a en mejorar tu presencia en LinkedIn.
      </p>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Pero aquí está la verdad: <strong>ver contenido no es lo mismo que implementarlo</strong>.
      </p>
      
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <p style="color: #92400e; margin: 0; font-size: 15px;">
          ⚠️ El 90% de las personas que ven una masterclass <strong>nunca aplican lo aprendido</strong>. 
          No dejes que te pase a ti.
        </p>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        El <strong>Programa LinkedIn 2026</strong> está diseñado para que implementes paso a paso, 
        con mi acompañamiento y el de una comunidad que te apoya.
      </p>
      
      <div style="background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 12px; padding: 30px; margin: 25px 0; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 20px;">🎯 Inscríbete al Programa</h3>
        <p style="margin: 0 0 10px 0; opacity: 0.95; font-size: 14px;">
          Cupos limitados para garantizar atención personalizada
        </p>
        <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold;">
          🔥 $126.000 CLP <span style="text-decoration: line-through; opacity: 0.7; font-size: 14px;">$180.000</span>
        </p>
        <p style="margin: 0 0 15px 0; opacity: 0.85; font-size: 13px;">
          📍 Marzo: 13-17-24-31 • 13:00-15:00 hrs
        </p>
        <a href="${PROGRAM_URL}" style="display: inline-block; background: white; color: #ea580c; text-decoration: none; padding: 14px 35px; border-radius: 25px; font-weight: bold; font-size: 15px;">
          Quiero inscribirme →
        </a>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Este es el último email que te envío sobre el programa. La decisión es tuya.
      </p>
      
      <p style="color: #4a5568; font-size: 14px; margin-top: 25px;">
        Éxito en todo lo que emprendas,<br>
        <strong>Constanza Ibieta</strong><br>
        <span style="color: #718096;">Elevate y Conecta</span>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
  };

  return templates[step] || null;
};

async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const resend = new Resend(resendApiKey);
    const response = await resend.emails.send({
      from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
      to: [to],
      subject,
      html,
    });
    return { success: true, id: response.data?.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - skipping");
      return new Response(
        JSON.stringify({ success: true, message: "Skipped - no API key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Processing masterclass video follow-up emails...");

    // Get the masterclass video sequence
    const { data: sequence } = await supabase
      .from("email_sequences")
      .select("id")
      .eq("trigger_event", "masterclass_video_access")
      .maybeSingle();

    if (!sequence) {
      console.log("No masterclass video sequence found");
      return new Response(
        JSON.stringify({ success: true, message: "No sequence configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get leads in 'in_progress' stage (Masterclass Video viewers)
    // who have at least one email_send from this sequence
    const { data: emailSends, error: sendsError } = await supabase
      .from("email_sends")
      .select(`
        id,
        lead_id,
        sent_at,
        leads!inner(id, name, email, pipeline_stage)
      `)
      .eq("sequence_id", sequence.id)
      .order("sent_at", { ascending: false });

    if (sendsError) {
      console.error("Error fetching email sends:", sendsError);
      throw sendsError;
    }

    // Group by lead_id to get latest email per lead
    const leadEmailMap = new Map<string, { 
      leadId: string; 
      name: string; 
      email: string; 
      lastSentAt: Date;
      emailCount: number;
    }>();

    for (const send of emailSends || []) {
      const leadId = send.lead_id;
      const existing = leadEmailMap.get(leadId);
      
      if (!existing) {
        leadEmailMap.set(leadId, {
          leadId,
          name: (send.leads as any).name,
          email: (send.leads as any).email,
          lastSentAt: new Date(send.sent_at!),
          emailCount: 1,
        });
      } else {
        existing.emailCount++;
      }
    }

    const now = new Date();
    let emailsSent = 0;
    const results: { email: string; step: number; success: boolean }[] = [];

    for (const [leadId, leadData] of leadEmailMap) {
      const hoursSinceLastEmail = (now.getTime() - leadData.lastSentAt.getTime()) / (1000 * 60 * 60);
      
      let stepToSend: number | null = null;
      
      // Determine which step to send based on email count and time elapsed
      if (leadData.emailCount === 1 && hoursSinceLastEmail >= 48) {
        // 48h after first email -> send step 2
        stepToSend = 2;
      } else if (leadData.emailCount === 2 && hoursSinceLastEmail >= 48) {
        // 48h after second email (96h total) -> send step 3
        stepToSend = 3;
      }

      if (!stepToSend) {
        continue;
      }

      // Don't send more than 3 emails
      if (leadData.emailCount >= 3) {
        console.log(`Lead ${leadData.email} already received 3 emails - skipping`);
        continue;
      }

      const template = getEmailTemplate(stepToSend, leadData.name);
      if (!template) {
        continue;
      }

      console.log(`Sending step ${stepToSend} to ${leadData.email} (${hoursSinceLastEmail.toFixed(1)}h since last)`);
      
      const result = await sendEmail(resendApiKey, leadData.email, template.subject, template.html);

      if (result.success) {
        emailsSent++;
        results.push({ email: leadData.email, step: stepToSend, success: true });

        // Record the email send
        await supabase.from("email_sends").insert({
          lead_id: leadId,
          sequence_id: sequence.id,
          status: "sent",
          resend_id: result.id,
          sent_at: new Date().toISOString(),
        });
      } else {
        console.error(`Failed to send to ${leadData.email}: ${result.error}`);
        results.push({ email: leadData.email, step: stepToSend, success: false });
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Processed ${emailsSent} follow-up emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing follow-up emails:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
