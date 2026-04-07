import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Calendar, 
  Clock, 
  Video, 
  Target, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Play,
  BookOpen,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Palette,
  Bot,
  Network,
  Zap,
  CreditCard,
  Gift,
  FileText,
  LayoutTemplate,
  Timer,
  Flame,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/markmedia/Header";
import Footer from "@/components/markmedia/Footer";
import { pushGTMEvent } from "@/hooks/useGTM";
import ProgramRegistrationForm from "@/components/markmedia/ProgramRegistrationForm";
import constanzaAbout from "@/assets/constanza/constanza-about.jpeg";

// Flow payment link
const FLOW_PAYMENT_LINK = "https://www.flow.cl/app/web/pagarBtnPago.php?token=fe2cb54ee163fbe951797fd2b08914920f2ad9ec";

// Pricing configuration
const PRESALE_END_DATE = new Date('2026-03-01T12:00:00-03:00');
const MARCH_PRICE = 126000;    // Precio promocional para Marzo
const REGULAR_PRICE = 180000;  // Precio regular

// Countdown hook
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);
};

const sessions = [
  {
    number: 1,
    title: "Metodología CI+7 y Perfil Estratégico",
    icon: Target,
    objective: "Definir tu foco en LinkedIn y construir un perfil alineado a tu objetivo real.",
    topics: [
      "Metodología CI+7 paso a paso",
      "Definición de objetivo, audiencia y propuesta de valor",
      "Cómo optimizar tu perfil desde la URL hasta las recomendaciones",
      "Qué debe comunicar tu perfil en los primeros segundos",
      "Ejemplos reales de perfiles que venden servicios de alto impacto"
    ]
  },
  {
    number: 2,
    title: "Estrategia de Contenidos y Algoritmo LinkedIn 2026",
    icon: TrendingUp,
    objective: "Saber qué publicar, para qué y cómo alinear tu contenido al algoritmo actual.",
    topics: [
      "Cómo funciona el algoritmo de LinkedIn hoy",
      "Tipos de contenido con mayor impacto",
      "Definición de tema central y subtemas",
      "Publicaciones según cada etapa",
      "Buenas prácticas de distribución y timing",
      "Construcción de una estrategia de contenidos simple y sostenible"
    ]
  },
  {
    number: 3,
    title: "IA para Crear Contenido, Visuales y Carruseles",
    icon: Bot,
    objective: "Aprender a usar IA como apoyo estratégico para crear contenido sin sonar genérico.",
    topics: [
      "Uso de Perplexity para investigar temas relevantes",
      "Uso de ChatGPT para crear contenidos",
      "Uso de Nano Banana para crear imágenes",
      "Uso de plantillas en Canva para infografías y carruseles"
    ]
  },
  {
    number: 4,
    title: "Conversaciones, Networking y Cierre",
    icon: Network,
    objective: "Integrar todo lo aprendido y convertirlo en una estrategia personal y accionable.",
    topics: [
      "Por qué hoy los comentarios son más importantes que publicar",
      "A quién comentar y cómo generar conversaciones reales",
      "Construcción de networking estratégico",
      "30 minutos a diario en LinkedIn",
      "Revisión de métricas de LinkedIn para mejorar",
      "Plan de acción para implementar Metodología CI+7 (próximos 3 meses)"
    ]
  }
];

const baseContent = [
  { icon: Video, text: "Qué es LinkedIn hoy y para qué sirve realmente" },
  { icon: BookOpen, text: "Cómo funciona la plataforma y sus secciones" },
  { icon: Sparkles, text: "Diferencias entre LinkedIn y LinkedIn Premium" },
  { icon: Play, text: "Mapa completo del perfil y para qué sirve cada sección" },
  { icon: Lightbulb, text: "Cómo subir contenido correctamente y formatos con mayor impacto" },
  { icon: Palette, text: "Estructura base de una publicación" },
  { icon: Bot, text: "Introducción a la metodología CI+7" }
];

const targetAudience = [
  "Quieren usar LinkedIn de forma estratégica (no improvisada)",
  "Buscan posicionarse como referentes en su industria",
  "Quieren generar oportunidades reales (clientes, alianzas, visibilidad)",
  "Sienten que publican, pero no logran consistencia ni resultados",
  "Quieren aprender a usar IA y diseño sin depender de terceros"
];

const outcomes = [
  "Entender LinkedIn desde una lógica estratégica (no intuitiva)",
  "Tener claridad sobre tu objetivo, audiencia y propuesta de valor",
  "Usar tu perfil como un activo que trabaja por ti",
  "Crear una estrategia de contenidos alineada al algoritmo 2026",
  "Usar comentarios y conversaciones como motor de visibilidad",
  "Apoyarte en IA (ChatGPT, Perplexity, Nano Banana) sin perder autenticidad",
  "Salir con una estrategia propia, clara y sostenible en el tiempo"
];

