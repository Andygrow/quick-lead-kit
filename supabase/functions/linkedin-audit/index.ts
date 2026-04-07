const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// CI+7 Methodology Framework for LinkedIn Profile Analysis
const CI7_ANALYSIS_PROMPT = `Eres un experto en LinkedIn y en la Metodología CI+7 (Conexión e Interacción en 7 pasos) creada por Constanza Ibieta.

Tu tarea es analizar un perfil de LinkedIn bajo el marco de los 7 pasos de la metodología CI+7:

## LOS 7 PASOS DE LA METODOLOGÍA CI+7:

1. **OBJETIVO Y AUDIENCIA** 🎯
   - ¿El perfil tiene claro su objetivo?
   - ¿Está orientado a un cliente ideal específico?
   - ¿El mensaje es consistente con un propósito de negocio?

2. **PERFIL OPTIMIZADO** ✨
   - ¿El titular comunica una propuesta de valor clara (no solo un cargo)?
   - ¿El perfil funciona como landing page, no como CV?
   - ¿La foto es profesional y transmite confianza?
   - ¿El banner/portada refuerza la propuesta de valor?
   - ¿La sección "Acerca de" habla de beneficios para el cliente?

3. **RED DE CALIDAD** 🤝
   - ¿El número de conexiones sugiere una red activa?
   - ¿Hay evidencia de que la red está alineada con sus objetivos?

4. **NETWORKING E INTERACCIÓN** 💬
   - ¿Hay evidencia de actividad (publicaciones, comentarios)?
   - ¿Parece generar conversaciones y relaciones?

5. **CONTENIDO DE VALOR** 💡
   - ¿Hay contenido publicado visible?
   - ¿El contenido demuestra expertise y aporta valor?
   - ¿La actividad es consistente?

6. **CONSISTENCIA Y TIEMPO** ⏰
   - ¿Hay señales de presencia regular en la plataforma?
   - ¿El perfil parece actualizado?

7. **MEDICIÓN DE RESULTADOS** 📊
   - ¿Hay indicadores de resultados (testimonios, casos de éxito)?
   - ¿Servicios o logros destacados?

## INSTRUCCIONES DE ANÁLISIS:

IMPORTANTE: Si los datos del perfil están incompletos o no disponibles, indica claramente qué información falta y asigna puntuaciones "pendientes" (usa 50 como valor neutral para datos no disponibles). Sé honesto sobre las limitaciones del análisis.

Analiza el perfil proporcionado y genera un JSON con la siguiente estructura exacta:

{
  "overall_score": <número de 0 a 100>,
  "level": "<beginner|intermediate|advanced>",
  "data_quality": "<full|partial|limited>",
  "data_quality_note": "<explicación breve sobre la calidad de los datos disponibles>",
  "headline_analysis": {
    "current": "<titular actual del perfil>",
    "score": <número de 0 a 100>,
    "feedback": "<análisis del titular>",
    "suggestion": "<sugerencia de mejora del titular>"
  },
  "ci7_analysis": {
    "step_1_objetivo": {
      "name": "Objetivo y Audiencia",
      "emoji": "🎯",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_2_perfil": {
      "name": "Perfil Optimizado",
      "emoji": "✨",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "subsections": {
        "foto_perfil": { "score": <0-100>, "feedback": "<análisis>" },
        "banner": { "score": <0-100>, "feedback": "<análisis>" },
        "titular": { "score": <0-100>, "feedback": "<análisis>" },
        "acerca_de": { "score": <0-100>, "feedback": "<análisis>" }
      },
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_3_red": {
      "name": "Red de Calidad",
      "emoji": "🤝",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_4_networking": {
      "name": "Networking e Interacción",
      "emoji": "💬",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_5_contenido": {
      "name": "Contenido de Valor",
      "emoji": "💡",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_6_consistencia": {
      "name": "Consistencia y Tiempo",
      "emoji": "⏰",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    },
    "step_7_resultados": {
      "name": "Medición de Resultados",
      "emoji": "📊",
      "score": <número de 0 a 100>,
      "feedback": "<análisis de este paso>",
      "recommendations": ["<recomendación 1>", "<recomendación 2>"]
    }
  },
  "priority_actions": [
    {
      "priority": 1,
      "action": "<acción prioritaria más importante>",
      "impact": "<impacto esperado>"
    },
    {
      "priority": 2,
      "action": "<segunda acción prioritaria>",
      "impact": "<impacto esperado>"
    },
    {
      "priority": 3,
      "action": "<tercera acción prioritaria>",
      "impact": "<impacto esperado>"
    }
  ],
  "summary": "<resumen ejecutivo de 2-3 oraciones del análisis>"
}

Sé específico, constructivo y orientado a la acción. Si los datos son limitados, enfócate en lo que sí puedes analizar y sugiere que el usuario proporcione más información.
`;

