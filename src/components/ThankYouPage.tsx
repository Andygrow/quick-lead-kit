import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThankYouPageProps {
  resourceName: string;
  downloadUrl?: string;
}

export const ThankYouPage = ({ resourceName, downloadUrl }: ThankYouPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
        {/* Success icon */}
        <div className="relative inline-flex">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-accent" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            ¡Gracias por tu interés!
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Tu recurso <span className="text-primary font-semibold">"{resourceName}"</span> está en camino.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-secondary/50 rounded-2xl p-8 border border-border shadow-card text-left space-y-6">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Próximos pasos:
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Revisa tu bandeja de entrada</p>
                <p className="text-sm text-muted-foreground">
                  Te hemos enviado un email con el enlace de descarga.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Descarga inmediata</p>
                <p className="text-sm text-muted-foreground">
                  Si no ves el email, revisa tu carpeta de spam.
                </p>
              </div>
            </div>
          </div>

          {downloadUrl && (
            <Button 
              asChild
              className="w-full gradient-cta text-primary-foreground font-semibold py-6 text-lg shadow-button hover:opacity-90 transition-all duration-300 group"
            >
              <a href={downloadUrl} download>
                <Download className="mr-2 h-5 w-5" />
                Descargar Ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
        </div>

        {/* Return link */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Volver al inicio
        </a>
      </div>
    </div>
  );
};
