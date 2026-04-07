import andyProfile from "@/assets/andygrow/andy-profile.jpeg";
import { Sparkles, Calendar, Clock, Zap } from "lucide-react";

const VideoOutro = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Background glows - neon green */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            top: "-10%",
            left: "-15%",
            background: "radial-gradient(circle, #39e75f66 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full opacity-15"
          style={{
            bottom: "5%",
            right: "-10%",
            background: "radial-gradient(circle, #39e75f33 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: '#39e75f15', borderColor: '#39e75f40' }}>
          <Sparkles className="w-4 h-4" style={{ color: '#39e75f' }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#39e75f' }}>Masterclass Gratuita</span>
        </div>

        {/* Profile photo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl scale-110 opacity-50" style={{ background: 'linear-gradient(to bottom, #39e75f66, #39e75f22)' }} />
          <img
            src={andyProfile}
            alt="Andy Grow"
            className="relative w-32 h-32 rounded-full object-cover shadow-2xl"
            style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#39e75f' }}
          />
        </div>

        {/* Name */}
        <div>
          <p className="text-sm font-medium" style={{ color: '#888' }}>Con</p>
          <h2 className="font-display text-2xl font-bold text-white">Andy Grow</h2>
          <p className="text-sm font-semibold mt-1" style={{ color: '#39e75f' }}>Arquitecto de Sistemas de Venta con IA</p>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, #39e75f, transparent)' }} />

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white leading-tight">
            Crea tu{" "}
            <span style={{ color: '#39e75f' }}>Landing Page</span>
            <br />
            con IA
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#aaa' }}>
            Aprende a crear landing pages que convierten usando inteligencia artificial, sin saber código.
          </p>
        </div>

        {/* Event details */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: '#111', borderColor: '#222' }}>
            <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: '#39e75f' }} />
            <p className="text-white text-sm font-bold text-left">Martes 7 de Abril, 2026</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: '#111', borderColor: '#222' }}>
            <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#39e75f' }} />
            <p className="text-white text-sm font-bold text-left">19:00 hrs (Chile)</p>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full pt-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-md opacity-50" style={{ background: '#39e75f' }} />
            <div className="relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-black font-bold text-lg shadow-xl" style={{ background: 'linear-gradient(135deg, #39e75f, #2bc94d)' }}>
              <Zap className="w-5 h-5" />
              ¡Inscríbete GRATIS!
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: '#666' }}>
            🔗 andygrow.lovable.app
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoOutro;
