import { NextResponse } from "next/server";

export interface GlobalBookingRecord {
  bookingRef: string;
  tableType: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone?: string;
  submittedAt: string;
  isMembership?: boolean;
}

// In-memory server store for live cross-device sync
const globalBookingsStore: GlobalBookingRecord[] = [
  {
    bookingRef: "CUE-7821",
    tableType: "Simonis 860 Pool Slate",
    date: "2026-08-07",
    time: "08:00 PM",
    guests: 2,
    name: "Alex Morgan",
    email: "alex@example.com",
    submittedAt: new Date().toISOString(),
  },
  {
    bookingRef: "CUE-MEM-4192",
    tableType: "Premier Membership Tier",
    date: "2026-08-06",
    time: "Active Membership Pass",
    guests: 1,
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    submittedAt: new Date().toISOString(),
    isMembership: true,
  },
];

// Fallback cloud store URL for cross-server persistence if needed
const CLOUD_KV_ENDPOINT = "https://jsonbin.org/cueclub/bookings";

export async function GET() {
  return NextResponse.json({
    success: true,
    bookings: globalBookingsStore,
  });
}

export async function POST(request: Request) {
  try {
    const body: GlobalBookingRecord = await request.json();

    if (!body.bookingRef || !body.name) {
      return NextResponse.json({ success: false, error: "Invalid booking data" }, { status: 400 });
    }

    // Add to top of global server memory
    globalBookingsStore.unshift(body);

    // Keep store capped at latest 50 records
    if (globalBookingsStore.length > 50) {
      globalBookingsStore.pop();
    }

    return NextResponse.json({
      success: true,
      message: "Booking synced live across all devices",
      booking: body,
      allBookings: globalBookingsStore,
    });
  } catch (error) {
    console.error("API booking error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
