import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, Bot, Calendar, CheckCircle2, Clock, Gift, GraduationCap,
  Loader2, Mail, PartyPopper, Phone, Play, Rocket, Sparkles, Star,
  Trophy, User, Users, Zap, ChevronDown, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import andyProfile from "@/assets/andygrow/andy-profile.jpeg";

/* ── Constants ── */
const MASTERCLASS_DATE = new Date("2026-04-07T19:00:00-03:00");
const GREEN = "hsl(142,72%,50%)";

/* ── Countdown ── */
const useCountdown = (target: Date) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

/* ── What you'll learn ── */
const LEARNINGS = [
  "Cómo crear una landing page profesional usando IA en minutos",
  "Estructura de una landing que convierte: copy, diseño y CTA",
  "Cómo conectar formularios para captar leads automáticamente",
  "Aprovechar la plantilla con backend y panel de administración incluido",
  "Crear y automatizar secuencias de email post-registro desde tu panel",
];

/* ── Who is it for ── */
const FOR_WHOM = [
  { icon: Rocket, text: "Emprendedores que quieren captar clientes online" },
  { icon: Users, text: "Freelancers y consultores buscando más leads" },
  { icon: Star, text: "Coaches y creadores de contenido" },
  { icon: GraduationCap, text: "Profesionales de marketing que quieren escalar" },
  { icon: Zap, text: "Cualquiera que quiera lanzar su landing con IA" },
];

/* ── Bonus section ── */
const BONUSES = [
  {
    icon: Gift,
    title: "Plantilla de Landing + Backend",
    desc: "Mi plantilla profesional con panel de administración, CRM y secuencias de email incluidas. Lista para personalizar y lanzar.",
  },
  {
    icon: Mail,
    title: "Sistema de Email Automático",
    desc: "Secuencias de email pre-configuradas que nutren tus leads desde el momento en que se registran. Solo actívalas.",
  },
  {
    icon: Bot,
    title: "Prompts de IA Exclusivos",
    desc: "Mi colección de prompts para generar copy, diseño y automatizaciones con ChatGPT, Claude y Lovable.",
  },
  {
    icon: Trophy,
    title: "Acceso a la Comunidad VIP",
    desc: "Únete al grupo privado donde comparto recursos, resuelvo dudas y publico contenido exclusivo.",
  },
];

/* ══════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════ */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(220,20%,4%)/0.95] backdrop-blur-lg border-b border-[hsl(0,0%,12%)]" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="text-xl font-black tracking-tight text-white">Andy<span className="text-[hsl(142,72%,50%)]">Grow</span></a>
        <Button
          onClick={() => document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] font-bold text-sm px-5 h-9 rounded-full"
        >
          Inscribirme
        </Button>
      </div>
    </nav>
  );
};

