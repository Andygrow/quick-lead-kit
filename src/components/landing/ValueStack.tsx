import { Check } from 'lucide-react';

interface ValueStackProps {
  headline: string;
  benefits: string[];
}

export const ValueStack = ({ headline, benefits }: ValueStackProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground text-center mb-12 tracking-tight">
          {headline}
        </h2>

        {/* Benefits List */}
        <ul className="space-y-5">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-accent" />
              </div>
              <span className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};