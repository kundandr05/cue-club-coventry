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
      <div className="sticky top-0 w-full h-screen z-0 bg-transparent">
        <View className="w-full h-full pointer-events-none">
          <AboutScene />
        </View>
        
        {/* Extremely subtle vignette so the glassmorphism pops, but NO black background that causes a seam */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Narrative Storytelling Content (scrolls normally over the sticky background) */}
      <div className="relative z-10 w-full">
        {/* Block 1 */}
        <div className="h-screen flex items-center justify-start px-6 lg:px-24">
          <div className="max-w-xl about-text opacity-0 backdrop-blur-md bg-white/60 border border-black/5 p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-color-accent-gold mb-4">
              Our Heritage
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-color-primary-white font-medium">
              We didn&apos;t just build a room; we built a sanctuary. A place where the outside world fades, leaving only the sound of the break and the quiet focus of competition.
            </p>
          </div>
        </div>

        {/* Block 2 */}
        <div className="h-[150vh] flex items-center justify-end px-6 lg:px-24 text-right pt-[25vh]">
          <div className="max-w-xl about-text opacity-0 backdrop-blur-md bg-white/60 border border-black/5 p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-color-accent-gold mb-4">
              The Craftsmanship
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-color-primary-white font-medium">
              Professional-grade slates resting on polished marble. Custom lighting designed to eliminate shadows. Every detail has been obsessively engineered for the purist.
            </p>
          </div>
        </div>

        {/* Block 3 */}
        <div className="h-[150vh] flex items-center justify-start px-6 lg:px-24 pt-[25vh]">
          <div className="max-w-xl about-text opacity-0 backdrop-blur-md bg-white/60 border border-black/5 p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium text-color-accent-gold mb-4">
              The Community
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-color-primary-white font-medium">
              Between frames, the experience continues. Sink into the Chesterfield leather. Order from the premium bar. This is your club.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
