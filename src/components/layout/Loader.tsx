"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function Loader({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(current);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && containerRef.current) {
      // Fade out the loader container smoothly to initiate 3D entrance walk-in & splash break
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.2,
        onComplete: () => {
          setVisible(false);
          onLoaded();
        }
      });
    }
  }, [progress, onLoaded]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-10 bg-ink text-porcelain select-none"
    >
      {/* Top Brand Tag */}
      <div className="w-full flex justify-between items-center font-mono text-[10px] text-smoke tracking-[0.3em] uppercase">
        <span>The Cue Club</span>
        <span>Coventry</span>
      </div>

      {/* Center Minimal Progress Counter & Cue Line */}
      <div className="flex flex-col items-center space-y-6 max-w-sm w-full">
        <div className="font-display text-5xl md:text-7xl text-brass tracking-tighter">
          {Math.round(progress)}<span className="text-xl md:text-3xl font-mono text-smoke">%</span>
        </div>
        
        {/* Sleek Brass Line Progress */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brass transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="font-mono text-[9px] text-smoke/70 uppercase tracking-[0.3em]">
          Entering Club Lounge...
        </span>
      </div>

      {/* Bottom Footer Info */}
      <div className="w-full flex justify-between items-center font-mono text-[9px] text-smoke/50 tracking-widest uppercase">
        <span>Est. 1994</span>
        <span>Precision & Heritage</span>
      </div>
    </div>
  );
}
