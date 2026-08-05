"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/layout/Loader";
import { HeroTableScene } from "@/three/scenes/HeroTableScene";
import gsap from "gsap";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Staggered reveal of the headline once loaded
  useEffect(() => {
    if (loaded && titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word');
      
      gsap.fromTo(words, 
        { 
          y: 50, 
          opacity: 0,
          rotateX: 45
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.5 // Wait for the Break animation to finish
        }
      );
    }
  }, [loaded]);

  return (
    <main className="w-full min-h-screen bg-ink relative overflow-hidden">
      <Loader onLoaded={() => setLoaded(true)} />

      {/* R3F Canvas Layer */}
      <HeroTableScene loaded={loaded} />

      {/* DOM Content Layer */}
      <div className="relative z-10 w-full h-screen flex flex-col justify-end p-8 md:p-16 pointer-events-none">
        
        <h1 
          ref={titleRef}
          className="font-display text-4xl md:text-7xl lg:text-9xl tracking-tighter leading-none text-porcelain max-w-4xl uppercase mix-blend-difference"
        >
          <span className="word inline-block origin-bottom mr-4">Coventry&apos;s</span>
          <span className="word inline-block origin-bottom mr-4">Home</span>
          <span className="word inline-block origin-bottom mr-4">For</span>
          <br />
          <span className="word inline-block origin-bottom mr-4 text-brass">Pool,</span>
          <span className="word inline-block origin-bottom mr-4 text-brass">Snooker,</span>
          <br />
          <span className="word inline-block origin-bottom mr-4">Darts</span>
          <span className="word inline-block origin-bottom mr-4">&</span>
          <span className="word inline-block origin-bottom mr-4">Poker.</span>
        </h1>

        <div className="mt-8 flex items-center space-x-4 opacity-50">
          <div className="w-6 h-6 border-2 border-porcelain rounded-sm animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest">Scroll to explore</span>
        </div>
      </div>
    </main>
  );
}
