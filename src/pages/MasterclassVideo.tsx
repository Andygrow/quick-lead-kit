import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Play, CheckCircle2, Sparkles, Star, Clock, Users, Trophy, Lock, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/markmedia/Header";
import Footer from "@/components/markmedia/Footer";
import MasterclassAccessForm from "@/components/markmedia/MasterclassAccessForm";
import ProgramCTABanner from "@/components/markmedia/ProgramCTABanner";
import Confetti from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";

import constanzaProfile from "@/assets/constanza/constanza-professional.jpeg";

const VIDEO_URL = "https://storage.googleapis.com/msgsndr/YgeRRdsNvQfoQJPg3fAa/media/6981f89bd2e7ef617606a1bd.mp4";
const PREVIEW_DURATION = 40; // seconds of free preview before gate appears
const CTA_TRIGGER_TIME = 600; // 10 minutes in seconds

const videoDetails = {
  title: "Masterclass",
  subtitle: "LinkedIn Estratégico 2026",
  description: "Descubre cómo usar LinkedIn de forma estratégica con la metodología CI+7. En esta masterclass aprenderás los fundamentos para transformar tu perfil en una herramienta de posicionamiento y ventas.",
  duration: "60 minutos",
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

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
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

const MasterclassVideo = () => {
  const [searchParams] = useSearchParams();
  const hasAccessParam = searchParams.get('access') === 'true';
  const [showConfetti, setShowConfetti] = useState(false);
  // If user arrives via email link with ?access=true, skip the gate entirely
  const [isUnlocked, setIsUnlocked] = useState(hasAccessParam);
  const [showGate, setShowGate] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showProgramCTA, setShowProgramCTA] = useState(false);
  const [hasShownCTA, setHasShownCTA] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showInlineBanner, setShowInlineBanner] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    
    // Gate for non-unlocked users
    if (!isUnlocked && time >= PREVIEW_DURATION && !showGate) {
      videoRef.current.pause();
      setShowGate(true);
    }
    
    // Show CTA after 10 minutes for unlocked users
    if (isUnlocked && time >= CTA_TRIGGER_TIME && !hasShownCTA) {
      setShowProgramCTA(true);
      setHasShownCTA(true);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    if (isUnlocked && !hasShownCTA) {
      setShowProgramCTA(true);
      setHasShownCTA(true);
    }
  };

  const handleAccessSuccess = () => {
    setIsUnlocked(true);
    setShowGate(false);
    setShowConfetti(true);
    
    // Resume video after unlocking
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 500);
  };

  const previewProgress = Math.min((currentTime / PREVIEW_DURATION) * 100, 100);

  return (
    <>
      <Helmet>
        <title>Masterclass: LinkedIn Estratégico 2026 | Elevate y Conecta</title>
        <meta 
          name="description" 
          content="Mira la Masterclass completa y descubre cómo usar LinkedIn estratégicamente con la metodología CI+7. Accede gratis dejando tus datos." 
        />
        <meta property="og:title" content="Masterclass: LinkedIn Estratégico 2026" />
        <meta property="og:description" content="Aprende a transformar tu perfil de LinkedIn en una herramienta de posicionamiento y ventas. ¡Accede gratis!" />
        <meta property="og:type" content="video.other" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AnimatePresence>
          {showConfetti && <Confetti duration={5000} />}
        </AnimatePresence>

        <Header />
        
        {/* Hero Section with Video */}
        <section className="relative pt-24 pb-8 sm:pt-32 sm:pb-12 overflow-hidden">
          <FloatingParticles />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 mb-4"
                >
                  <Play className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-accent">Masterclass Disponible</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                  {videoDetails.title}
                </h1>
                <p className="text-xl sm:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
                  {videoDetails.subtitle}
                </p>
              </motion.div>

              {/* Video Player Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border"
              >
                {/* Video */}
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    className="w-full h-full object-cover"
                    controls={isUnlocked}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    playsInline
                  />
                  
                  {/* Preview Progress Bar (only when not unlocked) */}
                  {!isUnlocked && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-primary"
                        style={{ width: `${previewProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Play Button Overlay (initial state) */}
                  {!showGate && !isUnlocked && currentTime === 0 && (
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => videoRef.current?.play()}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-accent/40 group-hover:bg-accent/90 transition-colors">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="white" />
                      </div>
                      <span className="absolute bottom-8 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
                        Ver preview de {PREVIEW_DURATION} segundos
                      </span>
                    </motion.button>
                  )}
                </div>

                {/* Gate Overlay */}
                <AnimatePresence>
                  {showGate && !isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 flex items-center justify-center p-4 sm:p-8"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-md"
                      >
                        <div className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-accent/40 bg-card/95 backdrop-blur-sm shadow-2xl">
                          {/* Lock Icon */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                          </div>

                          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center mb-2">
                            ¿Te gustó el preview?
                          </h3>
                          <p className="text-muted-foreground text-center mb-6">
                            Ingresa tus datos para ver la Masterclass completa <strong>gratis</strong>
                          </p>

                          <MasterclassAccessForm onSuccess={handleAccessSuccess} />

                          <p className="text-center text-muted-foreground text-xs mt-4 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-accent" />
                            Tu información está segura. Sin spam.
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Video Info Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{videoDetails.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span>Metodología CI+7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>+500 profesionales</span>
                </div>
              </motion.div>

              {/* Instructor */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 justify-center mt-6"
              >
                <img 
                  src={constanzaProfile} 
                  alt="Constanza Ibieta" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Constanza Ibieta</p>
                  <p className="text-sm text-muted-foreground">Experta en LinkedIn y Social Selling</p>
                </div>
              </motion.div>
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
                {videoDetails.learnings.map((learning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 p-4 bg-card rounded-xl border border-accent/20 shadow-sm hover:shadow-md hover:border-accent/40 transition-all cursor-default"
                  >
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
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
                {videoDetails.forWhom.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/30 shadow-sm hover:shadow-lg hover:border-accent/50 transition-all cursor-default"
                  >
                    <Star className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Different content based on unlock state */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {!isUnlocked ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                      ¿Listo para transformar tu LinkedIn?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Accede a la Masterclass completa gratis y descubre la metodología CI+7
                    </p>

                    <div className="max-w-md mx-auto glass-card p-6 rounded-2xl border border-accent/30">
                      <MasterclassAccessForm onSuccess={handleAccessSuccess} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                      ¿Listo para implementar la metodología CI+7?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Únete al <strong>Programa LinkedIn 2026</strong> y transforma tu perfil con acompañamiento personalizado
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Link to="/programa-linkedin-2026">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-semibold px-8 py-6"
                        >
                          <Rocket className="w-5 h-5 mr-2" />
                          Quiero inscribirme al Programa
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="text-sm mt-4 space-y-1">
                      <p className="font-bold text-accent">🔥 $126.000 CLP <span className="text-muted-foreground font-normal line-through text-xs">$180.000</span></p>
                      <p className="text-muted-foreground">📍 Marzo: 13-17-24-31 • 13:00-15:00 hrs</p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Subtle floating CTA for unlocked users */}
        <AnimatePresence>
          {isUnlocked && !showProgramCTA && showInlineBanner && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 right-6 z-40 hidden lg:block"
            >
              <ProgramCTABanner isVisible={true} variant="inline" onClose={() => setShowInlineBanner(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal CTA after 10 min or video end */}
        <ProgramCTABanner 
          isVisible={showProgramCTA} 
          onClose={() => setShowProgramCTA(false)}
          variant="modal"
        />

        <Footer />
      </div>
    </>
  );
};

export default MasterclassVideo;
