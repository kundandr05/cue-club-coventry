"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import AboutScene from "@/three/AboutScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get all narrative text blocks
    const textBlocks = containerRef.current.querySelectorAll(".about-text");

    // Fade up each block as it enters the viewport
    textBlocks.forEach((block) => {
      gsap.fromTo(
        block,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%", // triggers when top of block hits 80% down viewport
            end: "bottom 20%",
            toggleActions: "play reverse play reverse", // Fade out when leaving
          },
        }
      );
    });
  }, []);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* 3D View Portal fixed within this section */}
      <div className="sticky top-0 w-full h-screen z-0">
        <View className="w-full h-full pointer-events-none">
          <AboutScene />
        </View>
        
        {/* Subtle vignette overlay to blend edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-color-primary-black pointer-events-none" />
      </div>

      {/* Narrative Storytelling Content (scrolls normally over the sticky background) */}
      <div className="relative z-10 w-full">
        {/* Block 1 */}
        <div className="h-screen flex items-center justify-start px-6 lg:px-24">
          <div className="max-w-2xl about-text opacity-0 backdrop-blur-xl bg-black/30 border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-color-accent-gold mb-6">
              The Atmosphere
            </h2>
            <p className="text-xl md:text-3xl leading-relaxed text-color-primary-white">
              Step into a space where time slows down. A sanctuary built for those who understand that the perfect break requires more than just precision—it demands atmosphere.
            </p>
          </div>
        </div>

        {/* Block 2 */}
        <div className="h-screen flex items-center justify-end px-6 lg:px-24 text-right">
          <div className="max-w-2xl about-text opacity-0 backdrop-blur-xl bg-black/30 border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-color-accent-gold mb-6">
              The Craftsmanship
            </h2>
            <p className="text-xl md:text-3xl leading-relaxed text-color-primary-white">
              Every table engineered for flawless roll. Every cue balanced for the decisive strike. We have obsessed over the details so you can obsess over the game.
            </p>
          </div>
        </div>

        {/* Block 3 */}
        <div className="h-[50vh] flex items-center justify-center px-6 lg:px-24 text-center">
          <div className="max-w-3xl about-text opacity-0">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-color-primary-white mb-6">
              Welcome to the Club.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
