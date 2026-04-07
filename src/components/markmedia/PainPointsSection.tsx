import { motion } from "framer-motion";
import { EyeOff, MessageSquareOff, UserX, CheckCircle2, Target, Sparkles } from "lucide-react";

const painPoints = [
  {
    icon: EyeOff,
    title: "Eres Invisible",
    description: "Publicas contenido pero nadie lo ve. Tu perfil está ahí, pero no genera impacto ni atrae oportunidades.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MessageSquareOff,
    title: "Sin Respuestas",
    description: "Mandas mensajes que quedan en el vacío. Tus intentos de conexión no generan conversaciones reales.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: UserX,
    title: "Solo Observador",
    description: "Ves cómo otros crecen mientras tú sigues esperando. LinkedIn es una oportunidad que no estás aprovechando.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const solution = {
  icon: CheckCircle2,
  title: "Metodología CI+7",
  description: "Pasa de la observación a la acción con un sistema probado de 7 pasos que convierte tu perfil en un imán de oportunidades.",
  features: [
    "Perfil optimizado para atraer clientes",
    "Contenido que posiciona tu autoridad",
    "Estrategia de Social Selling efectiva",
  ],
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PainPointsSection = () => {
  return (
    <section className="py-20 sm:py-28 section-gradient relative overflow-hidden">
      {/* Static ambient glows - reduced blur for performance */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px hsl(38 75% 55% / 0.3)",
            }}
          >
            ¿Te identificas?
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ¿Tu LinkedIn{" "}
            <span className="shimmer-text energy-glow">no te está dando resultados</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            La mayoría de profesionales <span className="text-accent font-bold">solo observan</span>. 
            Es hora de pasar a la <span className="text-primary font-semibold">acción</span> y convertir 
            tu perfil en tu mejor vendedor.
          </p>
        </motion.div>

        {/* Pain Point Cards with energy effects */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12"
        >
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="energy-card p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${point.bgColor} flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-7 h-7 ${point.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {point.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Solution Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div 
            className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/30 relative overflow-hidden"
            whileHover={{
              boxShadow: "0 0 60px -20px hsl(var(--primary) / 0.5)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 energy-glow">
                <Target className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <Sparkles className="w-4 h-4" />
                    La solución
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {solution.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  {solution.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 pt-2">
                  {solution.features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-3 text-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;