"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOURNAMENTS = [
  {
    title: "Thursday 8-Ball Open",
    date: "Every Thursday • 7:00 PM",
    prize: "£500 Guaranteed",
    entry: "£15 Entry Fee",
    badge: "Weekly Series",
    desc: "Double-elimination open tournament for 8-ball players. World Rules format.",
  },
  {
    title: "Sunday Snooker Handicap",
    date: "First Sunday of Month • 11:00 AM",
    prize: "£750 Guaranteed",
    entry: "£20 Entry Fee",
    badge: "Monthly Championship",
    desc: "Handicapped tournament open to all skill levels. Best of 5 frames final.",
  },
  {
    title: "Pro-Am Exhibition Night",
    date: "Last Friday of Month • 8:00 PM",
    prize: "Exhibition Match",
    entry: "Free for Members",
    badge: "Special Event",
    desc: "Watch top national professionals play frames and interact with club members.",
  },
];

export function EventsTournaments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".event-card");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section
      id="events-section"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-20 py-24 pointer-events-auto"
    >
      <span className="font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase mb-4 block">
        04 — Competition
      </span>

      <div className="max-w-3xl mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-6 h-[1px] bg-brass" />
          <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">
            Tournaments & Events
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-5xl text-porcelain uppercase tracking-tight">
          Test Your Game
        </h2>
        <p className="text-smoke text-sm md:text-base font-light mt-3">
          Join our competitive series or drop in for monthly exhibition showcases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mb-12">
        {TOURNAMENTS.map((item, index) => (
          <div
            key={index}
            className="event-card bg-black/80 backdrop-blur-md border border-white/10 hover:border-brass/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-brass/5"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] text-brass bg-brass/10 border border-brass/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
                <span className="font-mono text-xs text-smoke font-light">
                  {item.entry}
                </span>
              </div>

              <h3 className="font-display text-xl text-porcelain uppercase mb-2">
                {item.title}
              </h3>
              <div className="font-mono text-xs text-brass mb-3">
                📅 {item.date}
              </div>
              <p className="text-smoke text-xs font-light leading-relaxed mb-6">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <div>
                <div className="font-mono text-[10px] text-smoke uppercase tracking-widest">
                  Prize Pool
                </div>
                <div className="font-mono text-base font-bold text-porcelain">
                  {item.prize}
                </div>
              </div>
              <Link
                href="/booking"
                className="inline-flex items-center space-x-2 text-brass hover:text-porcelain font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <span>Register</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
