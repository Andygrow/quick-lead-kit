import { motion } from "framer-motion";
import { Linkedin, Instagram, Globe, Sparkles } from "lucide-react";
import { pushGTMEvent } from "@/hooks/useGTM";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 sm:py-16 bg-background border-t border-border relative overflow-hidden"
    >
      {/* Top energy line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), hsl(var(--accent) / 0.25), transparent)",
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="font-display text-xl font-bold text-foreground">
                Elévate y Conecta
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              <span className="text-primary font-semibold">+6 años</span> ayudando a profesionales, 
              emprendedores y equipos a convertir LinkedIn en su mejor herramienta de crecimiento.
            </p>
            
            {/* Energy tagline */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="shimmer-text">Conectar y Destacar</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Servicios</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {['Consultoría Personal', 'Entrenamiento Equipos', 'Optimización de Perfil', 'Estrategia de Contenido'].map((service, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                  className="cursor-default transition-colors"
                >
                  {service}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <motion.a 
                href="https://www.elevateyconecta.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => {
                  pushGTMEvent('outbound_click', {
                    link_url: 'https://www.elevateyconecta.com',
                    link_text: 'www.elevateyconecta.com',
                    link_location: 'footer',
                  });
                }}
              >
                <Globe className="w-4 h-4" />
                www.elevateyconecta.com
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Elévate y Conecta - Constanza Ibieta. Todos los derechos reservados.
          </p>

          {/* Social Links with energy hover */}
          <div className="flex items-center gap-3">
            {[
              { href: "https://linkedin.com/in/constanzaibietaillanes", icon: Linkedin, label: "LinkedIn" },
              { href: "https://instagram.com/elevateyconecta", icon: Instagram, label: "Instagram" },
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                aria-label={label}
                onClick={() => {
                  pushGTMEvent('social_click', {
                    social_network: label.toLowerCase(),
                    link_url: href,
                    link_location: 'footer',
                  });
                }}
                whileHover={{ 
                  scale: 1.15,
                  backgroundColor: "hsl(var(--primary) / 0.12)",
                  color: "hsl(var(--primary))",
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;