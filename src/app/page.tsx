"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/layout/Loader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Only load the heavy 3D scene on desktop — skip on mobile to prevent lag
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
      <div className="flex justify-between items-center px-6 md:px-16 py-5 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm md:backdrop-blur-none">

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
          className="md:hidden flex flex-col space-y-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[1px] bg-porcelain transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 transition-all duration-500 overflow-hidden ${mobileOpen ? "max-h-64 py-6" : "max-h-0"}`}>
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
// MOBILE FALLBACK BACKGROUND (no WebGL lag)
// ─────────────────────────────────────────────
function MobileBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(11,61,46,0.5)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(201,161,90,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,161,90,0.06)_0%,transparent_60%)]" />
      {/* Simulated table felt glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[30vh] bg-felt/20 rounded-3xl blur-3xl" />
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

  // Detect mobile on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loaded || !titleRef.current) return;

    // Hero text stagger
    const words = titleRef.current.querySelectorAll(".word");
    gsap.fromTo(words,
      { y: 80, opacity: 0, rotateX: 60 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.1, ease: "power4.out", delay: 0.3, transformOrigin: "bottom center" }
    );

    gsap.fromTo("#navbar-el", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.5 });
    gsap.fromTo("#scroll-hint", { opacity: 0 }, { opacity: 0.6, duration: 1, delay: 2 });

    // Only set up scroll animations on desktop
    if (!isMobile) {
      gsap.to(titleRef.current, {
        opacity: 0, y: -60,
        scrollTrigger: { trigger: "#hero-section", start: "40% top", end: "bottom top", scrub: 1 }
      });

      gsap.fromTo("#about-text",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: "#about-section", start: "top 70%", end: "top 20%", scrub: 1 } }
      );

      gsap.fromTo("#booking-card",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: "#booking-section", start: "top 70%", end: "top 20%", scrub: 1 } }
      );

      gsap.fromTo("#membership-content",
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, scrollTrigger: { trigger: "#membership-section", start: "top 70%", end: "top 20%", scrub: 1 } }
      );
    } else {
      // On mobile, just show content immediately
      gsap.set(["#about-text", "#booking-card", "#membership-content"], { opacity: 1, x: 0, y: 0 });
    }
  }, [loaded, isMobile]);

  // On mobile — skip the loader, go straight to content
  useEffect(() => {
    if (isMobile) {
      setTimeout(() => setLoaded(true), 500);
    }
  }, [isMobile]);

  return (
    <main className="w-full bg-ink text-porcelain">

      {/* Loader — desktop only */}
      {!isMobile && <Loader onLoaded={() => setLoaded(true)} />}

      {/* Custom cursor — desktop only */}
      {loaded && !isMobile && <CustomCursor />}
      {loaded && !isMobile && <ScrollProgress />}
      {loaded && <FloatingCTA />}

      {/* Background */}
      <div id="navbar-el">
        <Navbar visible={loaded} />
      </div>

      {/* 3D Canvas — desktop only; CSS gradient fallback on mobile */}
      {!isMobile ? (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {loaded && <HeroTableScene loaded={loaded} />}
        </div>
      ) : (
        <MobileBackground />
      )}

      {/* Scrollable content */}
      <div className="relative z-10 w-full">

        {/* ══ HERO ══ */}
        <section id="hero-section" className="relative w-full min-h-screen flex flex-col justify-end px-6 md:px-20 pb-16 md:pb-20 pt-24">
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

          <div id="scroll-hint" className="mt-8 flex items-center space-x-4 opacity-0">
            <div className="w-8 h-[1px] bg-brass" />
            <span className="font-mono text-[10px] text-smoke tracking-[0.3em] uppercase">Scroll to enter</span>
          </div>

          {/* Mobile-only immediate CTA */}
          {isMobile && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#booking-section"
                className="bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full text-center hover:bg-brass/90 transition-all">
                Reserve a Table
              </a>
              <a href="#membership-section"
                className="border border-brass text-brass font-display text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-full text-center hover:bg-brass/10 transition-all">
                Join Membership
              </a>
            </div>
          )}
        </section>

        {/* ══ ABOUT ══ */}
        <section id="about-section" className="relative w-full min-h-screen flex items-center px-6 md:px-20 py-24">
          {/* Section label — left aligned, below navbar */}
          <span className="absolute top-6 left-6 md:left-20 font-mono text-[10px] text-smoke/40 tracking-[0.3em] uppercase">01 — Heritage</span>

          <div id="about-text" className={`max-w-xl ${isMobile ? "" : "opacity-0"}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">About</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-porcelain uppercase leading-tight mb-6">
              A Heritage<br />of Precision.
            </h2>
            <p className="text-smoke leading-relaxed text-base md:text-lg font-light mb-8">
              For over three decades, Cue Club Coventry has been the home of serious cue sports. Our match-grade tables, professional atmosphere, and dedicated community set a standard that goes far beyond recreation.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[["12+", "Tables"], ["30+", "Years"], ["500+", "Members"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-xl md:text-2xl text-brass">{n}</div>
                  <div className="font-mono text-[10px] text-smoke uppercase tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
            <a href="#booking-section"
              className="mt-8 inline-flex items-center space-x-3 border border-white/20 hover:border-brass text-porcelain hover:text-brass font-display text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-300">
              <span>Reserve a Table</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* ══ BOOKING ══ */}
        <section id="booking-section" className="relative w-full min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20 py-24">
          <span className="absolute top-6 left-6 md:left-20 font-mono text-[10px] text-smoke/40 tracking-[0.3em] uppercase">02 — Reserve</span>

          <div id="booking-card" className={`w-full max-w-md bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl ${isMobile ? "" : "opacity-0"}`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Reserve</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-porcelain uppercase mb-6">Book a Table</h2>
            <BookingForm />
          </div>
        </section>

        {/* ══ MEMBERSHIP ══ */}
        <section id="membership-section" className="relative w-full min-h-screen flex items-center px-6 md:px-20 py-24">
          <span className="absolute top-6 left-6 md:left-20 font-mono text-[10px] text-smoke/40 tracking-[0.3em] uppercase">03 — Membership</span>

          <div id="membership-content" className={`max-w-lg w-full ${isMobile ? "" : "opacity-0"}`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Membership</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] text-porcelain uppercase leading-tight mb-4">
              Join the<br />Inner Circle.
            </h2>
            <p className="text-smoke leading-relaxed mb-8 font-light">
              Priority booking, tournament access, and an exclusive lounge. Membership is more than a subscription — it&apos;s belonging.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { tier: "Standard", desc: "Pool tables & bar access", price: "£25", featured: false },
                { tier: "Premier",  desc: "Snooker, pool & private lounge", price: "£50", featured: true },
              ].map(p => (
                <div key={p.tier} className={`flex items-center justify-between p-5 rounded-xl border ${p.featured ? "border-brass/50 bg-brass/5" : "border-white/10 bg-white/[0.02]"}`}>
                  <div>
                    <div className={`font-display uppercase tracking-widest text-sm mb-1 ${p.featured ? "text-brass" : "text-porcelain"}`}>{p.tier}</div>
                    <div className="font-mono text-xs text-smoke">{p.desc}</div>
                  </div>
                  <div>
                    <span className="font-mono text-xl text-porcelain">{p.price}</span>
                    <span className="font-mono text-xs text-smoke">/mo</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="#booking-section"
              className="block w-full text-center border-2 border-brass text-brass hover:bg-brass hover:text-ink font-display text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300">
              Apply for Membership
            </a>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <section id="footer-section" className="relative w-full min-h-[80vh] flex flex-col justify-end px-6 md:px-20 py-16 bg-gradient-to-t from-black via-black/80 to-transparent">
          <span className="absolute top-6 left-6 md:left-20 font-mono text-[10px] text-smoke/40 tracking-[0.3em] uppercase">04 — Contact</span>

          <h2 className="font-display text-[clamp(3rem,12vw,9rem)] text-porcelain/8 uppercase leading-none tracking-tighter select-none mb-12 overflow-hidden">
            Cue Club<br />Coventry
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display text-brass text-xs tracking-[0.3em] uppercase mb-3">The Cue Club</div>
              <p className="text-smoke text-sm font-light leading-relaxed">Where precision meets passion. The home of cue sports in Coventry since 1994.</p>
            </div>
            {[
              { label: "Location", lines: ["12 Precision Way", "Coventry, CV1 2AB"] },
              { label: "Hours",    lines: ["Mon – Sun", "12:00 PM – 02:00 AM"] },
              { label: "Contact",  lines: ["hello@cueclubcoventry.com", "+44 (0) 241 234 5678"] },
            ].map(col => (
              <div key={col.label}>
                <div className="font-mono text-[10px] text-smoke tracking-widest uppercase mb-3">{col.label}</div>
                {col.lines.map(l => <p key={l} className="text-sm text-porcelain font-light leading-relaxed">{l}</p>)}
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
