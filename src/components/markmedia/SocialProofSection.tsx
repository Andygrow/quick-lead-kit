import { motion } from "framer-motion";

// Logo imports
import santanderLogo from "@/assets/brands/santander.png";
import antalisLogo from "@/assets/brands/antalis.webp";
import uchileLogo from "@/assets/brands/uchile.png";
import papajohnsLogo from "@/assets/brands/papajohns.png";
import kibernumLogo from "@/assets/brands/kibernum.png";
import outsystemsLogo from "@/assets/brands/outsystems.png";

// Marcas con las que ha trabajado Constanza
const clients = [
  { name: "Santander", logo: santanderLogo },
  { name: "Universidad de Chile", logo: uchileLogo },
  { name: "Antalis", logo: antalisLogo },
  { name: "Papa John's", logo: papajohnsLogo },
  { name: "Kibernum", logo: kibernumLogo },
  { name: "Outsystems", logo: outsystemsLogo },
];

const stats = [
  { value: "60K+", label: "Seguidores en LinkedIn" },
  { value: "3.500+", label: "Profesionales entrenados" },
  { value: "30+", label: "Empresas acompañadas" },
];

const SocialProofSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-card border-y border-border relative overflow-hidden">
      {/* Background accent - simplified */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Static ambient glows - no parallax */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-10"
        >
          {/* Tagline */}
          <div className="space-y-3 relative">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              LinkedIn no es solo estar, es
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground relative inline-block">
              Conectar y{" "}
              <span className="shimmer-text">Destacar</span>
            </h2>
          </div>

          {/* Stats - simplified */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center relative group"
              >
                <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary relative z-10">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-foreground/70 mt-1 relative z-10">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto relative">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <p className="text-sm text-foreground/80 font-medium px-2">
              Marcas que confían en el método
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* Client logos - Marquee carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
            
            {/* Marquee container */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex"
            >
              {/* First set of logos */}
              <div className="flex animate-marquee">
                {clients.map((client, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex items-center justify-center px-6 sm:px-8 py-4 mx-2 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-w-[160px] sm:min-w-[180px] h-20 group flex-shrink-0"
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-h-12 max-w-[120px] object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex animate-marquee" aria-hidden="true">
                {clients.map((client, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex items-center justify-center px-6 sm:px-8 py-4 mx-2 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-w-[160px] sm:min-w-[180px] h-20 group flex-shrink-0"
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-h-12 max-w-[120px] object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Trust message */}
          <p className="text-foreground/80 text-sm max-w-xl mx-auto">
            Más de <span className="text-primary font-semibold">6 años</span> dedicados a 
            <span className="text-foreground font-medium"> hackear LinkedIn</span> y convertirlo en tu 
            mejor herramienta de ventas y posicionamiento.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;