"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FACILITIES = [
  {
    title: "Simonis 860 Cloth",
    spec: "Worst-spun Tournament Baize",
    desc: "Engineered in Belgium for ultra-fast, true ball roll without pilling or resistance.",
    icon: "🟢",
  },
  {
    title: "Heated Italian Slate",
    spec: "Precision-ground 45mm Slate",
    desc: "Thermologically stabilized slate bed eliminates humidity variance for consistent speed.",
    icon: "🪨",
  },
  {
    title: "Aramith Super Pro Balls",
    spec: "Phenolic Resin Precision",
    desc: "Perfect density and balance for crisp cue ball response and predictable deflection.",
    icon: "🎱",
  },
  {
    title: "Match-Grade Lighting",
    spec: "5000K Flicker-Free LED Rigs",
    desc: "Overhead canopy diffusers cast zero shadows across cushions and pocket entries.",
    icon: "💡",
  },
];

export function TablesFacilities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".facility-card");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section
      id="tables-section"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-20 py-24 pointer-events-auto"
    >
      <span className="font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase mb-4 block">
        02 — Specifications
      </span>

      <div className="max-w-3xl mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-6 h-[1px] bg-brass" />
          <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">
            Equipment & Technology
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-porcelain uppercase tracking-tight">
          Tables & Facilities
        </h2>
        <p className="text-smoke text-sm md:text-base font-light mt-3">
          Every table at Cue Club Coventry is maintained to tournament standards for players who value precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full">
        {FACILITIES.map((item, index) => (
          <div
            key={index}
            className="facility-card bg-black/80 backdrop-blur-md border border-white/10 hover:border-brass/50 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-brass/5"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <div className="font-mono text-[10px] text-brass tracking-wider uppercase mb-1">
              {item.spec}
            </div>
            <h3 className="font-display text-lg text-porcelain uppercase mb-2">
              {item.title}
            </h3>
            <p className="text-smoke text-xs font-light leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
