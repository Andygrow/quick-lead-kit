import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Bot, ChevronDown, Zap, BarChart3, Clock, Menu, X,
  Workflow, LineChart, BrainCircuit, Search, Layers, Rocket, RefreshCw,
  Building2, ShoppingCart, GraduationCap, Briefcase, HeartPulse, Factory,
  Globe, CheckCircle2, Users, Star, Phone, Mail, User,
  Loader2, Sparkles, FileText, Download, ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ── helpers ── */
const AC = "hsl(var(--tpl-accent))"; // accent color shorthand
const ACA = (alpha: number) => `hsl(var(--tpl-accent) / ${alpha})`; // accent with alpha

/* ── Stat counter ── */
const useCounter = (end: number, duration = 2000, inView = false, decimals = 0) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const t0 = Date.now();
    const f = Math.pow(10, decimals);
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(end * eased * f) / f);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, inView, decimals]);
  return count;
};

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ── Shared section wrapper ── */
const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-20 md:py-28 relative ${className}`}>
    <div className="container mx-auto px-4">{children}</div>
  </section>
);

const SectionHeader = ({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-16">
    <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={0}
      className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
      {badge}
    </motion.span>
    <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={1}
      className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">{title}</motion.h2>
    <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={2}
      className="text-[hsl(0,0%,55%)] text-lg">{subtitle}</motion.p>
  </div>
);

/* ══════════════════ NAVBAR ══════════════════ */
// 📌 PERSONALIZAR: Links de navegación
const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Soluciones", href: "#industrias" },
  { label: "Resultados", href: "#resultados" },
  { label: "Recurso Gratis", href: "#lead-magnet" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-lg border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 📌 PERSONALIZAR: Nombre de marca */}
        <a href="#" className="text-2xl font-black tracking-tight text-white">Tu<span className="text-primary">Marca</span></a>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-white transition-colors font-medium">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => document.getElementById("lead-magnet")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm px-5 h-9 rounded-full">
            Descargar Gratis
          </Button>
          <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border px-4 pb-4">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block py-3 text-muted-foreground hover:text-white font-medium border-b border-border last:border-0">{l.label}</a>
          ))}
          <Button onClick={() => { setMobileOpen(false); document.getElementById("lead-magnet")?.scrollIntoView({ behavior: "smooth" }); }}
            className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full">
            Descargar Recurso Gratis
          </Button>
        </motion.div>
      )}
    </nav>
  );
};

/* ══════════════════ HERO ══════════════════ */
const MiniStat = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex items-center gap-2.5 text-left">
    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <div className="text-white font-bold text-sm leading-tight">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  </div>
);

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(0,0%,50%/0.3) 1px,transparent 1px),linear-gradient(90deg,hsl(0,0%,50%/0.3) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
              {/* 📌 PERSONALIZAR: Badge del hero */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <Bot className="w-3.5 h-3.5" /> [Tu Categoría]
              </span>
            </motion.div>
            {/* 📌 PERSONALIZAR: Titular principal */}
            <motion.h1 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              [Tu propuesta de{" "}<span className="tpl-gradient-text">valor principal</span>{" "}aquí]
            </motion.h1>
            {/* 📌 PERSONALIZAR: Subtítulo */}
            <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Describe en 1-2 líneas qué haces, para quién lo haces y el resultado que entregas. Sé específico y orientado al beneficio del cliente.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={3}>
              <Button onClick={() => document.getElementById("lead-magnet")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full tpl-glow tpl-glow-hover transition-all duration-300 group">
                {/* 📌 PERSONALIZAR: Texto del CTA */}
                Descargar Guía Gratis <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            {/* 📌 PERSONALIZAR: Mini estadísticas */}
            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={4} className="flex flex-wrap gap-6 mt-10">
              <MiniStat icon={Zap} value="[Stat 1]" label="[Descripción]" />
              <MiniStat icon={BarChart3} value="[Stat 2]" label="[Descripción]" />
              <MiniStat icon={Clock} value="[Stat 3]" label="[Descripción]" />
            </motion.div>
          </div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2} className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full border border-primary/15" />
              <div className="absolute -inset-8 rounded-full border border-primary/8" />
              {/* 📌 PERSONALIZAR: Imagen de perfil o logo */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full overflow-hidden border-2 border-primary/30 tpl-glow bg-card flex items-center justify-center">
                <User className="w-24 h-24 text-muted-foreground/30" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 tpl-float">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/30 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary tpl-pulse-dot" />
                  <span className="text-xs font-bold text-white whitespace-nowrap">[Estado activo]</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 tpl-scroll-indicator">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </div>
      </div>
    </section>
  );
};

/* ══════════════════ SOCIAL PROOF ══════════════════ */
// 📌 PERSONALIZAR: Estadísticas y logos de clientes/aliados
const SOCIAL_STATS = [
  { value: "[X]+", label: "[Clientes atendidos]" },
  { value: "[X]+", label: "[Proyectos entregados]" },
  { value: "[X]+", label: "[Años de experiencia]" },
];

const SOCIAL_LOGOS = [
  "[Marca 1]", "[Marca 2]", "[Marca 3]", "[Marca 4]", "[Marca 5]", "[Marca 6]",
];

const SocialProofSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-14 bg-card/50 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {SOCIAL_STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.4 }} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {/* 📌 PERSONALIZAR: Texto de confianza */}
            <p className="text-sm text-muted-foreground font-medium px-2">Confían en nosotros</p>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* Client logos as text badges */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {SOCIAL_LOGOS.map((logo, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                className="px-5 py-2.5 rounded-xl border border-border bg-background/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <span className="text-sm font-semibold text-muted-foreground">{logo}</span>
              </motion.div>
            ))}
          </div>

          {/* Trust line */}
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {/* 📌 PERSONALIZAR: Línea de confianza */}
            Más de <span className="text-primary font-semibold">[X años]</span> ayudando a empresas a{" "}
            <span className="text-white font-medium">[lograr resultado principal]</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════ SERVICIOS ══════════════════ */
// 📌 PERSONALIZAR: Tus servicios principales
const SERVICES = [
  { icon: Workflow, title: "[Servicio 1]", desc: "Descripción breve del primer servicio o solución que ofreces. Enfócate en el beneficio para el cliente." },
  { icon: LineChart, title: "[Servicio 2]", desc: "Descripción breve del segundo servicio. Explica qué problema resuelve y qué resultado genera." },
  { icon: BrainCircuit, title: "[Servicio 3]", desc: "Descripción breve del tercer servicio. Destaca el diferenciador o la ventaja competitiva." },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Section id="servicios">
      <SectionHeader badge="Servicios" title={<>Lo que <span className="tpl-gradient-text">ofrecemos</span></>} subtitle="Soluciones diseñadas para transformar tu negocio." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SERVICES.map((s) => (
          <motion.div key={s.title} variants={fadeUp} custom={0}
            className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_hsl(var(--tpl-accent)/0.2)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ INDUSTRIAS / SOLUCIONES ══════════════════ */
// 📌 PERSONALIZAR: Industrias o segmentos
const INDUSTRIES = [
  { id: "segmento-1", icon: Building2, label: "[Segmento 1]", problem: "Describe el problema principal de este segmento.", solution: "Explica cómo tu solución resuelve el problema.", impact: "Métricas de impacto esperadas." },
  { id: "segmento-2", icon: ShoppingCart, label: "[Segmento 2]", problem: "Problema del segundo segmento.", solution: "Tu solución para este segmento.", impact: "Resultados esperados." },
  { id: "segmento-3", icon: GraduationCap, label: "[Segmento 3]", problem: "Problema del tercer segmento.", solution: "Solución personalizada.", impact: "Impacto medible." },
  { id: "segmento-4", icon: Briefcase, label: "[Segmento 4]", problem: "Problema del cuarto segmento.", solution: "Tu propuesta de valor.", impact: "Resultados concretos." },
  { id: "segmento-5", icon: HeartPulse, label: "[Segmento 5]", problem: "Problema específico.", solution: "Solución diferenciada.", impact: "KPIs de mejora." },
  { id: "segmento-6", icon: Factory, label: "[Segmento 6]", problem: "Desafío del segmento.", solution: "Enfoque de solución.", impact: "Métricas de éxito." },
];

const IndustrySection = () => {
  const [active, setActive] = useState("segmento-1");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const selected = INDUSTRIES.find((i) => i.id === active)!;
  return (
    <Section id="industrias" className="bg-[hsl(220,15%,4%)]">
      <SectionHeader badge="Soluciones" title={<>Soluciones para <span className="tpl-gradient-text">tu industria</span></>} subtitle="Selecciona tu sector y descubre cómo podemos ayudarte." />
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {INDUSTRIES.map((ind) => (
            <motion.button key={ind.id} variants={fadeUp} custom={0} onClick={() => setActive(ind.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${active === ind.id ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-muted"}`}>
              <ind.icon className="w-6 h-6" />
              <span className="text-xs font-semibold text-center">{ind.label}</span>
            </motion.button>
          ))}
        </motion.div>
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Problema", color: "hsl(0,70%,55%)", content: selected.problem },
            { label: "Solución", color: AC, content: selected.solution },
            { label: "Impacto esperado", color: "hsl(45,90%,55%)", content: selected.impact },
          ].map((card) => (
            <div key={card.label} className="p-6 rounded-2xl border border-border bg-card">
              <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: card.color }}>{card.label}</span>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

