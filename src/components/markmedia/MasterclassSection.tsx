import { motion } from "framer-motion";
import { Play, Clock, Users, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { pushGTMEvent } from "@/hooks/useGTM";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MasterclassSectionProps {
  variant?: "full" | "compact";
}

const videoDetails = {
  title: "Masterclass Disponible",
  subtitle: "LinkedIn Estratégico 2026",
  description: "Descubre cómo usar LinkedIn de forma estratégica con la metodología CI+7. En esta masterclass aprenderás los fundamentos para transformar tu perfil en una herramienta de posicionamiento y ventas.",
  duration: "60 minutos",
  benefits: [
    "Introducción a la metodología CI+7",
    "Cómo funciona LinkedIn realmente en 2026",
    "Los 3 errores que te hacen invisible",
    "Acceso anticipado al Programa Completo",
  ],
};

const MasterclassSection = ({ variant = "full" }: MasterclassSectionProps) => {
  const handleCTAClick = () => {
    pushGTMEvent('cta_click', {
      cta_name: 'masterclass_video_cta',
      cta_location: variant === 'full' ? 'landing_section' : 'thank_you_page',
    });
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 sm:p-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5"
      >
        {/* Header - centered on all screens */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
            <Play className="w-6 h-6 text-accent" fill="currentColor" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium mb-2">
            <Sparkles className="w-3 h-3" />
            Disponible ahora
          </span>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            {videoDetails.title}: {videoDetails.subtitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Profundiza en la metodología CI+7 y conoce el Programa Completo LinkedIn 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-foreground/70 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              {videoDetails.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-accent" />
              +500 profesionales
            </span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Link to="/masterclass" onClick={handleCTAClick}>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-5">
            <Play className="mr-2 h-4 w-4" fill="currentColor" />
            Ver Masterclass Gratis
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <section id="masterclass-registration" className="py-16 sm:py-24 section-gradient relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Play className="w-4 h-4 text-accent" fill="currentColor" />
                <span className="text-sm font-medium text-accent">Disponible Ahora</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {videoDetails.title}
                </h2>
                <p className="text-xl sm:text-2xl text-primary font-semibold">
                  {videoDetails.subtitle}
                </p>
              </div>

              <p className="text-lg text-muted-foreground">
                {videoDetails.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-3">
                {videoDetails.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Video Preview Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-5 sm:p-8 rounded-2xl border border-border"
            >
              {/* Header with icon and title - centered on mobile */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-accent ml-1" fill="currentColor" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Mira la Masterclass Completa
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Accede gratis dejando tus datos
                </p>
              </div>

              {/* Details */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{videoDetails.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>+500 profesionales</span>
                </div>
              </div>

              {/* Preview Thumbnail Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-6 overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-accent/40 cursor-pointer"
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 rounded-full text-white text-xs font-medium">
                  60:00
                </div>
              </div>

              {/* CTA Button */}
              <Link to="/masterclass" onClick={handleCTAClick}>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-5 text-base">
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  Ver Masterclass Gratis
                </Button>
              </Link>

              <div className="mt-4 pt-4 border-t border-border">
                <Link 
                  to="/programa-linkedin-2026"
                  onClick={() => window.scrollTo(0, 0)}
                  className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Ver detalles del Programa Completo
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;
