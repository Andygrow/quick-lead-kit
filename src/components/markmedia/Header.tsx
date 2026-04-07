import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Linkedin, Sun, Moon } from "lucide-react";
import { pushGTMEvent } from "@/hooks/useGTM";
import { useTheme } from "next-themes";
import logoOficial from "@/assets/constanza/logo-elevate-conecta-oficial.png";
import HeaderMasterclassBadge from "./HeaderMasterclassBadge";

interface HeaderProps {
  hasTopBanner?: boolean;
}

const Header = ({ hasTopBanner = false }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 ${hasTopBanner ? 'top-10' : 'top-0'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Oficial - adapts to theme */}
          <a href="/" className="flex items-center">
            <img 
              src={logoOficial} 
              alt="Elévate y Conecta" 
              className="h-20 sm:h-24 w-auto transition-all duration-300"
              style={{
                filter: 'var(--logo-filter, brightness(0))',
              }}
            />
          </a>

          {/* Masterclass Badge - Center */}
          <HeaderMasterclassBadge />

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-primary/10 w-8 h-8 sm:w-9 sm:h-9"
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* LinkedIn/WhatsApp Button - Icon only on mobile, full on desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:text-primary hover:bg-primary/10 w-8 h-8"
              aria-label="Contactar por LinkedIn"
              onClick={() => {
                pushGTMEvent('cta_click', {
                  cta_name: 'header_hablemos_whatsapp',
                  cta_location: 'header',
                  cta_text: 'Hablemos',
                });
                const whatsappNumber = '56940118070';
                const message = encodeURIComponent('Hola Constanza! Vi tu landing y me interesa saber más sobre cómo potenciar mi presencia en LinkedIn.');
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
            >
              <Linkedin className="w-4 h-4" />
            </Button>

            {/* Desktop: Full button with text */}
            <Button
              variant="ghost"
              className="hidden md:flex text-foreground hover:text-primary hover:bg-primary/10 font-medium items-center gap-2"
              onClick={() => {
                pushGTMEvent('cta_click', {
                  cta_name: 'header_hablemos_whatsapp',
                  cta_location: 'header',
                  cta_text: 'Hablemos',
                });
                const whatsappNumber = '56940118070';
                const message = encodeURIComponent('Hola Constanza! Vi tu landing y me interesa saber más sobre cómo potenciar mi presencia en LinkedIn.');
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
            >
              <Linkedin className="w-4 h-4" />
              Hablemos
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;