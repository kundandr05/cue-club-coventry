"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices structurally
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Fast tracking for the main dot
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    // Hover states for interactive elements
    const onMouseEnter = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "rgba(198, 168, 124, 0.2)",
        borderColor: "rgba(198, 168, 124, 1)",
        duration: 0.3,
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "rgba(255, 255, 255, 0.5)",
        duration: 0.3,
      });
    };

    const attachHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, input, [data-cursor='hover']"
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    
    // Initial attach
    attachHoverListeners();

    // Re-attach on DOM mutations (for lazy loaded/React dynamic content)
    const observer = new MutationObserver(() => {
      attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      const interactiveElements = document.querySelectorAll("a, button, input, [data-cursor='hover']");
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 rounded-full border border-white/50 bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    />
  );
}
