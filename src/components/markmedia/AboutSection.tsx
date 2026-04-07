import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Building2, Linkedin, TrendingUp, Sparkles, Target, Zap } from "lucide-react";
import constanzaAbout from "@/assets/constanza/constanza-about.jpeg";
import EnergyParticles from "./EnergyParticles";

const achievements = [
  { icon: Linkedin, value: "60K+", label: "Seguidores en LinkedIn", color: "text-primary" },
  { icon: Users, value: "3.500+", label: "Profesionales entrenados", color: "text-accent" },
  { icon: Building2, value: "30+", label: "Empresas acompañadas", color: "text-primary" },
  { icon: Award, value: "#1", label: "Favikon: Marca Personal & Creadora de Audiencia", color: "text-accent" },
];

const milestones = [
  {
    year: "2019",
    title: "El inicio del viaje",
    description: "Comenzó a explorar LinkedIn como herramienta de posicionamiento profesional, descubriendo su potencial para generar oportunidades de negocio.",
  },
  {
    year: "2021",
    title: "Nacimiento de la Metodología CI+7",
    description: "Después de años de experimentación y análisis, desarrolló la metodología CI+7 que hoy transforma la presencia digital de profesionales y empresas.",
  },
  {
    year: "2023",
    title: "Reconocimiento #1 en Favikon",
    description: "Fue reconocida como #1 en Chile en la categoría Marca Personal & Creadora de Audiencia según Favikon, consolidando su posición como referente en Social Selling.",
  },
  {
    year: "2024",
    title: "Elévate & CONECTA",
    description: "Lanzó su consultora especializada en LinkedIn y Social Selling, ayudando a profesionales y empresas a alcanzar sus objetivos comerciales.",
  },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const yPhoto = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yStory = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yGlow1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const yGlow2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const scaleTimeline = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0.95, 1, 0.98]);
  // Removed rotatePhoto - causes card to stay tilted

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Background effects */}
      <EnergyParticles count={15} className="opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Parallax ambient glows */}
      <motion.div 
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none"
        style={{ y: yGlow1 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none"
        style={{ y: yGlow2 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Conoce a la creadora
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Quién Soy
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-12">
          {/* Left: Photo with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ y: yPhoto }}
          >
            {/* Profile Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-3xl blur-2xl opacity-60" />
              <div className="relative glass-card rounded-2xl overflow-hidden border border-primary/20">
                {/* Photo */}
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
                  <img
                    src={constanzaAbout}
                    alt="Constanza Ibieta Illanes"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Constanza Ibieta Illanes
                  </h3>
                  <p className="text-primary font-semibold text-lg mb-1">
                    LinkedIn Strategist & #1 Favikon
                  </p>
                  <p className="text-foreground/80">
                    Creadora de la Metodología CI+7
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Story with parallax */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ y: yStory }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Mi Historia
                </h4>
              </div>

              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Hace más de <span className="text-foreground font-medium">6 años</span> descubrí que LinkedIn 
                  no era solo una red para buscar empleo. Era una <span className="text-primary font-medium">mina de oro</span> para 
                  generar oportunidades de negocio y posicionarse como referente en cualquier industria.
                </p>
                <p>
                  Comencé experimentando, analizando patrones, estudiando qué funcionaba y qué no. 
                  Probé cientos de estrategias hasta que logré <span className="text-foreground font-medium">sistematizar 
                  un método</span> que cualquier persona pudiera replicar.
                </p>
                <p>
                  Así nació la <span className="text-accent font-bold">Metodología CI+7</span>: 7 pasos claros y accionables 
                  para transformar tu perfil en una <span className="text-foreground font-medium">máquina de generar leads</span> y 
                  oportunidades de negocio.
                </p>
                <p>
                  Hoy, mi misión es ayudar a profesionales y empresas a dominar LinkedIn, 
                  dejar de ser invisibles y <span className="text-primary font-medium">convertirse en la primera opción</span> de 
                  sus clientes ideales.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex gap-4">
                  <Zap className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <blockquote className="text-foreground italic font-medium">
                    "LinkedIn no se trata de publicar por publicar. Se trata de conectar 
                    con propósito y convertir esas conexiones en resultados reales."
                  </blockquote>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievement Stats - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="glass-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300 text-center"
            >
              <achievement.icon className={`w-7 h-7 ${achievement.color} mx-auto mb-3`} />
              <p className={`font-display text-3xl font-bold ${achievement.color}`}>
                {achievement.value}
              </p>
              <p className="text-sm text-foreground/70 mt-2">
                {achievement.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline with parallax scale */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ scale: scaleTimeline }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-primary font-semibold">
              <TrendingUp className="w-5 h-5" />
              <span>Mi Trayectoria</span>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Year bubble */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs shadow-lg">
                    {milestone.year.slice(2)}
                  </div>

                  {/* Content */}
                  <div className={`ml-16 sm:ml-0 sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="glass-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300">
                      <span className="text-primary font-bold text-sm">{milestone.year}</span>
                      <h5 className="font-display text-lg font-bold text-foreground mt-1 mb-2">
                        {milestone.title}
                      </h5>
                      <p className="text-foreground/80 text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
