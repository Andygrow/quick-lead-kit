import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users, Gift, CheckCircle2, ExternalLink } from "lucide-react";
import { pushGTMEvent } from "@/hooks/useGTM";
import { Link } from "react-router-dom";
import WebinarRegistrationForm from "./WebinarRegistrationForm";

interface WebinarSectionProps {
  variant?: "full" | "compact";
}

const webinarDetails = {
  title: "Masterclass Gratuita",
  subtitle: "LinkedIn Estratégico 2026",
  description: "Descubre cómo usar LinkedIn de forma estratégica con la metodología CI+7. En esta masterclass gratuita aprenderás los fundamentos para transformar tu perfil en una herramienta de posicionamiento y ventas.",
  date: "Martes 7 de Abril",
  time: "19:00 hrs (Chile)",
  duration: "60 minutos",
  benefits: [
    "Introducción a la metodología CI+7",
    "Cómo funciona LinkedIn realmente en 2026",
    "Los 3 errores que te hacen invisible",
    "Acceso anticipado al Programa Completo",
  ],
};

const WebinarSection = ({ variant = "full" }: WebinarSectionProps) => {
  const handleRegistrationSuccess = () => {
    pushGTMEvent('webinar_register_success', {
      cta_name: 'webinar_register',
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
            <Video className="w-6 h-6 text-accent" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium mb-2">
            <Gift className="w-3 h-3" />
            Gratis
          </span>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            {webinarDetails.title}: {webinarDetails.subtitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Profundiza en la metodología CI+7 y conoce el Programa Completo LinkedIn 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-foreground/70 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent" />
              {webinarDetails.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              {webinarDetails.duration}
            </span>
          </div>
        </div>
        
        {/* Form */}
        <WebinarRegistrationForm onSuccess={handleRegistrationSuccess} />
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
                <Gift className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Evento Gratuito</span>
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {webinarDetails.title}
                </h2>
                <p className="text-xl sm:text-2xl text-primary font-semibold">
                  {webinarDetails.subtitle}
                </p>
              </div>

              <p className="text-lg text-muted-foreground">
                {webinarDetails.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-3">
                {webinarDetails.benefits.map((benefit, index) => (
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

            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-5 sm:p-8 rounded-2xl border border-border"
            >
              {/* Header with icon and title - centered on mobile */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-3">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Reserva tu lugar ahora
                </h3>
              </div>

              {/* Details - horizontal on mobile, stacked on larger */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{webinarDetails.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{webinarDetails.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{webinarDetails.duration}</span>
                </div>
              </div>

              {/* Registration Form */}
              <WebinarRegistrationForm onSuccess={handleRegistrationSuccess} />

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

export default WebinarSection;
