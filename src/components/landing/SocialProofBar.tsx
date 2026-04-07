import { Users } from 'lucide-react';

interface SocialProofBarProps {
  text: string;
}

export const SocialProofBar = ({ text }: SocialProofBarProps) => {
  return (
    <section className="section-light py-6 border-y border-border">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span className="text-sm md:text-base font-medium">{text}</span>
        </div>
      </div>
    </section>
  );
};