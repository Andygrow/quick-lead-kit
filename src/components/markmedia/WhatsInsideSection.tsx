import { motion } from "framer-motion";
import { Check, BookOpen, Target, Users, TrendingUp, Gift, Sparkles } from "lucide-react";
import EnergyParticles from "./EnergyParticles";
import constanzaLaptop from "@/assets/constanza/constanza-laptop.jpg";

const features = [
  "Define tu objetivo y audiencia ideal en LinkedIn",
  "Optimiza tu perfil como landing page profesional",
  "Genera una red de contactos de calidad estratégicamente",
  "Interactúa y haz networking genuino",
  "Impacta con contenido de valor que resuelve problemas",
  "Invierte tiempo y sé consistente en la red",
  "Mide tus resultados y mejora continuamente",
];

const WhatsInsideSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Energy particles */}
      <EnergyParticles count={10} className="opacity-30" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Ambient glows */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Guide Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Photo with guide overlay */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Main photo */}
              <motion.div
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl"
              >
                <img
                  src={constanzaLaptop}
                  alt="Constanza Ibieta trabajando"
                  className="w-full h-auto object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                {/* Floating guide card */}
                <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4 border border-primary/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Guía Metodología CI+7</p>
                      <p className="text-xs text-muted-foreground">Por Constanza Ibieta</p>
                    </div>
                    <div className="ml-auto px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                      GRATIS
                    </div>
                  </div>
                  
                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Perfil", icon: Target, value: "100%" },
                      { label: "Contenido", icon: TrendingUp, value: "85%" },
                      { label: "Ventas", icon: Users, value: "90%" },
                    ].map(({ label, icon: Icon, value }, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-muted/50">
                        <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-bold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Gift indicator */}
              <motion.div
                initial={{ rotate: 6 }}
                whileHover={{ rotate: 3, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4 transform rotate-6 border border-accent/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center energy-glow">
                    <Gift className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">+ Newsletter Semanal</p>
                    <p className="text-xs text-muted-foreground">Estrategias exclusivas</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Features List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Recurso Gratuito
              </motion.span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Guía{" "}
                <span className="shimmer-text energy-glow">Metodología CI+7</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Descarga la guía que ha ayudado a más de <span className="text-primary font-semibold">3,500 profesionales</span> a 
                transformar su LinkedIn en un imán de oportunidades con los 7 pasos probados.
              </p>
            </div>

            {/* Feature checklist */}
            <ul className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="feature-check mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-foreground font-medium text-lg group-hover:text-primary transition-colors duration-300">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhatsInsideSection;