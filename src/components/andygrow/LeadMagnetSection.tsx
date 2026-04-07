import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowRight, Building2, ShoppingCart, GraduationCap, Briefcase, Stethoscope, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const industries = [
  { value: "Inmobiliaria", icon: Building2 },
  { value: "E-commerce", icon: ShoppingCart },
  { value: "Educación", icon: GraduationCap },
  { value: "Servicios Profesionales", icon: Briefcase },
  { value: "Salud", icon: Stethoscope },
  { value: "Manufactura", icon: Factory },
];

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-industry`;

const LeadMagnetSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !selectedIndustry) {
      toast.error("Completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Ingresa un email válido");
      return;
    }

    setIsLoading(true);
    setResult("");
    setShowResult(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ name, email, industry: selectedIndustry }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Demasiadas solicitudes, intenta en unos segundos.");
        } else if (resp.status === 402) {
          toast.error("Servicio temporalmente no disponible.");
        } else {
          toast.error("Error al generar el análisis. Intenta de nuevo.");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullText += content;
              setResult(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullText += content;
              setResult(fullText);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown to HTML
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^## (.*$)/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 class="text-lg font-semibold text-white mt-4 mb-2">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-[hsl(0,0%,72%)]">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <section id="lead-magnet" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,hsl(142,72%,50%,0.05),transparent_60%)]" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-wider uppercase text-[hsl(142,72%,50%)] mb-4 block">
            Diagnóstico Gratuito
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Tu análisis de IA{" "}
            <span className="text-[hsl(142,72%,50%)]">personalizado</span>
          </h2>
          <p className="mt-4 text-[hsl(0,0%,65%)] max-w-xl mx-auto">
            Selecciona tu industria, ingresa tus datos y recibe un diagnóstico estratégico generado por inteligencia artificial en segundos.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Industry selector */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-[hsl(0,0%,70%)] mb-3 block">
              Selecciona tu industria
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industries.map((ind) => {
                const isActive = selectedIndustry === ind.value;
                return (
                  <button
                    key={ind.value}
                    type="button"
                    onClick={() => setSelectedIndustry(ind.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${
                      isActive
                        ? "border-[hsl(142,72%,50%)/0.5] bg-[hsl(142,72%,50%)/0.1] shadow-[0_0_20px_hsl(142,72%,50%,0.1)]"
                        : "border-[hsl(0,0%,15%)] bg-[hsl(220,20%,6%)] hover:border-[hsl(0,0%,25%)]"
                    }`}
                  >
                    <ind.icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-[hsl(142,72%,50%)]" : "text-[hsl(0,0%,50%)]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-white" : "text-[hsl(0,0%,65%)]"
                      }`}
                    >
                      {ind.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="text-sm font-semibold text-[hsl(0,0%,70%)] mb-2 block">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                maxLength={100}
                className="w-full h-12 px-4 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(220,20%,6%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] focus:outline-none focus:ring-1 focus:ring-[hsl(142,72%,50%)/0.3] transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[hsl(0,0%,70%)] mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                maxLength={255}
                className="w-full h-12 px-4 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(220,20%,6%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] focus:outline-none focus:ring-1 focus:ring-[hsl(142,72%,50%)/0.3] transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !selectedIndustry}
            className="w-full h-14 text-base font-bold bg-[hsl(142,72%,50%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(142,72%,60%)] rounded-xl shadow-[0_0_30px_hsl(142,72%,50%,0.3)] hover:shadow-[0_0_50px_hsl(142,72%,50%,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Analizando tu industria...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-5 h-5" />
                Obtener mi Diagnóstico con IA Gratis
              </>
            )}
          </Button>
        </motion.form>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto mt-12"
            >
              <div className="rounded-2xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(220,20%,5%)] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[hsl(0,0%,12%)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(142,72%,50%)/0.15] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[hsl(142,72%,50%)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Diagnóstico IA · {selectedIndustry}
                    </h3>
                    <p className="text-xs text-[hsl(0,0%,50%)]">
                      Análisis personalizado para {name || "tu negocio"}
                    </p>
                  </div>
                  {isLoading && (
                    <Loader2 className="w-4 h-4 text-[hsl(142,72%,50%)] animate-spin ml-auto" />
                  )}
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {result ? (
                    <div
                      className="text-sm text-[hsl(0,0%,72%)] leading-relaxed prose-invert"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
                    />
                  ) : (
                    <div className="flex items-center gap-3 text-[hsl(0,0%,50%)]">
                      <Loader2 className="w-5 h-5 animate-spin text-[hsl(142,72%,50%)]" />
                      <span className="text-sm">Generando tu diagnóstico personalizado...</span>
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                {!isLoading && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-6 py-5 border-t border-[hsl(0,0%,12%)] bg-[hsl(220,20%,4%)]"
                  >
                    <p className="text-sm text-[hsl(0,0%,60%)] mb-4 text-center">
                      ¿Quieres aprender a implementar esto en tu negocio? Inscríbete en mi masterclass gratuita.
                    </p>
                    <a
                      href="#masterclass"
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[hsl(142,72%,50%)] text-[hsl(220,20%,4%)] font-bold text-sm hover:bg-[hsl(142,72%,60%)] transition-all shadow-[0_0_20px_hsl(142,72%,50%,0.3)] hover:shadow-[0_0_40px_hsl(142,72%,50%,0.5)]"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Inscribirme a la Masterclass Gratis
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
