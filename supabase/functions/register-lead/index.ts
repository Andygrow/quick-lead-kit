import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadRegistrationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  source: 'quiz' | 'guide' | 'masterclass' | 'masterclass_video' | 'program';
  // Quiz specific fields
  quiz_score?: number;
  quiz_level?: string;
  quiz_answers?: Record<string, number>;
  // UTM params
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const body: LeadRegistrationRequest = await req.json();
    console.log("Received registration request:", { 
      email: body.email, 
      source: body.source,
      name: body.name 
    });

    // Validate required fields
    if (!body.email || !body.name) {
      return new Response(
        JSON.stringify({ error: "Email y nombre son requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = body.email.trim().toLowerCase();
    
    // Check if email is corporate
    const freeProviders = [
      'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
      'live.com', 'icloud.com', 'mail.com', 'protonmail.com',
      'aol.com', 'yandex.com', 'zoho.com'
    ];
    const domain = normalizedEmail.split('@')[1]?.toLowerCase();
    const isCorporateEmail = domain ? !freeProviders.includes(domain) : false;

    // Check for existing lead (use limit(1) to handle duplicates gracefully)
    const { data: existingLeads, error: selectError } = await supabaseAdmin
      .from("leads")
      .select("id, pipeline_stage, quiz_level, quiz_score")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1);

    if (selectError) {
      console.error("Error checking existing lead:", selectError);
      throw selectError;
    }

    const existingLead = existingLeads && existingLeads.length > 0 ? existingLeads[0] : null;

    let leadId: string;
    let isNewLead = false;

    if (existingLead) {
      leadId = existingLead.id;
      console.log("Updating existing lead:", leadId);

      // Build update data based on source
      const updateData: Record<string, unknown> = {
        name: body.name.trim(),
      };

      // Only update phone if provided
      if (body.phone) {
        updateData.phone = body.phone.trim();
      }

      // Only update company if provided
      if (body.company) {
        updateData.company = body.company.trim();
      }

      // Handle pipeline stage progression based on source
      const stageOrder = ['new', 'in_progress', 'qualified', 'closed'];
      const currentStageIndex = stageOrder.indexOf(existingLead.pipeline_stage);

      if (body.source === 'masterclass' || body.source === 'masterclass_video') {
        // Advance to in_progress if not already further
        if (currentStageIndex < 1) {
          updateData.pipeline_stage = 'in_progress';
          if (existingLead.quiz_level) {
            updateData.role = `Quiz CI+7 → Masterclass Video`;
          } else {
            updateData.role = 'Masterclass Video LinkedIn';
          }
        }
      } else if (body.source === 'quiz' && body.quiz_score !== undefined) {
        // Update quiz data (always update if new quiz taken)
        updateData.quiz_score = body.quiz_score;
        updateData.quiz_level = body.quiz_level;
        updateData.quiz_answers = body.quiz_answers;
        updateData.role = `Quiz CI+7: ${body.quiz_level === 'advanced' ? 'Nivel Avanzado' : body.quiz_level === 'intermediate' ? 'Nivel Intermedio' : 'Nivel Inicial'}`;
      }

      const { error: updateError } = await supabaseAdmin
        .from("leads")
        .update(updateData)
        .eq("id", existingLead.id);

      if (updateError) {
        console.error("Error updating lead:", updateError);
        throw updateError;
      }
    } else {
      // Create new lead
      isNewLead = true;
      console.log("Creating new lead for:", normalizedEmail);

      // Determine initial role and stage based on source
      let role = 'Lead Magnet';
      let pipelineStage = 'new';
      let leadQuality = isCorporateEmail ? 'high' : 'low';

      if (body.source === 'masterclass' || body.source === 'masterclass_video') {
        role = 'Masterclass Video LinkedIn';
        pipelineStage = 'in_progress';
      } else if (body.source === 'quiz' && body.quiz_level) {
        role = `Quiz CI+7: ${body.quiz_level === 'advanced' ? 'Nivel Avanzado' : body.quiz_level === 'intermediate' ? 'Nivel Intermedio' : 'Nivel Inicial'}`;
        // Quiz beginners/intermediates are high quality leads
        if (body.quiz_level === 'beginner' || body.quiz_level === 'intermediate') {
          leadQuality = 'high';
        }
      } else if (body.source === 'guide') {
        role = 'Guía Metodología CI+7';
      }

      const insertData: Record<string, unknown> = {
        name: body.name.trim(),
        email: normalizedEmail,
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || 'Por definir',
        role,
        pipeline_stage: pipelineStage,
        is_corporate_email: isCorporateEmail,
        lead_quality: leadQuality,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        utm_term: body.utm_term || null,
      };

      // Add quiz data if present
      if (body.source === 'quiz' && body.quiz_score !== undefined) {
        insertData.quiz_score = body.quiz_score;
        insertData.quiz_level = body.quiz_level;
        insertData.quiz_answers = body.quiz_answers;
      }

      const { data: newLead, error: insertError } = await supabaseAdmin
        .from("leads")
        .insert(insertData)
        .select("id")
        .single();

      if (insertError) {
        console.error("Error inserting lead:", insertError);
        throw insertError;
      }

      leadId = newLead.id;
    }

    // For masterclass sources, also upsert into webinar_registrations
    if (body.source === 'masterclass' || body.source === 'masterclass_video') {
      // Check if already registered
      const { data: existingReg } = await supabaseAdmin
        .from("webinar_registrations")
        .select("id")
        .eq("email", normalizedEmail)
        .limit(1);

      if (!existingReg || existingReg.length === 0) {
        const { error: webinarError } = await supabaseAdmin
          .from("webinar_registrations")
          .insert({
            name: body.name.trim(),
            email: normalizedEmail,
            phone: body.phone?.trim() || null,
            utm_source: body.utm_source || null,
            utm_medium: body.utm_medium || null,
            utm_campaign: body.utm_campaign || null,
          });

        if (webinarError) {
          console.error("Error inserting webinar registration:", webinarError);
        } else {
          console.log("Webinar registration created for:", normalizedEmail);
        }
      } else {
        console.log("Webinar registration already exists for:", normalizedEmail);
      }
    }

    console.log("Lead registration successful:", { leadId, isNewLead });

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId,
        isNewLead,
        isCorporateEmail
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in register-lead:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
