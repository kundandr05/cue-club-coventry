"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.15, ease: "power2.out" });
    };

    const onEnterLink = () => {
      gsap.to(dot, { scale: 2.5, backgroundColor: "#C9A15A", duration: 0.25, ease: "power2.out" });
    };

    const onLeaveLink = () => {
      gsap.to(dot, { scale: 1, backgroundColor: "#C9A15A", duration: 0.25, ease: "power2.out" });
    };

    const onDown = () => gsap.to(dot, { scale: 0.6, duration: 0.15 });
    const onUp   = () => gsap.to(dot, { scale: 1, duration: 0.15 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach(el => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      interactives.forEach(el => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brass shadow-[0_0_10px_rgba(201,161,90,0.8)]"
    />
  );
}
