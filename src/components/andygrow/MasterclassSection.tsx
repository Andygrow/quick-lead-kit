import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play, CheckCircle2, GraduationCap, Gift, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  { icon: Play, text: "Aprende a crear landing pages con IA en vivo" },
  { icon: Gift, text: "Recibe mi plantilla profesional gratis" },
  { icon: Users, text: "Sesión interactiva con Q&A en tiempo real" },
  { icon: Zap, text: "Automatiza tu negocio desde el día 1" },
];

const MasterclassSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Ingresa un email válido");
      return;
    }

    const phoneClean = phone.replace(/\s/g, "");
    if (phoneClean.length < 8) {
      toast.error("Ingresa un teléfono válido");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("webinar_registrations").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phoneClean,
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || null,
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || null,
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("¡Inscripción exitosa! Te enviaremos los detalles pronto.");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error("Hubo un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="masterclass" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(142,72%,50%,0.06),transparent_60%)]" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-wider uppercase text-[hsl(142,72%,50%)] mb-4 block">
            Masterclass Gratuita · 24 de Marzo · 19:00 hrs Chile
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Aprende a crear tu{" "}
            <span className="text-[hsl(142,72%,50%)]">landing con IA</span>
          </h2>
          <p className="mt-4 text-[hsl(0,0%,65%)] max-w-2xl mx-auto">
            Te enseñaré paso a paso cómo construí esta landing page usando inteligencia artificial,
            y te regalaré la plantilla para que la uses en tu negocio.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[hsl(142,72%,50%)/0.3] bg-[hsl(142,72%,50%)/0.08] text-[hsl(142,72%,50%)] text-sm font-bold">
            📅 Lunes 24 de Marzo · 19:00 hrs (Chile)
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[hsl(142,72%,50%)/0.15] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[hsl(142,72%,50%)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">¿Qué aprenderás?</h3>
                <p className="text-sm text-[hsl(0,0%,55%)]">Todo en una sesión práctica en vivo</p>
              </div>
            </div>

            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(0,0%,12%)] bg-[hsl(220,20%,6%)] hover:border-[hsl(142,72%,50%)/0.3] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[hsl(142,72%,50%)/0.1] flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-[hsl(142,72%,50%)]" />
                </div>
                <span className="text-sm text-[hsl(0,0%,75%)] font-medium">{b.text}</span>
              </motion.div>
            ))}

            <div className="mt-6 p-4 rounded-xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(142,72%,50%)/0.05]">
              <p className="text-sm text-[hsl(142,72%,50%)] font-semibold flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Bonus: Plantilla profesional de landing page incluida
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-[hsl(142,72%,50%)/0.2] bg-[hsl(220,20%,5%)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[hsl(0,0%,12%)] bg-[hsl(142,72%,50%)/0.05]">
                <h3 className="text-lg font-bold text-white text-center">
                  Inscríbete gratis
                </h3>
                <p className="text-xs text-[hsl(0,0%,55%)] text-center mt-1">
                  Cupos limitados · Recibe acceso + plantilla
                </p>
              </div>

              <div className="px-6 py-6">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-[hsl(142,72%,50%)/0.15] flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[hsl(142,72%,50%)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      ¡Estás inscrito! 🎉
                    </h3>
                    <p className="text-sm text-[hsl(0,0%,60%)]">
                      Revisa tu email para los detalles de acceso.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[hsl(0,0%,70%)] mb-2 block">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
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
                    <div>
                      <label className="text-sm font-semibold text-[hsl(0,0%,70%)] mb-2 block">
                        Teléfono (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+56 9 1234 5678"
                        maxLength={20}
                        className="w-full h-12 px-4 rounded-xl border border-[hsl(0,0%,15%)] bg-[hsl(220,20%,6%)] text-white placeholder:text-[hsl(0,0%,35%)] focus:border-[hsl(142,72%,50%)/0.5] focus:outline-none focus:ring-1 focus:ring-[hsl(142,72%,50%)/0.3] transition-all text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-base font-bold bg-[hsl(142,72%,50%)] text-[hsl(220,20%,4%)] hover:bg-[hsl(142,72%,60%)] rounded-xl shadow-[0_0_30px_hsl(142,72%,50%,0.3)] hover:shadow-[0_0_50px_hsl(142,72%,50%,0.5)] transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Inscribiendo...
                        </>
                      ) : (
                        <>
                          <GraduationCap className="mr-2 w-5 h-5" />
                          Inscribirme a la Masterclass Gratis
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-[hsl(0,0%,40%)] text-center">
                      Sin costo · Sin spam · Cancela cuando quieras
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;
