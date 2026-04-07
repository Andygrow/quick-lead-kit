import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, Video, Users, Gift, CheckCircle2, Sparkles, Star, Zap, Trophy, PartyPopper } from "lucide-react";
import Header from "@/components/markmedia/Header";
import Footer from "@/components/markmedia/Footer";
import WebinarRegistrationForm from "@/components/markmedia/WebinarRegistrationForm";
import Confetti from "@/components/ui/confetti";
import { pushGTMEvent } from "@/hooks/useGTM";

import constanzaProfile from "@/assets/constanza/constanza-professional.jpeg";

const webinarDetails = {
  title: "Masterclass Gratuita",
  subtitle: "LinkedIn Estratégico 2026",
  description: "Descubre cómo usar LinkedIn de forma estratégica con la metodología CI+7. En esta masterclass gratuita aprenderás los fundamentos para transformar tu perfil en una herramienta de posicionamiento y ventas.",
  date: "Viernes 30 de Enero",
  time: "10:00 - 11:00 AM (Chile)",
  duration: "60 minutos",
  benefits: [
    "Introducción a la metodología CI+7",
    "Cómo funciona LinkedIn realmente en 2026",
    "Los 3 errores que te hacen invisible",
    "Acceso anticipado al Programa Completo",
  ],
  learnings: [
    "Cómo funciona el algoritmo hoy",
    "Por qué tu perfil actual no genera resultados",
    "Las 7 dimensiones del CI+7",
    "Cómo crear contenido que conecta",
    "Cuál debería ser tu plan de acción este 2026",
  ],
  forWhom: [
    "Profesionales que quieren destacar en LinkedIn",
    "Emprendedores buscando más clientes",
    "Consultores y coaches en crecimiento",
    "Ejecutivos que quieren posicionarse como referentes",
    "Cualquiera que sienta que LinkedIn no le funciona",
  ],
};

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: i % 2 === 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Animated gift badge
const GiftBadge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 shadow-lg shadow-accent/20"
  >
    <motion.div
      animate={{ rotate: [0, -10, 10, -10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
    >
      <Gift className="w-5 h-5 text-accent" />
    </motion.div>
    <span className="text-sm font-bold text-accent">100% Gratuita</span>
    <span className="text-accent/60">•</span>
    <span className="text-sm font-semibold text-primary">Cupos Limitados</span>
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Sparkles className="w-4 h-4 text-accent" />
    </motion.div>
  </motion.div>
);

const Masterclass = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    pushGTMEvent('webinar_register_success', {
      cta_name: 'masterclass_landing',
      cta_location: 'masterclass_page',
    });
  };

  return (
    <>
      <Helmet>
        <title>Masterclass Gratuita: LinkedIn Estratégico 2026 | Elevate y Conecta</title>
        <meta 
          name="description" 
          content="Únete a nuestra Masterclass gratuita y descubre cómo usar LinkedIn estratégicamente con la metodología CI+7. Viernes 30 de Enero, 10:00 AM Chile." 
        />
        <meta property="og:title" content="Masterclass Gratuita: LinkedIn Estratégico 2026" />
        <meta property="og:description" content="Aprende a transformar tu perfil de LinkedIn en una herramienta de posicionamiento y ventas. ¡Regístrate gratis!" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Initial confetti celebration */}
        <AnimatePresence>
          {showConfetti && <Confetti duration={4000} />}
        </AnimatePresence>

        {/* Registration success confetti */}
        <AnimatePresence>
          {registrationSuccess && <Confetti duration={5000} />}
        </AnimatePresence>

        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
          {/* Floating particles */}
          <FloatingParticles />
          
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  {/* Animated Gift Badge */}
                  <GiftBadge />

                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 mt-6"
                  >
                    {webinarDetails.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold mb-6"
                  >
                    {webinarDetails.subtitle}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
                  >
                    {webinarDetails.description}
                  </motion.p>

                  {/* Event details - animated cards */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-primary/30 shadow-md"
                    >
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">{webinarDetails.date}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-primary/30 shadow-md"
                    >
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">{webinarDetails.time}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-accent/30 shadow-md"
                    >
                      <Video className="w-5 h-5 text-accent" />
                      <span className="font-medium">En vivo por Zoom</span>
                    </motion.div>
                  </motion.div>

                  {/* Instructor preview */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-4 justify-center lg:justify-start"
                  >
                    <img 
                      src={constanzaProfile} 
                      alt="Constanza Ibieta" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Constanza Ibieta</p>
                      <p className="text-sm text-muted-foreground">Experta en LinkedIn y Social Selling</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Registration Card - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: 30, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <motion.div 
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl" 
                  />
                  
                  <div className="relative glass-card p-6 sm:p-8 rounded-2xl border-2 border-accent/40 bg-card/90 backdrop-blur-sm shadow-2xl shadow-accent/10">
                    {/* Celebration ribbon */}
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-accent to-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <PartyPopper className="w-3 h-3" />
                      ¡Es GRATIS!
                    </motion.div>

                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div 
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
                      >
                        <Trophy className="w-10 h-10 text-white" />
                      </motion.div>
                      <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-display text-2xl font-bold text-foreground mb-2"
                      >
                        ¡Reserva tu lugar ahora!
                      </motion.h2>
                      <p className="text-muted-foreground">
                        Completa el formulario y asegura tu cupo
                      </p>
                    </div>

                    {/* Details badges - animated */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-accent/15 text-accent text-sm font-semibold rounded-full border border-accent/30"
                      >
                        📅 {webinarDetails.date}
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 bg-primary/15 text-primary text-sm font-semibold rounded-full border border-primary/30"
                      >
                        ⏰ {webinarDetails.time}
                      </motion.span>
                    </div>

                    {/* Registration Form */}
                    <WebinarRegistrationForm onSuccess={handleRegistrationSuccess} />

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center text-muted-foreground text-xs mt-4 flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-accent" />
                      Tu información está segura. Sin spam.
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  ¿Qué aprenderás en esta Masterclass?
                </h2>
                <p className="text-lg text-muted-foreground">
                  En solo 60 minutos transformarás tu visión sobre LinkedIn
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4">
                {webinarDetails.learnings.map((learning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 p-4 bg-card rounded-xl border border-accent/20 shadow-sm hover:shadow-md hover:border-accent/40 transition-all cursor-default"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <span className="text-foreground">{learning}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Whom Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  ¿Es para ti esta Masterclass?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Esta sesión es perfecta si eres...
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {webinarDetails.forWhom.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/30 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all cursor-default"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + index }}
                    >
                      <Star className="w-5 h-5 text-accent flex-shrink-0" />
                    </motion.div>
                    <span className="text-foreground text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 relative overflow-hidden">
          {/* Floating particles in CTA */}
          <FloatingParticles />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 shadow-lg mb-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Users className="w-5 h-5 text-accent" />
                </motion.div>
                <span className="text-sm font-bold text-accent">¡Cupos limitados!</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4"
              >
                ¡No te quedes fuera! 🎉
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Reserva tu lugar ahora y da el primer paso hacia un LinkedIn que realmente funcione para ti.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-accent/40 max-w-md mx-auto shadow-xl shadow-accent/10"
              >
                <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 text-foreground bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                    {webinarDetails.date}
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 text-foreground bg-accent/10 px-3 py-1.5 rounded-full"
                  >
                    <Clock className="w-4 h-4 text-accent" />
                    {webinarDetails.time}
                  </motion.span>
                </div>
                <WebinarRegistrationForm onSuccess={handleRegistrationSuccess} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Masterclass;
