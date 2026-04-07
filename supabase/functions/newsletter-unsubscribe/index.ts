import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return new Response(getHtmlPage("Error", "Email no proporcionado."), {
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Deactivate from newsletter_contacts
    await supabase
      .from("newsletter_contacts")
      .update({ is_active: false })
      .eq("email", email.toLowerCase().trim());

    console.log(`Unsubscribed: ${email}`);

    return new Response(
      getHtmlPage(
        "Desuscripción exitosa",
        `El email <strong>${email}</strong> ha sido removido de nuestra lista de newsletters. Ya no recibirás más correos de este tipo.`
      ),
      { headers: { ...corsHeaders, "Content-Type": "text/html" } }
    );
  } catch (error: unknown) {
    console.error("Unsubscribe error:", error);
    return new Response(
      getHtmlPage("Error", "Ocurrió un error al procesar tu solicitud. Intenta nuevamente."),
      { headers: { ...corsHeaders, "Content-Type": "text/html" }, status: 500 }
    );
  }
});

function getHtmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Elévate & Conecta</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
  <div style="max-width: 500px; margin: 40px auto; text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png" alt="Elévate & Conecta" width="180" style="margin-bottom: 24px;" />
    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px 0;">${title}</h1>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">${message}</p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">Elévate & CONECTA</p>
  </div>
</body>
</html>`;
}
