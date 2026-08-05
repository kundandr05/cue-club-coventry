"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.fromTo(
      barRef.current,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className="fixed right-6 top-1/4 h-1/2 w-[1px] bg-white/10 z-30 pointer-events-none overflow-hidden">
      <div
        ref={barRef}
        className="w-full bg-brass"
        style={{ height: "0%" }}
      />
    </div>
  );
}

