"use client";

import { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { fadeUp } from "@/animations/fadeUp";

const BookingScene = dynamic(() => import("@/three/BookingScene"), { ssr: false });

export default function EventsBookingSection() {
  const containerRef = useRef<HTMLElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const [bookingStep, setBookingStep] = useState<"idle" | "date" | "confirm">("idle");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !blurRef.current) return;

    // Heavy cinematic blur for the entire section (depth of field)
    gsap.to(blurRef.current, {
      backdropFilter: "blur(32px)",
      backgroundColor: "rgba(5, 5, 5, 0.7)",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });

    // Reveal all elements marked with .reveal-element
    const revealElements = containerRef.current.querySelectorAll(".reveal-element");
    revealElements.forEach((el) => {
      fadeUp(el, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });
  }, []);

  return (
    <section 
      id="events-booking" 
      ref={containerRef}
      className="relative w-full min-h-[200vh] flex flex-col pt-32 pb-48 overflow-hidden bg-transparent"
    >
      {/* 3D View Portal (Sticky background) */}
      <div className="absolute inset-0 z-0">
        <View className="w-full h-full pointer-events-none">
          <BookingScene />
        </View>
        <div ref={blurRef} className="absolute inset-0 z-10 pointer-events-none backdrop-blur-none bg-black/0" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-24">
        
        {/* --- EVENTS TIMELINE --- */}
        <div className="mb-64">
          <div className="reveal-element opacity-0 mb-16">
            <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
              Upcoming
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-color-primary-white">
              Tournaments & Events
            </h3>
          </div>

          <div className="flex flex-col space-y-16 border-l border-white/10 pl-8 md:pl-16 ml-4 md:ml-8">
            
            {/* Event 1 */}
            <div className="relative reveal-element opacity-0 group">
              <div className="absolute -left-[41px] md:-left-[73px] top-2 w-4 h-4 rounded-full border-2 border-color-accent-gold bg-black group-hover:bg-color-accent-gold transition-colors duration-500" />
              <p className="text-color-accent-gold tracking-widest text-sm uppercase mb-2">October 15-18</p>
              <h4 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight group-hover:text-color-accent-gold transition-colors duration-500">
                The Coventry Classic
              </h4>
              <p className="text-xl text-gray-400 max-w-2xl">
                The city's premier invitational. Watch the region's finest compete on professional slates.
              </p>
            </div>

            {/* Event 2 */}
            <div className="relative reveal-element opacity-0 group">
              <div className="absolute -left-[41px] md:-left-[73px] top-2 w-4 h-4 rounded-full border-2 border-white/30 bg-black group-hover:border-color-accent-gold group-hover:bg-color-accent-gold transition-colors duration-500" />
              <p className="text-gray-400 tracking-widest text-sm uppercase mb-2">November 02</p>
              <h4 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight group-hover:text-color-accent-gold transition-colors duration-500">
                Autumn Open
              </h4>
              <p className="text-xl text-gray-400 max-w-2xl">
                Open entry tournament. Test your precision against local talent in our signature 9-ball bracket.
              </p>
            </div>

          </div>
        </div>

        {/* --- BOOKING EXPERIENCE --- */}
        <div className="min-h-screen flex flex-col justify-center">
          <div className="reveal-element opacity-0 text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.2em] text-color-accent-gold mb-4">
              Reservations
            </h2>
            <h3 className="text-5xl md:text-8xl font-bold tracking-tighter text-color-primary-white">
              Book Your Table.
            </h3>
          </div>

          <div className="max-w-4xl mx-auto w-full reveal-element opacity-0">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Initial */}
              {bookingStep === "idle" && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <button 
                    onClick={() => setBookingStep("date")}
                    className="group relative overflow-hidden px-12 py-6 border border-white/20 bg-white/5 backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-color-accent-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-xl md:text-2xl font-medium tracking-widest text-white group-hover:text-black transition-colors duration-500">
                      SELECT DATE
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Date Selection (No standard inputs) */}
              {bookingStep === "date" && (
                <motion.div
                  key="date"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {["Today", "Tomorrow", "Friday", "Saturday"].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDate(day);
                        setBookingStep("confirm");
                      }}
                      className="group border border-white/10 bg-black/40 backdrop-blur-md p-8 hover:border-color-accent-gold transition-colors duration-300 text-center"
                    >
                      <h4 className="text-2xl text-white group-hover:text-color-accent-gold transition-colors duration-300">
                        {day}
                      </h4>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-12 border border-color-accent-gold/30 bg-color-accent-gold/10 backdrop-blur-md"
                >
                  <h4 className="text-3xl text-color-accent-gold mb-4">Request Sent</h4>
                  <p className="text-xl text-white mb-8">
                    Your preference for {selectedDate} has been registered. Our concierge will contact you shortly to confirm table availability.
                  </p>
                  <button 
                    onClick={() => setBookingStep("idle")}
                    className="text-sm tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
                  >
                    Start Over
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
