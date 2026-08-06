"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/layout/Loader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import { Gallery } from "@/components/sections/Gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASINGS, DURATIONS } from "@/utils/easings";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dynamically import 3D scene (client-side only)
const HeroTableScene = dynamic(
  () => import("@/three/scenes/HeroTableScene").then(m => ({ default: m.HeroTableScene })),
  { ssr: false }
);

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ visible }: { visible: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "About",      href: "#about-section" },
    { label: "Booking",    href: "#booking-section" },
    { label: "Membership", href: "#membership-section" },
    { label: "Contact",    href: "#footer-section" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="flex justify-between items-center px-6 md:px-16 py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">

        {/* Logo */}
        <a href="#hero-section" className="font-display text-brass text-xs tracking-[0.3em] uppercase">
          The Cue Club
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className="font-mono text-[10px] text-smoke hover:text-porcelain tracking-[0.2em] uppercase transition-colors duration-300">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop location */}
        <div className="hidden md:block font-mono text-[10px] text-smoke/60 tracking-widest uppercase">
          Coventry, UK
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden flex flex-col space-y-1.5 p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-500 overflow-hidden ${mobileOpen ? "max-h-64 py-6" : "max-h-0"}`}>
        <div className="flex flex-col space-y-4 px-6">
          {links.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-sm text-porcelain uppercase tracking-widest hover:text-brass transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// BOOKING FORM
// ─────────────────────────────────────────────
function BookingForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("→ Sending to Zapier/Make webhook:", data);
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full border border-brass flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl text-porcelain mb-2">Confirmed.</h3>
        <p className="text-smoke text-sm font-light">Your table is secured. See you at the club.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Full Name</label>
        <input required name="name" type="text" placeholder="John Doe"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Date</label>
          <input required name="date" type="date"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors" />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Time</label>
          <input required name="time" type="time"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Table</label>
        <select required name="type"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors appearance-none">
          <option value="pool">Professional Pool Slate</option>
          <option value="snooker">Full-Size Snooker</option>
        </select>
      </div>
      <button disabled={status === "submitting"} type="submit"
        className="w-full bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-4 rounded-lg hover:bg-brass/90 transition-all duration-300 disabled:opacity-50">
        {status === "submitting" ? "Processing..." : "Reserve Table"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// MOBILE BACKGROUND — Pure CSS, zero WebGL lag
// ─────────────────────────────────────────────
const MOBILE_BALLS = [
  { top: "47%", left: "28%",  color: "#F5C518", highlight: "#FFF176", number: "1",  size: 28 },
  { top: "53%", left: "58%",  color: "#B71C1C", highlight: "#EF9A9A", number: "3",  size: 26 },
  { top: "44%", left: "48%",  color: "#0A0A0A", highlight: "#616161", number: "8",  size: 30 },
  { top: "50%", left: "38%",  color: "#1565C0", highlight: "#90CAF9", number: "2",  size: 26 },
  { top: "57%", left: "44%",  color: "#6A1B9A", highlight: "#CE93D8", number: "4",  size: 24 },
  { top: "43%", left: "62%",  color: "#1B5E20", highlight: "#A5D6A7", number: "6",  size: 26 },
  { top: "56%", left: "68%",  color: "#E65100", highlight: "#FFCC80", number: "5",  size: 24 },
  { top: "41%", left: "35%",  color: "#F5F3EE", highlight: "#FFFFFF", number: "",  size: 22 },
];

function MobileBg({ loaded }: { loaded: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#060e09" }}>

      {/* Felt table glow */}
      <div className="absolute" style={{
        inset: 0,
        background: "radial-gradient(ellipse 120% 55% at 50% 60%, rgba(11,61,46,0.85) 0%, rgba(6,14,9,0) 70%)",
        animation: loaded ? "mobileFeltPulse 4s ease-in-out infinite" : "none",
      }} />

      {/* Overhead spotlight beam */}
      <div className="absolute left-1/2" style={{
        top: "8%", width: "2px", height: "38%",
        background: "linear-gradient(to bottom, rgba(201,161,90,0.6), transparent)",
        filter: "blur(6px)", transform: "translateX(-50%)",
      }} />
      <div className="absolute left-1/2" style={{
        top: "8%", width: "240px", height: "240px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,161,90,0.14) 0%, transparent 70%)",
        filter: "blur(22px)", transform: "translateX(-50%)",
      }} />

      {/* Pool table surface */}
      <div className="absolute left-1/2" style={{
        top: "40%", width: "90vw", maxWidth: "400px", height: "170px",
        background: "rgba(11,61,46,0.6)",
        border: "1px solid rgba(201,161,90,0.2)",
        borderRadius: "6px",
        boxShadow: "0 0 40px rgba(11,61,46,0.6), 0 0 80px rgba(11,61,46,0.3)",
        transform: "translateX(-50%)",
        animation: loaded ? "mobileTableGlow 3s ease-in-out infinite" : "none",
      }}>
        {/* Rails */}
        <div style={{ position:"absolute", inset:0, border:"8px solid rgba(8,30,18,0.8)", borderRadius:"6px" }} />
        {/* Centre spot */}
        <div style={{ position:"absolute", left:"50%", top:"50%", width:6, height:6,
          borderRadius:"50%", background:"rgba(201,161,90,0.4)", transform:"translate(-50%,-50%)" }} />
      </div>

      {/* 3D Billiard balls */}
      {MOBILE_BALLS.map((b, i) => (
        <div key={i} className="absolute" style={{
          top: b.top, left: b.left,
          width: b.size, height: b.size,
          borderRadius: "50%",
          // 3D sphere effect via radial gradient
          background: `radial-gradient(circle at 35% 32%, ${b.highlight} 0%, ${b.color} 52%, rgba(0,0,0,0.6) 100%)`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.4), 0 0 8px ${b.color}55`,
          animation: loaded
            ? `mobileBallFloat ${2.4 + i * 0.25}s ease-in-out ${i * 0.18}s infinite`
            : "none",
          opacity: loaded ? 1 : 0,
          transition: `opacity 0.6s ease ${i * 0.1}s`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Ball number */}
          {b.number && (
            <span style={{
              fontSize: b.size * 0.38,
              fontWeight: 700,
              color: b.color === "#0A0A0A" ? "#ffffff" : "rgba(0,0,0,0.75)",
              lineHeight: 1,
              userSelect: "none",
              fontFamily: "sans-serif",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}>{b.number}</span>
          )}
        </div>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.88) 100%)",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const soundFired = useRef(false);
  const reducedMotion = useReducedMotion();

  // ── FIX: Always start from top on refresh ───────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // ── AUTO SOUND: fires on first user touch/click (browser policy safe) ─
  useEffect(() => {
    if (isMobile || reducedMotion) return; // sound on desktop only
    const handleFirstInteraction = () => {
      if (soundFired.current) return;
      soundFired.current = true;
      // Remove listener immediately
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      // Play crack sound after the 3D cue strike moment
      const delay = loaded ? 0 : 1400;
      setTimeout(() => {
        try {
          const ctx = new AudioContext();
          const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.15), ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 800;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(1.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
          src.start();
        } catch { /* silently ignore */ }
      }, delay);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isMobile, loaded, reducedMotion]);

  // Check mobile device on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loaded || !titleRef.current) return;

    // Reduced motion: zero delay, instant opacity
    const textDelay = reducedMotion ? 0 : isMobile ? 0.8 : 3.2;
    const navDelay  = reducedMotion ? 0 : isMobile ? 0.6 : 3.0;
    const hintDelay = reducedMotion ? 0 : isMobile ? 1.5 : 4.0;
    const dur       = reducedMotion ? 0.1 : DURATIONS.signature;

    const words = titleRef.current.querySelectorAll(".word");
    gsap.fromTo(words,
      { y: 80, opacity: 0, rotateX: 60 },
      { y: 0, opacity: 1, rotateX: 0, duration: DURATIONS.signature, stagger: 0.08,
        ease: EASINGS.settleGsap, delay: textDelay, transformOrigin: "bottom center" }
    );

    // Sound + spotlight only on desktop
    if (!isMobile) {
      setTimeout(() => {
        if (titleRef.current) titleRef.current.classList.add("spotlight-sweep");
      }, 5000);
    }

    gsap.fromTo("#navbar-el", { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: EASINGS.settleGsap, delay: navDelay });
    gsap.fromTo("#scroll-hint", { opacity: 0 },
      { opacity: 0.6, duration: 1.0, ease: EASINGS.settleGsap, delay: hintDelay });

    // ScrollTrigger animations (same for all)
    gsap.to(titleRef.current, {
      opacity: 0, y: -60,
      scrollTrigger: { trigger: "#hero-section", start: "40% top", end: "bottom top", scrub: 1 }
    });
    gsap.fromTo("#about-text", { opacity: 0, y: 50 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: "#about-section", start: "top 80%", end: "top 30%", scrub: 1 } }
    );
    gsap.fromTo("#booking-card", { opacity: 0, y: 50 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: "#booking-section", start: "top 80%", end: "top 30%", scrub: 1 } }
    );
    gsap.fromTo("#membership-content", { opacity: 0, y: 50 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: "#membership-section", start: "top 80%", end: "top 30%", scrub: 1 } }
    );
    gsap.fromTo("#footer-title", { opacity: 0.1, y: 40 },
      { opacity: 0.85, y: 0, scrollTrigger: { trigger: "#footer-section", start: "top 80%", end: "top 20%", scrub: 1 } }
    );
  }, [loaded, isMobile]);

  return (
    <main className="w-full bg-ink text-porcelain min-h-screen">

      {/* ── BACKGROUND ───────────────────────────────────────────────────
          Desktop: Full 3D WebGL canvas (pre-warmed behind loader)
          Mobile:  Pure CSS background — zero WebGL, zero lag            */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {!isMobile
          ? <HeroTableScene loaded={loaded} />
          : <MobileBg loaded={loaded} />
        }
      </div>

      {/* Loader overlay (z-50) */}
      <Loader onLoaded={() => setLoaded(true)} />

      {/* Custom Cursor & Scroll Progress (Desktop only) */}
      {loaded && !isMobile && <CustomCursor />}
      {loaded && !isMobile && <ScrollProgress />}

      {/* Floating CTA */}
      {loaded && <FloatingCTA />}

      {/* Navbar */}
      <div id="navbar-el" style={{ opacity: 0 }}>
        <Navbar visible={loaded} />
      </div>

      {/* Scrollable DOM Content */}
      <div className="relative z-10 w-full">

        {/* ══ HERO ══ */}
        <section id="hero-section" className="relative w-full min-h-screen flex flex-col justify-end px-6 md:px-20 pb-16 md:pb-20 pt-24 pointer-events-none">
          <div className="mb-3">
            <span className="font-mono text-[10px] text-brass tracking-[0.4em] uppercase">Est. Coventry — Since 1994</span>
          </div>

          <h1 ref={titleRef}
            className="font-display text-[clamp(2.5rem,10vw,110px)] leading-[0.88] tracking-tighter max-w-4xl uppercase">
            <span className="word inline-block opacity-0 mr-2">Coventry&apos;s</span><br />
            <span className="word inline-block opacity-0 mr-2">Finest</span>
            <span className="word inline-block opacity-0 mr-2 text-brass">Cue</span>
            <span className="word inline-block opacity-0">Club.</span>
          </h1>

          {/* Rolling ball CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-4 pointer-events-auto">
            <a href="#booking-section"
              className="rolling-btn group relative overflow-hidden inline-flex items-center gap-3 bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] px-7 py-4 rounded-xl hover:bg-brass/90 transition-all duration-300">
              <span className="ball-roll">🎱</span>
              <span>Book a Table</span>
            </a>
            <a href="#about-section"
              className="inline-flex items-center gap-3 border border-white/20 hover:border-brass/60 text-smoke hover:text-porcelain font-mono text-[10px] uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm bg-black/30">
              <span>Discover the Club</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>

          <div id="scroll-hint" className="mt-6 flex items-center space-x-4 opacity-0">
            <div className="w-8 h-[1px] bg-brass" />
            <span className="font-mono text-[10px] text-smoke tracking-[0.3em] uppercase">Scroll to enter</span>
          </div>
        </section>

        {/* ══ ABOUT ══ */}
        <section id="about-section" className="relative w-full min-h-screen flex items-center px-6 md:px-20 py-24 pointer-events-none">
          <span className="absolute top-8 left-6 md:left-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">01 — Heritage</span>

          <div id="about-text" className="max-w-xl opacity-0 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 pointer-events-auto shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">About</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-porcelain uppercase leading-tight mb-4">
              A Heritage<br />of Precision.
            </h2>
            <p className="text-smoke leading-relaxed text-sm md:text-base font-light mb-6">
              For over three decades, Cue Club Coventry has been the home of serious cue sports. Our match-grade tables, professional atmosphere, and dedicated community set a standard that goes far beyond recreation.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 mb-6">
              {[["12+", "Tables"], ["30+", "Years"], ["500+", "Members"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-xl md:text-2xl text-brass">{n}</div>
                  <div className="font-mono text-[10px] text-smoke uppercase tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
            <a href="#booking-section"
              className="inline-flex items-center space-x-3 border border-brass/50 hover:border-brass bg-brass/10 hover:bg-brass text-brass hover:text-ink font-display text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all duration-300">
              <span>Reserve a Table</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* ══ GALLERY ══ */}
        <Gallery />

        {/* ══ BOOKING ══ */}
        <section id="booking-section" className="relative w-full min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20 py-24 pointer-events-auto">
          <span className="absolute top-8 left-6 md:left-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">02 — Reserve</span>

          <div id="booking-card" className="w-full max-w-md bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 opacity-0 shadow-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Reserve</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-porcelain uppercase mb-6">Book a Table</h2>
            <BookingForm />
          </div>
        </section>

        {/* ══ MEMBERSHIP ══ */}
        <section id="membership-section" className="relative w-full min-h-screen flex items-center px-6 md:px-20 py-24 pointer-events-auto">
          <span className="absolute top-8 left-6 md:left-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">03 — Membership</span>

          <div id="membership-content" className="max-w-lg w-full opacity-0 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Membership</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-porcelain uppercase leading-tight mb-4">
              Join the<br />Inner Circle.
            </h2>
            <p className="text-smoke leading-relaxed mb-6 font-light text-sm md:text-base">
              Priority booking, tournament access, and an exclusive lounge. Membership is more than a subscription — it&apos;s belonging.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { tier: "Standard", desc: "Pool tables & bar access", price: "£25", featured: false },
                { tier: "Premier",  desc: "Snooker, pool & private lounge", price: "£50", featured: true },
              ].map(p => (
                <div key={p.tier} className={`flex items-center justify-between p-4 rounded-xl border ${p.featured ? "border-brass/50 bg-brass/10" : "border-white/10 bg-white/5"}`}>
                  <div>
                    <div className={`font-display uppercase tracking-widest text-xs md:text-sm mb-1 ${p.featured ? "text-brass" : "text-porcelain"}`}>{p.tier}</div>
                    <div className="font-mono text-xs text-smoke">{p.desc}</div>
                  </div>
                  <div>
                    <span className="font-mono text-lg md:text-xl text-porcelain">{p.price}</span>
                    <span className="font-mono text-xs text-smoke">/mo</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="#booking-section"
              className="block w-full text-center border-2 border-brass bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-brass/90 transition-all duration-300">
              Apply for Membership
            </a>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <section id="footer-section" className="relative w-full min-h-screen flex flex-col justify-end px-6 md:px-20 py-16 bg-transparent pointer-events-auto">
          <span className="absolute top-8 left-6 md:left-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">04 — Contact</span>

          <h2 id="footer-title" className="font-display text-[clamp(2.5rem,10vw,8rem)] text-brass uppercase leading-none tracking-tighter select-none mb-12 overflow-hidden drop-shadow-[0_0_25px_rgba(201,161,90,0.3)]">
            Cue Club<br />Coventry
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display text-brass text-xs tracking-[0.3em] uppercase mb-3">The Cue Club</div>
              <p className="text-smoke text-xs md:text-sm font-light leading-relaxed">Where precision meets passion. The home of cue sports in Coventry since 1994.</p>
            </div>
            {[
              { label: "Location", lines: ["12 Precision Way", "Coventry, CV1 2AB"] },
              { label: "Hours",    lines: ["Mon – Sun", "12:00 PM – 02:00 AM"] },
              { label: "Contact",  lines: ["hello@cueclubcoventry.com", "+44 (0) 241 234 5678"] },
            ].map(col => (
              <div key={col.label}>
                <div className="font-mono text-[10px] text-smoke tracking-widest uppercase mb-3">{col.label}</div>
                {col.lines.map(l => <p key={l} className="text-xs md:text-sm text-porcelain font-light leading-relaxed">{l}</p>)}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] text-smoke tracking-widest">© {new Date().getFullYear()} The Cue Club Coventry.</p>
            <div className="flex space-x-6">
              {["Instagram", "Facebook", "Twitter"].map(s => (
                <a key={s} href="#" className="font-mono text-[10px] text-smoke hover:text-brass tracking-widest uppercase transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
