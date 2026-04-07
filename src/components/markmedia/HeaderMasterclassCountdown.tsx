import { useState, useEffect } from "react";
import { Calendar, Video } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeaderMasterclassCountdown = () => {
  // Masterclass date: April 7, 2026 at 7:00 PM Chile time (UTC-3)
  const masterclassDate = new Date("2026-04-07T19:00:00-03:00");
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = masterclassDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    const element = document.getElementById('masterclass-registration');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isExpired) return null;

  return (
    <>
      {/* Desktop version */}
      <button
        onClick={handleClick}
        className="hidden md:flex items-center gap-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/40 hover:border-accent/60 hover:from-primary/25 hover:to-accent/25 transition-all cursor-pointer group shadow-lg"
      >
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
          <Video className="w-5 h-5 text-white" />
        </div>
        
        {/* Info */}
        <div className="text-left hidden lg:block">
          <p className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
            🔥 Masterclass GRATIS
          </p>
          <p className="text-xs text-muted-foreground leading-tight flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-primary" />
            Martes 7 Abril • 19:00 hrs Chile
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-primary/50 to-accent/50" />

        {/* Countdown */}
        <div className="flex items-center gap-1.5">
          <CountdownUnit value={timeLeft.days} label="días" variant="primary" />
          <span className="text-primary font-bold text-sm">:</span>
          <CountdownUnit value={timeLeft.hours} label="hrs" variant="accent" />
          <span className="text-accent font-bold text-sm">:</span>
          <CountdownUnit value={timeLeft.minutes} label="min" variant="primary" />
          <span className="text-primary font-bold text-sm">:</span>
          <CountdownUnit value={timeLeft.seconds} label="seg" variant="accent" />
        </div>
      </button>

      {/* Mobile version - descriptive pill with context */}
      <button
        onClick={handleClick}
        className="flex md:hidden items-center gap-2 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[11px] font-bold shadow-lg hover:shadow-xl transition-all"
      >
        {/* Icon */}
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Video className="w-3 h-3" />
        </div>
        
        {/* Context label */}
        <div className="flex flex-col items-start leading-none">
          <span className="font-bold">Masterclass Gratis</span>
          <span className="text-[9px] opacity-90 font-medium">
            en {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </div>
      </button>
    </>
  );
};

interface CountdownUnitProps {
  value: number;
  label: string;
  variant?: "primary" | "accent";
  className?: string;
}

const CountdownUnit = ({ value, label, variant = "primary", className = "" }: CountdownUnitProps) => (
  <div className={`flex flex-col items-center ${className}`}>
    <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold tabular-nums shadow-sm ${
      variant === "primary" 
        ? "bg-primary/20 border border-primary/40 text-primary" 
        : "bg-accent/20 border border-accent/40 text-accent"
    }`}>
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[9px] text-muted-foreground mt-0.5 hidden xl:block">{label}</span>
  </div>
);

export default HeaderMasterclassCountdown;
