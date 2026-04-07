import { useState, useRef, useEffect } from "react";
import Header from "@/components/markmedia/Header";
import HeroSection from "@/components/markmedia/HeroSection";
import PainPointsSection from "@/components/markmedia/PainPointsSection";
import WhatsInsideSection from "@/components/markmedia/WhatsInsideSection";
import SocialProofSection from "@/components/markmedia/SocialProofSection";
import AboutSection from "@/components/markmedia/AboutSection";
import TestimonialsSection from "@/components/markmedia/TestimonialsSection";
import ServicesSection from "@/components/markmedia/ServicesSection";
import FAQSection from "@/components/markmedia/FAQSection";
import FinalCTA from "@/components/markmedia/FinalCTA";
import Footer from "@/components/markmedia/Footer";
import YouTubeInterviewsSection from "@/components/markmedia/YouTubeInterviewsSection";
import MasterclassSection from "@/components/markmedia/MasterclassSection";

interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle hash-based navigation on page load
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    // Run on initial load
    handleHashScroll();

    // Also listen for hash changes
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const handleUnlock = (data: UserData) => {
    setUserData(data);
    setIsUnlocked(true);
    // Scroll to top smoothly when unlocked
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div ref={heroRef}>
          <HeroSection 
            isUnlocked={isUnlocked} 
            userData={userData}
            onUnlock={handleUnlock} 
          />
        </div>
        {/* Only show these sections when locked */}
        {!isUnlocked && (
          <>
            <SocialProofSection />
            <AboutSection />
            <MasterclassSection />
            <YouTubeInterviewsSection />
            <TestimonialsSection />
            <ServicesSection />
            <PainPointsSection />
            <WhatsInsideSection />
            <FAQSection />
            <FinalCTA onCTAClick={scrollToHero} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
