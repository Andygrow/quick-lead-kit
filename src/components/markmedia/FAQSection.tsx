import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Metodología CI+7",
    questions: [
      {
        question: "¿Qué es la metodología CI+7?",
        answer: "CI+7 es un sistema probado de 7 pasos que he desarrollado tras años de experiencia en LinkedIn. Incluye: Objetivo claro, Perfil optimizado, Red estratégica, Networking activo, Contenido de valor, Consistencia y Medición. Cada paso está diseñado para construir una presencia profesional sólida que genere oportunidades de negocio."
      },
      {
        question: "¿Cuánto tiempo toma ver resultados con CI+7?",
        answer: "Los primeros resultados suelen verse entre 2-4 semanas: mayor visibilidad, conexiones de calidad y engagement. Para resultados comerciales tangibles (reuniones, leads, ventas), normalmente entre 2-3 meses de aplicación consistente. Todo depende de tu punto de partida y dedicación."
      },
      {
        question: "¿CI+7 funciona para cualquier industria?",
        answer: "Sí, la metodología está diseñada para profesionales B2B de cualquier sector. He trabajado con ejecutivos de banca, tecnología, salud, retail, manufactura y más. Los principios de Social Selling son universales, aunque adaptamos las tácticas a cada industria."
      },
      {
        question: "¿Necesito experiencia previa en LinkedIn?",
        answer: "No. CI+7 está diseñado tanto para principiantes como para usuarios avanzados. Si eres nuevo, te guío desde cero. Si ya usas LinkedIn, optimizamos tu estrategia actual para multiplicar resultados."
      }
    ]
  },
  {
    category: "Servicios",
    questions: [
      {
        question: "¿Cuál es la diferencia entre Workshop, Mentoría y Consultoría?",
        answer: "Workshop: Capacitación grupal intensiva (4-8 horas) ideal para equipos que necesitan alinearse rápidamente. Mentoría 1:1: Acompañamiento personal de 3-6 meses para ejecutivos que buscan transformación profunda. Consultoría: Estrategia integral para empresas que quieren implementar Social Selling a nivel organizacional."
      },
      {
        question: "¿Los workshops son presenciales o virtuales?",
        answer: "Ofrezco ambas modalidades. Los workshops presenciales tienen un impacto especial por la interacción directa, pero los virtuales son igual de efectivos y permiten participantes de diferentes ubicaciones. Tú eliges según tus necesidades."
      },
      {
        question: "¿Qué incluye la mentoría 1:1?",
        answer: "Incluye: diagnóstico inicial completo, plan de acción personalizado, sesiones semanales de 1 hora vía Zoom, revisión de tu contenido antes de publicar, acceso directo por WhatsApp para dudas rápidas, y material exclusivo de apoyo."
      },
      {
        question: "¿Trabajan con empresas pequeñas o solo grandes corporaciones?",
        answer: "Trabajo con empresas de todos los tamaños. Desde emprendedores y PyMEs hasta corporaciones multinacionales como Banco Estado, Bridgestone o AbbVie. Lo importante es el compromiso con implementar la estrategia."
      }
    ]
  },
  {
    category: "Resultados y Garantías",
    questions: [
      {
        question: "¿Qué resultados puedo esperar?",
        answer: "Mis clientes típicamente logran: 3-5x más visualizaciones en sus publicaciones, red de contactos estratégicos en su industria, posicionamiento como referente, y lo más importante: reuniones comerciales y nuevas oportunidades de negocio generadas directamente desde LinkedIn."
      },
      {
        question: "¿Ofrecen algún tipo de garantía?",
        answer: "Mi garantía es mi reputación: +3,500 profesionales capacitados, +30 empresas de primer nivel, y reconocimiento como #1 en Favikon (Marca Personal & Creadora de Audiencia) en Chile. Si no ves valor en las primeras sesiones de mentoría, buscamos la mejor solución juntos."
      },
      {
        question: "¿Por qué elegir Elévate & CONECTA sobre otros consultores?",
        answer: "Porque no solo enseño teoría: comparto estrategias que uso a diario y me han posicionado como referente. Tengo resultados medibles con empresas reconocidas, y mi metodología CI+7 está probada con miles de profesionales. Además, mi enfoque es práctico y accionable desde el día uno."
      }
    ]
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Resuelve tus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              dudas
            </span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre la metodología CI+7 
            y nuestros servicios de Social Selling.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {category.category}
              </h3>
              
              <div className="glass-card border-primary/20 rounded-2xl p-6">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-primary/10"
                    >
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary py-4">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
          className="text-center mt-16"
        >
          <div className="glass-card border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">¿Tienes otra pregunta?</h3>
            <p className="text-muted-foreground mb-6">
              Estoy aquí para ayudarte. Escríbeme directamente y te respondo personalmente.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white"
            >
              Escríbeme por LinkedIn
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
