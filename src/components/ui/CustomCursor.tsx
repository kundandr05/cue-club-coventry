"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: "none" });
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.5, ease: "power3.out" });
    };

    const onEnterLink = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const data = el.getAttribute("data-cursor");
      setLabel(data || "");
      gsap.to(cursor, { scale: data ? 2.5 : 1.8, opacity: 0.9, duration: 0.3, ease: "power2.out" });
    };

    const onLeaveLink = () => {
      setLabel("");
      gsap.to(cursor, { scale: 1, opacity: 0.5, duration: 0.3, ease: "power2.out" });
    };

    const onDown = () => gsap.to([cursor, dot], { scale: 0.7, duration: 0.15 });
    const onUp   = () => gsap.to([cursor, dot], { scale: 1,   duration: 0.15 });

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
    <>
      {/* Large ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ opacity: 0.5 }}
      >
        <div className="w-10 h-10 rounded-full border border-brass flex items-center justify-center">
          {label && (
            <span className="font-mono text-[8px] text-brass tracking-widest uppercase whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      </div>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brass"
      />
    </>
  );
}
