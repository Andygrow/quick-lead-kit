import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Users, User, Building2, Lightbulb, Target, TrendingUp, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "+56940118070";

const services = [
  {
    icon: Building2,
    title: "LinkedIn para Equipos y Empresas",
    subtitle: "Potencia tu equipo con Social Selling B2B",
    description: "Transforma a tu equipo en embajadores de marca y diseña estrategias de ventas en LinkedIn para escalar tus resultados.",
    features: [
      "Metodología CI+7 paso a paso",
      "Taller de Employee Advocacy",
      "Auditoría de presencia digital",
      "Capacitación de equipos de venta",
      "Playbook de contenido y KPIs"
    ],
    duration: "Proyecto a medida",
    format: "Presencial o Virtual",
    highlight: "Para equipos y empresas B2B",
    whatsappMessage: "Hola Constanza! Me interesa el servicio de LinkedIn para Equipos y Empresas. Quisiera conocer más detalles sobre cómo potenciar a mi equipo con Social Selling B2B."
  },
  {
    icon: User,
    title: "Mentoría 1:1",
    subtitle: "Impacta con tu marca y vende más con LinkedIn",
    description: "Acompañamiento personalizado para ejecutivos y profesionales que buscan destacar y generar oportunidades en LinkedIn.",
    features: [
      "Diagnóstico inicial completo",
      "Plan de acción personalizado",
      "Sesiones semanales 1 hora",
      "Revisión de contenido",
      "Acceso directo por WhatsApp"
    ],
    duration: "3-6 meses",
    format: "100% Virtual",
    highlight: "Más vendido",
    featured: true,
    whatsappMessage: "Hola Constanza! Me interesa la Mentoría 1:1 para trabajar mi marca personal y generar oportunidades en LinkedIn. ¿Podemos agendar una llamada?"
  },
  {
    icon: Lightbulb,
    title: "Workshop, Talleres, Cursos y Charlas",
    subtitle: "Formatos flexibles para cada necesidad",
    description: "Capacitaciones adaptadas a tu evento, conferencia o necesidad específica de formación.",
    features: [
      "Charlas inspiracionales",
      "Workshops prácticos",
      "Cursos intensivos",
      "Formatos presenciales y virtuales",
      "Contenido personalizado"
    ],
    duration: "1 hora a varios días",
    format: "Presencial o Virtual",
    highlight: "Eventos y conferencias",
    whatsappMessage: "Hola Constanza! Me interesa contratar un Workshop, Taller o Charla sobre LinkedIn para mi evento/empresa. ¿Podemos conversar sobre las opciones disponibles?"
  }
];

const benefits = [
  { icon: Lightbulb, text: "Metodología probada con +3,500 profesionales" },
  { icon: Target, text: "Resultados medibles desde la primera semana" },
  { icon: TrendingUp, text: "ROI demostrado en ventas B2B" }
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const yGlow1 = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const yGlow2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yCards = [
    useTransform(scrollYProgress, [0, 1], [40, -40]),
    useTransform(scrollYProgress, [0, 1], [60, -60]),
    useTransform(scrollYProgress, [0, 1], [40, -40]),
  ];
  const scaleBenefits = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <motion.div 
        className="absolute top-1/4 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        style={{ y: yGlow1 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
        style={{ y: yGlow2 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Servicios Elévate & CONECTA
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Elige tu camino hacia el{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              éxito en LinkedIn
            </span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Cada profesional y empresa tiene necesidades únicas. Por eso ofrezco diferentes 
            formatos para que encuentres la opción perfecta para ti.
          </p>
        </motion.div>

        {/* Benefits Bar with parallax scale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ scale: scaleBenefits }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-3 px-5 py-3 rounded-full glass-card border-primary/20"
            >
              <benefit.icon className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid with individual parallax */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={{ y: yCards[index] }}
              whileHover={{ scale: 1.02 }}
              className={`relative group ${service.featured ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Featured badge */}
              {service.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white text-sm font-bold shadow-lg">
                    {service.highlight}
                  </span>
                </div>
              )}
              
              <div className={`
                h-full p-8 rounded-2xl transition-all duration-500
                glass-card border-primary/20
                ${service.featured 
                  ? 'border-accent/50 shadow-[0_0_40px_rgba(255,109,0,0.15)]' 
                  : 'hover:border-primary/40'
                }
                group-hover:shadow-[0_0_50px_rgba(37,99,235,0.1)]
              `}>
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-xl mb-6 flex items-center justify-center
                  ${service.featured 
                    ? 'bg-gradient-to-br from-accent to-accent/80' 
                    : 'bg-gradient-to-br from-primary/20 to-primary/10'
                  }
                `}>
                  <service.icon className={`w-8 h-8 ${service.featured ? 'text-white' : 'text-primary'}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-accent font-medium mb-4">{service.subtitle}</p>
                
                {/* Description */}
                <p className="text-foreground/80 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${service.featured ? 'text-accent' : 'text-primary'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {service.duration}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-foreground/70 text-xs font-medium">
                    {service.format}
                  </span>
                </div>

                {/* Non-featured highlight */}
                {!service.featured && service.highlight && (
                  <p className="text-sm text-accent font-medium mb-4">
                    ✨ {service.highlight}
                  </p>
                )}

                {/* CTA Button - WhatsApp con mensaje personalizado */}
                <Button 
                  asChild
                  className={`
                    w-full group/btn
                    ${service.featured 
                      ? 'bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white' 
                      : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }
                  `}
                >
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(service.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Más información
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">
            ¿No sabes cuál es la mejor opción para ti?
          </p>
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="border-primary/30 hover:bg-primary/10"
          >
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent("Hola Constanza! No sé cuál servicio es mejor para mí. ¿Podemos agendar una llamada de diagnóstico gratuita?")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agenda una llamada de diagnóstico gratuita
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
