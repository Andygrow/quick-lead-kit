import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentInfoRequest {
  name: string;
  email: string;
  registrationId: string;
}

// Pricing configuration
const PRESALE_END_DATE = new Date('2026-03-01T12:00:00-03:00');
const PRESALE_PRICE = 126000;
const REGULAR_PRICE = 180000;

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, registrationId }: PaymentInfoRequest = await req.json();

    console.log(`Sending payment info email to ${email} for registration ${registrationId}`);

    if (!email || !name) {
      throw new Error("Missing required fields: email and name");
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const firstName = name.split(" ")[0];
    const paymentLink = "https://www.flow.cl/app/web/pagarBtnPago.php?token=fe2cb54ee163fbe951797fd2b08914920f2ad9ec";
    
    // Check if we're in presale period
    const now = new Date();
    const isPresale = now < PRESALE_END_DATE;
    const currentPrice = isPresale ? PRESALE_PRICE : REGULAR_PRICE;
    const savings = REGULAR_PRICE - PRESALE_PRICE;
    const discountPercent = Math.round((savings / REGULAR_PRICE) * 100);

    // Calculate days remaining for presale
    const daysRemaining = isPresale ? Math.ceil((PRESALE_END_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const presaleBadge = isPresale ? `
      <div style="background: linear-gradient(135deg, #ff6d00 0%, #ff8533 100%); border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
        <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 0 0 4px 0;">🔥 ¡PREVENTA EXCLUSIVA! -${discountPercent}%</p>
        <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 0;">Termina en ${daysRemaining} días (1 de Marzo)</p>
      </div>
    ` : '';

    const pricingDisplay = isPresale ? `
      <div style="text-align: center; margin-bottom: 15px;">
        <p style="color: #999999; font-size: 16px; text-decoration: line-through; margin: 0 0 4px 0;">Precio Regular: ${formatPrice(REGULAR_PRICE)}</p>
        <p style="color: #ff6d00; font-size: 28px; font-weight: bold; margin: 0;">Precio Preventa: ${formatPrice(PRESALE_PRICE)}</p>
        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin: 4px 0 0 0;">¡Ahorras ${formatPrice(savings)}!</p>
      </div>
    ` : `
      <p style="color: #333333; font-size: 20px; font-weight: bold; margin: 0 0 15px 0; text-align: center;">
        Inversión: ${formatPrice(REGULAR_PRICE)}
      </p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Constanza Ibieta <noreply@mail.elevateyconecta.com>",
        to: [email],
        subject: isPresale 
          ? `🔥 ${firstName}, aprovecha el -${discountPercent}% de preventa antes que termine`
          : `${firstName}, aquí tienes la información para completar tu inscripción`,
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
              <div style="background: linear-gradient(135deg, #0052e2 0%, #003399 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 10px 0; font-weight: bold;">
                  ¡Solo falta un paso, ${firstName}!
                </h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">
                  Completa tu pago para asegurar tu lugar
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  ¡Hola ${firstName}!
                </p>
                
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Gracias por pre-inscribirte al <strong style="color: #0052e2;">Programa LinkedIn 2026: Impacta con tu marca y estrategia</strong>. 
                  Tu pre-registro quedó guardado con el ID: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${registrationId ? registrationId.slice(0, 8) : 'N/A'}</code>
                </p>

                <!-- Payment Info Card -->
                <div style="background: linear-gradient(135deg, #fff8f0 0%, #ffedd5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #ff6d00;">
                  
                  ${presaleBadge}
                  
                  <h3 style="color: #ff6d00; font-size: 20px; margin: 0 0 15px 0; text-align: center;">💳 Información de Pago</h3>
                  
                  <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                    ${pricingDisplay}
                    
                    <p style="color: #666666; font-size: 14px; margin: 15px 0 10px 0;">
                      <strong>Incluye:</strong>
                    </p>
                    <ul style="color: #666666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>4 sesiones en vivo de 2 horas (10, 17, 24, 31 Mar)</li>
                      <li>Contenido base grabado</li>
                      <li>Grupo exclusivo de WhatsApp</li>
                      <li>15 plantillas y recursos descargables</li>
                      <li>Guía de perfil + Calendario de publicaciones</li>
                      <li>Acceso a grabaciones por 6 meses</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${paymentLink}" 
                       style="display: inline-block; background: linear-gradient(135deg, #ff6d00 0%, #ff8533 100%); color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 30px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 109, 0, 0.4);">
                      💳 ${isPresale ? 'PAGAR PREVENTA ' + formatPrice(PRESALE_PRICE) : 'PAGAR AHORA'}
                    </a>
                  </div>
                </div>

                <!-- Program Summary -->
                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0052e2;">
                  <h3 style="color: #0052e2; font-size: 16px; margin: 0 0 15px 0;">📅 Fechas del Programa</h3>
                  <ul style="color: #333333; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>Jueves 13 de Marzo - 13:00 a 15:00 hrs</li>
                    <li>Lunes 17 de Marzo - 13:00 a 15:00 hrs</li>
                    <li>Lunes 24 de Marzo - 13:00 a 15:00 hrs</li>
                    <li>Lunes 31 de Marzo - 13:00 a 15:00 hrs</li>
                  </ul>
                </div>

                <!-- Urgency -->
                ${isPresale ? `
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center; border: 2px solid #f59e0b;">
                  <p style="color: #92400e; font-size: 14px; font-weight: bold; margin: 0;">
                    ⏰ Precio Preventa válido hasta el 1 de Marzo 2026 a las 12:00 hrs
                  </p>
                  <p style="color: #92400e; font-size: 12px; margin: 4px 0 0 0;">
                    Después sube a ${formatPrice(REGULAR_PRICE)}
                  </p>
                </div>
                ` : `
                <div style="background: #fee2e2; border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center;">
                  <p style="color: #b91c1c; font-size: 14px; font-weight: bold; margin: 0;">
                    ⚠️ Los cupos son limitados. Asegura tu lugar hoy.
                  </p>
                </div>
                `}

                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                  Si tienes alguna pregunta sobre el pago, escríbeme directamente:
                </p>

                <!-- WhatsApp Button -->
                <div style="text-align: center; margin: 25px 0;">
                  <a href="https://wa.me/56940118070?text=Hola%20Constanza%2C%20tengo%20una%20consulta%20sobre%20el%20pago%20del%20programa" 
                     style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-size: 14px;">
                    💬 Consultar por WhatsApp
                  </a>
                </div>

                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                  Una vez completado el pago, recibirás un email de confirmación con todos los detalles para acceder al programa.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #1a1a2e; padding: 25px 30px; text-align: center;">
                <img src="https://iqirztunbbwkkxtehauy.supabase.co/storage/v1/object/public/email-assets/logo-elevate-conecta.png?v=1" 
                     alt="Elévate & Conecta" 
                     width="180" 
                     style="margin-bottom: 12px; max-width: 100%; height: auto;" />
                <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
                  LinkedIn Strategy & Social Selling
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
    console.log("Payment info email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-payment-info function:", error);
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
