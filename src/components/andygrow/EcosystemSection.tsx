import { motion } from "framer-motion";
import { Megaphone, Cog, GraduationCap, ExternalLink } from "lucide-react";

const ecosystemCards = [
  {
    name: "Brief.cl",
    role: "Agencia de Marketing & Ads",
    icon: Megaphone,
    description:
      "Estrategia, performance y creatividad digital. Campañas de adquisición que escalan con datos y automatización.",
    url: "https://brief.cl",
    accent: "hsl(142,72%,50%)",
  },
  {
    name: "Revbase.cl",
    role: "Motores Comerciales",
    icon: Cog,
    description:
      "Infraestructura comercial para empresas que necesitan generar demanda predecible y cerrar más deals.",
    url: "https://revbase.cl",
    accent: "hsl(200,80%,55%)",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const EcosystemSection = () => {
  return (
    <section id="ecosistema" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(200,80%,55%,0.03),transparent_50%)]" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-wider uppercase text-[hsl(142,72%,50%)] mb-4 block">
            Ecosistema
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Empresas que <span className="text-[hsl(142,72%,50%)]">potencian</span> el sistema
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
        >
          {ecosystemCards.map((card) => (
            <motion.a
              key={card.name}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardReveal}
              className="group relative p-8 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,20%,6%)] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden hover:shadow-[0_20px_60px_-20px_hsl(142,72%,50%,0.1)]"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(142,72%,50%,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_15px_hsl(142,72%,50%,0.15)]"
                    style={{ backgroundColor: `${card.accent}15` }}
                  >
                    <card.icon className="w-6 h-6" style={{ color: card.accent }} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-[hsl(0,0%,25%)] group-hover:text-[hsl(142,72%,50%)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                {/* Info */}
                <h3
                  className="text-xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {card.name}
                </h3>
                <span
                  className="text-xs font-semibold uppercase tracking-wider mb-4 block"
                  style={{ color: card.accent }}
                >
                  {card.role}
                </span>
                <p className="text-sm text-[hsl(0,0%,62%)] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom glow on hover */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.accent}60, transparent)`,
                }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Teaching banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-[hsl(142,72%,50%)/0.15] bg-[hsl(142,72%,50%)/0.04] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-[hsl(142,72%,50%)/0.12] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[hsl(142,72%,50%)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Docente de IA Aplicada
              </p>
              <p className="text-xs text-[hsl(0,0%,58%)]">
                Llevando la trinchera a la academia
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EcosystemSection;
