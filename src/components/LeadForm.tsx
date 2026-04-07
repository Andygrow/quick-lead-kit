import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { leadFormSchema, LeadFormData, isCorporateEmail } from '@/lib/validation';
import { useUTMParams } from '@/hooks/useUTMParams';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  resourceName: string;
  onSuccess: () => void;
}

export const LeadForm = ({ resourceName, onSuccess }: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utmParams = useUTMParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      const isCorporate = isCorporateEmail(data.email);
      
      // Insert lead into database
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          role: data.role,
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_term: utmParams.utm_term || null,
          is_corporate_email: isCorporate,
          lead_quality: isCorporate ? 'high' : 'low',
        });

      if (insertError) throw insertError;

      // Trigger email via edge function
      try {
        await supabase.functions.invoke('send-lead-email', {
          body: {
            name: data.name,
            email: data.email,
            resourceName,
          },
        });
      } catch (emailError) {
        console.log('Email sending skipped - Resend not configured');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-form-foreground font-medium">
          Nombre completo
        </Label>
        <Input
          id="name"
          placeholder="Tu nombre"
          {...register('name')}
          className="bg-form-input border-form-border text-form-foreground placeholder:text-form-muted focus:ring-primary"
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-form-foreground font-medium">
          Email corporativo
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@empresa.com"
          {...register('email')}
          className="bg-form-input border-form-border text-form-foreground placeholder:text-form-muted focus:ring-primary"
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-form-foreground font-medium">
          Teléfono
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+56 9 1234 5678"
          {...register('phone')}
          className="bg-form-input border-form-border text-form-foreground placeholder:text-form-muted focus:ring-primary"
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-form-foreground font-medium">
          Empresa
        </Label>
        <Input
          id="company"
          placeholder="Nombre de tu empresa"
          {...register('company')}
          className="bg-form-input border-form-border text-form-foreground placeholder:text-form-muted focus:ring-primary"
        />
        {errors.company && (
          <p className="text-destructive text-sm">{errors.company.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-form-foreground font-medium">
          Rol / Cargo
        </Label>
        <Input
          id="role"
          placeholder="Ej: Director de Marketing"
          {...register('role')}
          className="bg-form-input border-form-border text-form-foreground placeholder:text-form-muted focus:ring-primary"
        />
        {errors.role && (
          <p className="text-destructive text-sm">{errors.role.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-cta text-primary-foreground font-semibold py-6 text-lg shadow-button hover:opacity-90 transition-all duration-300 group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Descargar Gratis
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-center text-form-muted text-xs">
        Al enviar, aceptas nuestra política de privacidad. No spam, prometido.
      </p>
    </form>
  );
};
