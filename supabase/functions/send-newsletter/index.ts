import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGO_URL = "https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png";

const UNSUBSCRIBE_BASE = "https://iqirztunbbwkkxtehauy.supabase.co/functions/v1/newsletter-unsubscribe";

const getNewsletterHtml = (content: string, subject: string, recipientEmail: string) => {
  const unsubscribeUrl = `${UNSUBSCRIBE_BASE}?email=${encodeURIComponent(recipientEmail)}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); padding: 24px 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <img src="${LOGO_URL}" alt="Elévate & Conecta" width="160" style="margin-bottom: 12px; max-width: 100%; height: auto;" />
    </div>
    
    <div style="background: #ffffff; padding: 32px; overflow: hidden;">
      <div style="color: #374151; font-size: 16px; line-height: 1.8; overflow: hidden;">${content.replace(/\n/g, '<br />').replace(/<img /g, '<img style="max-width:100%;height:auto;display:block;" ')}</div>
    </div>
    
    <div style="background-color: #1a1a2e; padding: 25px 30px; text-align: center; border-radius: 0 0 16px 16px;">
      <img src="${LOGO_URL}" alt="Elévate & Conecta" width="140" style="margin-bottom: 8px; max-width: 100%; height: auto;" />
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">LinkedIn Strategy & Metodología CI+7</p>
      <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 8px 0 0 0;">
        Si no deseas recibir más correos, <a href="${unsubscribeUrl}" style="color: rgba(255,255,255,0.7); text-decoration: underline;">haz click aquí para desuscribirte</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
};

interface SendNewsletterRequest {
  newsletter_id?: string;
  test_email?: string;
  subject?: string;
  content?: string;
  retry?: boolean;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BATCH_SIZE = 2;
const BATCH_DELAY_MS = 600;

async function sendBatch(
  resend: Resend,
  supabase: ReturnType<typeof createClient>,
  recipients: { email: string; name: string | null; source: string }[],
  newsletter: { id: string; subject: string; content: string },
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  const results = await Promise.allSettled(
    recipients.map(async (recipient) => {
      try {
        const html = getNewsletterHtml(newsletter.content, newsletter.subject, recipient.email);
        const response = await resend.emails.send({
          from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
          reply_to: "constanza@elevateyconecta.com",
          to: [recipient.email],
          subject: newsletter.subject,
          html,
        });

        await supabase
          .from("newsletter_sends")
          .update({
            status: response.data?.id ? "sent" : "failed",
            resend_id: response.data?.id || null,
            sent_at: new Date().toISOString(),
          })
          .eq("newsletter_id", newsletter.id)
          .eq("recipient_email", recipient.email);

        return !!response.data?.id;
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to send to ${recipient.email}: ${errMsg}`);
        await supabase
          .from("newsletter_sends")
          .update({ status: "failed" })
          .eq("newsletter_id", newsletter.id)
          .eq("recipient_email", recipient.email);
        return false;
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) sent++;
    else failed++;
  }

  return { sent, failed };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    const body: SendNewsletterRequest = await req.json();

    // === TEST EMAIL MODE ===
    if (body.test_email && body.subject && body.content) {
      console.log(`Sending test newsletter to: ${body.test_email}`);
      const html = getNewsletterHtml(body.content, body.subject, body.test_email);
      const response = await resend.emails.send({
        from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
        reply_to: "constanza@elevateyconecta.com",
        to: [body.test_email],
        subject: `[TEST] ${body.subject}`,
        html,
      });

      return new Response(
        JSON.stringify({ success: true, id: response.data?.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === FULL SEND MODE ===
    const { newsletter_id, retry } = body;

    if (!newsletter_id) {
      return new Response(
        JSON.stringify({ error: "newsletter_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get newsletter
    const { data: newsletter, error: nlError } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", newsletter_id)
      .single();

    if (nlError || !newsletter) {
      return new Response(
        JSON.stringify({ error: "Newsletter not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!retry && (newsletter.status === "sending" || newsletter.status === "sent")) {
      return new Response(
        JSON.stringify({ error: "Newsletter already being sent or already sent" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build recipient list
    const recipients: { email: string; name: string | null; source: string }[] = [];

    if (retry) {
      // RETRY MODE: only get pending (previously failed) sends
      const { data: pendingSends } = await supabase
        .from("newsletter_sends")
        .select("recipient_email, recipient_name, recipient_source")
        .eq("newsletter_id", newsletter_id)
        .eq("status", "pending");

      for (const send of pendingSends || []) {
        recipients.push({ email: send.recipient_email, name: send.recipient_name, source: send.recipient_source });
      }

      console.log(`Newsletter ${newsletter_id} RETRY: ${recipients.length} pending recipients`);
    } else {
      // NORMAL MODE: build from audience
      const seenEmails = new Set<string>();
      const audience = newsletter.audience;

      if (audience === "all" || audience === "leads") {
        const { data: leads } = await supabase
          .from("leads")
          .select("email, name")
          .order("created_at", { ascending: false });

        for (const lead of leads || []) {
          const emailLower = lead.email.toLowerCase().trim();
          if (!seenEmails.has(emailLower)) {
            seenEmails.add(emailLower);
            recipients.push({ email: lead.email, name: lead.name, source: "lead" });
          }
        }
      }

      if (audience === "all" || audience === "contacts") {
        const { data: contacts } = await supabase
          .from("newsletter_contacts")
          .select("email, name")
          .eq("is_active", true);

        for (const contact of contacts || []) {
          const emailLower = contact.email.toLowerCase().trim();
          if (!seenEmails.has(emailLower)) {
            seenEmails.add(emailLower);
            recipients.push({ email: contact.email, name: contact.name, source: "contact" });
          }
        }
      }

      console.log(`Newsletter ${newsletter_id}: ${recipients.length} recipients`);

      // Create send records
      const sendRecords = recipients.map(r => ({
        newsletter_id,
        recipient_email: r.email,
        recipient_name: r.name,
        recipient_source: r.source,
        status: "pending",
      }));

      for (let i = 0; i < sendRecords.length; i += 100) {
        await supabase.from("newsletter_sends").insert(sendRecords.slice(i, i + 100));
      }
    }

    // Update newsletter status
    await supabase
      .from("newsletters")
      .update({
        status: "sending",
        total_recipients: recipients.length,
        sent_at: new Date().toISOString(),
      })
      .eq("id", newsletter_id);

    // Send emails in parallel batches of BATCH_SIZE
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const result = await sendBatch(resend, supabase, batch, {
        id: newsletter_id,
        subject: newsletter.subject,
        content: newsletter.content,
      });

      sentCount += result.sent;
      failedCount += result.failed;

      // Update progress every few batches
      if ((i / BATCH_SIZE) % 3 === 0) {
        await supabase
          .from("newsletters")
          .update({ sent_count: sentCount, failed_count: failedCount })
          .eq("id", newsletter_id);
      }

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await delay(BATCH_DELAY_MS);
      }
    }

    // Final update
    await supabase
      .from("newsletters")
      .update({
        status: "sent",
        sent_count: sentCount,
        failed_count: failedCount,
        completed_at: new Date().toISOString(),
      })
      .eq("id", newsletter_id);

    console.log(`Newsletter ${newsletter_id} completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, failed: failedCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending newsletter:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
