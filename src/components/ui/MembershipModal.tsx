"use client";

import { useState } from "react";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipModal({ isOpen, onClose }: MembershipModalProps) {
  const [tier, setTier] = useState<"standard" | "premier">("premier");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [memberId, setMemberId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const generatedId = "CUE-MEM-" + Math.floor(1000 + Math.random() * 9000);
    const payload = {
      memberId: generatedId,
      tier,
      name,
      email,
      phone,
      appliedAt: new Date().toISOString(),
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

    // Save to localStorage history so it appears in /booking/history
    try {
      const stored = localStorage.getItem("cue_club_bookings");
      const existing = stored ? JSON.parse(stored) : [];
      const historyRecord = {
        bookingRef: generatedId,
        tableType: tier === "premier" ? "Premier Membership Tier" : "Standard Membership Tier",
        date: new Date().toISOString().split("T")[0],
        time: "Active Membership Pass",
        guests: 1,
        name,
        email,
        phone,
        submittedAt: new Date().toISOString(),
        isMembership: true,
      };
      localStorage.setItem("cue_club_bookings", JSON.stringify([historyRecord, ...existing]));
    } catch {
      // ignore
    }

    setMemberId(generatedId);
    setStatus("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-black/90 border border-white/10 rounded-2xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-smoke hover:text-porcelain p-2 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full border-2 border-brass flex items-center justify-center mx-auto mb-4 bg-brass/10">
              <svg className="w-8 h-8 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-mono text-xs text-brass tracking-[0.3em] uppercase block mb-1">
              Application Received
            </span>
            <h2 className="font-display text-2xl text-porcelain uppercase mb-2">
              Welcome to the Club
            </h2>
            <p className="text-smoke text-xs font-light mb-6">
              Your membership pass has been created. Our team will review your application within 24 hours.
            </p>

            {/* Digital Member Card */}
            <div className="bg-gradient-to-br from-brass/20 via-black to-black border border-brass/40 rounded-xl p-5 mb-6 text-left relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-display text-brass text-xs tracking-[0.2em] uppercase">
                    The Cue Club Coventry
                  </div>
                  <div className="font-mono text-[10px] text-smoke uppercase">
                    {tier === "premier" ? "Premier Tier Member" : "Standard Tier Member"}
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-brass">{memberId}</div>
              </div>

              <div className="font-display text-lg text-porcelain uppercase mb-1">{name}</div>
              <div className="font-mono text-[10px] text-smoke/70">{email}</div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-brass/90 transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-6 h-[1px] bg-brass" />
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">
                Membership
              </span>
            </div>
            <h2 className="font-display text-2xl text-porcelain uppercase mb-2">
              Apply for Membership
            </h2>
            <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-3 py-1 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                18 Spots Open (482 / 500 Active Members)
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tier Selector */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setTier("standard")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    tier === "standard"
                      ? "border-brass bg-brass/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="font-display text-xs text-porcelain uppercase">Standard</div>
                  <div className="font-mono text-sm text-brass font-bold">£25/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier("premier")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    tier === "premier"
                      ? "border-brass bg-brass/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="font-display text-xs text-brass uppercase">Premier</div>
                  <div className="font-mono text-sm text-brass font-bold">£50/mo</div>
                </button>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-1.5">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-smoke mb-1.5">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+44 7123 456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-porcelain placeholder-smoke/40 focus:outline-none focus:border-brass/60"
                />
              </div>

              <button
                disabled={status === "submitting"}
                type="submit"
                className="w-full bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-brass/90 transition-all disabled:opacity-50 mt-2"
              >
                {status === "submitting" ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
