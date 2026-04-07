import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle, 
  Target, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Lightbulb,
  Star,
  Zap,
  Clock,
  BarChart3,
  Heart,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Linkedin
} from "lucide-react";
import constanzaProfile from "@/assets/constanza/constanza-profile.png";

// Metodología CI+7 - Los 7 Pasos Reales
const ciPlusSevenSteps = [
  {
    step: 1,
    title: "Define tu Objetivo y Audiencia",
    icon: Target,
    gradient: "from-primary via-primary to-primary/80",
    bgAccent: "bg-primary/10",
    borderAccent: "border-primary/30",
    keyPoints: [
      "Define POR QUÉ estás en LinkedIn",
      "Identifica claramente A QUIÉN quieres llegar (tu cliente ideal)",
      "Establece metas específicas y medibles"
    ],
    tip: "Un perfil sin objetivo claro se siente confuso. Sin confianza, no hay ventas.",
    emoji: "🎯"
  },
  {
    step: 2,
    title: "Optimiza tu Cuenta de Perfil",
    icon: Users,
    gradient: "from-accent via-accent to-accent/80",
    bgAccent: "bg-accent/10",
    borderAccent: "border-accent/30",
    keyPoints: [
      "Tu perfil debe funcionar como una landing page, no como CV",
      "Responde las preguntas que se hace tu cliente ideal",
      "Incluye propuesta de valor clara en tu titular",
      "Foto profesional + banner estratégico"
    ],
    tip: "El titular no es para impresionar colegas, es para que tu cliente ideal se reconozca.",
    emoji: "✨"
  },
  {
    step: 3,
    title: "Genera una Red de Contactos de Calidad",
    icon: Heart,
    gradient: "from-primary via-primary to-primary/80",
    bgAccent: "bg-primary/10",
    borderAccent: "border-primary/30",
    keyPoints: [
      "Objetivo: 150-200 contactos nuevos por mes mínimo",
      "Conectar con tu público objetivo (10-15 conexiones diarias)",
      "Es una red de oportunidades, no de amigos",
      "No colecciones contactos, genera relaciones"
    ],
    tip: "No se trata de sumar contactos al azar. Construye una red alineada a tus objetivos.",
    emoji: "🤝"
  },
  {
    step: 4,
    title: "Interactuar y Generar Networking",
    icon: MessageSquare,
    gradient: "from-accent via-accent to-accent/80",
    bgAccent: "bg-accent/10",
    borderAccent: "border-accent/30",
    keyPoints: [
      "Transformarte en autoridad en tu sector",
      "Comentar y reaccionar (5-10 comentarios diarios)",
      "Generar networking genuino, no transaccional",
      "Entablar conversaciones significativas por InMails"
    ],
    tip: "Un buen comentario estratégico puede abrir más puertas que muchos mensajes directos.",
    emoji: "💬"
  },
  {
    step: 5,
    title: "Impacta con Contenido de Valor",
    icon: Lightbulb,
    gradient: "from-primary via-primary to-primary/80",
    bgAccent: "bg-primary/10",
    borderAccent: "border-primary/30",
    keyPoints: [
      "Publicar mínimo 2-3 veces por semana",
      "Interactúa y cuenta tu historia",
      "Estrategia variada: casos, historias, soluciones",
      "Enfócate en resolver los problemas de tu audiencia"
    ],
    tip: "80% valor, 20% promoción. Educa, inspira y entretiene antes de vender.",
    emoji: "💡"
  },
  {
    step: 6,
    title: "Invierte Tiempo y Sé Consistente",
    icon: Clock,
    gradient: "from-accent via-accent to-accent/80",
    bgAccent: "bg-accent/10",
    borderAccent: "border-accent/30",
    keyPoints: [
      "20 minutos diarios para practicar y tomar acción",
      "Convertir tu presencia en un hábito constante",
      "Estar activo más allá de solo publicar",
      "Visibilidad permanente en la red"
    ],
    tip: "Consistencia > Viralidad. Es mejor publicar 3 veces por semana durante un año.",
    emoji: "⏰"
  },
  {
    step: 7,
    title: "Mide tus Resultados",
    icon: BarChart3,
    gradient: "from-primary via-primary to-primary/80",
    bgAccent: "bg-primary/10",
    borderAccent: "border-primary/30",
    keyPoints: [
      "Monitorea el crecimiento de contactos semana a semana",
      "Mide impresiones (más importante que likes)",
      "Analiza qué contenido genera más engagement",
      "Mejora continuamente basado en datos"
    ],
    tip: "Lo que no se mide, no se mejora. Realiza ajustes según resultados.",
    emoji: "📊"
  }
];

