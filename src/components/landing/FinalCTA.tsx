import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useUTMParams } from '@/hooks/useUTMParams';
import { isCorporateEmail } from '@/lib/validation';

const emailSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface FinalCTAProps {
  headline: string;
  reminder: string;
  ctaText: string;
  resourceName: string;
  onSuccess: () => void;
}

export const FinalCTA = ({
  headline,
  reminder,
  ctaText,
  resourceName,
  onSuccess,
}: FinalCTAProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utmParams = useUTMParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    try {
      const isCorporate = isCorporateEmail(data.email);

      await supabase.from('leads').insert({
        name: 'Lead rápido',
        email: data.email,
        company: 'Por definir',
        role: 'Por definir',
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        is_corporate_email: isCorporate,
        lead_quality: isCorporate ? 'high' : 'low',
      });

      try {
        await supabase.functions.invoke('send-lead-email', {
          body: { name: 'Usuario', email: data.email, resourceName },
        });
      } catch {
        console.log('Email skipped');
      }

      onSuccess();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-foreground text-white">
      <div className="container max-w-3xl mx-auto px-4 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
          {headline}
        </h2>

        {/* Reminder */}
        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10">
          {reminder}
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
        >
          <div className="flex-1">
            <Input
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className="h-14 md:h-16 text-base md:text-lg px-6 bg-white text-foreground border-0 rounded-xl"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-2 text-left">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 md:h-16 px-8 text-base md:text-lg font-bold gradient-cta text-white shadow-cta hover:shadow-cta-hover transition-all duration-300 rounded-xl group"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        {/* Micro-text */}
        <p className="text-sm text-white/50 mt-4">
          Sin spam. Cancela cuando quieras.
        </p>
      </div>
    </section>
  );
};