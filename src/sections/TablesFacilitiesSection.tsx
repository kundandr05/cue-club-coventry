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
      className="relative w-full min-h-[400vh] flex flex-col bg-transparent"
    >
      {/* 3D View Portal */}
      <div className="sticky top-0 w-full h-screen z-0 overflow-hidden">
        <View className="w-full h-full pointer-events-none">
          <Suspense fallback={null}>
            <FacilitiesScene />
          </Suspense>
        </View>
      </div>

      {/* DOM Overlay: Narrative Typography synced to the pan */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        
        {/* The Pull Back (Pool Table) */}
        <div className="h-screen w-full flex items-center justify-start px-6 lg:px-24">
          <div className="max-w-xl facility-text opacity-0 pointer-events-auto backdrop-blur-2xl bg-black/20 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-color-accent-gold mb-4">
              The Tables
            </h2>
            <p className="text-xl md:text-3xl font-medium leading-tight text-color-primary-white">
              Step back and take it all in. Professional-grade slates, competition felt, and uncompromised precision in every bay.
            </p>
          </div>
        </div>

        {/* The Pan (Snooker Table) */}
        <div className="h-[150vh] w-full flex items-center justify-end px-6 lg:px-24 text-right pt-[25vh]">
          <div className="max-w-2xl facility-text opacity-0 pointer-events-auto backdrop-blur-2xl bg-black/20 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-color-accent-gold mb-4">
              The Snooker Room
            </h2>
            <p className="text-xl md:text-3xl font-medium leading-tight text-color-primary-white">
              The purist&apos;s game. Full-size tables bathed in focused illumination, waiting for centuries to be built.
            </p>
          </div>
        </div>

        {/* The Lounge (Bar and Seating) */}
        <div className="h-[150vh] w-full flex items-center justify-start px-6 lg:px-24 pt-[25vh]">
          <div className="max-w-xl facility-text opacity-0 pointer-events-auto backdrop-blur-2xl bg-black/20 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-color-accent-gold mb-4">
              The Lounge
            </h2>
            <p className="text-xl md:text-3xl font-medium leading-tight text-color-primary-white">
              Between frames, the experience continues. Crafted cocktails, premium seating, and the unmistakable hum of competition.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
