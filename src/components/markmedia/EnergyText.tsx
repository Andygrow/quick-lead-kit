import { motion } from "framer-motion";
import { useMemo } from "react";

interface EnergyTextProps {
  children: string;
  className?: string;
}

const EnergyText = ({ children, className = "" }: EnergyTextProps) => {
  // Generate sparkles once
  const sparkles = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      y: Math.random() * 120 - 10,
      delay: i * 0.4,
    })), []
  );

  return (
    <motion.span
      className={`energy-text relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* Main text with shimmer effect */}
      <span className="shimmer-text energy-glow relative z-10">{children}</span>

      {/* Static sparkle particles - CSS animated */}
      <span className="sparkle-container">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </span>

      {/* Energy burst lines - CSS only */}
      <span
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-0.5 energy-line"
        style={{
          background: "linear-gradient(90deg, hsl(187 100% 50%), hsl(187 100% 70%), transparent)",
          transformOrigin: "left center",
        }}
      />
    </motion.span>
  );
};

export default EnergyText;
