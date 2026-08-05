"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/fadeUp";
import HeroScene from "@/three/HeroScene";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { useStore } from "@/store/useStore";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  const isAppLoaded = useStore((state) => state.isAppLoaded);

  useEffect(() => {
    // Staggered fade up for text elements only AFTER the app has fully loaded (Loader dissolves)
    if (isAppLoaded && textRef.current) {
      const elements = textRef.current.querySelectorAll(".hero-text");
      fadeUp(elements as unknown as Element[], {
        stagger: 0.2,
        delay: 0.2, // Small delay after loader vanishes
      });
    }
  }, [isAppLoaded]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      
      {/* 
        The View acts as a portal to the GlobalCanvas.
        It takes up the entire screen here, rendering HeroScene in the background.
      */}
      <div className="absolute inset-0 z-0">
        <View className="w-full h-full">
          <HeroScene />
        </View>
      </div>

      {/* DOM Overlay - Content */}
      <div 
        ref={textRef} 
        className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center justify-end text-center pb-24 h-full pointer-events-none"
      >
        <div className="hero-text opacity-0 backdrop-blur-md bg-white/40 p-6 rounded-2xl border border-black/5 shadow-lg flex flex-col items-center pointer-events-auto">
          <p className="uppercase tracking-[0.4em] text-color-accent-gold text-[10px] md:text-xs font-medium mb-4">
            The Next Generation of Billiards
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[0.9]">
            Cue Club <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary-white to-color-secondary-white">
              Coventry
            </span>
          </h1>
          
          <MagneticButton
            strength={30}
            className="group relative flex items-center gap-4 bg-black/5 backdrop-blur-lg border border-black/10 text-color-primary-white px-6 py-3 rounded-full font-medium overflow-hidden transition-all hover:bg-color-accent-gold hover:border-color-accent-gold hover:text-white"
          >
            <span className="text-sm">Book a Table</span>
            <span className="bg-black/5 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-3 h-3" />
            </span>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-40">
        <span className="text-[10px] uppercase tracking-[0.3em] text-color-secondary-white">Scroll to explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-color-secondary-white to-transparent" />
      </div>
    </section>
  );
}