interface ApifyLinkedInProfile {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  about?: string;
  profilePicture?: string;
  profilePic?: string;
  backgroundImage?: string;
  coverImage?: string;
  connections?: number;
  connectionsCount?: number;
  followersCount?: number;
  location?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    companyName?: string;
    duration?: string;
    description?: string;
  }>;
  positions?: Array<{
    title?: string;
    companyName?: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    school?: string;
    schoolName?: string;
    degree?: string;
    degreeName?: string;
  }>;
  skills?: string[];
  recommendations?: number;
  recommendationsCount?: number;
  posts?: Array<{
    text?: string;
    likes?: number;
    comments?: number;
  }>;
  activities?: Array<{
    text?: string;
    likes?: number;
    comments?: number;
  }>;
  [key: string]: unknown;
}

// Normalize profile data from different Apify actors
function normalizeProfileData(rawData: Record<string, unknown>): ApifyLinkedInProfile {
  return {
    fullName: (rawData.fullName || rawData.name || `${rawData.firstName || ''} ${rawData.lastName || ''}`.trim()) as string || undefined,
    headline: (rawData.headline || rawData.title) as string || undefined,
    summary: (rawData.summary || rawData.about || rawData.description) as string || undefined,
    profilePicture: (rawData.profilePicture || rawData.profilePic || rawData.profileImage || rawData.avatar) as string || undefined,
    backgroundImage: (rawData.backgroundImage || rawData.coverImage || rawData.coverPhoto || rawData.banner) as string || undefined,
    connections: (rawData.connections || rawData.connectionsCount || rawData.connectionCount) as number || undefined,
    location: (rawData.location || rawData.locationName) as string || undefined,
    experience: (rawData.experience || rawData.positions || rawData.workExperience) as ApifyLinkedInProfile['experience'] || undefined,
    education: rawData.education as ApifyLinkedInProfile['education'] || undefined,
    skills: (rawData.skills || rawData.skillEndorsements?.map((s: {name?: string}) => s.name)) as string[] || undefined,
    recommendations: (rawData.recommendations || rawData.recommendationsCount || rawData.recommendationsReceived) as number || undefined,
    posts: (rawData.posts || rawData.activities || rawData.recentActivity) as ApifyLinkedInProfile['posts'] || undefined,
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl, firstName, lastName, apifyWebhookData, scrapeOnly } = await req.json();

    console.log("LinkedIn Audit request received:", { 
      linkedinUrl, 
      firstName, 
      lastName,
      hasWebhookData: !!apifyWebhookData,
      scrapeOnly: !!scrapeOnly
    });

    // Get API keys - Only require LOVABLE_API_KEY if we're doing analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY && !scrapeOnly) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY");
    
    let profileData: ApifyLinkedInProfile | null = null;
    let screenshotUrl: string | null = null;
    let dataSource = "none";
    let scrapeError: string | null = null;

    // Determine search parameters
    let searchFirstName = firstName || "";
    let searchLastName = lastName || "";
    
    // If URL provided instead of name, extract name from URL
    if (linkedinUrl && !firstName) {
      const profileIdMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/\?]+)/i);
      const profileSlug = profileIdMatch ? decodeURIComponent(profileIdMatch[1]) : '';
      const slugParts = profileSlug.split('-').filter((part: string) => !/^\d+$/.test(part) && !/^[a-f0-9]{6,}$/i.test(part));
      searchFirstName = slugParts[0] ? slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1) : '';
      searchLastName = slugParts.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    
    console.log("Search parameters:", { searchFirstName, searchLastName });

    // If webhook data is provided, use it directly
    if (apifyWebhookData) {
      console.log("Using provided webhook data");
      profileData = normalizeProfileData(apifyWebhookData.profileData || apifyWebhookData);
      screenshotUrl = apifyWebhookData.screenshotUrl || null;
      dataSource = "webhook";
    } 
    // Use Apify to search by name
    else if (APIFY_API_KEY && (searchFirstName || linkedinUrl)) {
      console.log("Searching profile with Apify...");
      
      
      const actors = [
        // Primary: HarvestAPI LinkedIn Profile Search (pay-per-event, no rental)
        // Actor ID format: harvestapi~linkedin-profile-search (use ~ for Apify API)
        {
          id: "harvestapi~linkedin-profile-search",
          body: { 
            profileScraperMode: "Full",
            searchQuery: `${searchFirstName} ${searchLastName}`.trim(),
            maxItems: 1
          }
        },
      ];

      for (const actor of actors) {
        try {
          console.log(`Trying Apify actor: ${actor.id}`);
          
          const apifyResponse = await fetch(
            `https://api.apify.com/v2/acts/${actor.id}/run-sync-get-dataset-items?token=${APIFY_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(actor.body),
            }
          );

          if (apifyResponse.ok) {
            const apifyData = await apifyResponse.json();
            console.log(`Actor ${actor.id} response:`, apifyData?.length || 0, "profiles");
            
            if (apifyData && apifyData.length > 0) {
              profileData = normalizeProfileData(apifyData[0]);
              dataSource = actor.id;
              scrapeError = null;
              console.log("Profile data extracted:", {
                name: profileData.fullName,
                headline: profileData.headline?.substring(0, 50),
                hasPhoto: !!profileData.profilePicture,
              });
              break;
            }
          } else {
            const errorText = await apifyResponse.text();
            console.error(`Actor ${actor.id} error:`, apifyResponse.status, errorText);
            scrapeError = `${actor.id}: ${apifyResponse.status}`;
            
            if (apifyResponse.status === 401 || apifyResponse.status === 403) {
              continue;
            }
          }
        } catch (actorError) {
          console.error(`Error with actor ${actor.id}:`, actorError);
          continue;
        }
      }
    } 
    
    if (!profileData && !APIFY_API_KEY) {
      scrapeError = "No scraping API configured (APIFY_API_KEY required)";
    }

    // If scrapeOnly mode, return profile data without AI analysis (for confirmation step)
    if (scrapeOnly) {
      if (!profileData || !profileData.fullName) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: scrapeError || "No se encontró el perfil. Intenta con otro nombre." 
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get profile URL from raw data
      const rawData = profileData as Record<string, unknown>;
      const profileUrl = (rawData.url || rawData.profileUrl || rawData.linkedinUrl || 
        `https://www.linkedin.com/in/${(profileData.fullName || '').toLowerCase().replace(/\s+/g, '-')}`) as string;

      console.log("Scrape only mode - returning profile for confirmation:", profileData.fullName);
      
      return new Response(
        JSON.stringify({
          success: true,
          profile: {
            fullName: profileData.fullName,
            headline: profileData.headline || null,
            summary: profileData.summary || null,
            profilePicture: profileData.profilePicture || null,
            location: profileData.location || null,
            connections: profileData.connections || null,
            url: profileUrl,
            rawData: rawData, // Include raw data for follow-up analysis
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine data quality and prepare context
    let dataQuality: "full" | "partial" | "limited" = "limited";
    let dataQualityNote = "";

    if (profileData?.fullName && profileData?.headline && profileData?.summary) {
      dataQuality = "full";
      dataQualityNote = "Datos completos del perfil obtenidos correctamente.";
    } else if (profileData?.fullName || profileData?.headline) {
      dataQuality = "partial";
      dataQualityNote = "Algunos datos del perfil fueron obtenidos. El análisis puede estar incompleto.";
    } else {
      dataQuality = "limited";
      dataQualityNote = scrapeError 
        ? `No se pudo obtener datos del perfil (${scrapeError}). Análisis basado solo en la URL.`
        : "No se pudo acceder a los datos del perfil. Análisis limitado basado en la URL proporcionada.";
      
      // Create minimal data from URL
      profileData = {
        fullName: extractNameFromUrl(linkedinUrl) || "Usuario",
        headline: "No disponible - requiere acceso al perfil",
        summary: "No disponible - requiere acceso al perfil",
        connections: undefined,
        profilePicture: undefined,
        backgroundImage: undefined,
      };
    }

    // Prepare profile context for AI analysis
    const profileContext = `
## ESTADO DE LOS DATOS:
**Calidad de datos:** ${dataQuality}
**Nota:** ${dataQualityNote}
**Fuente:** ${dataSource}

## DATOS DEL PERFIL DE LINKEDIN:

**Nombre:** ${profileData.fullName || "No disponible"}
**Titular:** ${profileData.headline || "No disponible"}
**Resumen/Acerca de:** ${profileData.summary || "No disponible"}
**Conexiones:** ${profileData.connections || "No disponible"}
**Ubicación:** ${profileData.location || "No disponible"}
**Tiene foto de perfil:** ${profileData.profilePicture ? "Sí" : "No visible/No disponible"}
**Tiene banner/portada:** ${profileData.backgroundImage ? "Sí" : "No visible/No disponible"}

**Experiencia reciente:**
${profileData.experience?.slice(0, 3).map((exp, i) => 
  `${i + 1}. ${exp.title || "Sin título"} en ${exp.company || exp.companyName || "Sin empresa"} (${exp.duration || "Sin duración"})`
).join("\n") || "No disponible"}

**Skills destacados:** ${profileData.skills?.slice(0, 10).join(", ") || "No visibles"}

**Recomendaciones recibidas:** ${profileData.recommendations || "No visibles"}

**Actividad reciente (posts):**
${profileData.posts?.slice(0, 3).map((post, i) => 
  `${i + 1}. "${post.text?.substring(0, 100)}..." - ${post.likes || 0} likes, ${post.comments || 0} comentarios`
).join("\n") || "No visible o sin actividad reciente"}

**URL del perfil:** ${linkedinUrl}

## INSTRUCCIONES ESPECIALES:
${dataQuality === "limited" ? `
IMPORTANTE: Los datos del perfil NO pudieron ser extraídos. Esto significa que:
1. NO inventes datos que no tienes
2. Para los pasos donde no tienes información, indica claramente "No se pudo evaluar - datos no disponibles"
3. Usa puntuación 50 (neutral) para elementos que no puedes verificar
4. En el resumen, indica claramente que el análisis está limitado
5. Sugiere que el usuario verifique manualmente o intente de nuevo
` : ''}
`;

    console.log("Sending to AI for analysis... Data quality:", dataQuality);

    // Call Lovable AI Gateway for analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CI7_ANALYSIS_PROMPT },
          { role: "user", content: profileContext }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Error en análisis de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const aiContent = aiData.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ success: false, error: "Respuesta vacía de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse AI response - extract JSON from markdown code block if present
    let analysisResult;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : aiContent.trim();
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI content:", aiContent.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: "Error procesando análisis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add data quality info to result
    analysisResult.data_quality = dataQuality;
    analysisResult.data_quality_note = dataQualityNote;

    // Build response
    const response = {
      success: true,
      profile: {
        name: profileData.fullName || "Usuario",
        headline: profileData.headline || "",
        summary: profileData.summary || "",
        profilePicture: profileData.profilePicture || null,
        backgroundImage: profileData.backgroundImage || null,
        screenshotUrl: screenshotUrl,
        connections: profileData.connections || null,
        url: linkedinUrl,
      },
      analysis: analysisResult,
      methodology: "CI+7",
      dataSource: dataSource,
      analyzedAt: new Date().toISOString(),
    };

    console.log("Analysis complete. Data quality:", dataQuality, "Source:", dataSource);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("LinkedIn Audit error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper to extract name from LinkedIn URL
function extractNameFromUrl(url: string): string | null {
  try {
    const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    if (match) {
      const username = decodeURIComponent(match[1]);
      const cleanName = username.replace(/-\d+$/, '').split("-").map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(" ");
      return cleanName;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

// Extract profile data from Firecrawl markdown content
function extractProfileFromFirecrawl(
  markdown: string, 
  metadata: Record<string, unknown>,
  linkedinUrl: string
): ApifyLinkedInProfile {
  const lines = markdown.split('\n').filter(line => line.trim());
  
  // Try to extract name from title or first heading
  let fullName = (metadata.title as string)?.replace(' | LinkedIn', '').replace(' - LinkedIn', '').trim();
  if (!fullName) {
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    fullName = h1Match ? h1Match[1].trim() : extractNameFromUrl(linkedinUrl) || "Usuario";
  }
  
  // Extract headline - usually after the name
  let headline = '';
  const headlinePatterns = [
    /^(.+?)\s+at\s+/m,
    /^(.+?)\s+en\s+/m,
    /^([^\n]+(?:CEO|CTO|Director|Manager|Engineer|Developer|Consultant|Founder|Co-founder)[^\n]*)/mi,
  ];
  
  for (const pattern of headlinePatterns) {
    const match = markdown.match(pattern);
    if (match) {
      headline = match[1].trim();
      break;
    }
  }
  
  // If no headline found, try to get description from metadata
  if (!headline && metadata.description) {
    headline = (metadata.description as string).substring(0, 200);
  }
  
  // Extract summary/about section
  let summary = '';
  const aboutMatch = markdown.match(/(?:About|Acerca de|Extracto)\s*\n+([\s\S]*?)(?=\n#|\nExperience|\nExperiencia|\nEducation|$)/i);
  if (aboutMatch) {
    summary = aboutMatch[1].trim().substring(0, 2000);
  }
  
  // Extract experience
  const experience: ApifyLinkedInProfile['experience'] = [];
  const expMatch = markdown.match(/(?:Experience|Experiencia)\s*\n+([\s\S]*?)(?=\n#|\nEducation|\nEducación|\nSkills|\nAptitudes|$)/i);
  if (expMatch) {
    const expLines = expMatch[1].split('\n').filter(l => l.trim());
    let currentExp: { title?: string; company?: string; duration?: string } = {};
    
    for (const line of expLines.slice(0, 15)) {
      if (line.startsWith('##') || line.startsWith('**')) {
        if (currentExp.title) {
          experience.push(currentExp);
        }
        currentExp = { title: line.replace(/^[#*]+\s*/, '').trim() };
      } else if (!currentExp.company && line.trim()) {
        currentExp.company = line.trim();
      } else if (line.match(/\d{4}|Present|Actual/i)) {
        currentExp.duration = line.trim();
      }
    }
    if (currentExp.title) {
      experience.push(currentExp);
    }
  }
  
  // Extract skills
  const skills: string[] = [];
  const skillsMatch = markdown.match(/(?:Skills|Aptitudes|Habilidades)\s*\n+([\s\S]*?)(?=\n#|$)/i);
  if (skillsMatch) {
    const skillLines = skillsMatch[1].split('\n').filter(l => l.trim());
    for (const line of skillLines.slice(0, 20)) {
      const skill = line.replace(/^[-*•]\s*/, '').trim();
      if (skill && skill.length < 50) {
        skills.push(skill);
      }
    }
  }
  
  // Try to find connection count
  let connections: number | undefined;
  const connMatch = markdown.match(/(\d+)\+?\s*(?:connections|conexiones|seguidores|followers)/i);
  if (connMatch) {
    connections = parseInt(connMatch[1], 10);
  }
  
  // Extract location
  let location = '';
  const locMatch = markdown.match(/(?:Location|Ubicación)[:\s]+([^\n]+)/i);
  if (locMatch) {
    location = locMatch[1].trim();
  }
  
  console.log("Firecrawl extraction results:", {
    fullName,
    headline: headline?.substring(0, 50),
    hasSummary: !!summary,
    experienceCount: experience.length,
    skillsCount: skills.length,
    connections,
  });
  
  return {
    fullName,
    headline,
    summary,
    experience,
    skills,
    connections,
    location,
    profilePicture: undefined, // Firecrawl doesn't extract images directly
    backgroundImage: undefined,
  };
}
