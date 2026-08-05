"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/layout/Loader";
import { HeroTableScene } from "@/three/scenes/HeroTableScene";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingCTA } from "@/components/ui/FloatingCTA";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ visible }: { visible: boolean }) {
  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-8 md:px-16 py-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="font-display text-brass text-sm tracking-[0.3em] uppercase">
        The Cue Club
      </div>
      <div className="hidden md:flex items-center space-x-8">
        {["About", "Booking", "Membership", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}-section`}
            className="font-mono text-xs text-smoke hover:text-porcelain tracking-widest uppercase transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </div>
      <div className="font-mono text-xs text-smoke tracking-widest uppercase">
        Coventry, UK
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
        <div className="w-16 h-16 rounded-full border-2 border-brass flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-porcelain mb-2">Confirmed.</h3>
        <p className="text-smoke text-sm">Your table is secured. See you at the club.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Full Name</label>
        <input required name="name" type="text" placeholder="John Doe"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain placeholder-smoke/50 focus:outline-none focus:border-brass/60 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Date</label>
          <input required name="date" type="date"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors" />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Time</label>
          <input required name="time" type="time"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">Table</label>
        <select required name="type"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60 transition-colors appearance-none">
          <option value="pool">Professional Pool Slate</option>
          <option value="snooker">Full-Size Snooker Table</option>
        </select>
      </div>
      <button disabled={status === "submitting"} type="submit"
        className="w-full mt-2 bg-brass text-ink font-display text-sm uppercase tracking-[0.2em] py-4 rounded-lg hover:bg-brass/90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "submitting" ? "Processing..." : "Reserve Table"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!loaded || !titleRef.current) return;

    // Hero text stagger
    const words = titleRef.current.querySelectorAll(".word");
    gsap.fromTo(words,
      { y: 80, opacity: 0, rotateX: 60, transformOrigin: "bottom center" },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.1, ease: "power4.out", delay: 0.3 }
    );

    // Navbar fade in
    gsap.fromTo("#navbar", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.5 });

    // Scroll indicator
    gsap.fromTo("#scroll-hint", { opacity: 0 }, { opacity: 0.6, duration: 1, delay: 2 });

    // Hero text fade out on scroll
    gsap.to(titleRef.current, {
      opacity: 0, y: -60,
      scrollTrigger: { trigger: "#hero-section", start: "40% top", end: "bottom top", scrub: 1 }
    });

    // About text reveal
    gsap.fromTo("#about-text",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: "#about-section", start: "top 70%", end: "top 30%", scrub: 1 } }
    );

    // Booking form reveal
    gsap.fromTo("#booking-card",
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: "#booking-section", start: "top 70%", end: "top 20%", scrub: 1 } }
    );

    // Membership reveal
    gsap.fromTo("#membership-content",
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, scrollTrigger: { trigger: "#membership-section", start: "top 70%", end: "top 20%", scrub: 1 } }
    );

    // Stats counter
    gsap.fromTo("#stats-row",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: "#membership-section", start: "top center", toggleActions: "play none none reverse" } }
    );
  }, [loaded]);

  return (
    <main className="w-full bg-ink text-porcelain">

      {/* ── Loader ── */}
      <Loader onLoaded={() => setLoaded(true)} />

      {/* ── Premium Extras ── */}
      {loaded && <CustomCursor />}
      {loaded && <ScrollProgress />}
      {loaded && <FloatingCTA />}

      {/* ── Fixed Navbar ── */}
      <Navbar visible={loaded} />

      {/* ── Fixed 3D Canvas ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroTableScene loaded={loaded} />
      </div>

      {/* ── Scrollable DOM ── */}
      <div className="relative z-10 w-full">

        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        <section id="hero-section" className="w-full h-screen flex flex-col justify-end p-8 md:p-20 pointer-events-none">
          <div className="absolute top-8 right-8 md:right-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">01 / 05</div>
          <div className="mb-4">
            <span className="font-mono text-[10px] text-brass tracking-[0.4em] uppercase">Est. Coventry — Since 1994</span>
          </div>

          <h1 ref={titleRef} className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tighter max-w-5xl uppercase overflow-hidden">
            <span className="word inline-block opacity-0 mr-3">Coventry&apos;s</span>
            <br />
            <span className="word inline-block opacity-0 mr-3">Finest</span>
            <span className="word inline-block opacity-0 text-brass mr-3">Cue</span>
            <span className="word inline-block opacity-0 mr-3">Club.</span>
          </h1>

          <div id="scroll-hint" className="mt-10 flex items-center space-x-4 opacity-0">
            <div className="w-8 h-[1px] bg-brass" />
            <span className="font-mono text-[10px] text-smoke tracking-[0.3em] uppercase">Scroll to enter</span>
          </div>
        </section>

        {/* ════════════════════════════════════
            ABOUT
        ════════════════════════════════════ */}
        <section id="about-section" className="w-full h-screen flex items-center p-8 md:p-20 pointer-events-none">
          <div className="absolute top-8 right-8 md:right-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">02 / 05</div>
          <div id="about-text" className="max-w-xl opacity-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Heritage</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-porcelain uppercase leading-tight mb-6">
              A Heritage<br />of Precision.
            </h2>
            <p className="text-smoke leading-relaxed text-lg font-light">
              For over three decades, Cue Club Coventry has been the home of serious cue sports. Our match-grade tables, professional atmosphere, and community of dedicated players set a standard that goes far beyond recreation.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[["12+", "Tables"], ["30+", "Years"], ["500+", "Members"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-2xl text-brass">{n}</div>
                  <div className="font-mono text-[10px] text-smoke uppercase tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            BOOKING
        ════════════════════════════════════ */}
        <section id="booking-section" className="w-full h-screen flex items-center justify-end p-8 md:p-20 pointer-events-auto">
          <div className="absolute top-8 right-8 md:right-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">03 / 05</div>
          <div id="booking-card" className="w-full max-w-md opacity-0 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Reserve</span>
            </div>
            <h2 className="font-display text-3xl text-porcelain uppercase mb-6">Book a Table</h2>
            <BookingForm />
          </div>
        </section>

        {/* ════════════════════════════════════
            MEMBERSHIP
        ════════════════════════════════════ */}
        <section id="membership-section" className="w-full h-screen flex items-center p-8 md:p-20 pointer-events-auto">
          <div className="absolute top-8 right-8 md:right-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">04 / 05</div>
          <div id="membership-content" className="max-w-lg opacity-0">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">Membership</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-porcelain uppercase leading-tight mb-4">
              Join the<br />Inner Circle.
            </h2>
            <p className="text-smoke leading-relaxed mb-10 font-light">
              Priority booking, tournament access, and an exclusive lounge. Membership is more than a subscription — it&apos;s belonging.
            </p>

            {/* Pricing Cards */}
            <div className="space-y-4">
              {[
                { tier: "Standard", desc: "Pool tables & bar access", price: "£25", per: "/mo" },
                { tier: "Premier", desc: "Snooker, pool & private lounge", price: "£50", per: "/mo", featured: true },
              ].map((p) => (
                <div key={p.tier} className={`flex items-center justify-between p-5 rounded-xl border transition-all ${p.featured ? "border-brass/50 bg-brass/5" : "border-white/10 bg-white/2"}`}>
                  <div>
                    <div className={`font-display uppercase tracking-widest text-sm mb-1 ${p.featured ? "text-brass" : "text-porcelain"}`}>{p.tier}</div>
                    <div className="font-mono text-xs text-smoke">{p.desc}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl text-porcelain">{p.price}</span>
                    <span className="font-mono text-xs text-smoke">{p.per}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full border-2 border-brass text-brass hover:bg-brass hover:text-ink font-display text-sm uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300">
              Apply for Membership
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <section id="footer-section" className="w-full min-h-screen flex flex-col justify-end p-8 md:p-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">

          {/* Large wordmark */}
          <div className="mb-16">
            <h2 className="font-display text-6xl md:text-9xl text-porcelain/10 uppercase leading-none tracking-tighter select-none">
              Cue Club<br />Coventry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-white/10 pt-10 mb-10">
            <div className="md:col-span-1">
              <div className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase mb-4">The Cue Club Coventry</div>
              <p className="text-smoke text-sm font-light leading-relaxed">Where precision meets passion. The home of serious cue sports in Coventry since 1994.</p>
            </div>
            <div>
              <div className="font-mono text-[10px] text-smoke tracking-widest uppercase mb-4">Location</div>
              <p className="text-sm text-porcelain font-light">12 Precision Way<br />Coventry, CV1 2AB</p>
            </div>
            <div>
              <div className="font-mono text-[10px] text-smoke tracking-widest uppercase mb-4">Hours</div>
              <p className="text-sm text-porcelain font-light">Mon – Sun<br />12:00 PM – 02:00 AM</p>
            </div>
            <div>
              <div className="font-mono text-[10px] text-smoke tracking-widest uppercase mb-4">Contact</div>
              <p className="text-sm text-porcelain font-light">hello@cueclubcoventry.com<br />+44 (0) 241 234 5678</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/10 pt-6 space-y-4 md:space-y-0">
            <p className="font-mono text-[10px] text-smoke tracking-widest">© {new Date().getFullYear()} The Cue Club Coventry. All rights reserved.</p>
            <div className="flex space-x-8">
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
