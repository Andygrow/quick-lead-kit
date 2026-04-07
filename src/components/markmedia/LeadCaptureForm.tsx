import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, Gift, Linkedin } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useUTMParams } from "@/hooks/useUTMParams";
import { pushGTMEvent } from "@/hooks/useGTM";

// Validation schema with sanitization
const leadSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "Nombre muy largo"),
  email: z.string().trim().email("Ingresa un email válido").max(255, "Email muy largo"),
  phone: z.string().trim().min(7, "El teléfono debe tener al menos 7 dígitos").max(20, "Teléfono muy largo"),
  company: z.string().trim().min(2, "Tu cargo o empresa es requerido").max(200, "Muy largo"),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface LeadCaptureFormProps {
  onUnlock: (userData: { name: string; email: string; phone: string; company: string }) => void;
}

// Check if email is corporate (not free providers)
const isCorporateEmail = (email: string): boolean => {
  const freeProviders = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
    'live.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'aol.com', 'yandex.com', 'zoho.com'
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !freeProviders.includes(domain) : false;
};

const LeadCaptureForm = ({ onUnlock }: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const utmParams = useUTMParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Use edge function to handle lead registration (handles deduplication internally)
      const { data: result, error: registerError } = await supabase.functions.invoke('register-lead', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          source: 'guide',
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_term: utmParams.utm_term || null,
        },
      });

      if (registerError) {
        console.error('Error registering lead:', registerError);
        throw registerError;
      }

      console.log('Lead registration result:', result);

      // Try to send email notification (non-blocking)
      supabase.functions.invoke('send-lead-email', {
        body: {
          name: formData.name,
          email: formData.email,
          resourceName: 'Guía Metodología CI+7',
          leadQuality: result?.isCorporateEmail ? 'high' : 'low',
          leadId: result?.leadId,
        },
      }).catch(console.error);

      // Push GTM event for successful lead form submission
      pushGTMEvent('lead_form_submit', {
        form_name: 'guia_metodologia_ci7',
        lead_quality: result?.isCorporateEmail ? 'high' : 'low',
        is_corporate_email: result?.isCorporateEmail || false,
        utm_source: utmParams.utm_source || 'direct',
        utm_medium: utmParams.utm_medium || 'none',
        utm_campaign: utmParams.utm_campaign || 'none',
      });

      toast({
        title: "¡Guía Desbloqueada!",
        description: "Ya puedes acceder a la Guía de la Metodología CI+7.",
      });

      // Trigger unlock with user data
      onUnlock({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
      });
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Hubo un problema. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Form Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-accent uppercase tracking-wide">
            Recurso Gratuito
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
          Descarga la Guía de la Metodología CI+7
        </h3>
        <p className="text-muted-foreground text-sm">
          + Recibe cada semana nuestra Newsletter con estrategias exclusivas
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Nombre completo
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Ej: María González"
            value={formData.name}
            onChange={handleChange}
            className="bg-input border-border focus:border-primary focus:ring-primary/20 h-12"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-input border-border focus:border-primary focus:ring-primary/20 h-12"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-medium">
            Teléfono / WhatsApp
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+56 9 1234 5678"
            value={formData.phone}
            onChange={handleChange}
            className="bg-input border-border focus:border-primary focus:ring-primary/20 h-12"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-foreground font-medium">
            Cargo / Empresa
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Ej: CEO de TuEmpresa"
            value={formData.company}
            onChange={handleChange}
            className="bg-input border-border focus:border-primary focus:ring-primary/20 h-12"
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 text-base font-bold gradient-cta shadow-cta hover:shadow-cta-hover transition-all duration-300 pulse-glow mt-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Quiero la Guía Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Respetamos tu privacidad. Cero spam, solo valor para tu LinkedIn.
        </p>
      </form>
    </motion.div>
  );
};

export default LeadCaptureForm;