"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/fadeUp";
import HeroScene from "@/three/HeroScene";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered fade up for text elements
    if (textRef.current) {
      const elements = textRef.current.querySelectorAll(".hero-text");
      fadeUp(elements as unknown as Element[], {
        stagger: 0.2,
        delay: 0.5, // Wait for initial 3D table load to start
      });
    }
  }, []);

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
        className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center mt-32 pointer-events-none"
      >
        <p className="hero-text opacity-0 uppercase tracking-[0.2em] text-color-accent-gold text-sm font-medium mb-6">
          The Next Generation of Billiards
        </p>
        
        <h1 className="hero-text opacity-0 text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Cue Club <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-color-primary-white to-color-secondary-white">
            Coventry
          </span>
        </h1>
        
        <p className="hero-text opacity-0 text-color-secondary-white max-w-xl text-lg md:text-xl mb-12">
          Experience a cinematic, Awwwards-quality environment designed for the modern player. Luxury, precision, and atmosphere combined.
        </p>
        
        {/* CTA Button needs pointer-events-auto so it can be clicked */}
        <div className="hero-text opacity-0 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-4 bg-color-primary-white text-color-primary-black px-8 py-4 rounded-full font-medium overflow-hidden transition-colors hover:bg-color-accent-gold hover:text-white"
          >
            <span>Book a Table</span>
            <span className="bg-color-primary-black/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-50">
        <span className="text-xs uppercase tracking-widest text-color-secondary-white">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-color-secondary-white to-transparent" />
      </div>
    </section>
  );
}
