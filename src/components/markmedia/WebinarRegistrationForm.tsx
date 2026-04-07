import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { webinarRegistrationSchema, WebinarRegistrationData } from '@/lib/webinarValidation';
import { useUTMParams } from '@/hooks/useUTMParams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { pushGTMEvent } from '@/hooks/useGTM';

interface WebinarRegistrationFormProps {
  onSuccess?: () => void;
}

export const WebinarRegistrationForm = ({ onSuccess }: WebinarRegistrationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const utmParams = useUTMParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WebinarRegistrationData>({
    resolver: zodResolver(webinarRegistrationSchema),
  });

  const onSubmit = async (data: WebinarRegistrationData) => {
    setIsSubmitting(true);

    try {
      // Use edge function to handle lead registration (handles deduplication internally)
      const { data: result, error: registerError } = await supabase.functions.invoke('register-lead', {
        body: {
          name: data.name,
          email: data.email.trim().toLowerCase(),
          phone: data.phone || null,
          source: 'masterclass',
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
        },
      });

      if (registerError) {
        console.error('Error registering lead:', registerError);
        throw registerError;
      }

      console.log('Lead registration result:', result);

      // Track GTM event
      pushGTMEvent('webinar_registration', {
        event_category: 'conversion',
        event_label: 'masterclass_linkedin_2026',
        user_email_domain: data.email.split('@')[1],
      });

      // Trigger welcome email sequence in background (don't await - faster UX)
      supabase.functions.invoke('send-webinar-emails', {
        body: {
          name: data.name,
          email: data.email,
          step: 1,
          leadId: result?.leadId,
        },
      }).catch(() => {
        console.log('Email sending skipped - not configured');
      });

      setIsSuccess(true);
      reset();
      
      toast({
        title: "¡Registro exitoso!",
        description: "Recibirás un email de confirmación en breve.",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      toast({
        title: "Error",
        description: error?.message || "Hubo un problema al registrarte. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          ¡Estás registrado!
        </h3>
        <p className="text-muted-foreground text-sm">
          Revisa tu email para recibir la confirmación y los detalles de acceso.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webinar-name" className="text-foreground font-medium text-sm">
          Nombre completo
        </Label>
        <Input
          id="webinar-name"
          placeholder="Tu nombre"
          {...register('name')}
          className="bg-background border-input"
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="webinar-email" className="text-foreground font-medium text-sm">
          Email
        </Label>
        <Input
          id="webinar-email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          className="bg-background border-input"
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="webinar-phone" className="text-foreground font-medium text-sm">
          Teléfono (WhatsApp)
        </Label>
        <Input
          id="webinar-phone"
          type="tel"
          placeholder="+56 9 1234 5678"
          {...register('phone')}
          className="bg-background border-input"
        />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            Reservar mi lugar gratis
          </>
        )}
      </Button>

      <p className="text-center text-muted-foreground text-xs">
        Recibirás confirmación por email y WhatsApp
      </p>
    </form>
  );
};

export default WebinarRegistrationForm;
