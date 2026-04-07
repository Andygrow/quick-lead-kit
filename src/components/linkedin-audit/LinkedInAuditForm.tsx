import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Linkedin, Sparkles, AlertCircle, Target, Users, Heart, MessageSquare, Lightbulb, Clock, BarChart3 } from "lucide-react";

interface LinkedInAuditFormProps {
  onSubmit: (data: { firstName: string; lastName: string }) => void;
}

const ci7Steps = [
  { icon: Target, label: "Objetivo", color: "text-primary" },
  { icon: Users, label: "Perfil", color: "text-accent" },
  { icon: Heart, label: "Red", color: "text-pink-500" },
  { icon: MessageSquare, label: "Networking", color: "text-blue-500" },
  { icon: Lightbulb, label: "Contenido", color: "text-amber-500" },
  { icon: Clock, label: "Consistencia", color: "text-purple-500" },
  { icon: BarChart3, label: "Resultados", color: "text-emerald-500" },
];

export const LinkedInAuditForm = ({ onSubmit }: LinkedInAuditFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst) {
      setError("Por favor ingresa el nombre");
      return;
    }

    if (trimmedFirst.length < 2 || trimmedFirst.length > 50) {
      setError("El nombre debe tener entre 2 y 50 caracteres");
      return;
    }

    if (trimmedLast && (trimmedLast.length < 2 || trimmedLast.length > 50)) {
      setError("El apellido debe tener entre 2 y 50 caracteres");
      return;
    }

    onSubmit({ firstName: trimmedFirst, lastName: trimmedLast });
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#0077B5] via-primary to-[#0077B5]" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#0077B5]/10">
            <Linkedin className="w-6 h-6 text-[#0077B5]" />
          </div>
          <CardTitle className="text-xl">Auditoría de Perfil CI+7</CardTitle>
        </div>
        <CardDescription className="text-base">
          Ingresa el nombre de la persona cuyo perfil de LinkedIn deseas analizar.
          El sistema buscará su perfil y lo evaluará bajo los 7 pasos de la metodología CI+7.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ej: Constanza"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError("");
                }}
                className={`h-12 text-base ${error && !firstName.trim() ? "border-destructive focus-visible:ring-destructive" : ""}`}
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Ej: Ibieta"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError("");
                }}
                className="h-12 text-base"
                maxLength={50}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-[#0077B5] to-primary hover:from-[#005885] hover:to-primary/90"
          >
            <Sparkles className="w-5 h-5" />
            Buscar y Analizar Perfil
          </Button>
        </form>

        {/* CI+7 Steps Preview */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Los 7 Pasos que Analizaremos:
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {ci7Steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background border border-border/50"
                >
                  <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                  <span className="text-xs font-medium text-foreground">{step.label}</span>
                </div>
              );
            })}
          </div>

          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Análisis de tu propuesta de valor y titular
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Evaluación de identidad visual (foto y banner)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Scorecard con puntuación por cada paso CI+7
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Acciones prioritarias personalizadas
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
