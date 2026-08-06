"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SoundToggleProps {
  playStrike?: boolean; // external trigger: play crack on cue strike
}

export function SoundToggle({ playStrike }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const strikeRef = useRef<HTMLAudioElement | null>(null);
  const strikeFired = useRef(false);

  // Show button after 2s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Initialise audio elements once
  useEffect(() => {
    // Use Web Audio API oscillator to synthesize sounds — no external files needed
    // We use a silent audio hack so autoplay is allowed once user clicks
    ambientRef.current = new Audio();
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0;

    strikeRef.current = new Audio();
    strikeRef.current.volume = 0.7;
  }, []);

  // Synthesize a cue-strike crack sound via Web Audio API
  const playCrack = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      // High-pass filter for crack character
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch {
      // Ignore AudioContext errors silently
    }
  }, []);

  // Synthesize a gentle ambient hum / pool-hall ambience
  const startAmbient = useCallback(() => {
    try {
      const ctx = new AudioContext();
      // Low rumble oscillator
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 60;
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      // Store ctx reference for cleanup
      (ambientRef.current as unknown as { _ctx: AudioContext; _osc: OscillatorNode; _gain: GainNode })._ctx = ctx;
      (ambientRef.current as unknown as { _osc: OscillatorNode })._osc = osc;
      (ambientRef.current as unknown as { _gain: GainNode })._gain = gain;
    } catch {
      // Ignore AudioContext errors silently
    }
  }, []);

  const stopAmbient = useCallback(() => {
    try {
      const ref = ambientRef.current as unknown as { _ctx: AudioContext };
      if (ref?._ctx) ref._ctx.close();
    } catch {
      // Ignore AudioContext errors silently
    }
  }, []);

  // React to enabled toggle
  useEffect(() => {
    if (enabled) {
      startAmbient();
    } else {
      stopAmbient();
    }
  }, [enabled, startAmbient, stopAmbient]);

  // React to external playStrike trigger
  useEffect(() => {
    if (playStrike && enabled && !strikeFired.current) {
      strikeFired.current = true;
      playCrack();
    }
  }, [playStrike, enabled, playCrack]);

  return (
    <button
      id="sound-toggle"
      onClick={() => setEnabled(v => !v)}
      title={enabled ? "Mute sounds" : "Enable sounds"}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      className={`
        fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full
        flex items-center justify-center
        border transition-all duration-500 backdrop-blur-md
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        ${enabled
          ? "border-brass/70 bg-brass/20 text-brass"
          : "border-white/20 bg-black/40 text-smoke hover:border-brass/40 hover:text-porcelain"
        }
      `}
    >
      {enabled ? (
        /* Sound ON icon */
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9 9l-3 3 3 3" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
      ) : (
        /* Sound OFF icon */
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}
    </button>
  );
}
