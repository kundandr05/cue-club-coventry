"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/layout/Loader";
import { HeroTableScene } from "@/three/scenes/HeroTableScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  // Scroll animations for DOM elements
  useEffect(() => {
    if (loaded && titleRef.current) {
      // Fade out hero text on scroll
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Fade in about text on scroll
      gsap.fromTo("#about-text",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#about-section",
            start: "top center",
            end: "center center",
            scrub: true,
          }
        }
      );
    }
  }, [loaded]);

  return (
    <main className="w-full bg-ink relative text-porcelain">
      <Loader onLoaded={() => setLoaded(true)} />

      {/* R3F Canvas Layer (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroTableScene loaded={loaded} />
      </div>

      {/* DOM Content Layer - Scrollable */}
      <div className="relative z-10 w-full">
        
        {/* Section 1: Hero */}
        <section id="hero-section" className="w-full h-screen flex flex-col justify-end p-8 md:p-16 pointer-events-none">
          <h1 
            ref={titleRef}
            className="font-display text-4xl md:text-7xl lg:text-9xl tracking-tighter leading-none max-w-4xl uppercase mix-blend-difference"
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
        </section>

        {/* Section 2: About Lounge */}
        <section id="about-section" className="w-full h-screen flex items-center p-8 md:p-16 pointer-events-none">
          <div id="about-text" className="max-w-2xl bg-ink/40 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <h2 className="font-display text-3xl md:text-5xl text-brass uppercase mb-6">
              A Heritage of Precision.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-smoke font-light">
              Experience the pinnacle of cue sports in Coventry. With premium, match-grade snooker tables, professional pool slates, and a meticulously crafted lounge atmosphere, Cue Club is designed for those who respect the game.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
