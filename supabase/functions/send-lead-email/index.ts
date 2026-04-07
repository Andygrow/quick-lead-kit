import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendLeadEmailRequest {
  name: string;
  email: string;
  resourceName: string;
  leadQuality?: string;
  adminEmail?: string;
  leadId?: string;
}

const MASTERCLASS_URL = "https://growth-starter.lovable.app/masterclass";
const GUIDE_URL = "https://drive.google.com/file/d/1hgyF44CTK7D7WzvViQD1GRP1K9udCHk8/view";
const LOGO_URL = "https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png";

const getUserEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 8px 0;">🎯 ¡Tu Guía de la Metodología CI+7 está aquí!</h1>
      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Gracias por descargarla, ${name}</p>
    </div>
    
    <div style="background: #ffffff; padding: 32px;">
      <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
        ¡Hola <strong style="color: #0052e2;">${name}</strong>! 👋
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
        Gracias por descargar la <strong>Guía de la Metodología CI+7</strong>. Este es el mismo método que usan mis clientes para transformar LinkedIn en su mejor canal de ventas.
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        Con esta guía aprenderás los <strong style="color: #ff6d00;">7 pasos fundamentales</strong> de la Metodología CI+7 para destacar en LinkedIn y generar oportunidades reales de negocio.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${GUIDE_URL}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          📥 Descargar Guía Metodología CI+7
        </a>
      </div>
      
      <div style="background: linear-gradient(135deg, #f0f7ff 0%, #fff5eb 100%); border-left: 4px solid #0052e2; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #1a1a1a; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong style="color: #0052e2;">💡 Tip:</strong> Lee cada paso con atención y aplícalo inmediatamente. Los resultados llegan cuando pasas a la acción.
        </p>
      </div>
    </div>
    
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
        
        <div style="text-align: left; background: #ffffff; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255,109,0,0.2);">
          <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">En esta Masterclass aprenderás:</p>
          <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Introducción práctica a la metodología CI+7</li>
            <li>Cómo funciona LinkedIn realmente en 2026</li>
            <li>Los 3 errores que te hacen invisible</li>
            <li>Acceso anticipado al Programa Completo</li>
          </ul>
        </div>
        
        <a href="${MASTERCLASS_URL}" target="_blank" style="display: inline-block; background: #ff6d00; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; margin-top: 16px; box-shadow: 0 4px 14px rgba(255,109,0,0.3);">
          ▶️ Ver Masterclass Grabada
        </a>
        
        <p style="color: #6b7280; font-size: 12px; margin: 16px 0 0 0;">
          ⚡ Acceso inmediato y gratuito
        </p>
      </div>
    </div>
    
    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        ¡Nos vemos en LinkedIn!
      </p>
      
      <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #0052e2; font-size: 16px; font-weight: 600; margin: 0;">Constanza Ibieta</p>
        <p style="color: #ff6d00; font-size: 14px; margin: 4px 0 0 0;">Elévate & CONECTA</p>
        <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Consultora en LinkedIn y Metodología CI+7</p>
      </div>
    </div>
    
    <div style="background-color: #1a1a2e; padding: 25px 30px; text-align: center; margin-top: 0;">
      <img src="${LOGO_URL}" alt="Elévate & Conecta" width="180" style="margin-bottom: 12px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">LinkedIn Strategy & Metodología CI+7</p>
    </div>
  </div>
</body>
</html>
`;

const getAdminEmailHtml = (name: string, email: string, resourceName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #ff6d00 0%, #ff8c33 100%); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">🔥 Nuevo Lead de Alta Calidad</h1>
    </div>
    
    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #ff6d00;">
        <p style="color: #333333; font-size: 16px; margin: 0 0 12px 0;"><strong style="color: #0052e2;">Nombre:</strong> ${name}</p>
        <p style="color: #333333; font-size: 16px; margin: 0 0 12px 0;"><strong style="color: #0052e2;">Email:</strong> <a href="mailto:${email}" style="color: #ff6d00;">${email}</a></p>
        <p style="color: #333333; font-size: 16px; margin: 0;"><strong style="color: #0052e2;">Recurso:</strong> ${resourceName}</p>
      </div>
      
      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
        Este lead usa un <strong style="color: #ff6d00;">email corporativo</strong> y ha sido clasificado como alta calidad. Considera hacer seguimiento prioritario.
      </p>
    </div>
    
    <div style="background-color: #1a1a2e; padding: 20px; text-align: center; margin-top: 0;">
      <img src="${LOGO_URL}" alt="Elévate & Conecta" width="140" style="margin-bottom: 8px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">Panel Admin</p>
    </div>
  </div>
</body>
</html>
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured - skipping email");
      return new Response(
        JSON.stringify({ success: true, message: "Email skipped - no API key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body: SendLeadEmailRequest = await req.json();
    console.log("Sending lead email:", { email: body.email, name: body.name });

    // Send user email
    const userEmailResponse = await resend.emails.send({
      from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
      to: [body.email],
      subject: "Tu Guía de la Metodología CI+7 está lista",
      html: getUserEmailHtml(body.name),
    });

    console.log("User email sent:", userEmailResponse);

    // Track email send if leadId provided
    if (body.leadId) {
      let { data: sequence } = await supabase
        .from("email_sequences")
        .select("id")
        .eq("trigger_event", "lead_created")
        .eq("is_active", true)
        .maybeSingle();

      if (sequence) {
        const { data: step } = await supabase
          .from("email_sequence_steps")
          .select("id")
          .eq("sequence_id", sequence.id)
          .eq("step_order", 1)
          .maybeSingle();

        await supabase.from("email_sends").insert({
          lead_id: body.leadId,
          sequence_id: sequence.id,
          step_id: step?.id || null,
          status: userEmailResponse.data?.id ? "sent" : "failed",
          resend_id: userEmailResponse.data?.id || null,
          sent_at: new Date().toISOString(),
        });
        console.log("Email send tracked in database");
      }
    }

    // Send admin alert for high-quality leads
    if (body.leadQuality === "high" && body.adminEmail) {
      console.log("Sending high-quality lead alert to:", body.adminEmail);
      const adminEmailResponse = await resend.emails.send({
        from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
        to: [body.adminEmail],
        subject: `🔥 Nuevo Lead de Alta Calidad: ${body.name}`,
        html: getAdminEmailHtml(body.name, body.email, body.resourceName),
      });
      console.log("Admin alert sent:", adminEmailResponse);
    }

    return new Response(
      JSON.stringify({ success: true, id: userEmailResponse.data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
