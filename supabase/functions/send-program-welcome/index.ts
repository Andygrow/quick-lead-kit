import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProgramWelcomeRequest {
  name: string;
  email: string;
  programName?: string;
  paidAmount?: number;
}

// Pricing configuration
const PRESALE_END_DATE = new Date('2026-03-01T12:00:00-03:00');
const PRESALE_PRICE = 126000;
const REGULAR_PRICE = 180000;

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, programName, paidAmount }: ProgramWelcomeRequest = await req.json();

    const program = programName || "Programa LinkedIn 2026";
    console.log(`Sending program welcome email to ${email} for ${program}`);

    // Validate required fields
    if (!email || !name) {
      throw new Error("Missing required fields: email and name");
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const firstName = name.split(" ")[0];
    
    // Determine if user got presale price
    const now = new Date();
    const isPresale = now < PRESALE_END_DATE;
    const userPaidPresale = paidAmount ? paidAmount <= PRESALE_PRICE : isPresale;
    const savings = REGULAR_PRICE - PRESALE_PRICE;

    const presaleCelebration = userPaidPresale ? `
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
        <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">🎊 ¡Aprovechaste la Preventa!</p>
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Ahorraste ${formatPrice(savings)} al inscribirte antes del 1 de Marzo</p>
      </div>
    ` : '';

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
        to: [email],
        subject: `🎉 ¡Bienvenido/a al ${program}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #0052e2 0%, #ff6d00 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
                  🎉 ¡Felicitaciones, ${firstName}!
                </h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">
                  Tu inscripción ha sido confirmada
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  ¡Hola ${firstName}!
                </p>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Estoy muy contenta de tenerte en el <strong style="color: #0052e2;">${program}</strong>. 
                  Has dado un paso importante hacia transformar tu presencia en LinkedIn.
                </p>

                ${presaleCelebration}

                <!-- Program Details Card -->
                <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0edff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #0052e2;">
                  <h3 style="color: #0052e2; font-size: 18px; margin: 0 0 15px 0;">📅 Detalles del Programa</h3>
                  <ul style="color: #333333; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong style="color: #ff6d00;">Jueves 13 Mar:</strong> Metodología CI+7 y Perfil Estratégico</li>
                    <li><strong style="color: #ff6d00;">Lunes 17 Mar:</strong> Estrategia de Contenidos y Algoritmo</li>
                    <li><strong style="color: #ff6d00;">Lunes 24 Mar:</strong> IA para Contenido y Visuales</li>
                    <li><strong style="color: #ff6d00;">Lunes 31 Mar:</strong> Networking y Plan de Acción</li>
                  </ul>
                  <p style="color: #666666; font-size: 13px; margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #c4d9f8;">
                    ⏰ Horario: 13:00 a 15:00 hrs (Chile) | 📍 Plataforma: Zoom
                  </p>
                </div>

                <!-- What's Included -->
                <div style="background: linear-gradient(135deg, #fff8f0 0%, #ffedd5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #ff6d00;">
                  <h3 style="color: #ff6d00; font-size: 18px; margin: 0 0 15px 0;">🎁 Tu Acceso Incluye</h3>
                  <div style="display: grid; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">4 sesiones en vivo de 2 horas</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">Contenido base grabado (acceso previo)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">Grupo exclusivo de WhatsApp</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">15 plantillas para publicar</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">Guía de perfil + Calendario de publicaciones</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #22c55e; font-size: 16px;">✓</span>
                      <span style="color: #333333; font-size: 14px;">Acceso a grabaciones por 6 meses</span>
                    </div>
                  </div>
                </div>

                <!-- What's Next -->
                <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0052e2;">
                  <h3 style="color: #0052e2; font-size: 18px; margin: 0 0 15px 0;">🚀 Próximos Pasos</h3>
                  <ol style="color: #333333; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                    <li>Revisa el contenido base grabado que te enviaré esta semana</li>
                    <li>Únete a nuestro grupo de WhatsApp (te envío el link abajo)</li>
                    <li>Prepara tus preguntas para la primera sesión</li>
                    <li><strong style="color: #ff6d00;">¡Nos vemos el 13 de Marzo!</strong></li>
                  </ol>
                </div>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                  Si tienes alguna pregunta, no dudes en escribirme directamente por WhatsApp.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wa.me/56940118070?text=Hola%20Constanza%2C%20acabo%20de%20inscribirme%20al%20programa%20LinkedIn%202026%20🎉" 
                     style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                    💬 Únete al Grupo de WhatsApp
                  </a>
                </div>

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0;">
                  ¡Nos vemos pronto!
                </p>
                
                <p style="color: #0052e2; font-size: 18px; font-weight: bold; margin: 10px 0 0 0;">
                  Constanza Ibieta
                </p>
                <p style="color: #666666; font-size: 14px; margin: 5px 0 0 0;">
                  LinkedIn Strategist & Creadora de la Metodología CI+7
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #1a1a2e; padding: 25px 30px; text-align: center;">
                <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png?v=1" 
                     alt="Elévate & Conecta" 
                     width="180" 
                     style="margin-bottom: 12px; max-width: 100%; height: auto;" />
                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                  LinkedIn Strategy & Social Selling | Metodología CI+7
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Program welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-program-welcome function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
