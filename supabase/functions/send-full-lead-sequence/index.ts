import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MASTERCLASS_URL = "https://growth-starter.lovable.app/masterclass";
const PROGRAM_URL = "https://growth-starter.lovable.app/programa-linkedin-2026";
const GUIDE_URL = "https://drive.google.com/file/d/1hgyF44CTK7D7WzvViQD1GRP1K9udCHk8/view";

// Email templates for the 3-step welcome sequence
const getEmailTemplate = (step: number, name: string) => {
  const firstName = name.split(" ")[0];

  const templates: Record<number, { subject: string; html: string }> = {
    // Step 1: Immediate - Welcome + Guide + Masterclass Recording Invitation
    1: {
      subject: `Tu Guía de la Metodología CI+7 está lista`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 8px 0;">🎯 ¡Tu Guía de la Metodología CI+7 está aquí!</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Gracias por descargarla, ${firstName}</p>
    </div>
    
    <!-- Content -->
    <div style="background: #ffffff; padding: 32px;">
      <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
        ¡Hola <strong style="color: #0052e2;">${firstName}</strong>! 👋
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
        Gracias por descargar la <strong>Guía de la Metodología CI+7</strong>. Este es el mismo método que usan mis clientes para transformar LinkedIn en su mejor canal de ventas.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        Con esta guía aprenderás los <strong style="color: #ff6d00;">7 pasos fundamentales</strong> de la Metodología CI+7 para destacar en LinkedIn y generar oportunidades reales de negocio.
      </p>
      
      <!-- Download Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${GUIDE_URL}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          📥 Descargar Guía Metodología CI+7
        </a>
      </div>
      
      <!-- Tip box -->
      <div style="background: linear-gradient(135deg, #f0f7ff 0%, #fff5eb 100%); border-left: 4px solid #0052e2; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #1a1a1a; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong style="color: #0052e2;">💡 Tip:</strong> Lee cada paso con atención y aplícalo inmediatamente. Los resultados llegan cuando pasas a la acción.
        </p>
      </div>
    </div>
    
    <!-- MASTERCLASS RECORDING INVITATION -->
    <div style="background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); padding: 32px; border-top: 3px solid #ff6d00; border-bottom: 3px solid #ff6d00;">
      <div style="text-align: center;">
        <span style="display: inline-block; background: #ff6d00; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px;">
          🎬 DISPONIBLE AHORA
        </span>
        
        <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">
          Masterclass Grabada: LinkedIn Estratégico 2026
        </h2>
        
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
          ¿Quieres aprender a <strong>implementar la Metodología CI+7</strong> paso a paso? Mira la grabación de mi Masterclass donde te enseño cómo convertir tu perfil en un imán de clientes.
        </p>
        
        <!-- What you'll learn -->
        <div style="text-align: left; background: #ffffff; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,109,0,0.2);">
          <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">En esta Masterclass aprenderás:</p>
          <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Introducción práctica a la metodología CI+7</li>
            <li>Cómo funciona LinkedIn realmente en 2026</li>
            <li>Los 3 errores que te hacen invisible</li>
            <li>Acceso anticipado al Programa Completo</li>
          </ul>
        </div>
        
        <!-- CTA Button -->
        <a href="${MASTERCLASS_URL}" target="_blank" style="display: inline-block; background: #ff6d00; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; margin-top: 16px; box-shadow: 0 4px 14px rgba(255,109,0,0.3);">
          ▶️ Ver Masterclass Grabada
        </a>
        
        <p style="color: #6b7280; font-size: 12px; margin: 16px 0 0 0;">
          ⚡ Acceso inmediato y gratuito
        </p>
      </div>
    </div>
    
    <!-- Closing -->
    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        ¡Nos vemos en LinkedIn!
      </p>
      
      <!-- Firma -->
      <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #0052e2; font-size: 16px; font-weight: 600; margin: 0;">Constanza Ibieta</p>
        <p style="color: #ff6d00; font-size: 14px; margin: 4px 0 0 0;">Elévate & CONECTA</p>
        <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Consultora en LinkedIn y Metodología CI+7</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #1a1a2e; padding: 25px 30px; text-align: center; margin-top: 0;">
      <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png?v=1" 
           alt="Elévate & Conecta" 
           width="180" 
           style="margin-bottom: 12px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">LinkedIn Strategy & Metodología CI+7</p>
    </div>
  </div>
</body>
</html>
      `,
    },

    // Step 2: 48h - Tips + Masterclass reminder
    2: {
      subject: `¿Ya revisaste tu perfil de LinkedIn? Aquí van 3 tips rápidos`,
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
      <h1 style="color: #1a1a1a; font-size: 22px; margin: 0 0 20px 0;">Hola ${firstName} 👋</h1>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Han pasado 2 días desde que descargaste la <strong>Guía de la Metodología CI+7</strong>. 
        ¿Ya empezaste a aplicar los consejos?
      </p>
      
      <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px;">🎯 3 tips rápidos para tu perfil:</h3>
        <div style="color: #4a5568; line-height: 1.8;">
          <p style="margin: 10px 0;"><strong>1. Optimiza tu titular:</strong> Es lo primero que ven. Debe decir qué haces y para quién.</p>
          <p style="margin: 10px 0;"><strong>2. Foto profesional:</strong> Un rostro claro y amigable genera 14x más vistas.</p>
          <p style="margin: 10px 0;"><strong>3. Banner estratégico:</strong> Usa tu banner para comunicar tu propuesta de valor.</p>
        </div>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Si quieres profundizar más, te invito a ver la <strong>Masterclass grabada</strong> donde 
        explico la Metodología CI+7 completa en acción.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${MASTERCLASS_URL}" style="display: inline-block; background: linear-gradient(135deg, #0052e2, #ff6d00); color: white; text-decoration: none; padding: 14px 35px; border-radius: 25px; font-weight: bold; font-size: 15px;">
          ▶️ Ver Masterclass Grabada
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
    
    <!-- Footer -->
    <div style="background-color: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 16px 16px; margin-top: 0;">
      <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png?v=1" 
           alt="Elévate & Conecta" 
           width="140" 
           style="margin-bottom: 8px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">LinkedIn Strategy & Metodología CI+7</p>
    </div>
  </div>
</body>
</html>
      `,
    },

    // Step 3: 96h - Program invitation
    3: {
      subject: `🎯 Invitación especial: LinkedIn 2026 - Impacta con tu marca y estrategia`,
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
      <h1 style="color: #1a1a1a; font-size: 22px; margin: 0 0 20px 0;">${firstName}, tengo algo especial para ti</h1>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        Ya viste la guía, quizás exploraste la Masterclass... pero ahora viene la pregunta importante:
      </p>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        <strong>¿Estás listo/a para implementar todo esto con acompañamiento profesional?</strong>
      </p>
      
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <p style="color: #92400e; margin: 0; font-size: 15px;">
          ⚠️ El 90% de las personas que ven contenido <strong>nunca aplican lo aprendido</strong>. 
          No dejes que te pase a ti.
        </p>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        El <strong>Programa LinkedIn 2026</strong> está diseñado para que implementes paso a paso, 
        con mi acompañamiento y el de una comunidad que te apoya.
      </p>
      
      <div style="background: linear-gradient(135deg, #0052e2, #ff6d00); border-radius: 12px; padding: 30px; margin: 25px 0; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 20px;">🚀 Programa LinkedIn 2026</h3>
        <p style="margin: 0 0 10px 0; opacity: 0.95; font-size: 14px;">
          4 sesiones en vivo + comunidad + acompañamiento
        </p>
        <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold;">
          🔥 $126.000 CLP <span style="text-decoration: line-through; opacity: 0.7; font-size: 14px;">$180.000</span>
        </p>
        <p style="margin: 0 0 15px 0; opacity: 0.85; font-size: 13px;">
          📍 Marzo: 13-17-24-31 • 13:00-15:00 hrs
        </p>
        <a href="${PROGRAM_URL}" style="display: inline-block; background: white; color: #0052e2; text-decoration: none; padding: 14px 35px; border-radius: 25px; font-weight: bold; font-size: 15px;">
          Quiero inscribirme →
        </a>
      </div>
      
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
        <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 14px;">✅ Lo que incluye:</h4>
        <ul style="color: #166534; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>4 sesiones en vivo de 2 horas</li>
          <li>Implementación guiada de la Metodología CI+7</li>
          <li>Comunidad privada de networking</li>
          <li>Acceso a grabaciones de por vida</li>
          <li>Certificado de finalización</li>
        </ul>
      </div>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
        El precio de preventa ($126.000) termina el <strong>1 de Marzo</strong>. 
        Después sube a $180.000.
      </p>
      
      <p style="color: #4a5568; font-size: 14px; margin-top: 25px;">
        Éxito en todo lo que emprendas,<br>
        <strong>Constanza Ibieta</strong><br>
        <span style="color: #718096;">Elevate y Conecta</span>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 16px 16px; margin-top: 0;">
      <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png?v=1" 
           alt="Elévate & Conecta" 
           width="140" 
           style="margin-bottom: 8px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">LinkedIn Strategy & Metodología CI+7</p>
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
  resend: Resend,
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, testMode } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, email")
      .eq("email", email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: "Lead not found", details: leadError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get sequence info
    const { data: sequence } = await supabase
      .from("email_sequences")
      .select("id")
      .eq("trigger_event", "lead_created")
      .maybeSingle();

    const results: { step: number; success: boolean; subject: string; error?: string }[] = [];

    // Send all 3 emails
    for (let step = 1; step <= 3; step++) {
      const template = getEmailTemplate(step, lead.name);
      if (!template) continue;

      console.log(`Sending step ${step} to ${lead.email}: ${template.subject}`);

      const result = await sendEmail(resend, lead.email, template.subject, template.html);
      
      results.push({
        step,
        success: result.success,
        subject: template.subject,
        error: result.error,
      });

      if (result.success && !testMode) {
        // Record in database
        await supabase.from("email_sends").insert({
          lead_id: lead.id,
          sequence_id: sequence?.id,
          status: "sent",
          resend_id: result.id,
          sent_at: new Date().toISOString(),
        });
      }

      // Delay between emails to avoid rate limits
      if (step < 3) {
        await delay(1000);
      }
    }

    console.log("Sequence complete:", results);

    return new Response(
      JSON.stringify({
        success: true,
        leadName: lead.name,
        leadEmail: lead.email,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending sequence:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