const differentiators = [
  {
    title: "No es un curso técnico de LinkedIn",
    description: "Es un programa integral, práctico y actualizado"
  },
  {
    title: "Hilo conductor real (CI+7)",
    description: "No son tips sueltos, es un sistema que puedes repetir"
  },
  {
    title: "Mix único: Estrategia + IA + Diseño",
    description: "Enseña a pensar, usar IA con sentido y ejecutar"
  },
  {
    title: "Sales con estrategia propia",
    description: "Clara, sostenible y adaptada a tu realidad"
  }
];

const bonusItems = [
  { icon: FileText, text: "PDF del Programa completo" },
  { icon: Users, text: "Guía de la cuenta de perfil" },
  { icon: CheckCircle2, text: "Checklist para cada perfil" },
  { icon: LayoutTemplate, text: "15 Plantillas para publicar en LinkedIn" },
  { icon: BookOpen, text: "Guía de requisitos de formatos de LinkedIn" },
  { icon: Calendar, text: "Calendario de publicaciones" },
  { icon: MessageSquare, text: "Acompañamiento por WhatsApp" }
];

const ProgramaLinkedIn = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const countdown = useCountdown(PRESALE_END_DATE);
  const isPresale = !countdown.isExpired;

  const handleCTAClick = () => {
    pushGTMEvent('cta_click', {
      cta_name: 'programa_linkedin_inscripcion',
      cta_location: 'programa_page',
      cta_text: 'Quiero Inscribirme'
    });
    setShowRegistrationForm(true);
    // Scroll to registration form
    setTimeout(() => {
      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRegistrationSuccess = (registrationId: string) => {
    console.log('Registration completed:', registrationId);
  };

  return (
    <>
      <Helmet>
        <title>Programa LinkedIn 2026 | Metodología CI+7 | Elévate & Conecta</title>
        <meta name="description" content="Programa intensivo de LinkedIn basado en la metodología CI+7. 4 sesiones en vivo + contenido grabado. Estrategia + IA + Diseño para posicionar tu marca profesional." />
        <meta property="og:title" content="Programa LinkedIn 2026 | Elévate & Conecta" />
        <meta property="og:description" content="Programa intensivo basado en la metodología CI+7. 4 sesiones en vivo + contenido grabado para dominar LinkedIn estratégicamente." />
        <meta property="og:url" content="https://elevate-conecta.cl/programa-linkedin-2026" />
        <link rel="canonical" href="https://elevate-conecta.cl/programa-linkedin-2026" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header hasTopBanner={isPresale} />
        
        {/* Spacer for fixed presale banner - taller on mobile due to wrapping */}
        {isPresale && <div className="h-16 sm:h-12" />}
        
        {/* Urgency Banner - Fixed at Top (above header) */}
        {isPresale && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-accent via-accent/90 to-accent py-2 px-3 shadow-lg"
          >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-white text-xs sm:text-sm md:text-base">
              {/* Top row on mobile */}
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                <span className="font-bold">¡PRECIO ESPECIAL MARZO!</span>
              </div>
              {/* Bottom row on mobile */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 font-mono font-bold bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                  <span>{String(countdown.days).padStart(2, '0')}d</span>
                  <span>:</span>
                  <span>{String(countdown.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(countdown.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span>{String(countdown.seconds).padStart(2, '0')}s</span>
                </div>
                <span className="font-semibold">{formatPrice(MARCH_PRICE)} (-30%)</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Hero Section */}
        <section className={`relative ${isPresale ? 'pt-44' : 'pt-32'} pb-20 overflow-hidden`}>
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
              {/* Left: Constanza Photo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                  <img 
                    src={constanzaAbout}
                    alt="Constanza Ibieta"
                    className="relative w-64 h-80 object-cover object-top rounded-2xl shadow-2xl border-2 border-white/20"
                  />
                </div>
              </motion.div>

              {/* Center: Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center lg:col-span-1"
              >
                {/* Presale Badge */}
                {isPresale && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mb-4"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm font-bold animate-pulse">
                      <Tag className="w-4 h-4" />
                      🔥 MARZO: {formatPrice(MARCH_PRICE)}
                    </span>
                  </motion.div>
                )}
                
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Metodología CI+7
                </span>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                  LinkedIn 2026
                </h1>
                
                <p className="text-lg md:text-xl text-primary font-semibold mb-3">
                  Impacta con tu marca y estrategia
                </p>
                <p className="text-base text-muted-foreground mb-2">
                  (con y sin IA)
                </p>
                
                <p className="text-base text-muted-foreground mb-6">
                  Posiciona tu marca, genera conversaciones y convierte oportunidades
                </p>
                
                {/* Program Date - February Only */}
                <div className="flex flex-col gap-3 mb-6">
                  {/* March - Featured */}
                  <motion.div 
                    className="relative px-4 py-4 rounded-xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border-2 border-accent shadow-lg shadow-accent/20"
                    animate={{ 
                      boxShadow: isPresale ? ['0 10px 25px rgba(249, 115, 22, 0.2)', '0 10px 35px rgba(249, 115, 22, 0.35)', '0 10px 25px rgba(249, 115, 22, 0.2)'] : undefined 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isPresale && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold animate-pulse">
                        🔥 PRECIO PROMOCIONAL
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span className="text-foreground font-bold">📍 Marzo: 13-17-24-31</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-accent">{formatPrice(MARCH_PRICE)}</span>
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(REGULAR_PRICE)}</span>
                      </div>
                      <span className="text-xs text-accent font-medium">¡30% de descuento!</span>
                    </div>
                  </motion.div>

                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium text-sm">13:00 a 15:00 hrs (Chile)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium text-sm">4 Sesiones en Vivo (2 hrs c/u)</span>
                  </div>
                </div>
                
                <Button
                  size="lg"
                  onClick={handleCTAClick}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all animate-pulse"
                >
                  {isPresale ? '¡Aprovechar Preventa!' : 'Quiero Inscribirme'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              {/* Right: LinkedIn Logo */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-8 bg-[#0077B5]/20 rounded-full blur-3xl" />
                  <div className="relative w-48 h-48 bg-[#0077B5] rounded-3xl flex items-center justify-center shadow-2xl">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-28 h-28 text-white fill-current"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ¿Para quién es? */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Floating icons background */}
          <div className="absolute inset-0 pointer-events-none">
            {[Users, Target, Sparkles, TrendingUp].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + i * 25}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <Icon className="w-16 h-16 text-primary/10" />
              </motion.div>
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.span
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20"
              >
                <Target className="w-4 h-4" />
                Tu Perfil Ideal
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Para Quién es Este Programa?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profesionales, emprendedores y dueños de negocio que:
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {targetAudience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className="flex items-start gap-3 p-5 rounded-xl bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ¿Qué vas a lograr? - Premium style */}
        <section className="py-20 relative overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/30"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Qué Vas a Lograr?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Al finalizar el programa vas a:
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {outcomes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group p-6 rounded-2xl bg-card border-2 border-transparent hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-accent/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center group-hover:from-accent group-hover:to-accent/80 transition-all duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                      <Zap className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                    </motion.div>
                    <span className="text-3xl font-black text-accent/30 group-hover:text-accent transition-colors">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contenido Base - Video style */}
        <section className="py-20 bg-gradient-to-b from-muted/50 via-muted/30 to-background relative overflow-hidden">
          {/* Play button decoration */}
          <div className="absolute top-20 right-10 opacity-5">
            <Play className="w-64 h-64 text-accent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 text-accent text-sm font-bold mb-4 border border-accent/30 shadow-lg shadow-accent/10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Video className="w-5 h-5" />
                </motion.div>
                Acceso Previo Incluido
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contenido Base Grabado
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Este módulo permite que todos los participantes partan desde el mismo nivel
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {baseContent.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group flex items-center gap-4 p-5 rounded-xl bg-card/80 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/50 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:from-accent group-hover:to-accent/80 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sesiones en Vivo - Premium Cards */}
        <section className="py-20 relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '10%', left: '-10%' }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl"
              animate={{
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              style={{ bottom: '10%', right: '-10%' }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-bold mb-4 border border-primary/30 shadow-lg shadow-primary/10"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
                4 Sesiones en Vivo
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Programa de Sesiones
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                2 horas cada sesión, enfoque práctico y estratégico
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {sessions.map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateY: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                    {/* Gradient header strip */}
                    <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300 shadow-md"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                        >
                          <session.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                        </motion.div>
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">Sesión {session.number}</span>
                          <h3 className="text-xl font-bold text-foreground">{session.title}</h3>
                        </div>
                      </div>
                      
                      <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                            <Target className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-sm font-bold text-accent">Objetivo</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.objective}</p>
                      </div>
                      
                      <ul className="space-y-2.5">
                        {session.topics.map((topic, topicIndex) => (
                          <motion.li 
                            key={topicIndex} 
                            className="flex items-start gap-3 text-sm text-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: topicIndex * 0.05 }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                            </div>
                            <span>{topic}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BONUS Section with Confetti */}
        <section className="py-20 bg-gradient-to-b from-accent/5 via-accent/10 to-accent/5 relative overflow-hidden">
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  backgroundColor: ['#ff6d00', '#0052e2', '#FFD700', '#FF69B4', '#00CED1', '#9370DB'][i % 6],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{
                  y: ['0vh', '120vh'],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              {/* Gift ribbon decoration */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative inline-block mb-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mx-auto shadow-lg shadow-accent/30">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎉
                </motion.div>
              </motion.div>
              
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-bold mb-4 border border-accent/30">
                <Sparkles className="w-4 h-4" />
                ¡REGALO INCLUIDO!
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Bonus del Programa
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recursos adicionales para maximizar tu aprendizaje y resultados
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {bonusItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="flex items-center gap-3 p-5 rounded-xl bg-card border-2 border-accent/30 hover:border-accent/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-accent/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-foreground font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciadores - Premium Grid */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-primary/10 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-accent/10 rounded-br-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Qué Diferencia a Este Programa?
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {differentiators.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group p-6 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary/50 text-center transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                >
                  <motion.div 
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <Sparkles className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CI+7 System - Journey visual */}
        <section className="py-20 relative overflow-hidden">
          {/* Connection line background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Top gradient bar */}
                <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20"
                    >
                      <Zap className="w-4 h-4" />
                      Tu Transformación
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      CI+7 como Sistema Operativo Personal
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      No es una fórmula rápida. Es un sistema que puedes repetir y adaptar según tu objetivo.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connection lines on desktop */}
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 -translate-y-1/2 rounded-full" />
                    
                    {[
                      { step: 1, title: 'Al Inicio', desc: 'Entiendes el por qué', icon: Lightbulb },
                      { step: 2, title: 'Durante', desc: 'Sabes qué hacer', icon: Target },
                      { step: 3, title: 'Al Final', desc: 'Sabes cómo sostenerlo', icon: TrendingUp },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, type: 'spring', stiffness: 150 }}
                        whileHover={{ y: -5, scale: 1.05 }}
                        className="text-center p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl relative z-10"
                      >
                        <motion.div 
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                        >
                          <item.icon className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-2">
                          Paso {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Registration Form Section */}
        {showRegistrationForm && (
          <section id="registration-form" className="py-20 bg-gradient-to-b from-accent/5 via-accent/10 to-accent/5 relative overflow-hidden">
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    backgroundColor: ['#ff6d00', '#0052e2', '#FFD700', '#FF69B4', '#00CED1'][i % 5],
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [0, Math.random() * 50 - 25],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="border-2 border-accent/30 shadow-2xl shadow-accent/10">
                  <CardContent className="p-8">
                    {/* Urgency banner in form */}
                    {isPresale && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-accent font-bold mb-2">
                          <Timer className="w-5 h-5" />
                          <span>Precio Preventa termina en:</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold text-foreground">
                          <span className="bg-accent/20 px-3 py-1 rounded">{String(countdown.days).padStart(2, '0')}</span>
                          <span>:</span>
                          <span className="bg-accent/20 px-3 py-1 rounded">{String(countdown.hours).padStart(2, '0')}</span>
                          <span>:</span>
                          <span className="bg-accent/20 px-3 py-1 rounded">{String(countdown.minutes).padStart(2, '0')}</span>
                          <span>:</span>
                          <span className="bg-accent/20 px-3 py-1 rounded">{String(countdown.seconds).padStart(2, '0')}</span>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Inscripción al Programa LinkedIn 2026
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Completa tus datos para asegurar tu lugar
                      </p>
                      
                      {/* Price display - March only */}
                      <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/30">
                        <span className="text-sm font-medium text-foreground">📍 Marzo:</span>
                        <span className="text-xl font-bold text-accent">{formatPrice(MARCH_PRICE)}</span>
                        <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">-30%</span>
                        <span className="text-sm text-muted-foreground line-through">{formatPrice(REGULAR_PRICE)}</span>
                      </div>
                    </div>
                    
                    <ProgramRegistrationForm 
                      onSuccess={handleRegistrationSuccess}
                      paymentLink={FLOW_PAYMENT_LINK || undefined}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent relative overflow-hidden">
          {/* Sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                <Sparkles className="w-4 h-4 text-accent/40" />
              </motion.div>
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              {isPresale && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-bold text-lg animate-pulse">
                    <Flame className="w-5 h-5" />
                    ¡Últimos días de Preventa!
                  </span>
                </motion.div>
              )}
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Listo para Transformar tu Presencia en LinkedIn?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Deja de improvisar. Construye una estrategia que puedas sostener y que genere resultados reales.
              </p>
              
              {/* Price reminder - March only */}
              <div className="mb-8 p-4 rounded-xl bg-accent/10 border-2 border-accent/30 inline-block">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-accent font-bold">📍 Marzo: 13-17-24-31</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <p className="text-2xl text-accent font-bold">{formatPrice(MARCH_PRICE)}</p>
                      <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">-30%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleCTAClick}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {showRegistrationForm ? 'Completar Inscripción' : (isPresale ? '¡Aprovechar Preventa!' : 'Quiero Inscribirme')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>Cupos limitados</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProgramaLinkedIn;
