import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { webinarRegistrationSchema, WebinarRegistrationData } from '@/lib/webinarValidation';
import { useUTMParams } from '@/hooks/useUTMParams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { pushGTMEvent } from '@/hooks/useGTM';

interface MasterclassAccessFormProps {
  onSuccess?: () => void;
}

export const MasterclassAccessForm = ({ onSuccess }: MasterclassAccessFormProps) => {
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
      // Use edge function to handle lead registration
      const { data: result, error: registerError } = await supabase.functions.invoke('register-lead', {
        body: {
          name: data.name,
          email: data.email.trim().toLowerCase(),
          phone: data.phone || null,
          source: 'masterclass_video',
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
      pushGTMEvent('masterclass_video_access', {
        event_category: 'conversion',
        event_label: 'masterclass_video_unlock',
        user_email_domain: data.email.split('@')[1],
      });

      // Trigger welcome email sequence (3-email nurture sequence)
      supabase.functions.invoke('send-masterclass-video-emails', {
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
        title: "¡Acceso desbloqueado!",
        description: "Disfruta la Masterclass completa.",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Error",
        description: error?.message || "Hubo un problema. Por favor, intenta de nuevo.",
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
        className="text-center py-4"
      >
        <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          ¡Acceso desbloqueado!
        </h3>
        <p className="text-muted-foreground text-sm">
          Disfruta la Masterclass completa
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="access-name" className="text-foreground font-medium text-sm">
          Nombre completo
        </Label>
        <Input
          id="access-name"
          placeholder="Tu nombre"
          {...register('name')}
          className="bg-background border-input"
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="access-email" className="text-foreground font-medium text-sm">
          Email
        </Label>
        <Input
          id="access-email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          className="bg-background border-input"
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="access-phone" className="text-foreground font-medium text-sm">
          Teléfono (WhatsApp)
        </Label>
        <Input
          id="access-phone"
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
            Desbloqueando...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Ver Masterclass Completa
          </>
        )}
      </Button>
    </form>
  );
};

export default MasterclassAccessForm;
