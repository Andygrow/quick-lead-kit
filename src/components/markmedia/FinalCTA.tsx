import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushGTMEvent } from "@/hooks/useGTM";
import constanzaProfessional from "@/assets/constanza/constanza-professional.jpeg";

interface FinalCTAProps {
  onCTAClick: () => void;
}

const FinalCTA = ({ onCTAClick }: FinalCTAProps) => {
  const handleCTAClick = () => {
    pushGTMEvent('cta_click', {
      cta_name: 'final_cta_quiero_guia',
      cta_location: 'final_section',
      cta_text: 'Quiero la Guía Gratis',
    });
    onCTAClick();
  };
  
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with energy effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl aspect-[4/5]">
              <img
                src={constanzaProfessional}
                alt="Constanza Ibieta"
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Quote overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-foreground/90 italic text-lg font-medium">
                  "Tu próximo cliente ya está en LinkedIn. Solo falta que te encuentre."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">100% Gratis • Sin compromiso</span>
            </motion.div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              ¿Listo para ser el{" "}
              <span className="shimmer-text energy-glow">especialista que todos buscan</span>
              <br className="hidden sm:block" />
              en LinkedIn?
            </h2>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10">
              Únete a los <span className="text-primary font-semibold">+3,500 profesionales</span> que ya 
              transformaron su LinkedIn con esta guía práctica.
            </p>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="h-14 md:h-16 px-10 md:px-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
              >
                <span>Quiero la Guía Gratis</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Descarga inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Newsletter semanal incluida</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-primary" />
                <span>60K+ seguidores</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;