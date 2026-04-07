import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ConfettiProps {
  count?: number;
  duration?: number;
}

const COLORS = [
  '#0052e2', // primary blue
  '#ff6d00', // accent orange
  '#10b981', // green
  '#f59e0b', // yellow
  '#ec4899', // pink
  '#8b5cf6', // purple
];

const Confetti = ({ count = 50, duration = 3 }: ConfettiProps) => {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // position %
      delay: Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px',
          }}
          initial={{
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: 400,
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration + Math.random(),
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
