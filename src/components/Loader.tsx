"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useStore } from "@/store/useStore";

export function Loader() {
  const { progress, active, total, loaded } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    let timer: NodeJS.Timeout;

    const finishLoading = () => {
      timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
            useStore.getState().setAppLoaded(true);
          }
        });
      }, 500);
    };

    // If progress reaches 100
    if (progress === 100 && !active) {
      finishLoading();
      return () => clearTimeout(timer);
    }
    
    // Fallback: If after 2 seconds no assets are loading at all, force finish
    const fallbackTimer = setTimeout(() => {
      if (total === 0 && !active) {
        finishLoading();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [progress, active, total, loaded, mounted]);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-color-primary-black text-color-primary-white"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          CUE CLUB
        </h1>
        <div className="w-48 h-[1px] bg-white/20 mb-4 overflow-hidden">
          <div 
            className="h-full bg-color-accent-gold transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress, total === 0 ? 100 : 0)}%` }}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-color-accent-gold">
          {Math.floor(Math.max(progress, total === 0 ? 100 : 0))}%
        </p>
      </div>
    </div>
  );
}
