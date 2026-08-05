"use client";

import { useEffect, useRef, Suspense } from "react";
import { View } from "@react-three/drei";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { fadeUp } from "@/animations/fadeUp";

const PricingScene = dynamic(() => import("@/three/PricingScene"), {
  ssr: false,
});

export default function PricingSection() {
  const containerRef = useRef<HTMLElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !blurRef.current) return;

    // Gradually increase the backdrop blur as the user scrolls down into the pricing section
    gsap.fromTo(
      blurRef.current,
      { backdropFilter: "blur(0px)", backgroundColor: "rgba(10, 10, 10, 0)" },
      {
        backdropFilter: "blur(24px)",
        backgroundColor: "rgba(10, 10, 10, 0.6)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%", // start blurring when section is halfway up
          end: "top top", // fully blurred when section hits the top
          scrub: true,
        },
      }
    );

    // Fade up text elements
    const textBlocks = containerRef.current.querySelectorAll(".pricing-element");
    textBlocks.forEach((block) => {
      fadeUp(block, {
        duration: 1.2,
        scrollTrigger: {
          trigger: block,
          start: "top 80%",
        },
      });
    });
  }, []);

  return (
    <section 
      id="pricing" 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center py-32 overflow-hidden bg-transparent"
    >
      {/* 3D View Portal (Sticky background) */}
      <div className="absolute inset-0 z-0">
        <View className="w-full h-full pointer-events-none">
          <Suspense fallback={null}>
            <PricingScene />
          </Suspense>
        </View>
        
        {/* The dynamic cinematic Depth of Field blur layer */}
        <div ref={blurRef} className="absolute inset-0 z-10 pointer-events-none" />
      </div>

      {/* DOM Overlay: Premium Membership Panels */}
      <div className="relative z-20 w-full max-w-7xl px-6 lg:px-24">
        
        <div className="text-center mb-24 pricing-element opacity-0">
          <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
            Membership
          </h2>
          <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-color-primary-white">
            Join the Legacy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Tier 1 */}
          <motion.div 
            className="group relative border border-white/10 bg-black/40 backdrop-blur-md p-10 overflow-hidden pricing-element opacity-0"
            whileHover={{ y: -10, borderColor: "rgba(198, 168, 124, 0.5)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-color-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h4 className="text-2xl font-bold text-color-primary-white mb-2">Club Access</h4>
            <p className="text-color-accent-gold mb-8">£45 / Month</p>
            
            <ul className="space-y-4 mb-12 text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Priority table reservations
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Lounge & Bar access
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Monthly guest passes (2)
              </li>
            </ul>
            
            <button className="w-full py-4 border border-white/20 text-white uppercase tracking-widest text-sm group-hover:bg-color-accent-gold group-hover:text-black group-hover:border-transparent transition-all duration-300">
              Apply Now
            </button>
          </motion.div>

          {/* Tier 2 */}
          <motion.div 
            className="group relative border border-color-accent-gold/30 bg-color-accent-gold/5 backdrop-blur-md p-10 overflow-hidden pricing-element opacity-0"
            whileHover={{ y: -10, borderColor: "rgba(198, 168, 124, 1)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-color-accent-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-0 right-0 bg-color-accent-gold text-black text-xs font-bold uppercase tracking-widest px-4 py-1">
              Limited
            </div>

            <h4 className="text-2xl font-bold text-color-primary-white mb-2">The Century</h4>
            <p className="text-color-accent-gold mb-8">£120 / Month</p>
            
            <ul className="space-y-4 mb-12 text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Unlimited table time
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Private cue locker
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Tournament entry included
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-color-accent-gold" />
                Concierge service
              </li>
            </ul>
            
            <button className="w-full py-4 bg-color-accent-gold text-black uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-colors duration-300">
              Request Invitation
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
