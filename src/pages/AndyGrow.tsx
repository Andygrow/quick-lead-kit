import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Bot, ChevronDown, Zap, BarChart3, Clock, Menu, X,
  Workflow, LineChart, BrainCircuit, Search, Layers, Rocket, RefreshCw,
  Building2, ShoppingCart, GraduationCap, Briefcase, HeartPulse, Factory,
  Globe, CheckCircle2, Calendar, Users, Gift, Star, Phone, Mail, User,
  Loader2, Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ── Countdown hook ── */
// 📌 PERSONALIZAR: Cambia esta fecha a la de tu evento
const EVENT_DATE = new Date("2026-04-15T19:00:00-03:00");

const useCountdown = (targetDate: Date) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isLive: diff === 0,
  };
};

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

const SectionHeader = ({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
      <motion.span variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
        className="inline-block px-4 py-1.5 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-xs font-semibold tracking-wide uppercase mb-4">
        {badge}
      </motion.span>
      <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">{title}</motion.h2>
      <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2}
        className="text-[hsl(0,0%,55%)] text-lg">{subtitle}</motion.p>
    </div>
  );
};

/* ══════════════════ COUNTDOWN BANNER ══════════════════ */
const CountdownBanner = () => {
  const { days, hours, minutes, seconds, isLive } = useCountdown(EVENT_DATE);
  if (isLive) return null;
  const units = [
    { v: days, l: "días" }, { v: hours, l: "hrs" }, { v: minutes, l: "min" }, { v: seconds, l: "seg" },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(142,72%,50%)] text-[hsl(220,20%,4%)]">
      <div className="container mx-auto px-4 h-10 flex items-center justify-center gap-3 text-sm font-bold">
        {/* 📌 PERSONALIZAR: Texto del banner */}
        <span className="hidden sm:inline">🔥 Evento GRATIS — Inscríbete ahora</span>
        <span className="sm:hidden">🔥 Evento Gratis</span>
        <div className="flex items-center gap-1.5 font-mono">
          {units.map((u, i) => (
            <span key={u.l} className="flex items-center gap-0.5">
              {i > 0 && <span className="opacity-60">:</span>}
              <span className="bg-[hsl(220,20%,4%)] text-[hsl(142,72%,50%)] rounded px-1.5 py-0.5 text-xs min-w-[28px] text-center tabular-nums">
                {u.v.toString().padStart(2, "0")}
              </span>
            </span>
          ))}
        </div>
        <button onClick={() => document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" })}
          className="hidden md:inline-flex items-center gap-1 bg-[hsl(220,20%,4%)] text-[hsl(142,72%,50%)] px-3 py-1 rounded-full text-xs font-bold hover:bg-[hsl(220,20%,8%)] transition-colors">
          Inscribirme <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

/* ══════════════════ NAVBAR ══════════════════ */
// 📌 PERSONALIZAR: Links de navegación
const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Industrias", href: "#industrias" },
  { label: "Resultados", href: "#resultados" },
  { label: "Inscríbete", href: "#cta-principal" },
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
    <nav className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(220,20%,4%)/0.95] backdrop-blur-lg border-b border-[hsl(0,0%,12%)]" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 📌 PERSONALIZAR: Nombre de marca */}
        <a href="#" className="text-2xl font-black tracking-tight text-white">Tu<span className="text-[hsl(142,72%,50%)]">Marca</span></a>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[hsl(0,0%,60%)] hover:text-white transition-colors font-medium">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden sm:inline-flex bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] font-bold text-sm px-5 h-9 rounded-full">
            Inscribirme
          </Button>
          <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[hsl(220,20%,6%)] border-b border-[hsl(0,0%,12%)] px-4 pb-4">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block py-3 text-[hsl(0,0%,70%)] hover:text-white font-medium border-b border-[hsl(0,0%,10%)] last:border-0">{l.label}</a>
          ))}
          <Button onClick={() => { setMobileOpen(false); document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" }); }}
            className="w-full mt-3 bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] font-bold rounded-full">
            Inscribirme
          </Button>
        </motion.div>
      )}
    </nav>
  );
};

