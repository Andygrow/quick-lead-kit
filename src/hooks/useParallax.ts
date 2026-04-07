import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface ParallaxOptions {
  offset?: ["start end" | "end start" | "start start" | "end end" | "center center", "start end" | "end start" | "start start" | "end end" | "center center"];
  inputRange?: number[];
  outputRange?: number[];
}

export const useParallax = (options?: ParallaxOptions) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options?.offset || ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress,
    options?.inputRange || [0, 1],
    options?.outputRange || [100, -100]
  );

  return { ref, scrollYProgress, y };
};

export const useParallaxMultiple = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Different speeds for layered effects
  const ySlowUp = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yMediumUp = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yFastUp = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  const ySlowDown = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yMediumDown = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  
  // Scale effects
  const scaleIn = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const scaleUp = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  
  // Opacity effects
  const fadeIn = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const fadeInOut = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  // Rotation
  const rotateSlowCW = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateSlowCCW = useTransform(scrollYProgress, [0, 1], [0, -15]);

  return {
    ref,
    scrollYProgress,
    ySlowUp,
    yMediumUp,
    yFastUp,
    ySlowDown,
    yMediumDown,
    scaleIn,
    scaleUp,
    fadeIn,
    fadeInOut,
    rotateSlowCW,
    rotateSlowCCW
  };
};

export const useScrollOpacity = (start: number = 0, end: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return { ref, opacity, scrollYProgress };
};
