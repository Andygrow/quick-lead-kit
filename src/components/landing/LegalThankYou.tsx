import { CheckCircle, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LegalThankYouProps {
  resourceName: string;
}

export const LegalThankYou = ({ resourceName }: LegalThankYouProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/20 mb-4">
            <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 sm:mb-4 uppercase">
          ¡Listo!
        </h1>
        
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
          Te hemos enviado la <strong className="text-primary">{resourceName}</strong> a tu correo electrónico.
        </p>

        {/* Next Steps Card */}
        <div className="bg-secondary rounded-lg p-4 sm:p-6 border border-border mb-6 sm:mb-8 text-left">
          <h3 className="font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            ¿Qué sigue?
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                1
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base">Revisa tu bandeja de entrada</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Busca el correo de EstoyEnQuiebra.cl</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                2
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base">Completa la checklist</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Te tomará solo 3 minutos</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                3
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base">Un abogado revisará tu caso</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Te contactaremos para una evaluación preliminar gratuita</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-primary" />
            <span className="truncate">contacto@estoyenquiebra.cl</span>
          </div>
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-primary" />
            +56 9 5009 8785
          </div>
        </div>

        {/* Return Link */}
        <Button
          variant="outline"
          className="mt-6 sm:mt-8 text-foreground border-border hover:bg-secondary text-sm"
          onClick={() => window.location.reload()}
        >
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
};
