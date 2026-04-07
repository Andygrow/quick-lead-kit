import { Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeaderMasterclassBadge = () => {
  return (
    <>
      {/* Desktop version */}
      <Link
        to="/masterclass"
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/40 hover:border-accent/60 hover:from-primary/25 hover:to-accent/25 transition-all cursor-pointer group shadow-lg"
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
        </div>
        
        {/* Info */}
        <div className="text-left">
          <p className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight flex items-center gap-1.5">
            🎬 Masterclass Disponible
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            Ver ahora gratis
          </p>
        </div>
      </Link>

      {/* Mobile version */}
      <Link
        to="/masterclass"
        className="flex md:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Play className="w-3 h-3 ml-0.5" fill="white" />
        </div>
        <span>Masterclass</span>
        <Sparkles className="w-3 h-3" />
      </Link>
    </>
  );
};

export default HeaderMasterclassBadge;
