import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, Calendar, Users, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProgramCTABannerProps {
  isVisible: boolean;
  onClose?: () => void;
  variant?: 'modal' | 'inline';
}

const PROGRAM_URL = "/programa-linkedin-2026";

export const ProgramCTABanner = ({ 
  isVisible, 
  onClose,
  variant = 'modal' 
}: ProgramCTABannerProps) => {
  if (!isVisible) return null;

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-card border border-accent/30 rounded-xl p-4 shadow-lg relative"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              Programa LinkedIn 2026
            </h4>
            <p className="text-muted-foreground text-xs mb-3">
              Implementa la metodología CI+7 con acompañamiento personalizado
            </p>
            <Link to={PROGRAM_URL}>
              <Button 
                size="sm" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
              >
                Conoce el programa
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-2 border-accent/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
          
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center mb-2">
              ¿Te gustó la Masterclass?
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Lleva tu LinkedIn al siguiente nivel con el <strong className="text-foreground">Programa LinkedIn 2026</strong>
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div className="text-foreground">
                  <div className="font-medium">📍 Marzo: 13-17-24-31</div>
                  <div className="text-xs text-muted-foreground">13:00-15:00 hrs (Chile)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">Acompañamiento personalizado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground">Bonos exclusivos incluidos</span>
              </div>
            </div>

            {/* CTA */}
            <Link to={PROGRAM_URL}>
              <Button 
                className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-semibold py-6"
                size="lg"
              >
                Quiero inscribirme al Programa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Price hint */}
            <p className="text-center text-accent text-sm font-bold mt-4">
              🔥 $126.000 CLP <span className="text-muted-foreground font-normal line-through text-xs">$180.000</span>
            </p>
            <p className="text-center text-muted-foreground text-xs">
              Precio especial Marzo • Cupos limitados
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgramCTABanner;
