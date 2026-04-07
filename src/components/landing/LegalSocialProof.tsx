import { Users, Building, Scale } from 'lucide-react';

interface Stat {
  icon: 'trophy' | 'scale' | 'location';
  value: string;
  label: string;
}

interface LegalSocialProofProps {
  headline: string;
  stats: Stat[];
}

const iconMap = {
  trophy: Users,
  scale: Building,
  location: Scale,
};

export const LegalSocialProof = ({ headline, stats }: LegalSocialProofProps) => {
  return (
    <section className="py-6 sm:py-8 md:py-10 bg-background border-t border-border">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs sm:text-sm md:text-base text-muted-foreground mb-6 sm:mb-8">
          {headline}
        </p>
        
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12">
          <div className="text-center">
            <p className="stat-number text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-1 sm:mb-2">+120</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Abogados<br />Expertos
            </p>
          </div>
          
          <div className="text-center border-x border-border">
            <p className="stat-number text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-1 sm:mb-2">12</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Oficinas<br />en Chile
            </p>
          </div>
          
          <div className="text-center">
            <p className="stat-number text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-1 sm:mb-2">100K</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Sentencias<br />Favorables
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
