import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, CheckCircle2, Linkedin, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { programRegistrationSchema, ProgramRegistrationData } from '@/lib/webinarValidation';
import { useUTMParams } from '@/hooks/useUTMParams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { pushGTMEvent } from '@/hooks/useGTM';

interface ProgramRegistrationFormProps {
  onSuccess?: (registrationId: string) => void;
  paymentLink?: string;
}

export const ProgramRegistrationForm = ({ onSuccess, paymentLink }: ProgramRegistrationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlternateDate, setIsAlternateDate] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const utmParams = useUTMParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramRegistrationData>({
    resolver: zodResolver(programRegistrationSchema),
  });

  const onSubmit = async (data: ProgramRegistrationData) => {
    setIsSubmitting(true);

    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      // Check if lead already exists in leads table
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, pipeline_stage')
        .eq('email', normalizedEmail)
        .maybeSingle();

      let finalLeadId: string;

      if (existingLead) {
        // Update existing lead - advance to program stage (qualified = pending payment)
        const stageOrder = ['new', 'in_progress', 'qualified', 'closed'];
        const currentStageIndex = stageOrder.indexOf(existingLead.pipeline_stage);
        const targetStageIndex = stageOrder.indexOf('qualified');

        const dateInfo = isAlternateDate ? 'Interesado en fecha alternativa' : 'Marzo (13-17-24-31)';
        const updateData: any = {
          name: data.name,
          phone: data.phone,
          notes: `Fecha: ${dateInfo}\nLinkedIn: ${data.linkedinProfile || 'No proporcionado'}\nObjetivo: ${data.courseObjective}`,
        };

        // Only update stage if current stage is earlier (not already paid) - unless alternate date
        if (currentStageIndex < targetStageIndex && !isAlternateDate) {
          updateData.pipeline_stage = 'qualified';
        } else if (isAlternateDate && currentStageIndex < stageOrder.indexOf('in_progress')) {
          updateData.pipeline_stage = 'in_progress'; // Waitlist for March
        }

        const { error: updateError } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', existingLead.id);

        if (updateError) throw updateError;
        finalLeadId = existingLead.id;
      } else {
        // Create new lead
        const dateInfo = isAlternateDate ? 'Interesado en fecha alternativa' : 'Marzo (13-17-24-31)';
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert({
            name: data.name,
            email: normalizedEmail,
            phone: data.phone,
            company: 'Por definir',
            role: isAlternateDate ? 'Waitlist Marzo 2026' : 'Programa LinkedIn 2026',
            pipeline_stage: isAlternateDate ? 'in_progress' : 'qualified',
            notes: `Fecha: ${dateInfo}\nLinkedIn: ${data.linkedinProfile || 'No proporcionado'}\nObjetivo: ${data.courseObjective}`,
            utm_source: utmParams.utm_source || null,
            utm_medium: utmParams.utm_medium || null,
            utm_campaign: utmParams.utm_campaign || null,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        finalLeadId = newLead.id;
      }

      // Send payment info email only for February registrations
      if (!isAlternateDate) {
        try {
          await supabase.functions.invoke('send-payment-info', {
            body: {
              name: data.name,
              email: data.email,
              registrationId: finalLeadId
            }
          });
          console.log('Payment info email sent successfully');
        } catch (emailError) {
          console.log('Email sending skipped:', emailError);
        }
      }

      // Track GTM event
      pushGTMEvent('program_registration', {
        event_category: 'conversion',
        event_label: isAlternateDate ? 'programa_linkedin_waitlist_marzo' : 'programa_linkedin_2026_febrero',
        user_email_domain: data.email.split('@')[1],
      });

      setRegistrationId(finalLeadId);
      setIsSuccess(true);
      
      toast({
        title: isAlternateDate ? "¡Te anotamos!" : "¡Pre-registro exitoso!",
        description: isAlternateDate 
          ? "Te contactaremos por WhatsApp con información de la fecha de Marzo."
          : "Te enviamos un email con la información de pago.",
      });

      onSuccess?.(finalLeadId);
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al registrarte. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    pushGTMEvent('payment_click', {
      event_category: 'conversion',
      event_label: 'programa_linkedin_2026_flow',
      registration_id: registrationId,
    });
    
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
  };

  if (isSuccess) {
    // Different success messages for February vs March waitlist
    if (isAlternateDate) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            ¡Te anotamos en la lista!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Te contactaremos por WhatsApp con toda la información sobre la fecha de Marzo.
          </p>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              📅 Marzo: 13-17-24-31 • 13:00 a 15:00 hrs
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">
          ¡Pre-registro completado!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Solo falta un paso: completa tu pago para asegurar tu lugar en el Programa LinkedIn 2026.
        </p>
        
        {paymentLink ? (
          <Button 
            onClick={handlePayment}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-6"
          >
            Completar Pago
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              Te contactaremos por WhatsApp con los detalles de pago.
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program-name" className="text-foreground font-medium">
            Nombre completo *
          </Label>
          <Input
            id="program-name"
            placeholder="Tu nombre completo"
            {...register('name')}
            className="bg-background border-input"
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="program-email" className="text-foreground font-medium">
            Email *
          </Label>
          <Input
            id="program-email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            className="bg-background border-input"
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="program-phone" className="text-foreground font-medium">
          Teléfono (WhatsApp) *
        </Label>
        <Input
          id="program-phone"
          type="tel"
          placeholder="+56 9 1234 5678"
          {...register('phone')}
          className="bg-background border-input"
        />
        {errors.phone && (
          <p className="text-destructive text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* March Date Info - Fixed */}
      {!isAlternateDate && (
        <div className="p-4 rounded-xl bg-accent/10 border-2 border-accent/30">
          <div className="flex items-center justify-center gap-3 text-center">
            <Calendar className="w-5 h-5 text-accent" />
            <div>
              <p className="font-bold text-foreground">📍 Marzo: 13-17-24-31</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> 13:00 a 15:00 hrs (Chile)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* March Waitlist Info */}
      {isAlternateDate && (
        <div className="p-4 rounded-xl bg-primary/10 border-2 border-primary/30">
          <div className="flex items-center justify-center gap-3 text-center">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="font-bold text-foreground">📍 Lista de espera - Marzo</p>
              <p className="text-sm text-muted-foreground">Te contactaremos con la info de esta fecha</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="program-linkedin" className="text-foreground font-medium flex items-center gap-2">
          <Linkedin className="w-4 h-4 text-[#0077B5]" />
          Perfil de LinkedIn <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="program-linkedin"
          type="url"
          placeholder="https://linkedin.com/in/tu-perfil"
          {...register('linkedinProfile')}
          className="bg-background border-input"
        />
        {errors.linkedinProfile && (
          <p className="text-destructive text-xs">{errors.linkedinProfile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="program-objective" className="text-foreground font-medium">
          ¿Cuál es tu objetivo principal con LinkedIn? *
        </Label>
        <Textarea
          id="program-objective"
          placeholder="Cuéntanos qué quieres lograr: posicionarte como referente, generar clientes, expandir tu red, etc."
          {...register('courseObjective')}
          className="bg-background border-input min-h-[100px] resize-none"
        />
        {errors.courseObjective && (
          <p className="text-destructive text-xs">{errors.courseObjective.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className={`w-full font-bold py-6 ${isAlternateDate ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-accent hover:bg-accent/90 text-white'}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Procesando...
          </>
        ) : isAlternateDate ? (
          <>
            Anotarme en lista de espera
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        ) : (
          <>
            Continuar al Pago
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {/* Alternate Date Link */}
      <div className="text-center pt-2 border-t border-border">
        <button
          type="button"
          onClick={() => setIsAlternateDate(!isAlternateDate)}
          className="text-sm text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
        >
          {isAlternateDate 
            ? '← Volver a inscripción de Marzo' 
            : '¿No puedes en Marzo? Ver otra fecha'}
        </button>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        * Campos obligatorios. Tu información está segura.
      </p>
    </form>
  );
};

export default ProgramRegistrationForm;
