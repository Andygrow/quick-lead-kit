import { motion } from "framer-motion";
import { Quote, Star, Building2 } from "lucide-react";
import EnergyParticles from "./EnergyParticles";

import { companyLogos, testimonials } from "./testimonialsData";

const TestimonialsSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-card relative overflow-hidden">
      {/* Background effects */}
      <EnergyParticles count={10} className="opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Lo que dicen nuestros clientes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Resultados que{" "}
            <span className="shimmer-text">Hablan</span>
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            Profesionales y empresas que transformaron su presencia en LinkedIn con la metodología CI+7
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full glass-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  
                  {/* Quote text */}
                  <p className="text-foreground/90 text-sm leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 flex-shrink-0"
                        style={{
                          objectPosition: testimonial.objectPosition ?? "50% 25%",
                          transform: "scale(1.25)",
                          transformOrigin: "center",
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-foreground/70">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center gap-4 max-w-md mx-auto mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Building2 className="w-4 h-4" />
              <span>Empresas que confían en nosotros</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {companyLogos.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.03 * index }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.2)",
                }}
                className="px-5 py-2.5 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <span className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                  {company}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground">
                <span className="font-bold text-primary">+3.500</span> profesionales transformando su LinkedIn
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
