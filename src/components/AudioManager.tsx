"use client";

import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioManager() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Graceful fallback audio system. If the file is missing, it will just fail silently.
    const audio = new Audio("/audio/ambience.mp3");
    audio.loop = true;
    audio.volume = 0.3; // subtle
    audioRef.current = audio;

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // We do NOT auto-play on first interaction, we just unlock the context
        // and allow the user to toggle it manually via the UI.
        // Some awwwards sites auto-play after first click, but explicit toggle is better UX.
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Catch promise rejection if file is missing (404) to prevent console errors
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio file missing or blocked, failing gracefully.", e);
        setIsPlaying(false); // keep it off
      });
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-8 right-8 z-[9000] p-4 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-transparent transition-colors duration-300 pointer-events-auto"
      aria-label="Toggle Ambience"
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
