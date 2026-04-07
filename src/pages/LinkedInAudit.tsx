import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LinkedInAuditForm } from "@/components/linkedin-audit/LinkedInAuditForm";
import { LinkedInAuditStepper } from "@/components/linkedin-audit/LinkedInAuditStepper";
import { LinkedInAuditResults } from "@/components/linkedin-audit/LinkedInAuditResults";
import { ProfileConfirmation, ProfilePreview } from "@/components/linkedin-audit/ProfileConfirmation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, ArrowLeft, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type AuditStep = 
  | "idle" 
  | "connecting" 
  | "extracting" 
  | "confirming"
  | "analyzing" 
  | "complete" 
  | "error";

// CI+7 Step Analysis
export interface CI7StepAnalysis {
  name: string;
  emoji: string;
  score: number;
  feedback: string;
  recommendations: string[];
  subsections?: {
    [key: string]: {
      score: number;
      feedback: string;
    };
  };
}

// Full CI+7 Analysis
export interface CI7Analysis {
  step_1_objetivo: CI7StepAnalysis;
  step_2_perfil: CI7StepAnalysis;
  step_3_red: CI7StepAnalysis;
  step_4_networking: CI7StepAnalysis;
  step_5_contenido: CI7StepAnalysis;
  step_6_consistencia: CI7StepAnalysis;
  step_7_resultados: CI7StepAnalysis;
}

// Priority Action
export interface PriorityAction {
  priority: number;
  action: string;
  impact: string;
}

// Headline Analysis
export interface HeadlineAnalysis {
  current: string;
  score: number;
  feedback: string;
  suggestion: string;
}

// Full Analysis Result
export interface AnalysisResult {
  overall_score: number;
  level: "beginner" | "intermediate" | "advanced";
  headline_analysis: HeadlineAnalysis;
  ci7_analysis: CI7Analysis;
  priority_actions: PriorityAction[];
  summary: string;
}

// Profile Data
export interface ProfileData {
  name: string;
  headline: string;
  summary: string;
  profilePicture: string | null;
  backgroundImage: string | null;
  screenshotUrl: string | null;
  connections: number | null;
  url: string;
}

// Complete Audit Result
export interface AuditResult {
  success: boolean;
  profile: ProfileData;
  analysis: AnalysisResult;
  methodology: string;
  analyzedAt: string;
}

// Scraped profile data from edge function (before AI analysis)
export interface ScrapedProfileData {
  fullName: string;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  location: string | null;
  connections: number | null;
  url: string;
  rawData: Record<string, unknown>;
}

const LinkedInAudit = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AuditStep>("idle");
  const [searchName, setSearchName] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingProfile, setPendingProfile] = useState<ScrapedProfileData | null>(null);

  // Step 1: Search for profile
  const searchProfile = async (data: { firstName: string; lastName: string }) => {
    setSearchName(`${data.firstName} ${data.lastName}`.trim());
    setError(null);
    setResult(null);
    setPendingProfile(null);

    try {
      // Step 1: Connecting
      setCurrentStep("connecting");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Extracting (searching)
      setCurrentStep("extracting");

      // Call edge function with scrapeOnly flag
      const { data: responseData, error: fnError } = await supabase.functions.invoke("linkedin-audit", {
        body: { 
          firstName: data.firstName,
          lastName: data.lastName,
          scrapeOnly: true, // Only scrape, don't analyze yet
        },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw new Error(fnError.message || "Error al buscar el perfil");
      }

      if (!responseData?.success) {
        throw new Error(responseData?.error || "No se encontró el perfil");
      }

      console.log("Profile found:", responseData.profile);
      
      // Store pending profile and show confirmation
      setPendingProfile(responseData.profile as ScrapedProfileData);
      setCurrentStep("confirming");
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Error al buscar el perfil");
      setCurrentStep("error");
    }
  };

  // Step 2: Confirm and analyze
  const confirmAndAnalyze = async () => {
    if (!pendingProfile) return;

    try {
      setCurrentStep("analyzing");

      // Call edge function with full analysis (pass scraped data)
      const { data: responseData, error: fnError } = await supabase.functions.invoke("linkedin-audit", {
        body: { 
          apifyWebhookData: pendingProfile.rawData,
          linkedinUrl: pendingProfile.url,
        },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw new Error(fnError.message || "Error al analizar el perfil");
      }

      if (!responseData?.success) {
        throw new Error(responseData?.error || "Error en el análisis");
      }

      console.log("Audit result:", responseData);
      setResult(responseData as AuditResult);
      setCurrentStep("complete");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Error al analizar el perfil");
      setCurrentStep("error");
    }
  };

  // Reject and search again
  const rejectProfile = () => {
    setPendingProfile(null);
    setCurrentStep("idle");
  };

  const handleReset = () => {
    setCurrentStep("idle");
    setSearchName("");
    setResult(null);
    setError(null);
    setPendingProfile(null);
  };

  // Convert pending profile to confirmation format
  const getProfilePreview = (): ProfilePreview | null => {
    if (!pendingProfile) return null;
    
    // Extract location string from object if needed
    let locationString: string | null = null;
    if (pendingProfile.location) {
      if (typeof pendingProfile.location === 'string') {
        locationString = pendingProfile.location;
      } else if (typeof pendingProfile.location === 'object' && pendingProfile.location !== null) {
        const loc = pendingProfile.location as { linkedinText?: string; parsed?: { text?: string } };
        locationString = loc.linkedinText || loc.parsed?.text || null;
      }
    }
    
    return {
      fullName: pendingProfile.fullName,
      headline: pendingProfile.headline,
      profilePicture: pendingProfile.profilePicture,
      location: locationString,
      connections: pendingProfile.connections,
      url: pendingProfile.url,
    };
  };

  return (
    <>
      <Helmet>
        <title>LinkedIn Audit Lab | Herramientas de Desarrollo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                Módulo Experimental
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              LinkedIn Profile Audit Lab
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Analiza perfiles de LinkedIn bajo el Marco Teórico CI+7 (Conexión e Interacción en 7 pasos). 
              Evaluamos objetivo, perfil, red, networking, contenido, consistencia y resultados.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Input Form */}
            {currentStep === "idle" && (
              <LinkedInAuditForm onSubmit={searchProfile} />
            )}

            {/* Processing Stepper (connecting/extracting) */}
            {(currentStep === "connecting" || currentStep === "extracting") && (
              <Card className="p-8">
                <LinkedInAuditStepper currentStep={currentStep} />
              </Card>
            )}

            {/* Profile Confirmation */}
            {currentStep === "confirming" && getProfilePreview() && (
              <ProfileConfirmation
                profile={getProfilePreview()!}
                onConfirm={confirmAndAnalyze}
                onReject={rejectProfile}
              />
            )}

            {/* Analyzing step */}
            {currentStep === "analyzing" && (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 rounded-full bg-primary/10 animate-pulse">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Analizando bajo Marco CI+7...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluando identidad visual, propuesta de valor y autoridad
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">Procesando análisis inteligente</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Error State */}
            {currentStep === "error" && (
              <Card className="p-8 border-destructive/50 bg-destructive/5">
                <div className="text-center space-y-4">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button onClick={handleReset} variant="outline">
                    Intentar de nuevo
                  </Button>
                </div>
              </Card>
            )}

            {/* Results */}
            {currentStep === "complete" && result && (
              <LinkedInAuditResults 
                result={result} 
                onReset={handleReset} 
              />
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Este módulo está en fase experimental. Análisis basado en la Metodología CI+7.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkedInAudit;
