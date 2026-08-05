"use client";

import { useEffect, useRef, Suspense } from "react";
import { View } from "@react-three/drei";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { fadeUp } from "@/animations/fadeUp";
import { MagneticButton } from "@/components/MagneticButton";

const FinaleScene = dynamic(() => import("@/three/FinaleScene"), { ssr: false });

export default function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !fadeRef.current) return;

    // The physical screen fades to absolute black at the very end
    gsap.to(fadeRef.current, {
      opacity: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom 110%", // Triggers right at the bottom edge
        end: "bottom bottom",
        scrub: true,
      },
    });

    const revealElements = containerRef.current.querySelectorAll(".finale-element");
    revealElements.forEach((el) => {
      fadeUp(el, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });
  }, []);

  return (
    <section 
      id="contact-finale" 
      ref={containerRef}
      className="relative w-full min-h-[150vh] flex flex-col justify-end overflow-hidden bg-transparent"
    >
      {/* 3D View Portal (Sticky background) */}
      <div className="absolute inset-0 z-0">
        <View className="w-full h-full pointer-events-none">
          <Suspense fallback={null}>
            <FinaleScene />
          </Suspense>
        </View>
        
        {/* Soft vignette blending into the dark 3D scene */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        
        {/* The absolute black fade out at the very end */}
        <div ref={fadeRef} className="absolute inset-0 bg-black opacity-0 z-20 pointer-events-none" />
      </div>

      {/* Cinematic Outro / Contact Info */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24 pb-32">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32 border-t border-white/10 pt-16">
          
          {/* Location */}
          <div className="finale-element opacity-0">
            <h4 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-6">Location</h4>
            <p className="text-xl text-color-primary-white font-medium mb-2">Cue Club Coventry</p>
            <p className="text-gray-400">12 Precision Way<br />Coventry, CV1 2AB<br />United Kingdom</p>
          </div>

          {/* Contact & Hours */}
          <div className="finale-element opacity-0">
            <h4 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-6">Connect</h4>
            <a href="mailto:concierge@cueclub.com" className="block text-xl text-color-primary-white font-medium mb-2 hover:text-color-accent-gold transition-colors pointer-events-auto">
              concierge@cueclub.com
            </a>
            <a href="tel:+442412345678" className="block text-gray-400 mb-6 hover:text-white transition-colors pointer-events-auto">
              +44 24 1234 5678
            </a>
            <p className="text-gray-500 text-sm">Mon - Sun: 12:00 PM - 02:00 AM</p>
          </div>

          {/* Action */}
          <div className="finale-element opacity-0 flex flex-col items-start md:items-end text-left md:text-right">
            <h4 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-6">Experience</h4>
            <MagneticButton 
              strength={30}
              className="px-8 py-4 border border-white/20 text-white uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-transparent transition-all duration-300 mb-6 pointer-events-auto rounded-full"
            >
              Book a Table
            </MagneticButton>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors pointer-events-auto">IG</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors pointer-events-auto">X</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors pointer-events-auto">IN</a>
            </div>
          </div>

        </div>

        {/* The Final Logo Reveal */}
        <div className="finale-element opacity-0 text-center pt-32 pb-16">
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter text-white mb-8">
            CUE CLUB
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500">
            The Legacy Continues
          </p>
        </div>

      </div>
    </section>
  );
}
