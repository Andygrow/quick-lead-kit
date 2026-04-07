import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef } from "react";
import CI7Quiz from "./CI7Quiz";
import GuideContent from "./GuideContent";
import Confetti from "@/components/ui/confetti";
import { Linkedin, Sparkles, Download, FileText, Award, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import constanzaProfile from "@/assets/constanza/constanza-profile.png";

interface HeroSectionProps {
  isUnlocked: boolean;
  userData: { name: string; email: string; phone?: string; company: string } | null;
  onUnlock: (userData: { name: string; email: string; phone?: string; company: string }) => void;
}

// Generate static stars for the cosmic background (CSS animations only)
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
  }));
};

const HeroSection = ({ isUnlocked, userData, onUnlock }: HeroSectionProps) => {
  // Memoize stars - reduced count and use CSS animations instead of framer-motion
  const stars = useMemo(() => generateStars(20), []);
  
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Background - Simplified for performance */}
      <div className="absolute inset-0">
        {/* Pure gradient background using theme tokens */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        
        {/* Static glow effects - no parallax for better performance */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary glow - static */}
          <div 
            className="absolute w-[600px] h-[400px] rounded-full opacity-20 will-change-transform"
            style={{
              top: '-15%',
              left: '-5%',
              background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.25) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Accent glow - static */}
          <div 
            className="absolute w-[500px] h-[350px] rounded-full opacity-15 will-change-transform"
            style={{
              bottom: '15%',
              right: '-5%',
              background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.2) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
        
        {/* Static stars with CSS animations - much lighter on performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((star) => (
            <div
              key={star.id}
              className={`absolute rounded-full ${star.id % 3 === 0 ? 'bg-accent' : 'bg-primary'} animate-pulse`}
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: 0.4,
                animationDelay: `${star.delay}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
        
        {/* Subtle grid pattern using theme primary */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>
      
      {/* Content - no opacity fade on scroll */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* State A: Locked - Show form */
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]"
            >
              {/* Left - Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Metodología CI+7</span>
                </motion.div>

                {/* Main Headline */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  ¿Quieres ser el{" "}
                  <span className="shimmer-text energy-glow">especialista</span>
                  <br />
                  que todos buscan en LinkedIn?
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                  Descubre la <span className="text-accent font-semibold">Metodología CI+7</span>: 
                  Conexión e Interacción en 7 pasos para transformar tu perfil en un imán de oportunidades.
                </p>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm text-foreground/80">+60K seguidores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm text-foreground/80">+3,500 entrenados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm text-foreground/80">#1 Favikon Chile</span>
                  </div>
                </div>

                {/* Author section with photo */}
                <div className="pt-6 border-t border-border/30 flex items-center gap-4">
                  <img 
                    src={constanzaProfile} 
                    alt="Constanza Ibieta Illanes"
                    className="w-16 h-16 rounded-full object-cover object-top border-2 border-primary"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground italic">
                      "Comparte tu experiencia, sé original, consistente y deja una huella imborrable en LinkedIn"
                    </p>
                    <p className="text-sm font-semibold text-accent mt-1">— Constanza Ibieta Illanes</p>
                  </div>
                </div>
              </motion.div>

              {/* Right - CI+7 Quiz */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-md lg:max-w-lg mx-auto lg:mx-0"
              >
                <div className="glass-card p-6 rounded-2xl">
                  <CI7Quiz onComplete={onUnlock} />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* State B: Unlocked - Show Thank You / Resource */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-8 max-w-4xl mx-auto relative"
            >
              {/* Confetti Animation */}
              <Confetti count={60} duration={4} />

              {/* Celebration Header */}
              <div className="text-center mb-10 relative z-20">
                {/* Animated celebration badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 3, delay: 0.5 }}
                  >
                    <Gift className="w-5 h-5 text-accent" />
                  </motion.div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    🎉 ¡Acceso Desbloqueado!
                  </span>
                </motion.div>

                <motion.h2 
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  ¡Bienvenido/a,{" "}
                  <span className="shimmer-text energy-glow">{userData?.name?.split(" ")[0]}</span>! 🚀
                </motion.h2>

                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Tu <span className="text-primary font-semibold">Guía de la Metodología CI+7</span> está lista. 
                  Es hora de transformar tu LinkedIn en un imán de oportunidades.
                </motion.p>

                {/* Download CTA with glow effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="relative inline-block mb-6"
                >
                  {/* Glow behind button */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-40 animate-pulse" />
                  
                  <a
                    href="https://drive.google.com/file/d/1hgyF44CTK7D7WzvViQD1GRP1K9udCHk8/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-block"
                  >
                    <Button 
                      size="lg" 
                      className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      <Download className="w-5 h-5 group-hover:animate-bounce" />
                      Descargar mi Guía CI+7
                      <FileText className="w-5 h-5" />
                    </Button>
                  </a>
                  <p className="text-sm text-muted-foreground mt-3">
                    También la enviaremos a: <span className="text-primary font-medium">{userData?.email}</span>
                  </p>
                </motion.div>

                {/* Program Teaser - After download */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <motion.a
                    href="/programa-linkedin"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-accent flex items-center gap-2">
                        🎓 ¿Quieres dominar LinkedIn en 2026?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Programa LinkedIn 2026 • Presale hasta 1 de Marzo
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </motion.div>
              </div>

              {/* Guide Content - Visible on page */}
              <div className="relative z-10">
                <GuideContent />
              </div>

              {/* PROGRAMA CTA - Prominent and persuasive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-16 relative"
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 rounded-3xl blur-xl" />
                
                <div id="programa-cta" className="relative glass-card rounded-3xl p-8 md:p-10 border-2 border-accent/30 overflow-hidden">
                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-tr-full" />

                  <div className="relative z-10 text-center">
                    {/* Urgency badge */}
                    <motion.div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 mb-6"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Linkedin className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold text-accent">
                        🎓 Programa LinkedIn 2026 • Presale -30% hasta 1 de Marzo
                      </span>
                    </motion.div>

                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                      ¿Quieres dominar la{" "}
                      <span className="shimmer-text">Metodología CI+7</span>
                      {" "}con acompañamiento?
                    </h3>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                      Únete al <span className="text-primary font-semibold">Programa LinkedIn 2026</span> donde 
                      Constanza te acompañará en 4 sesiones para implementar cada paso y 
                      <span className="text-accent font-semibold"> convertir tu perfil en un imán de clientes</span>.
                    </p>

                    {/* Benefits mini-list */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-foreground">4 sesiones en vivo</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-foreground">Marzo 13-17-24-31</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-foreground">Solo $126.000 CLP</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a href="/programa-linkedin">
                      <Button 
                        size="lg" 
                        className="h-14 px-10 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                      >
                        <Linkedin className="w-5 h-5" />
                        Inscribirme al Programa
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Secondary CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-12 pt-8 border-t border-border/30"
              >
                <p className="text-center text-muted-foreground mb-6">
                  ¿Prefieres un enfoque más personalizado?
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.a
                    href="https://www.linkedin.com/in/constanzaibietaillanes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 rounded-xl text-left hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                    whileHover={{ y: -4 }}
                  >
                    <Linkedin className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-2">Conéctate conmigo</h3>
                    <p className="text-sm text-muted-foreground">Sígueme en LinkedIn para más estrategias CI+7</p>
                  </motion.a>

                  <motion.a
                    href="https://wa.me/56940118070?text=Hola%20Constanza!%20Acabo%20de%20descargar%20la%20gu%C3%ADa%20CI%2B7%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20tus%20servicios."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 rounded-xl text-left hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
                    whileHover={{ y: -4 }}
                  >
                    <Sparkles className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-foreground mb-2">Agenda una consulta</h3>
                    <p className="text-sm text-muted-foreground">Conversemos sobre cómo implementar CI+7 en tu negocio</p>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default HeroSection;