/* ══════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════ */
const HeroSection = () => {
  const cd = useCountdown(MASTERCLASS_DATE);
  const units = [
    { v: cd.days, l: "días" }, { v: cd.hours, l: "hrs" }, { v: cd.minutes, l: "min" }, { v: cd.seconds, l: "seg" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[hsl(142,72%,50%)/0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(142,72%,50%)/0.04] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" /> 100% Gratuita · Cupos Limitados
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-4">
            Masterclass:{" "}
            <span className="bg-gradient-to-r from-[hsl(142,72%,50%)] to-[hsl(142,72%,70%)] bg-clip-text text-transparent">
              Crea tu Landing Page con IA
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg sm:text-xl text-[hsl(0,0%,55%)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Te enseñaré paso a paso cómo construí esta landing page usando inteligencia artificial,
            y te regalaré la plantilla completa con backend y panel para que lances tu negocio.
          </motion.p>

          {/* Date & Time */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(220,15%,8%)] border border-[hsl(0,0%,12%)]">
              <Calendar className="w-5 h-5 text-[hsl(142,72%,50%)]" />
              <span className="font-semibold text-white">Lunes 7 de Abril</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(220,15%,8%)] border border-[hsl(0,0%,12%)]">
              <Clock className="w-5 h-5 text-[hsl(142,72%,50%)]" />
              <span className="font-semibold text-white">19:00 hrs (Chile)</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(220,15%,8%)] border border-[hsl(0,0%,12%)]">
              <Play className="w-5 h-5 text-[hsl(142,72%,50%)]" />
              <span className="font-semibold text-white">En vivo por Zoom</span>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex justify-center gap-4 mb-10">
            {units.map((u) => (
              <div key={u.l} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[hsl(220,15%,8%)] border border-[hsl(142,72%,50%)/0.25] flex items-center justify-center text-2xl sm:text-3xl font-black text-[hsl(142,72%,50%)] tabular-nums shadow-[0_0_20px_-5px_hsl(142,72%,50%/0.3)]">
                  {u.v.toString().padStart(2, "0")}
                </div>
                <span className="text-xs text-[hsl(0,0%,45%)] mt-2 block font-medium">{u.l}</span>
              </div>
            ))}
          </motion.div>

          {/* Instructor */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="flex items-center justify-center gap-4 mb-8">
            <img src={andyProfile} alt="Andy" className="w-14 h-14 rounded-full object-cover border-2 border-[hsl(142,72%,50%)/0.4]" />
            <div className="text-left">
              <p className="font-bold text-white">Andy</p>
              <p className="text-sm text-[hsl(0,0%,50%)]">Arquitecto de Sistemas de Venta con IA</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
            <Button
              onClick={() => document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" })}
              className="h-14 px-10 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-full shadow-[0_0_40px_-10px_hsl(142,72%,50%/0.5)] hover:shadow-[0_0_60px_-10px_hsl(142,72%,50%/0.7)] transition-all duration-300 group"
            >
              Reservar mi Lugar Gratis <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   WHAT YOU'LL LEARN
   ══════════════════════════════════════════════════════ */
const LearningsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-20 md:py-28 bg-[hsl(220,18%,5%)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
            className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            ¿Qué aprenderás en la <span className="bg-gradient-to-r from-[hsl(142,72%,50%)] to-[hsl(142,72%,70%)] bg-clip-text text-transparent">Masterclass</span>?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
            className="text-[hsl(0,0%,55%)] text-lg max-w-xl mx-auto">
            En 60 minutos tendrás todo lo necesario para lanzar tu propia landing page profesional.
          </motion.p>
        </div>
        <div ref={ref} className="max-w-3xl mx-auto space-y-4">
          {LEARNINGS.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
              className="flex items-start gap-4 p-5 rounded-xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-[hsl(142,72%,50%)/0.15] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[hsl(142,72%,50%)]" />
              </div>
              <span className="text-[hsl(0,0%,75%)] font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   BONUS
   ══════════════════════════════════════════════════════ */
const BonusSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(142,72%,50%,0.06),transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <motion.span variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-xs font-semibold tracking-wide uppercase mb-4">
            <Gift className="w-3.5 h-3.5" /> Bonus Exclusivos
          </motion.span>
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
            className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Te llevas todo esto <span className="bg-gradient-to-r from-[hsl(142,72%,50%)] to-[hsl(142,72%,70%)] bg-clip-text text-transparent">GRATIS</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2}
            className="text-[hsl(0,0%,55%)] text-lg max-w-xl mx-auto">
            Solo por inscribirte recibirás estos recursos valorados en +$200 USD.
          </motion.p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {BONUSES.map((bonus, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
              className="group p-6 rounded-2xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.5] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_hsl(142,72%,50%/0.2)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[hsl(142,72%,50%)/0.15] border border-[hsl(142,72%,50%)/0.2] flex items-center justify-center mb-4 group-hover:bg-[hsl(142,72%,50%)/0.25] transition-colors">
                <bonus.icon className="w-6 h-6 text-[hsl(142,72%,50%)]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{bonus.title}</h3>
              <p className="text-sm text-[hsl(0,0%,55%)] leading-relaxed">{bonus.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   FOR WHOM
   ══════════════════════════════════════════════════════ */
const ForWhomSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-20 md:py-28 bg-[hsl(220,18%,5%)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
            className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            ¿Es para <span className="bg-gradient-to-r from-[hsl(142,72%,50%)] to-[hsl(142,72%,70%)] bg-clip-text text-transparent">ti</span>?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
            className="text-[hsl(0,0%,55%)] text-lg max-w-xl mx-auto">
            Esta masterclass es perfecta si eres...
          </motion.p>
        </div>
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {FOR_WHOM.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
              className="flex items-center gap-3 p-4 rounded-xl border border-[hsl(0,0%,12%)] bg-[hsl(220,15%,6%)] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(142,72%,50%)/0.1] flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[hsl(142,72%,50%)]" />
              </div>
              <span className="text-sm text-[hsl(0,0%,70%)] font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   REGISTRATION
   ══════════════════════════════════════════════════════ */
const RegistrationSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const params = new URLSearchParams(window.location.search);
      
      const { data: result, error: registerError } = await supabase.functions.invoke('register-lead', {
        body: {
          name,
          email: normalizedEmail,
          phone: phone || null,
          source: 'masterclass',
          utm_source: params.get("utm_source") || null,
          utm_medium: params.get("utm_medium") || null,
          utm_campaign: params.get("utm_campaign") || null,
        },
      });
      
      if (registerError) throw registerError;
      
      setSubmitted(true);
      toast.success("¡Inscripción exitosa!");

      supabase.functions.invoke('send-webinar-emails', {
        body: { name, email: normalizedEmail, step: 1, leadId: result?.leadId },
      }).catch(() => {});
    } catch {
      toast.error("Hubo un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="registro" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(142,72%,50%,0.08),transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref} className="max-w-lg mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="rounded-2xl border border-[hsl(142,72%,50%)/0.3] bg-[hsl(220,15%,6%)] shadow-[0_0_80px_-20px_hsl(142,72%,50%/0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[hsl(0,0%,12%)] bg-[hsl(142,72%,50%)/0.05] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(142,72%,50%)] to-[hsl(142,72%,35%)] flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_-5px_hsl(142,72%,50%/0.5)]">
                <Rocket className="w-8 h-8 text-[hsl(220,20%,4%)]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Reserva tu lugar</h2>
              <p className="text-sm text-[hsl(0,0%,50%)]">Lunes 7 de Abril · 19:00 hrs Chile · Gratis</p>
            </div>

            <div className="p-6">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-[hsl(142,72%,50%)] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">¡Estás inscrito! 🎉</h3>
                  <p className="text-[hsl(0,0%,55%)]">Revisa tu email para los detalles de acceso y tus bonus.</p>
                </motion.div>
              ) : (
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
                    className="w-full h-14 text-base font-bold bg-[hsl(142,72%,50%)] hover:bg-[hsl(142,72%,45%)] text-[hsl(220,20%,4%)] rounded-xl shadow-[0_0_30px_hsl(142,72%,50%,0.3)] hover:shadow-[0_0_50px_hsl(142,72%,50%,0.5)] transition-all duration-300">
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Inscribiendo...</>
                    ) : (
                      <>Inscribirme a la Masterclass Gratis <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                  <p className="text-[10px] text-[hsl(0,0%,40%)] text-center">Sin spam · Tus datos están seguros · Cancela cuando quieras</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
const FooterMini = () => (
  <footer className="border-t border-[hsl(0,0%,10%)] py-8">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-sm font-black text-white">Andy<span className="text-[hsl(142,72%,50%)]">Grow</span></span>
      <p className="text-xs text-[hsl(0,0%,40%)]">© {new Date().getFullYear()} AndyGrow. Todos los derechos reservados.</p>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
const MasterclassAndyGrow = () => (
  <>
    <Helmet>
      <title>Masterclass Gratis: Crea tu Landing Page con IA | AndyGrow</title>
      <meta name="description" content="Aprende paso a paso cómo crear una landing page profesional con inteligencia artificial. Masterclass gratuita + plantilla + kit de cotillón digital. 7 de Abril, 19:00 hrs Chile." />
      <meta property="og:title" content="Masterclass Gratis: Landing Page con IA | AndyGrow" />
      <meta property="og:description" content="Te enseño a crear tu landing con IA y te regalo la plantilla + kit de cotillón digital. ¡Inscríbete gratis!" />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="andygrow-theme min-h-screen bg-[hsl(220,20%,4%)] text-white font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <LearningsSection />
      <BonusSection />
      <ForWhomSection />
      <RegistrationSection />
      <FooterMini />
    </div>
  </>
);

export default MasterclassAndyGrow;
