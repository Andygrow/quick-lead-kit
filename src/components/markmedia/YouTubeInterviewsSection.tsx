import { motion } from "framer-motion";
import { Youtube, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const FEATURED_VIDEOS = [
  {
    id: "6-w3KrsZ2B0",
    title: "Claves para potenciar tu LinkedIn",
    channel: "Elévate y Conecta",
  },
  {
    id: "oUTOj0VmXGM",
    title: "Estrategias de Social Selling",
    channel: "Elévate y Conecta",
  },
  {
    id: "8YWwz2RgZOk",
    title: "Marca Personal en LinkedIn",
    channel: "Elévate y Conecta",
  },
  {
    id: "LNcr6pvaBDU",
    title: "Metodología CI+7 en Acción",
    channel: "Elévate y Conecta",
  },
];

const MORE_VIDEOS = [
  {
    id: "llMYi-3E0vA",
    title: "Entrevista sobre LinkedIn y Marca Personal",
    channel: "Elévate y Conecta",
  },
  {
    id: "iXfXMmcMaUU",
    title: "Cómo generar oportunidades en LinkedIn",
    channel: "Elévate y Conecta",
  },
  {
    id: "RUJc83Kt97w",
    title: "El poder de las conexiones estratégicas",
    channel: "Elévate y Conecta",
  },
];

const ALL_VIDEOS = [...FEATURED_VIDEOS, ...MORE_VIDEOS];

const YouTubeInterviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerView = 3;
  const maxIndex = Math.max(0, ALL_VIDEOS.length - videosPerView);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const visibleVideos = ALL_VIDEOS.slice(currentIndex, currentIndex + videosPerView);

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <Youtube className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">YouTube</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Entrevistas en{" "}
            <span className="text-destructive">YouTube</span>
          </h2>
          
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Conoce más sobre la metodología CI+7 a través de mis entrevistas en diferentes canales
          </p>
        </motion.div>

        {/* Videos Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Videos Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visibleVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border/50 shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-foreground/60">{video.channel}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-primary w-6"
                    : "bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Ir al grupo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA to YouTube Channel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.youtube.com/@constanzaibieta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/30 text-destructive font-medium hover:bg-destructive/20 transition-all"
          >
            <Youtube className="w-5 h-5" />
            Ver más en YouTube
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeInterviewsSection;