/* ══════════════════ HERO ══════════════════ */
const MiniStat = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex items-center gap-2.5 text-left">
    <div className="w-9 h-9 rounded-lg bg-[hsl(142,72%,50%)/0.1] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-[hsl(142,72%,50%)]" />
    </div>
    <div>
      <div className="text-white font-bold text-sm leading-tight">{value}</div>
      <div className="text-[hsl(0,0%,50%)] text-xs">{label}</div>
    </div>
  </div>
);

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-[6.5rem] pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[hsl(142,72%,50%)/0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(142,72%,50%)/0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(0,0%,50%/0.3) 1px,transparent 1px),linear-gradient(90deg,hsl(0,0%,50%/0.3) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
              {/* 📌 PERSONALIZAR: Badge del hero */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-xs font-semibold tracking-wide uppercase mb-6">
                <Bot className="w-3.5 h-3.5" /> [Tu Categoría]
              </span>
            </motion.div>
            {/* 📌 PERSONALIZAR: Titular principal */}
            <motion.h1 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              [Tu propuesta de{" "}<span className="ag-gradient-text">valor principal</span>{" "}aquí]
            </motion.h1>
            {/* 📌 PERSONALIZAR: Subtítulo */}
            <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2}
              className="text-lg text-[hsl(0,0%,60%)] max-w-lg mb-8 leading-relaxed">
              Describe en 1-2 líneas qué haces, para quién lo haces y el resultado que entregas. Sé específico y orientado al beneficio del cliente.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={3}>
              <Button onClick={() => document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-8 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-full ag-glow ag-glow-hover transition-all duration-300 group">
                {/* 📌 PERSONALIZAR: Texto del CTA */}
                [Tu CTA Principal] <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <div className="absolute -inset-4 rounded-full border border-[hsl(142,72%,50%)/0.15]" />
              <div className="absolute -inset-8 rounded-full border border-[hsl(142,72%,50%)/0.08]" />
              {/* 📌 PERSONALIZAR: Imagen de perfil o logo */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full overflow-hidden border-2 border-[hsl(142,72%,50%)/0.3] ag-glow bg-[hsl(220,15%,8%)] flex items-center justify-center">
                <User className="w-24 h-24 text-[hsl(0,0%,30%)]" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 ag-float">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(220,15%,8%)] border border-[hsl(142,72%,50%)/0.3] shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-[hsl(142,72%,50%)] ag-pulse-dot" />
                  <span className="text-xs font-bold text-white whitespace-nowrap">[Estado activo]</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 ag-scroll-indicator">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[hsl(0,0%,40%)] font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5 text-[hsl(142,72%,50%)/0.6]" />
        </div>
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
      <SectionHeader badge="Servicios" title={<>Lo que <span className="ag-gradient-text">ofrecemos</span></>} subtitle="Soluciones diseñadas para transformar tu negocio." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SERVICES.map((s) => (
          <motion.div key={s.title} variants={fadeUp} custom={0}
            className="group p-8 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.4] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_hsl(142,72%,50%/0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[hsl(142,72%,50%)/0.1] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center mb-5 group-hover:bg-[hsl(142,72%,50%)/0.2] transition-colors">
              <s.icon className="w-6 h-6 text-[hsl(142,72%,50%)]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-[hsl(0,0%,55%)] text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ INDUSTRIAS / SOLUCIONES ══════════════════ */
// 📌 PERSONALIZAR: Industrias o segmentos que atiendes
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
    <Section id="industrias" className="bg-[hsl(220,18%,5%)]">
      <SectionHeader badge="Soluciones" title={<>Soluciones para <span className="ag-gradient-text">tu industria</span></>} subtitle="Selecciona tu sector y descubre cómo podemos ayudarte." />
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {INDUSTRIES.map((ind) => (
            <motion.button key={ind.id} variants={fadeUp} custom={0} onClick={() => setActive(ind.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${active === ind.id ? "border-[hsl(142,72%,50%)/0.5] bg-[hsl(142,72%,50%)/0.1] text-[hsl(142,72%,50%)]" : "border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] text-[hsl(0,0%,50%)] hover:border-[hsl(0,0%,20%)]"}`}>
              <ind.icon className="w-6 h-6" />
              <span className="text-xs font-semibold text-center">{ind.label}</span>
            </motion.button>
          ))}
        </motion.div>
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Problema", color: "hsl(0,70%,55%)", content: selected.problem },
            { label: "Solución", color: "hsl(142,72%,50%)", content: selected.solution },
            { label: "Impacto esperado", color: "hsl(45,90%,55%)", content: selected.impact },
          ].map((card) => (
            <div key={card.label} className="p-6 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)]">
              <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: card.color }}>{card.label}</span>
              <p className="text-[hsl(0,0%,70%)] text-sm leading-relaxed">{card.content}</p>
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
      <SectionHeader badge="Proceso" title={<>Cómo <span className="ag-gradient-text">funciona</span></>} subtitle="Un proceso probado para generar resultados reales." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {STEPS.map((s, i) => (
          <motion.div key={s.num} variants={fadeUp} custom={i}
            className="relative p-6 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] group hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-500">
            <span className="text-5xl font-black text-[hsl(142,72%,50%)/0.1] absolute top-4 right-4 group-hover:text-[hsl(142,72%,50%)/0.2] transition-colors">{s.num}</span>
            <div className="w-10 h-10 rounded-lg bg-[hsl(142,72%,50%)/0.1] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center mb-4">
              <s.icon className="w-5 h-5 text-[hsl(142,72%,50%)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-[hsl(0,0%,55%)] text-sm leading-relaxed">{s.desc}</p>
            {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[hsl(142,72%,50%)/0.3]" />}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ RESULTADOS ══════════════════ */
// 📌 PERSONALIZAR: Tus métricas de resultados
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
    <div ref={ref} className="text-center p-8 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-500 group hover:-translate-y-1">
      <div className="text-4xl md:text-5xl font-black text-[hsl(142,72%,50%)] mb-2 tabular-nums group-hover:drop-shadow-[0_0_12px_hsl(142,72%,50%,0.5)] transition-all duration-500">
        {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
      </div>
      <div className="text-sm text-[hsl(0,0%,55%)]">{label}</div>
    </div>
  );
};

const ResultsSection = () => (
  <Section id="resultados" className="bg-[hsl(220,18%,5%)]">
    <SectionHeader badge="Resultados" title={<>Números que <span className="ag-gradient-text">hablan</span></>} subtitle="Resultados reales de clientes que confían en nosotros." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {RESULTS.map((r) => <StatCounter key={r.label} {...r} />)}
    </div>
  </Section>
);

/* ══════════════════ ECOSISTEMA ══════════════════ */
// 📌 PERSONALIZAR: Productos o alianzas de tu ecosistema
const ECOSYSTEM = [
  { name: "[Producto 1]", url: "#", desc: "Descripción de tu primer producto o alianza estratégica.", tags: ["Tag1", "Tag2", "Tag3"] },
  { name: "[Producto 2]", url: "#", desc: "Descripción del segundo producto o herramienta complementaria.", tags: ["Tag1", "Tag2", "Tag3"] },
];

const EcosystemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <Section id="ecosistema">
      <SectionHeader badge="Ecosistema" title={<>Productos del <span className="ag-gradient-text">ecosistema</span></>} subtitle="Herramientas que complementan nuestra oferta." />
      <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {ECOSYSTEM.map((e) => (
          <motion.a key={e.name} variants={fadeUp} custom={0} href={e.url} target="_blank" rel="noopener noreferrer"
            className="group p-6 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.4] transition-all duration-500 hover:-translate-y-1 block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(142,72%,50%)/0.1] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center">
                <Globe className="w-5 h-5 text-[hsl(142,72%,50%)]" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[hsl(142,72%,50%)] transition-colors">{e.name}</h3>
            </div>
            <p className="text-[hsl(0,0%,55%)] text-sm leading-relaxed mb-4">{e.desc}</p>
            <div className="flex flex-wrap gap-2">
              {e.tags.map((t) => (
                <span key={t} className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[hsl(142,72%,50%)/0.2] text-[hsl(142,72%,50%)]">{t}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  );
};

/* ══════════════════ CTA PRINCIPAL (REGISTRO) ══════════════════ */
// 📌 PERSONALIZAR: Beneficios del lead magnet / evento
const BENEFITS = [
  { icon: BrainCircuit, text: "[Beneficio 1 de tu oferta]" },
  { icon: Gift, text: "[Beneficio 2 - regalo o bonus]" },
  { icon: Zap, text: "[Beneficio 3 - resultado rápido]" },
  { icon: Users, text: "[Beneficio 4 - exclusividad]" },
  { icon: Star, text: "[Beneficio 5 - acceso especial]" },
];

const CTASection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("webinar_registrations").insert({
        name, email, phone: phone || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("¡Inscripción exitosa! Te enviaremos los detalles por email.");

      supabase.functions.invoke('send-webinar-emails', {
        body: { name, email, step: 1 },
      }).catch(() => console.log('Email sending skipped'));
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="cta-principal" className="bg-[hsl(220,18%,5%)]">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Benefits */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            {/* 📌 PERSONALIZAR: Badge y título del CTA */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-xs font-semibold tracking-wide uppercase mb-4">
              <Calendar className="w-3.5 h-3.5" /> [Tipo de Oferta]
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              [Tu <span className="ag-gradient-text">oferta principal</span>]
            </h2>
            <p className="text-[hsl(0,0%,55%)] mb-2">[Fecha y hora del evento]</p>

            {/* Mini countdown */}
            <div className="flex gap-3 mb-8">
              {[
                { v: days, l: "días" }, { v: hours, l: "hrs" }, { v: minutes, l: "min" }, { v: seconds, l: "seg" },
              ].map((u) => (
                <div key={u.l} className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(220,15%,8%)] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center text-lg font-bold text-[hsl(142,72%,50%)] tabular-nums">
                    {u.v.toString().padStart(2, "0")}
                  </div>
                  <span className="text-[10px] text-[hsl(0,0%,45%)] mt-1 block">{u.l}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {BENEFITS.map((b) => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(142,72%,50%)/0.1] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <b.icon className="w-4 h-4 text-[hsl(142,72%,50%)]" />
                  </div>
                  <span className="text-[hsl(0,0%,70%)] text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
            <div className="p-8 rounded-2xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(220,15%,6%)] shadow-[0_0_60px_-15px_hsl(142,72%,50%/0.15)]">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-[hsl(142,72%,50%)] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">¡Listo!</h3>
                  <p className="text-[hsl(0,0%,55%)]">Revisa tu email para los detalles.</p>
                </div>
              ) : (
                <>
                  {/* 📌 PERSONALIZAR: Título del formulario */}
                  <h3 className="text-xl font-bold text-white mb-1">[Reserva tu lugar]</h3>
                  <p className="text-[hsl(0,0%,50%)] text-sm mb-6">[Subtítulo de urgencia]</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,40%)]" />
                      <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required
                        className="pl-10 h-12 bg-[hsl(220,15%,8%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] rounded-xl" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,40%)]" />
                      <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="pl-10 h-12 bg-[hsl(220,15%,8%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] rounded-xl" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,40%)]" />
                      <Input type="tel" placeholder="WhatsApp (opcional)" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 bg-[hsl(220,15%,8%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] rounded-xl" />
                    </div>
                    <Button type="submit" disabled={submitting}
                      className="w-full h-13 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-xl ag-glow ag-glow-hover transition-all duration-300">
                      {/* 📌 PERSONALIZAR: Texto del botón */}
                      {submitting ? "Procesando..." : "[Tu CTA del formulario] →"}
                    </Button>
                  </form>
                  <p className="text-[10px] text-[hsl(0,0%,40%)] text-center mt-3">Sin spam. Tus datos están seguros.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
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
          ¿Listo para <span className="ag-gradient-text">dar el paso</span>?
        </h2>
        <p className="text-[hsl(0,0%,55%)] text-lg mb-8">
          [Tu mensaje de cierre que motive a la acción]
        </p>
        <Button onClick={() => document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" })}
          className="h-14 px-10 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-full ag-glow ag-glow-hover transition-all duration-300 group">
          [CTA Final] <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </Section>
  );
};

/* ══════════════════ FOOTER ══════════════════ */
const Footer = () => (
  <footer className="border-t border-[hsl(0,0%,10%)] py-8">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* 📌 PERSONALIZAR: Nombre de marca */}
      <span className="text-sm font-black text-white">Tu<span className="text-[hsl(142,72%,50%)]">Marca</span></span>
      <p className="text-xs text-[hsl(0,0%,40%)]">© {new Date().getFullYear()} [Tu Marca]. Todos los derechos reservados.</p>
    </div>
  </footer>
);

/* ══════════════════ AI DIAGNOSIS ══════════════════ */
// 📌 PERSONALIZAR: Industrias para el diagnóstico con IA
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
    <Section id="diagnostico">
      <SectionHeader
        badge="Diagnóstico IA"
        title={<>Tu análisis <span className="ag-gradient-text">personalizado</span> con IA</>}
        subtitle="Selecciona tu industria, ingresa tus datos y recibe un diagnóstico estratégico generado en tiempo real."
      />
      <div ref={ref} className="max-w-3xl mx-auto">
        {!result ? (
          <motion.form
            variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] space-y-6"
          >
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Selecciona tu industria</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {DIAG_INDUSTRIES.map((ind) => (
                  <button key={ind.id} type="button" onClick={() => setIndustry(ind.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                      industry === ind.id
                        ? "border-[hsl(142,72%,50%)/0.5] bg-[hsl(142,72%,50%)/0.1] text-[hsl(142,72%,50%)]"
                        : "border-[hsl(0,0%,12%)] bg-[hsl(220,15%,8%)] text-[hsl(0,0%,50%)] hover:border-[hsl(0,0%,20%)]"
                    }`}>
                    <ind.icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold text-center leading-tight">{ind.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,40%)]" />
                <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required
                  className="pl-10 h-12 bg-[hsl(220,15%,8%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] rounded-xl" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,40%)]" />
                <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="pl-10 h-12 bg-[hsl(220,15%,8%)] border-[hsl(0,0%,15%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] rounded-xl" />
              </div>
            </div>

            <Button type="submit" disabled={loading || !industry}
              className="w-full h-13 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-xl ag-glow ag-glow-hover transition-all duration-300 group">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generando diagnóstico...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Obtener mi Diagnóstico con IA Gratis</>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(220,15%,6%)] overflow-hidden shadow-[0_0_60px_-15px_hsl(142,72%,50%/0.15)]">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[hsl(0,0%,12%)] bg-[hsl(220,15%,8%)]">
              <div className="w-8 h-8 rounded-lg bg-[hsl(142,72%,50%)/0.15] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-[hsl(142,72%,50%)]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">{name}</span>
                <span className="text-xs text-[hsl(0,0%,45%)] ml-2">· {industry}</span>
              </div>
              {!done && <Loader2 className="w-4 h-4 animate-spin text-[hsl(142,72%,50%)] ml-auto" />}
              {done && <CheckCircle2 className="w-4 h-4 text-[hsl(142,72%,50%)] ml-auto" />}
            </div>

            <div ref={resultRef} className="p-6 max-h-[500px] overflow-y-auto ag-markdown">
              <ReactMarkdown>{result}</ReactMarkdown>
              {!done && <span className="inline-block w-2 h-5 bg-[hsl(142,72%,50%)] animate-pulse ml-0.5 align-text-bottom" />}
            </div>

            {done && (
              <div className="px-6 pb-6 pt-2">
                <Button
                  onClick={() => document.getElementById("cta-principal")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full h-13 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-xl ag-glow ag-glow-hover transition-all duration-300 group">
                  [Tu CTA después del diagnóstico] <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Section>
  );
};

/* ══════════════════ PAGE ══════════════════ */
const AndyGrow = () => (
  <div className="andygrow-theme min-h-screen bg-[hsl(220,20%,4%)] text-white font-sans overflow-x-hidden">
    <CountdownBanner />
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <IndustrySection />
    <ProcessSection />
    <ResultsSection />
    <EcosystemSection />
    <AIDiagnosisSection />
    <CTASection />
    <FinalCTA />
    <Footer />
  </div>
);

export default AndyGrow;
