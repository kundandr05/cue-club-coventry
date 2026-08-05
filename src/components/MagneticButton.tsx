"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // How far it pulls
}

export function MagneticButton({ children, strength = 30, className = "", ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // We disable magnetism on mobile to prevent weird touch behaviors
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Magnetic pull using GSAP
      gsap.to(button, {
        x: (distX / width) * strength,
        y: (distY / height) * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)", // bouncy snap back
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center transition-colors group ${className}`}
      {...props}
    >
      {/* Optional: Add a subtle glow/fill behind the button on hover */}
      <span className="absolute inset-0 bg-color-accent-gold/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}
