import { Check, FileText, Zap, Target, TrendingUp } from 'lucide-react';

interface LeadMagnetHeroProps {
  title: string;
  subtitle: string;
  resourceType: string;
  benefits: string[];
}

export const LeadMagnetHero = ({ title, subtitle, resourceType, benefits }: LeadMagnetHeroProps) => {
  return (
    <div className="space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">{resourceType}</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {subtitle}
      </p>

      {/* Mockup Card */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="gradient-card rounded-2xl p-8 border border-border shadow-card">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-20 h-28 rounded-lg gradient-cta flex items-center justify-center shadow-glow">
              <FileText className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted/50 rounded w-48" />
              <div className="h-3 bg-muted/30 rounded w-36" />
              <div className="h-3 bg-muted/30 rounded w-40" />
              <div className="flex items-center gap-2 mt-4">
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  PDF
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                  Descarga Inmediata
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Benefits */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Lo que aprenderás:
        </p>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover:bg-primary/30 transition-colors">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust indicators */}
      <div className="flex items-center gap-6 pt-4 border-t border-border animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">+2,500 descargas</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Actualizado 2024</span>
        </div>
      </div>
    </div>
  );
};
