"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BookingRecord {
  bookingRef: string;
  tableType: "pool" | "snooker";
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  submittedAt: string;
}

export default function BookingHistoryPage() {
  const [history, setHistory] = useState<BookingRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cue_club_bookings");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("cue_club_bookings");
    setHistory([]);
  };

  return (
    <main className="min-h-screen w-full bg-ink text-porcelain px-6 py-12 md:py-20 flex flex-col justify-between relative">
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

        <div className="flex items-center space-x-4">
          <Link
            href="/booking"
            className="font-mono text-xs text-brass border border-brass/40 px-4 py-2 rounded-lg hover:bg-brass/10 transition-colors uppercase tracking-wider"
          >
            + New Reservation
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase block mb-1">
              Member Account
            </span>
            <h1 className="font-display text-2xl md:text-3xl text-porcelain uppercase">
              Reservation History
            </h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="font-mono text-[10px] text-smoke/60 hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              Clear Records
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 text-smoke">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-porcelain mb-2">No Past Reservations Found</h3>
            <p className="text-smoke text-xs font-light max-w-sm mx-auto mb-6">
              You haven&apos;t placed any table reservations yet. Book your session at Cue Club Coventry.
            </p>
            <Link
              href="/booking"
              className="inline-block bg-brass text-ink font-display text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-brass/90 transition-all"
            >
              Book a Table Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, idx) => (
              <div
                key={item.bookingRef + idx}
                className="bg-white/5 border border-white/10 hover:border-brass/40 rounded-xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-mono text-xs text-brass font-bold">
                      #{item.bookingRef}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Confirmed
                    </span>
                  </div>
                  <div className="font-display text-base text-porcelain uppercase">
                    {item.tableType === "pool" ? "Professional Pool Slate" : "Full-Size Snooker"}
                  </div>
                  <div className="font-mono text-xs text-smoke mt-1">
                    📅 {item.date} at {item.time} • 👥 {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
                  </div>
                  <div className="font-mono text-[10px] text-smoke/50 mt-1">
                    Name: {item.name} ({item.email})
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 items-start sm:items-end">
                  <a
                    href={`https://wa.me/442412345678?text=${encodeURIComponent(
                      `Hi! Inquiring about my booking #${item.bookingRef} for ${item.date} at ${item.time}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 rounded-lg hover:border-emerald-400 transition-colors uppercase tracking-wider"
                  >
                    WhatsApp Pass
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center mt-12">
        <p className="font-mono text-[10px] text-smoke/50 tracking-widest">
          © {new Date().getFullYear()} The Cue Club Coventry. Member records stored securely.
        </p>
      </div>
    </main>
  );
}
