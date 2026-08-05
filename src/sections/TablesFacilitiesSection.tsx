"use client";

import { useEffect, useRef, Suspense } from "react";
import { View } from "@react-three/drei";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { fadeUp } from "@/animations/fadeUp";

// Lazy load the 3D geometry to prevent blocking the initial Hero bundle
const FacilitiesScene = dynamic(() => import("@/three/FacilitiesScene"), {
  ssr: false,
});

export default function TablesFacilitiesSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const textBlocks = containerRef.current.querySelectorAll(".facility-text");

    textBlocks.forEach((block) => {
      fadeUp(block, {
        duration: 1.2,
        scrollTrigger: {
          trigger: block,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play reverse play reverse",
        },
      });
    });
  }, []);

  return (
    <section 
      id="facilities" 
      ref={containerRef}
      className="relative w-full min-h-[400vh] flex flex-col overflow-hidden bg-color-primary-black"
    >
      {/* 3D View Portal */}
      <div className="sticky top-0 w-full h-screen z-0">
        <View className="w-full h-full pointer-events-none">
          <Suspense fallback={null}>
            <FacilitiesScene />
          </Suspense>
        </View>
        
        {/* Soft fade gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-color-primary-black via-transparent to-color-primary-black opacity-80 pointer-events-none" />
      </div>

      {/* DOM Overlay: Narrative Typography synced to the pan */}
      <div className="relative z-10 w-full -mt-[100vh]">
        
        {/* The Pull Back (Pool Table) */}
        <div className="h-screen flex items-center justify-start px-6 lg:px-24">
          <div className="max-w-xl facility-text opacity-0">
            <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
              The Tables
            </h2>
            <p className="text-2xl md:text-4xl font-medium leading-tight text-color-primary-white">
              Step back and take it all in. Professional-grade slates, competition felt, and uncompromised precision in every bay.
            </p>
          </div>
        </div>

        {/* The Pan (Snooker Table) */}
        <div className="h-[150vh] flex items-center justify-end px-6 lg:px-24 text-right pt-[50vh]">
          <div className="max-w-2xl facility-text opacity-0">
            <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
              The Snooker Room
            </h2>
            <p className="text-2xl md:text-4xl font-medium leading-tight text-color-primary-white">
              The purist's game. Full-size tables bathed in focused illumination, waiting for centuries to be built.
            </p>
          </div>
        </div>

        {/* The Lounge (Bar and Seating) */}
        <div className="h-[150vh] flex items-center justify-start px-6 lg:px-24">
          <div className="max-w-xl facility-text opacity-0">
            <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
              The Lounge
            </h2>
            <p className="text-2xl md:text-4xl font-medium leading-tight text-color-primary-white">
              Between frames, the experience continues. Crafted cocktails, premium seating, and the unmistakable hum of competition.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
