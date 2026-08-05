"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#hero-section",
      start: "bottom 60%",
      onEnter: () => setShow(true),
      onLeaveBack: () => setShow(false),
    });
  }, []);

  return (
    <a
      href="#booking-section"
      data-cursor="Book"
      className={`fixed bottom-8 right-8 z-30 flex items-center space-x-3 bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full shadow-2xl transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <span>Reserve a Table</span>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  );
}