const resultsProven = [
  { icon: TrendingUp, stat: "+30%", label: "Visibilidad", color: "text-primary" },
  { icon: Target, stat: "+9%", label: "Conversión", color: "text-accent" },
  { icon: Star, stat: "+23%", label: "Ventas B2B", color: "text-primary" },
  { icon: Users, stat: "200", label: "Contactos/mes", color: "text-accent" }
];

const StepCard = ({ step, index }: { step: typeof ciPlusSevenSteps[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl overflow-hidden border-2 ${step.borderAccent} transition-all duration-300 ${isOpen ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Step Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gradient-to-r ${step.gradient} p-5 flex items-center gap-4 text-left transition-all duration-300`}
      >
        {/* Step Number Badge */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
            <span className="text-xl font-bold text-white">{step.step}</span>
          </div>
          {/* Emoji badge */}
          <span className="absolute -top-1 -right-1 text-lg">{step.emoji}</span>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h4 className="text-lg md:text-xl font-bold text-white leading-tight">
            {step.title}
          </h4>
        </div>

        {/* Icon and Arrow */}
        <div className="flex items-center gap-3">
          <step.icon className="w-6 h-6 text-white/70 hidden sm:block" />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-white/80" />
          </motion.div>
        </div>
      </button>

      {/* Step Content - Expandable */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className={`p-5 ${step.bgAccent} bg-card`}>
          {/* Key Points */}
          <ul className="space-y-3 mb-4">
            {step.keyPoints.map((point, pointIndex) => (
              <motion.li 
                key={pointIndex} 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
                transition={{ delay: isOpen ? pointIndex * 0.1 : 0, duration: 0.2 }}
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="text-foreground font-medium">{point}</span>
              </motion.li>
            ))}
          </ul>

          {/* Pro Tip */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/40 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Pro Tip</p>
                <p className="text-sm text-muted-foreground italic">
                  {step.tip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const GuideContent = () => {
  return (
    <div className="space-y-10">
      {/* Guide Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Metodología CI+7
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Conexión e Interacción en <span className="shimmer-text">7 Pasos</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Sistema probado que transforma perfiles individuales en "imanes" que atraen clientes
        </p>
      </motion.div>

      {/* Results Stats - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2 sm:gap-4"
      >
        {resultsProven.map((result, index) => (
          <motion.div 
            key={index}
            className="glass-card p-3 sm:p-4 rounded-xl text-center group hover:scale-105 transition-transform"
            whileHover={{ y: -2 }}
          >
            <result.icon className={`w-5 h-5 ${result.color} mx-auto mb-1.5 group-hover:scale-110 transition-transform`} />
            <p className={`text-xl sm:text-2xl font-bold ${result.color}`}>{result.stat}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{result.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* The 7 Steps - Interactive Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <h3 className="text-lg font-bold text-foreground px-4 flex items-center gap-2">
            <span>Los 7 Pasos</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        
        <div className="space-y-3">
          {ciPlusSevenSteps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Time Investment - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">¿Cuánto tiempo necesitas?</h4>
            <p className="text-xs text-muted-foreground">Solo 20 minutos diarios</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { text: "20 min diarios", icon: "⏱️" },
            { text: "3 posts/semana", icon: "📝" },
            { text: "5-10 comentarios", icon: "💬" },
            { text: "Sin tiempo completo", icon: "✅" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-foreground/80 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Who Is This For - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-5 rounded-2xl"
      >
        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-accent" />
          </div>
          ¿Para quién es esta metodología?
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            "Profesionales independientes",
            "Emprendedores B2B",
            "Ejecutivos y Gerentes",
            "Equipos de ventas",
            "Empresas con Embajadores"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Author Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl" />
        <div className="relative glass-card p-6 rounded-2xl border-l-4 border-accent">
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://www.linkedin.com/in/constanzaibietaillanes"
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto sm:mx-0 flex-shrink-0"
            >
              <div className="relative">
                <img 
                  src={constanzaProfile} 
                  alt="Constanza Ibieta" 
                  className="w-16 h-16 rounded-full object-cover object-top border-2 border-accent shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Linkedin className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
            </a>
            <div className="text-center sm:text-left">
              <p className="text-muted-foreground italic mb-2">
                "La metodología CI+7 enfatiza tres pilares: <span className="text-primary font-medium">Marca Personal</span>, 
                <span className="text-accent font-medium"> Creación de Contenido</span> y 
                <span className="text-primary font-medium"> Networking Auténtico</span>."
              </p>
              <a 
                href="https://www.linkedin.com/in/constanzaibietaillanes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                Constanza Ibieta Illanes
                <Linkedin className="w-4 h-4" />
              </a>
              <p className="text-xs text-muted-foreground">Creadora de la Metodología CI+7</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuideContent;
