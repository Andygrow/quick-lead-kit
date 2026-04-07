import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ShoppingCart, GraduationCap, Briefcase, AlertTriangle, Cpu, TrendingUp } from "lucide-react";

const industries = [
  {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    icon: Building2,
    problem: "El 78% de los leads inmobiliarios se pierden por falta de seguimiento oportuno. Los agentes dedican horas a responder las mismas preguntas y no logran filtrar compradores reales de curiosos.",
    solution: "Un sistema de IA que califica leads automáticamente según presupuesto, zona y urgencia. Chatbots que agendan visitas 24/7 y secuencias de email que nutren al prospecto hasta la decisión de compra.",
    impact: "3.5x más visitas agendadas · 60% menos tiempo en leads no calificados · Ciclo de venta reducido en 40%",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingCart,
    problem: "Carritos abandonados superan el 70%. Las campañas de remarketing son genéricas y el costo de adquisición sube cada trimestre sin mejorar la retención.",
    solution: "Flujos automatizados de recuperación de carrito con mensajes hiperpersonalizados. IA predictiva que recomienda productos según comportamiento de navegación y optimiza el gasto en ads en tiempo real.",
    impact: "35% de recuperación de carritos · 2.8x en ROAS · +45% en valor de vida del cliente (LTV)",
  },
  {
    id: "educacion",
    label: "Educación",
    icon: GraduationCap,
    problem: "Las instituciones educativas luchan por convertir interesados en matriculados. El proceso de admisión es lento, manual y pierde postulantes a mitad de camino.",
    solution: "Embudos inteligentes que guían al prospecto desde la consulta inicial hasta la matrícula. Chatbots que resuelven dudas sobre mallas, becas y requisitos, mientras el CRM prioriza los leads con mayor intención.",
    impact: "50% más matrículas desde digital · 70% reducción en consultas repetitivas · ROI de campaña mejorado en 200%",
  },
  {
    id: "servicios",
    label: "Servicios",
    icon: Briefcase,
    problem: "Consultoras y agencias dependen de referidos. No tienen un sistema predecible de generación de demanda y el cierre de propuestas toma semanas.",
    solution: "Sistema de prospección automatizada en LinkedIn + email. IA que genera propuestas personalizadas y flujos de nurturing que posicionan tu expertise hasta que el cliente está listo para comprar.",
    impact: "4x más reuniones calificadas por mes · Propuestas enviadas en minutos, no días · Pipeline predecible y escalable",
  },
];

const contentCards = [
  { key: "problem", icon: AlertTriangle, label: "Problema", colorClass: "text-red-400", bgClass: "bg-red-500/10", borderClass: "border-red-500/20", field: "problem" as const },
  { key: "solution", icon: Cpu, label: "Solución con IA", colorClass: "text-[hsl(142,72%,50%)]", bgClass: "bg-[hsl(142,72%,50%)/0.1]", borderClass: "border-[hsl(142,72%,50%)/0.25]", field: "solution" as const },
  { key: "impact", icon: TrendingUp, label: "Impacto", colorClass: "text-blue-400", bgClass: "bg-blue-500/10", borderClass: "border-blue-500/20", field: "impact" as const },
];

const IndustrySection = () => {
  const [active, setActive] = useState(industries[0].id);
  const current = industries.find((i) => i.id === active)!;

  return (
    <section id="industrias" className="py-24 lg:py-32 bg-[hsl(220,20%,3%)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(142,72%,50%,0.03),transparent_50%)]" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-wider uppercase text-[hsl(142,72%,50%)] mb-4 block">
            Soluciones
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            IA por <span className="text-[hsl(142,72%,50%)]">Industria</span>
          </h2>
          <p className="mt-4 text-[hsl(0,0%,65%)] max-w-xl mx-auto">
            Cada negocio tiene desafíos únicos. Descubre cómo la inteligencia artificial los resuelve en tu sector.
          </p>
        </motion.div>

        {/* Industry selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-3xl mx-auto">
          {industries.map((ind) => {
            const isActive = active === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActive(ind.id)}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? "border-[hsl(142,72%,50%)/0.5] bg-[hsl(142,72%,50%)/0.08] shadow-[0_0_25px_hsl(142,72%,50%,0.12)]"
                    : "border-[hsl(0,0%,12%)] bg-[hsl(220,20%,6%)] hover:border-[hsl(0,0%,22%)] hover:bg-[hsl(220,20%,7%)]"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-[hsl(142,72%,50%)/0.2] shadow-[0_0_12px_hsl(142,72%,50%,0.2)]"
                      : "bg-[hsl(0,0%,10%)] group-hover:bg-[hsl(0,0%,14%)]"
                  }`}
                >
                  <ind.icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive ? "text-[hsl(142,72%,50%)]" : "text-[hsl(0,0%,55%)] group-hover:text-[hsl(0,0%,70%)]"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-[hsl(0,0%,95%)]" : "text-[hsl(0,0%,62%)] group-hover:text-[hsl(0,0%,80%)]"
                  }`}
                >
                  {ind.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="industry-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 bg-[hsl(142,72%,50%)] rounded-full shadow-[0_0_8px_hsl(142,72%,50%,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto"
          >
            {contentCards.map((card, i) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`p-6 rounded-2xl border ${card.borderClass} bg-[hsl(220,20%,6%)] space-y-4 hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${card.bgClass} flex items-center justify-center`}>
                    <card.icon className={`w-[18px] h-[18px] ${card.colorClass}`} />
                  </div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${card.colorClass}`}>{card.label}</h3>
                </div>
                <p className="text-sm text-[hsl(0,0%,70%)] leading-relaxed">{current[card.field]}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default IndustrySection;
