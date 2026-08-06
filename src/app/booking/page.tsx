"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const TIME_SLOTS = [
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
  "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
  "12:00 AM", "01:00 AM"
];

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tableType, setTableType] = useState<"pool" | "snooker">("pool");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("08:00 PM");
  const [guests, setGuests] = useState<number>(2);
  const [memberStatus, setMemberStatus] = useState<"non_member" | "standard" | "premier">("non_member");
  const [durationHours, setDurationHours] = useState<number>(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "confirmed">("idle");
  const [refCode, setRefCode] = useState("");

  // Dynamic Pricing Helper
  const baseRate = tableType === "snooker" ? 16 : 12;
  const discountMultiplier = memberStatus === "premier" ? 0.5 : memberStatus === "standard" ? 0.8 : 1.0;
  const hourlyPrice = baseRate * discountMultiplier;
  const totalPrice = hourlyPrice * durationHours;
  const fullPrice = baseRate * durationHours;
  const savings = fullPrice - totalPrice;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [step, status]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const bookingRef = "CUE-" + Math.floor(1000 + Math.random() * 9000);
    const payload = {
      bookingRef,
      tableType,
      date: selectedDate,
      time: selectedTime,
      guests,
      name,
      email,
      phone,
      submittedAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.NEXT_PUBLIC_BOOKING_WEBHOOK_URL;
    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
    } catch {
      // ignore
    }

    // Save to localStorage history
    try {
      const stored = localStorage.getItem("cue_club_bookings");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("cue_club_bookings", JSON.stringify([payload, ...existing]));
    } catch {
      // ignore
    }

    setRefCode(bookingRef);
    setStatus("confirmed");
  };

  return (
    <main className="min-h-screen w-full bg-ink text-porcelain px-6 py-12 md:py-20 flex flex-col justify-between relative overflow-hidden">
      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between mb-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-smoke hover:text-brass font-mono text-xs uppercase tracking-widest transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Main Club</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/booking/history"
            className="font-mono text-xs text-smoke hover:text-brass transition-colors uppercase tracking-wider hidden sm:inline"
          >
            My Reservations →
          </Link>
          <span className="font-display text-brass text-xs tracking-[0.3em] uppercase">
            The Cue Club
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div ref={containerRef} className="max-w-2xl w-full mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative z-10 opacity-0">
        {status === "confirmed" ? (
          /* Confirmation Screen */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full border-2 border-brass flex items-center justify-center mx-auto mb-6 bg-brass/10">
              <svg className="w-8 h-8 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-mono text-xs text-brass tracking-[0.3em] uppercase block mb-2">
              Reservation Confirmed
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-porcelain uppercase mb-4">
              See You at the Club
            </h1>
            <p className="text-smoke text-sm font-light leading-relaxed max-w-md mx-auto mb-8">
              We&apos;ve reserved your table. A confirmation email has been dispatched.
            </p>

            {/* Reference Badge */}
            <div className="inline-block bg-white/5 border border-brass/40 rounded-xl p-4 mb-8">
              <div className="font-mono text-[10px] text-smoke uppercase tracking-widest mb-1">
                Booking Reference
              </div>
              <div className="font-mono text-2xl text-brass font-bold">{refCode}</div>
              <div className="font-mono text-xs text-porcelain mt-2">
                {tableType === "pool" ? "Pool Slate" : "Snooker"} • {selectedDate} at {selectedTime} ({guests} Guests)
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-brass/90 transition-all"
              >
                Return to Club
              </Link>
              <a
                href={`https://wa.me/442412345678?text=${encodeURIComponent(
                  `Hi, confirming my booking ${refCode} for ${selectedDate} at ${selectedTime}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:border-emerald-400 transition-all"
              >
                WhatsApp Confirmation
              </a>
            </div>
          </div>
        ) : (
          /* Multi-step Form */
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              {[
                { n: 1, title: "Table Type" },
                { n: 2, title: "Date & Time" },
                { n: 3, title: "Guest Info" },
              ].map((s) => (
                <div
                  key={s.n}
                  className={`flex items-center space-x-2 ${
                    step >= s.n ? "text-brass" : "text-smoke/40"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-mono flex items-center justify-center border ${
                      step >= s.n
                        ? "border-brass bg-brass/20 text-brass"
                        : "border-white/10 text-smoke/40"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest hidden sm:inline">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Select Table */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-porcelain uppercase mb-2">
                    Select Discipline
                  </h2>
                  <p className="text-smoke text-xs font-light">
                    Choose your preferred table setup for the session.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "pool",
                      title: "Simonis 860 Pool Slate",
                      spec: "8-Ball & 9-Ball • Worst-Spun Cloth",
                      desc: "Precision-honed slate with Belgian Simonis 860 cloth for true, ultra-fast roll.",
                      icon: "🟢",
                    },
                    {
                      id: "snooker",
                      title: "Heated Italian Snooker Slate",
                      spec: "12ft Competition • Heated Bed",
                      desc: "45mm Italian slate heated bed for zero humidity variance during championship play.",
                      icon: "🪨",
                    },
                    {
                      id: "aramith",
                      title: "Aramith Super Pro Table",
                      spec: "Phenolic Precision • Tournament Balls",
                      desc: "Equipped with Super Aramith Pro balls for optimal density & deflection response.",
                      icon: "🎱",
                    },
                    {
                      id: "lighting",
                      title: "5000K Match Lighting Rig",
                      spec: "Flicker-Free LED Canopy • Shadowless",
                      desc: "Overhead canopy diffusers cast zero shadows across cushions and pocket entries.",
                      icon: "💡",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTableType(item.id as "pool" | "snooker")}
                      className={`p-5 rounded-xl border text-left transition-all ${
                        tableType === item.id
                          ? "border-brass bg-brass/10 shadow-lg shadow-brass/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="font-display text-base text-porcelain uppercase mb-1">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-brass mb-2">{item.spec}</div>
                      <div className="text-xs text-smoke font-light leading-relaxed">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-brass/90 transition-all mt-4"
                >
                  Continue to Date & Time →
                </button>
              </div>
            )}

            {/* STEP 2: Select Date & Time */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-porcelain uppercase mb-2">
                    Date & Time Slot
                  </h2>
                  <p className="text-smoke text-xs font-light">
                    Select your preferred date and session start time.
                  </p>
                </div>

                {/* Member Status Selector */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                    Membership Tier (Applies Discount)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "non_member", label: "Non-Member", rate: "£" + baseRate + "/hr" },
                      { id: "standard", label: "Standard Member", rate: "-20% Off" },
                      { id: "premier", label: "Premier Member", rate: "-50% Off" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMemberStatus(m.id as "non_member" | "standard" | "premier")}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          memberStatus === m.id
                            ? "border-brass bg-brass/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="font-display text-xs text-porcelain uppercase">{m.label}</div>
                        <div className="font-mono text-[10px] text-brass mt-0.5">{m.rate}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                      Duration
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain focus:outline-none focus:border-brass/60"
                    >
                      {[1, 2, 3, 4, 5].map((h) => (
                        <option key={h} value={h} className="bg-ink text-porcelain">
                          {h} {h === 1 ? "Hour Session" : "Hours Session"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-3">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-2.5 rounded-lg font-mono text-xs transition-all ${
                          selectedTime === t
                            ? "bg-brass text-ink font-bold"
                            : "bg-white/5 text-porcelain hover:bg-white/10 border border-white/5"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Calculated Price Summary */}
                <div className="bg-brass/10 border border-brass/40 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-smoke uppercase tracking-wider">
                      Estimated Total ({durationHours} hr session)
                    </div>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className="font-mono text-2xl text-brass font-bold">£{totalPrice.toFixed(2)}</span>
                      {savings > 0 && (
                        <span className="font-mono text-xs text-smoke line-through">£{fullPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  {savings > 0 ? (
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                      Saving £{savings.toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-smoke uppercase">Standard Rate</span>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 border border-white/10 text-smoke font-mono text-xs uppercase tracking-widest py-4 rounded-xl hover:text-porcelain"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-brass/90 transition-all"
                  >
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Guest Details & Submit */}
            {step === 3 && (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-porcelain uppercase mb-2">
                    Guest Information
                  </h2>
                  <p className="text-smoke text-xs font-light">
                    Where should we send your booking pass?
                  </p>
                </div>

                {/* Summary Pill */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="text-porcelain font-bold">
                      <span className="text-brass uppercase">
                        {tableType === "pool" ? "Pool Slate" : tableType === "snooker" ? "Snooker" : "Match Table"}
                      </span>{" "}
                      • {selectedDate} at {selectedTime} ({durationHours} hr)
                    </div>
                    <div className="text-smoke text-[10px] mt-0.5">
                      Rate: <span className="text-brass">£{totalPrice.toFixed(2)}</span> ({memberStatus.replace("_", " ").toUpperCase()})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-brass underline hover:text-porcelain text-xs"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-2">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+44 7123 456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-white/10 text-smoke font-mono text-xs uppercase tracking-widest py-4 rounded-xl hover:text-porcelain"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={status === "submitting"}
                    type="submit"
                    className="w-2/3 bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-brass/90 transition-all disabled:opacity-50"
                  >
                    {status === "submitting" ? "Securing Table..." : "Confirm & Reserve"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="max-w-4xl w-full mx-auto text-center mt-12">
        <p className="font-mono text-[10px] text-smoke/50 tracking-widest">
          © {new Date().getFullYear()} The Cue Club Coventry. All reservations subject to club rules.
        </p>
      </div>
    </main>
  );
}
