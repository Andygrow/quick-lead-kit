import { useMemo } from "react";

interface EnergyParticlesProps {
  count?: number;
  className?: string;
}

const EnergyParticles = ({ count = 5, className = "" }: EnergyParticlesProps) => {
  // Generate fewer particles for better performance
  const particles = useMemo(() => 
    Array.from({ length: Math.min(count, 8) }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2,
      delay: Math.random() * 3,
    })), [count]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary/40 animate-pulse will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
};

export default EnergyParticles;
