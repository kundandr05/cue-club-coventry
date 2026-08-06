"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2500);

    const st = ScrollTrigger.create({
      trigger: "#hero-section",
      start: "bottom 70%",
      onEnter: () => setShow(true),
      onLeaveBack: () => setShow(false),
    });

    return () => { clearTimeout(t); st.kill(); };
  }, []);

  return (
    <Link
      href="/booking"
      data-cursor="Book"
      className={`fixed bottom-6 right-6 z-30 flex items-center space-x-2 bg-brass text-ink font-display text-[10px] uppercase tracking-[0.2em] px-5 py-3 rounded-full shadow-2xl transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <span>Reserve Table</span>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );
}
