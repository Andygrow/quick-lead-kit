import { User } from 'lucide-react';

interface AuthorSectionProps {
  headline: string;
  name: string;
  bio: string;
  imageUrl?: string;
}

export const AuthorSection = ({ headline, name, bio, imageUrl }: AuthorSectionProps) => {
  return (
    <section className="section-light py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          {headline}
        </h2>

        {/* Author Card */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-8 rounded-2xl border border-border shadow-sm">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              {name}
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};