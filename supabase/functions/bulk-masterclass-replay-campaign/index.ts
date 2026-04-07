import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MASTERCLASS_URL = "https://growth-starter.lovable.app/masterclass";
const PROGRAM_URL = "https://growth-starter.lovable.app/programa-linkedin-2026";

const getEmailTemplate = (name: string) => {
  const firstName = name.split(" ")[0];

  return {
    subject: `${firstName}, la Masterclass LinkedIn 2026 está disponible en grabado 🎬`,
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
      
      <!-- Header con icono -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #2563eb, #f97316); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px;">🎬</span>
        </div>
        <h1 style="color: #1a1a1a; font-size: 26px; margin: 0; line-height: 1.3;">
          ¿Te perdiste la Masterclass?<br>
          <span style="color: #f97316;">¡Ahora está disponible!</span>
        </h1>
      </div>
      
      <!-- Mensaje principal -->
      <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
        Hola ${firstName},
      </p>
      
      <p style="color: #4a5568; font-size: 16px; line-height: 1.7;">
        Sé que a veces los tiempos no coinciden. Por eso, quiero contarte que la 
        <strong>Masterclass LinkedIn Estratégico 2026</strong> ya está disponible en grabado 
        para que la veas cuando quieras.
      </p>
      
      <!-- Card de contenido -->
      <div style="background: linear-gradient(135deg, #f0f7ff, #fff7ed); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #2563eb;">
        <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 17px;">📚 En esta Masterclass aprenderás:</h3>
        <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.9;">
          <li>Cómo funciona el algoritmo de LinkedIn en 2026</li>
          <li>Por qué tu perfil actual no genera resultados</li>
          <li>Las 7 dimensiones de la metodología CI+7</li>
          <li>Estrategias para crear contenido que conecta</li>
          <li>Tu plan de acción para este año</li>
        </ul>
      </div>
      
      <!-- CTA Principal -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${MASTERCLASS_URL}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-decoration: none; padding: 18px 45px; border-radius: 30px; font-weight: bold; font-size: 17px; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);">
          🎬 Ver Masterclass Gratis
        </a>
      </div>
      
      <!-- Separador -->
      <div style="border-top: 1px solid #e2e8f0; margin: 30px 0;"></div>
      
      <!-- Programa promo -->
      <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); border-radius: 12px; padding: 25px; color: white; text-align: center;">
        <p style="margin: 0 0 10px 0; opacity: 0.9; font-size: 14px;">
          ¿Quieres implementar todo con mi acompañamiento?
        </p>
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">
          🚀 Programa LinkedIn 2026
        </h3>
        <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">
          🔥 $126.000 CLP <span style="text-decoration: line-through; opacity: 0.7; font-size: 13px;">$180.000</span>
        </p>
        <p style="margin: 0 0 15px 0; opacity: 0.85; font-size: 13px;">
          📍 Marzo: 13-17-24-31 • 13:00-15:00 hrs<br>
          ⏰ Preventa hasta el 1 de Marzo
        </p>
        <a href="${PROGRAM_URL}" style="display: inline-block; background: white; color: #2563eb; text-decoration: none; padding: 12px 28px; border-radius: 25px; font-weight: bold; font-size: 14px;">
          Conocer el Programa →
        </a>
      </div>
      
      <!-- Firma -->
      <p style="color: #4a5568; font-size: 15px; margin-top: 30px; line-height: 1.6;">
        Un abrazo,<br>
        <strong>Constanza Ibieta</strong><br>
        <span style="color: #718096;">Elevate y Conecta</span>
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 25px;">
      <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png" alt="Elévate & CONECTA" style="height: 40px; opacity: 0.8;">
      <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
        Recibiste este email porque te registraste en nuestros recursos gratuitos.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
};

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
        JSON.stringify({ success: false, error: "No API key configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Starting bulk masterclass replay campaign...");

    // Get or create the replay campaign sequence for tracking
    let { data: sequence } = await supabase
      .from("email_sequences")
      .select("id")
      .eq("trigger_event", "masterclass_replay_campaign")
      .maybeSingle();

    if (!sequence) {
      const { data: newSequence, error: seqError } = await supabase
        .from("email_sequences")
        .insert({
          name: "Campaña Masterclass en Grabado",
          description: "Email único informando que la masterclass está disponible en grabado",
          trigger_event: "masterclass_replay_campaign",
          is_active: true,
        })
        .select("id")
        .single();
      
      if (seqError) {
        console.error("Error creating sequence:", seqError);
        throw seqError;
      }
      sequence = newSequence;
    }

    console.log("Using sequence ID:", sequence?.id);

    // Get all leads with unique emails
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("id, email, name")
      .order("created_at", { ascending: true });

    if (leadsError) {
      console.error("Error fetching leads:", leadsError);
      throw leadsError;
    }

    console.log(`Found ${leads?.length || 0} leads to process`);

    // Get already sent emails for this campaign to avoid duplicates
    const { data: alreadySent } = await supabase
      .from("email_sends")
      .select("lead_id")
      .eq("sequence_id", sequence?.id);

    const sentLeadIds = new Set((alreadySent || []).map(s => s.lead_id));
    console.log(`Already sent to ${sentLeadIds.size} leads`);

    // Filter out already sent
    const leadsToSend = (leads || []).filter(lead => !sentLeadIds.has(lead.id));
    console.log(`Will send to ${leadsToSend.length} new leads`);

    // Track unique emails to avoid sending duplicates in same batch
    const processedEmails = new Set<string>();
    
    let sent = 0;
    let failed = 0;
    let skipped = 0;
    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const lead of leadsToSend) {
      // Skip if we already processed this email in this batch
      if (processedEmails.has(lead.email.toLowerCase())) {
        console.log(`Skipping duplicate email: ${lead.email}`);
        skipped++;
        continue;
      }
      processedEmails.add(lead.email.toLowerCase());

      try {
        const template = getEmailTemplate(lead.name);

        console.log(`Sending to ${lead.email}...`);
        
        const emailResponse = await resend.emails.send({
          from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
          to: [lead.email],
          subject: template.subject,
          html: template.html,
        });

        // Record the send
        await supabase.from("email_sends").insert({
          lead_id: lead.id,
          sequence_id: sequence?.id,
          status: "sent",
          resend_id: emailResponse.data?.id,
          sent_at: new Date().toISOString(),
        });

        sent++;
        results.push({ email: lead.email, success: true });
        console.log(`✓ Sent to ${lead.email} (${sent}/${leadsToSend.length})`);

        // Drip delay: 500ms between emails to avoid rate limits
        await delay(500);

      } catch (error: unknown) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.push({ email: lead.email, success: false, error: errorMessage });
        console.error(`✗ Failed to send to ${lead.email}: ${errorMessage}`);
        
        // Continue with next lead even if one fails
        await delay(500);
      }
    }

    const summary = {
      success: true,
      totalLeads: leads?.length || 0,
      alreadySent: sentLeadIds.size,
      processed: leadsToSend.length,
      sent,
      failed,
      skipped,
    };

    console.log("Campaign completed:", summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in bulk campaign:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