/* ══════════════════ PROCESO ══════════════════ */
// 📌 PERSONALIZAR: Tu proceso de trabajo
const STEPS = [
  { num: "01", icon: Search, title: "[Paso 1]", desc: "Descripción del primer paso de tu proceso." },
  { num: "02", icon: Layers, title: "[Paso 2]", desc: "Descripción del segundo paso." },
  { num: "03", icon: Rocket, title: "[Paso 3]", desc: "Descripción del tercer paso." },
  { num: "04", icon: RefreshCw, title: "[Paso 4]", desc: "Descripción del cuarto paso." },
];

const ProcessSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Section id="proceso">
      <SectionHeader badge="Proceso" title={<>Cómo <span className="tpl-gradient-text">funciona</span></>} subtitle="Un proceso probado para generar resultados reales." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {STEPS.map((s, i) => (
          <motion.div key={s.num} variants={fadeUp} custom={i}
            className="relative p-6 rounded-2xl border border-border bg-card group hover:border-primary/30 transition-all duration-500">
            <span className="text-5xl font-black text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">{s.num}</span>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-primary/30" />}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ RESULTADOS ══════════════════ */
// 📌 PERSONALIZAR: Tus métricas
const RESULTS = [
  { value: 100, suffix: "%", label: "[Métrica 1]", decimals: 0 },
  { value: 50, suffix: "%", label: "[Métrica 2]", decimals: 0 },
  { value: 30, suffix: "+", label: "[Métrica 3]", decimals: 0 },
  { value: 4.9, suffix: "★", label: "[Métrica 4]", decimals: 1 },
];

const StatCounter = ({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(value, 2000, inView, decimals);
  return (
    <div ref={ref} className="text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 group hover:-translate-y-1">
      <div className="text-4xl md:text-5xl font-black text-primary mb-2 tabular-nums group-hover:drop-shadow-[0_0_12px_hsl(var(--tpl-accent)/0.5)] transition-all duration-500">
        {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const ResultsSection = () => (
  <Section id="resultados" className="bg-[hsl(220,15%,4%)]">
    <SectionHeader badge="Resultados" title={<>Números que <span className="tpl-gradient-text">hablan</span></>} subtitle="Resultados reales de clientes que confían en nosotros." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {RESULTS.map((r) => <StatCounter key={r.label} {...r} />)}
    </div>
  </Section>
);

/* ══════════════════ LEAD MAGNET SECTION ══════════════════ */
/*
  📌 PERSONALIZAR: Este es un embudo de conversión con Lead Magnet.
  Flujo: Usuario ve la oferta → llena formulario → recibe recurso gratis → se registra como lead.
  Tipos de lead magnet: guía PDF, checklist, plantilla, quiz, calculadora, etc.
*/

// 📌 PERSONALIZAR: Lo que incluye tu lead magnet
const LEAD_MAGNET_ITEMS = [
  "Checklist paso a paso para [resultado deseado]",
  "Plantilla editable de [herramienta clave]",
  "3 estrategias probadas para [beneficio principal]",
  "Caso de estudio real con resultados",
  "Bonus: acceso a [recurso adicional]",
];

const LeadMagnetSection = () => {
  const [step, setStep] = useState<"offer" | "form" | "success">("offer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Ingresa un email válido");
      return;
    }

    setSubmitting(true);
    try {
      // 📌 Guarda el lead en la base de datos
      const { error } = await supabase.from("leads").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim() || "No especificada",
        role: "Lead Magnet",
        lead_quality: email.includes("gmail") || email.includes("hotmail") ? "low" : "high",
        is_corporate_email: !email.includes("gmail") && !email.includes("hotmail") && !email.includes("yahoo"),
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || null,
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || null,
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || null,
      });
      if (error) throw error;

      // 📌 Envía email con el recurso (opcional)
      try {
        await supabase.functions.invoke('send-lead-email', {
          body: { name, email, resourceName: "[Nombre del Lead Magnet]" },
        });
      } catch { console.log('Email skipped'); }

      setStep("success");
      toast.success("¡Listo! Revisa tu email para descargar el recurso.");
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="lead-magnet">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Value proposition */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              <Download className="w-3.5 h-3.5" /> Recurso Gratuito
            </span>
            {/* 📌 PERSONALIZAR: Título del lead magnet */}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              [Nombre del <span className="tpl-gradient-text">Lead Magnet</span>]
            </h2>
            {/* 📌 PERSONALIZAR: Descripción */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Una guía completa con las estrategias y herramientas que necesitas para [lograr resultado X]. Descárgala gratis y empieza a aplicarla hoy.
            </p>

            {/* Lead Magnet visual preview */}
            <div className="relative mb-6 p-5 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-18 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">[Título del recurso]</h3>
                  <p className="text-xs text-muted-foreground">PDF · 15 páginas · Descarga inmediata</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                GRATIS
              </div>
            </div>

            {/* What's included */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">Lo que incluye:</p>
              {LEAD_MAGNET_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form / Funnel */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
            <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-[0_0_60px_-15px_hsl(var(--tpl-accent)/0.15)]">
              {/* Progress bar */}
              <div className="h-1 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: step === "offer" ? "33%" : step === "form" ? "66%" : "100%" }}
                />
              </div>

              <div className="px-6 py-4 border-b border-border bg-primary/5">
                <h3 className="text-lg font-bold text-white text-center">
                  {step === "offer" && "Descarga tu recurso gratis"}
                  {step === "form" && "Un paso más..."}
                  {step === "success" && "¡Recurso enviado!"}
                </h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {step === "offer" && "Sin costo · Sin compromisos"}
                  {step === "form" && "Solo necesitamos tu info para enviarlo"}
                  {step === "success" && "Revisa tu bandeja de entrada"}
                </p>
              </div>

              <div className="px-6 py-6">
                <AnimatePresence mode="wait">
                  {step === "offer" && (
                    <motion.div
                      key="offer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-muted-foreground text-center">
                        Más de <span className="text-primary font-bold">[X] profesionales</span> ya descargaron este recurso
                      </p>
                      {/* Social proof mini */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">[X] valoraciones</span>
                      </div>
                      <Button
                        onClick={() => setStep("form")}
                        className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow tpl-glow-hover transition-all duration-300 group"
                      >
                        Quiero mi copia gratis
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <p className="text-[10px] text-muted-foreground/60 text-center">
                        Recibirás el recurso directo en tu email
                      </p>
                    </motion.div>
                  )}

                  {step === "form" && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required
                          className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                          className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Tu empresa (opcional)" value={company} onChange={(e) => setCompany(e.target.value)}
                          className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
                      </div>
                      <Button type="submit" disabled={submitting}
                        className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow tpl-glow-hover transition-all duration-300">
                        {submitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</>
                        ) : (
                          <><Download className="w-5 h-5 mr-2" /> Descargar Ahora</>
                        )}
                      </Button>
                      <button type="button" onClick={() => setStep("offer")} className="w-full text-xs text-muted-foreground hover:text-white transition-colors py-1">
                        ← Volver
                      </button>
                    </motion.form>
                  )}

                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">¡Listo! 🎉</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Revisa tu email — te enviamos el recurso.
                      </p>
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <p className="text-xs text-primary font-semibold mb-2">
                          💡 Mientras esperas, ¿quieres un diagnóstico personalizado?
                        </p>
                        <Button
                          onClick={() => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" })}
                          variant="outline"
                          className="w-full border-primary/30 text-primary hover:bg-primary/10 rounded-lg text-sm"
                        >
                          <Sparkles className="w-4 h-4 mr-2" /> Obtener Diagnóstico IA Gratis
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

/* ══════════════════ QUIZ LEAD MAGNET ══════════════════ */
/*
  📌 PERSONALIZAR: Lead magnet tipo Quiz / Autodiagnóstico.
  Flujo: Usuario responde 5 preguntas → ve resultado con nivel → deja datos → se registra como lead.
*/

const QUIZ_QUESTIONS = [
  {
    question: "[Pregunta 1: ¿Cómo describes tu situación actual en X?]",
    options: [
      { label: "No tengo nada implementado", score: 1 },
      { label: "Tengo algo básico pero sin estrategia", score: 2 },
      { label: "Tengo un sistema pero no da resultados", score: 3 },
      { label: "Funciona bien pero quiero optimizar", score: 4 },
    ],
  },
  {
    question: "[Pregunta 2: ¿Cuánto tiempo dedicas a X por semana?]",
    options: [
      { label: "Nada, no es prioridad", score: 1 },
      { label: "Menos de 2 horas", score: 2 },
      { label: "Entre 2 y 5 horas", score: 3 },
      { label: "Más de 5 horas con proceso", score: 4 },
    ],
  },
  {
    question: "[Pregunta 3: ¿Cuál es tu principal desafío con X?]",
    options: [
      { label: "No sé por dónde empezar", score: 1 },
      { label: "No tengo las herramientas", score: 2 },
      { label: "Tengo herramientas pero no estrategia", score: 3 },
      { label: "Necesito escalar lo que ya tengo", score: 4 },
    ],
  },
  {
    question: "[Pregunta 4: ¿Qué resultado buscas en los próximos 90 días?]",
    options: [
      { label: "Entender qué debo hacer", score: 1 },
      { label: "Implementar un sistema básico", score: 2 },
      { label: "Mejorar resultados actuales", score: 3 },
      { label: "Duplicar o triplicar resultados", score: 4 },
    ],
  },
  {
    question: "[Pregunta 5: ¿Tienes equipo dedicado a X?]",
    options: [
      { label: "No, lo hago solo/a", score: 1 },
      { label: "Tengo 1 persona parcial", score: 2 },
      { label: "Tengo un equipo pequeño", score: 3 },
      { label: "Equipo dedicado con procesos", score: 4 },
    ],
  },
];

const QUIZ_LEVELS = [
  { min: 5, max: 8, level: "Principiante", color: "hsl(0,70%,55%)", emoji: "🔴", desc: "Estás empezando — necesitas una base sólida." },
  { min: 9, max: 13, level: "En desarrollo", color: "hsl(45,90%,55%)", emoji: "🟡", desc: "Tienes los fundamentos pero falta estrategia." },
  { min: 14, max: 17, level: "Avanzado", color: "hsl(var(--tpl-accent))", emoji: "🟢", desc: "Vas por buen camino. Necesitas optimización." },
  { min: 18, max: 20, level: "Experto", color: "hsl(var(--tpl-accent))", emoji: "🚀", desc: "¡Excelente! Podemos ayudarte a escalar." },
];

const QuizLeadMagnet = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const quizLevel = QUIZ_LEVELS.find((l) => totalScore >= l.min && totalScore <= l.max) || QUIZ_LEVELS[0];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  const selectAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: "Quiz Lead Magnet",
        role: `Quiz: ${quizLevel.level}`,
        lead_quality: totalScore >= 14 ? "high" : totalScore >= 9 ? "medium" : "low",
        is_corporate_email: !email.includes("gmail") && !email.includes("hotmail") && !email.includes("yahoo"),
        quiz_score: totalScore,
        quiz_level: quizLevel.level,
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || null,
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || null,
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("¡Resultados enviados a tu email!");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0); setAnswers([]); setShowResult(false); setShowForm(false);
    setSubmitted(false); setName(""); setEmail("");
  };

  return (
    <Section id="quiz" className="bg-[hsl(220,15%,4%)]">
      <SectionHeader badge="Autodiagnóstico" title={<>¿En qué nivel estás en <span className="tpl-gradient-text">[Tu Tema]</span>?</>}
        subtitle="Responde 5 preguntas rápidas y descubre tu nivel actual." />
      <div ref={ref} className="max-w-2xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
          className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-[0_0_60px_-15px_hsl(var(--tpl-accent)/0.15)]">
          <div className="h-1.5 bg-muted">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${showResult ? 100 : progress}%` }} />
          </div>
          <div className="px-6 sm:px-8 py-6">
            <AnimatePresence mode="wait">
              {!showResult && !showForm && !submitted && (
                <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Pregunta {currentQ + 1} de {QUIZ_QUESTIONS.length}</span>
                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-6">{QUIZ_QUESTIONS[currentQ].question}</h3>
                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                      <button key={i} onClick={() => selectAnswer(opt.score)}
                        className="w-full text-left p-4 rounded-xl border border-border bg-muted hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors font-medium">{opt.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {showResult && !showForm && !submitted && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-center py-4">
                    <span className="text-5xl mb-4 block">{quizLevel.emoji}</span>
                    <h3 className="text-2xl font-black text-white mb-1">Tu nivel: <span style={{ color: quizLevel.color }}>{quizLevel.level}</span></h3>
                    <p className="text-sm text-muted-foreground mb-2">Puntuación: {totalScore} / {QUIZ_QUESTIONS.length * 4}</p>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden my-4 max-w-xs mx-auto">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(totalScore / (QUIZ_QUESTIONS.length * 4)) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full" style={{ backgroundColor: quizLevel.color }} />
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">{quizLevel.desc}</p>
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-4">
                      <p className="text-xs text-primary font-semibold">📊 ¿Quieres el reporte completo con recomendaciones?</p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => setShowForm(true)} className="flex-1 h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow">
                        <Mail className="w-4 h-4 mr-2" /> Recibir Reporte Gratis
                      </Button>
                      <Button onClick={resetQuiz} variant="outline" className="h-12 border-border text-muted-foreground hover:text-white rounded-xl">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {showForm && !submitted && (
                <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4 py-2">
                  <div className="text-center mb-4">
                    <span className="text-3xl">{quizLevel.emoji}</span>
                    <p className="text-sm font-bold text-white mt-2">Nivel: <span style={{ color: quizLevel.color }}>{quizLevel.level}</span></p>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required
                      className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
                  </div>
                  <Button type="submit" disabled={submitting}
                    className="w-full h-13 font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</> : <><Download className="w-4 h-4 mr-2" /> Enviar Reporte</>}
                  </Button>
                  <button type="button" onClick={() => setShowForm(false)} className="w-full text-xs text-muted-foreground hover:text-white py-1">← Volver</button>
                </motion.form>
              )}
              {submitted && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Reporte enviado! 🎉</h3>
                  <p className="text-sm text-muted-foreground mb-4">Revisa tu email con recomendaciones para nivel <span style={{ color: quizLevel.color }} className="font-bold">{quizLevel.level}</span>.</p>
                  <Button onClick={resetQuiz} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 rounded-lg">
                    <RefreshCw className="w-4 h-4 mr-2" /> Repetir quiz
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

/* ══════════════════ ECOSISTEMA ══════════════════ */
// 📌 PERSONALIZAR: Productos o alianzas
const ECOSYSTEM = [
  { name: "[Producto 1]", url: "#", desc: "Descripción de tu primer producto o alianza estratégica.", tags: ["Tag1", "Tag2", "Tag3"] },
  { name: "[Producto 2]", url: "#", desc: "Descripción del segundo producto complementario.", tags: ["Tag1", "Tag2", "Tag3"] },
];

const EcosystemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Section id="ecosistema">
      <SectionHeader badge="Ecosistema" title={<>Productos del <span className="tpl-gradient-text">ecosistema</span></>} subtitle="Herramientas que complementan nuestra oferta." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {ECOSYSTEM.map((e) => (
          <motion.a key={e.name} variants={fadeUp} custom={0} href={e.url} target="_blank" rel="noopener noreferrer"
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{e.name}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{e.desc}</p>
            <div className="flex flex-wrap gap-2">
              {e.tags.map((t) => (
                <span key={t} className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary/20 text-primary">{t}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ AI DIAGNOSIS ══════════════════ */
// 📌 PERSONALIZAR: Industrias para el diagnóstico IA
const DIAG_INDUSTRIES = [
  { id: "[Industria 1]", icon: Building2 },
  { id: "[Industria 2]", icon: ShoppingCart },
  { id: "[Industria 3]", icon: GraduationCap },
  { id: "[Industria 4]", icon: Briefcase },
  { id: "[Industria 5]", icon: HeartPulse },
  { id: "[Industria 6]", icon: Factory },
];

const AIDiagnosisSection = () => {
  const [industry, setIndustry] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [done, setDone] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !name || !email) return;
    setLoading(true);
    setResult("");
    setDone(false);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/analyze-industry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, industry }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al generar diagnóstico");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { setDone(true); break; }
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              setResult((prev) => prev + token);
              resultRef.current?.scrollTo({ top: resultRef.current.scrollHeight });
            }
          } catch {}
        }
      }
      setDone(true);
    } catch (err: any) {
      setResult(`**Error:** ${err.message || "No se pudo generar el diagnóstico. Intenta de nuevo."}`);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="diagnostico" className="bg-[hsl(220,15%,4%)]">
      <SectionHeader
        badge="Diagnóstico IA"
        title={<>Tu análisis <span className="tpl-gradient-text">personalizado</span> con IA</>}
        subtitle="Selecciona tu industria, ingresa tus datos y recibe un diagnóstico estratégico generado en tiempo real."
      />
      <div ref={ref} className="max-w-3xl mx-auto">
        {!result ? (
          <motion.form
            variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl border border-border bg-card space-y-6"
          >
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Selecciona tu industria</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {DIAG_INDUSTRIES.map((ind) => (
                  <button key={ind.id} type="button" onClick={() => setIndustry(ind.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                      industry === ind.id
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-muted"
                    }`}>
                    <ind.icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold text-center leading-tight">{ind.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required
                  className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="pl-10 h-12 bg-muted border-border text-white placeholder:text-muted-foreground focus:border-primary/50 rounded-xl" />
              </div>
            </div>

            <Button type="submit" disabled={loading || !industry}
              className="w-full h-13 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow tpl-glow-hover transition-all duration-300 group">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generando diagnóstico...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Obtener mi Diagnóstico con IA Gratis</>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-[0_0_60px_-15px_hsl(var(--tpl-accent)/0.15)]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">{name}</span>
                <span className="text-xs text-muted-foreground ml-2">· {industry}</span>
              </div>
              {!done && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
              {done && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
            </div>

            <div ref={resultRef} className="p-6 max-h-[500px] overflow-y-auto tpl-markdown">
              <ReactMarkdown>{result}</ReactMarkdown>
              {!done && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-0.5 align-text-bottom" />}
            </div>

            {done && (
              <div className="px-6 pb-6 pt-2">
                <Button
                  onClick={() => document.getElementById("lead-magnet")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full h-13 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl tpl-glow tpl-glow-hover transition-all duration-300 group">
                  Descargar Recurso Completo <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
};

/* ══════════════════ FINAL CTA ══════════════════ */
const FinalCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Section>
      <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
        className="text-center max-w-2xl mx-auto">
        {/* 📌 PERSONALIZAR: CTA final */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
          ¿Listo para <span className="tpl-gradient-text">dar el paso</span>?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          [Tu mensaje de cierre que motive a la acción — descarga el recurso, agenda una llamada, etc.]
        </p>
        <Button onClick={() => document.getElementById("lead-magnet")?.scrollIntoView({ behavior: "smooth" })}
          className="h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full tpl-glow tpl-glow-hover transition-all duration-300 group">
          Descargar Recurso Gratis <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </Section>
  );
};

/* ══════════════════ FOOTER ══════════════════ */
const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* 📌 PERSONALIZAR: Nombre de marca */}
      <span className="text-sm font-black text-white">Tu<span className="text-primary">Marca</span></span>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} [Tu Marca]. Todos los derechos reservados.</p>
    </div>
  </footer>
);

/* ══════════════════ PAGE ══════════════════ */
const AndyGrow = () => (
  <div className="template-theme min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <SocialProofSection />
    <ServicesSection />
    <IndustrySection />
    <ProcessSection />
    <ResultsSection />
    <LeadMagnetSection />
    <QuizLeadMagnet />
    <EcosystemSection />
    <AIDiagnosisSection />
    <FinalCTA />
    <Footer />
  </div>
);

export default AndyGrow;
