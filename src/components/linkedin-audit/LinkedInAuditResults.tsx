import { AuditResult, CI7StepAnalysis } from "@/pages/LinkedInAudit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  ExternalLink, 
  Target,
  Users,
  Heart,
  MessageSquare,
  Lightbulb,
  Clock,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Trophy,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkedInAuditResultsProps {
  result: AuditResult;
  onReset: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 75) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-orange-500";
};

const getScoreBgClass = (score: number): string => {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-orange-500";
};

const getLevelData = (level: string) => {
  switch (level) {
    case "advanced":
      return {
        label: "Nivel Avanzado",
        icon: Trophy,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
      };
    case "intermediate":
      return {
        label: "Nivel Intermedio",
        icon: AlertCircle,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
      };
    default:
      return {
        label: "Nivel Inicial",
        icon: AlertTriangle,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
      };
  }
};

// Map CI+7 steps to icons and colors
const ci7StepConfig: Record<string, { icon: typeof Target; gradient: string; iconBg: string; iconColor: string }> = {
  step_1_objetivo: { icon: Target, gradient: "from-primary/10 to-primary/5", iconBg: "bg-primary/10", iconColor: "text-primary" },
  step_2_perfil: { icon: Users, gradient: "from-accent/10 to-accent/5", iconBg: "bg-accent/10", iconColor: "text-accent" },
  step_3_red: { icon: Heart, gradient: "from-pink-500/10 to-pink-500/5", iconBg: "bg-pink-500/10", iconColor: "text-pink-500" },
  step_4_networking: { icon: MessageSquare, gradient: "from-blue-500/10 to-blue-500/5", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
  step_5_contenido: { icon: Lightbulb, gradient: "from-amber-500/10 to-amber-500/5", iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
  step_6_consistencia: { icon: Clock, gradient: "from-purple-500/10 to-purple-500/5", iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
  step_7_resultados: { icon: BarChart3, gradient: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
};

// CI7 Step Card Component
const CI7StepCard = ({ 
  stepKey, 
  stepData 
}: { 
  stepKey: string; 
  stepData: CI7StepAnalysis;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = ci7StepConfig[stepKey] || ci7StepConfig.step_1_objetivo;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl overflow-hidden border border-border/50 transition-all duration-300",
        isOpen && "shadow-md"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 flex items-center gap-3 text-left transition-colors",
          `bg-gradient-to-r ${config.gradient}`
        )}
      >
        <div className={cn("p-2 rounded-lg", config.iconBg)}>
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{stepData.emoji}</span>
            <h4 className="font-semibold text-foreground truncate">{stepData.name}</h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn("text-2xl font-bold", getScoreColor(stepData.score))}>
            {stepData.score}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-card">
              {/* Progress */}
              <Progress value={stepData.score} className="h-2" />

              {/* Feedback */}
              <p className="text-foreground">{stepData.feedback}</p>

              {/* Subsections if available */}
              {stepData.subsections && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(stepData.subsections).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className={cn("text-sm font-bold", getScoreColor(value.score))}>
                          {value.score}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80">{value.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2">
                <h5 className="font-medium text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Recomendaciones:
                </h5>
                <ul className="space-y-2">
                  {stepData.recommendations.map((rec, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const LinkedInAuditResults = ({ 
  result, 
  onReset 
}: LinkedInAuditResultsProps) => {
  const { profile, analysis } = result;
  const levelData = getLevelData(analysis.level);
  const LevelIcon = levelData.icon;

  // Get ordered CI7 steps
  const ci7Steps = Object.entries(analysis.ci7_analysis) as [string, CI7StepAnalysis][];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Score and Level */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold text-accent">Análisis CI+7</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className={cn("text-5xl font-bold", getScoreColor(analysis.overall_score))}>
                    {analysis.overall_score}
                  </div>
                  <p className="text-xs text-muted-foreground">puntos / 100</p>
                </div>
              </div>

              {/* Level Badge */}
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-xl border",
                levelData.bgColor,
                levelData.borderColor
              )}>
                <LevelIcon className={cn("w-8 h-8", levelData.color)} />
                <div>
                  <p className={cn("font-bold", levelData.color)}>{levelData.label}</p>
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                </div>
              </div>

              {/* Profile Link */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(profile.url, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                Ver perfil en LinkedIn
              </Button>
            </div>

            {/* Right: Headline Analysis */}
            <div className="lg:w-96 space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">Análisis del Titular</h4>
                  <Badge className={cn(getScoreBgClass(analysis.headline_analysis.score), "text-white")}>
                    {analysis.headline_analysis.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "{analysis.headline_analysis.current}"
                </p>
                <p className="text-sm text-foreground mb-3">
                  {analysis.headline_analysis.feedback}
                </p>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs font-medium text-primary mb-1">💡 Sugerencia:</p>
                  <p className="text-sm text-foreground">{analysis.headline_analysis.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Acciones Prioritarias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {analysis.priority_actions.map((action) => (
              <div 
                key={action.priority}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{action.priority}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Prioridad {action.priority}</span>
                </div>
                <p className="font-medium text-foreground mb-1">{action.action}</p>
                <p className="text-sm text-muted-foreground">{action.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CI+7 Detailed Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Análisis Detallado CI+7
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Evaluación de los 7 pasos de la metodología Conexión e Interacción
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ci7Steps.map(([key, stepData]) => (
              <CI7StepCard key={key} stepKey={key} stepData={stepData} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Score Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {ci7Steps.map(([key, stepData]) => {
              const config = ci7StepConfig[key] || ci7StepConfig.step_1_objetivo;
              const Icon = config.icon;
              return (
                <div key={key} className="text-center p-2 rounded-lg bg-muted/30">
                  <Icon className={cn("w-4 h-4 mx-auto mb-1", config.iconColor)} />
                  <div className={cn("text-lg font-bold", getScoreColor(stepData.score))}>
                    {stepData.score}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{stepData.emoji}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Analizar otro perfil
        </Button>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          onClick={() => window.open("https://www.linkedin.com/in/constanzaibietaillanes", "_blank")}
        >
          Solicitar consultoría CI+7
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
