import { AuditStep } from "@/pages/LinkedInAudit";
import { Wifi, ImageDown, Brain, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedInAuditStepperProps {
  currentStep: AuditStep;
}

const steps = [
  {
    id: "connecting",
    label: "Conectando con LinkedIn...",
    description: "Estableciendo conexión segura",
    icon: Wifi,
  },
  {
    id: "extracting",
    label: "Buscando perfil...",
    description: "Obteniendo datos del perfil",
    icon: ImageDown,
  },
];

export const LinkedInAuditStepper = ({ currentStep }: LinkedInAuditStepperProps) => {
  const getStepStatus = (stepId: string): "pending" | "active" | "complete" => {
    const stepOrder = ["connecting", "extracting", "analyzing"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Procesando Auditoría
        </h3>
        <p className="text-sm text-muted-foreground">
          Por favor espera mientras analizamos el perfil
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Step Icon */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500",
                    status === "complete" && "bg-primary border-primary",
                    status === "active" && "bg-primary/10 border-primary animate-pulse",
                    status === "pending" && "bg-muted border-border"
                  )}
                >
                  {status === "complete" ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : status === "active" ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Icon className={cn(
                      "w-5 h-5",
                      status === "pending" && "text-muted-foreground"
                    )} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <h4
                    className={cn(
                      "font-medium transition-colors",
                      status === "active" && "text-primary",
                      status === "complete" && "text-foreground",
                      status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {step.description}
                  </p>

                  {/* Progress indicator for active step */}
                  {status === "active" && (
                    <div className="mt-3 h-1.5 w-full max-w-xs bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
