import { FileCheck, Check, AlertTriangle } from 'lucide-react';
import { InsolvencyQuiz } from './InsolvencyQuiz';

interface LegalHeroSectionProps {
  tagline: string;
  headline: string;
  subheadline: string;
  benefits: Array<{ title: string; description: string }>;
  ctaText: string;
  onSuccess: () => void;
}

export const LegalHeroSection = ({
  tagline,
  headline,
  subheadline,
  benefits,
  ctaText,
  onSuccess,
}: LegalHeroSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(90 100% 50% / 0.1) 0%, transparent 50%)' }} />
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Column - Copy (appears second on mobile) */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-primary/50 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 bg-primary/10">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="leading-tight">{tagline}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-2 sm:mb-4 uppercase tracking-tight">
              <span className="text-foreground">Descubre si estás en </span>
              <span className="neon-text">riesgo de embargo</span>
              <span className="text-foreground"> antes de que sea tarde.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Responde 8 preguntas simples y descubre en 2 minutos si necesitas activar la protección de la Ley de Quiebra (Ley 20.720).
            </p>

            {/* Lead Magnet Visual */}
            <div className="relative mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-16 sm:w-16 sm:h-20 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                  <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground text-base sm:text-lg mb-1">Quiz de Insolvencia</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Evalúa tu situación en 2 minutos</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
                GRATIS
              </div>
            </div>

            {/* Benefits List */}
            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="benefit-check mt-0.5 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground text-sm sm:text-base">{benefit.title}:</span>{' '}
                    <span className="text-muted-foreground text-sm sm:text-base">{benefit.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Quiz (appears first on mobile) */}
          <div className="animate-slide-in-right order-1 lg:order-2">
            <div className="form-card p-5 sm:p-6 md:p-8">
              <InsolvencyQuiz onComplete={onSuccess} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
