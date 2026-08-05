import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import GlobalCanvasWrapper from "@/components/canvas/GlobalCanvasWrapper";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioManager } from "@/components/AudioManager";
import { Loader } from "@/components/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cue Club Coventry | The Premier Billiards Experience",
    template: "%s | Cue Club Coventry"
  },
  description: "Experience the pinnacle of cue sports in Coventry. Premium snooker tables, professional pool slates, and a luxurious lounge atmosphere.",
  keywords: ["Cue Club", "Coventry", "Snooker", "Pool", "Billiards", "Lounge", "Tournaments"],
  authors: [{ name: "Cue Club Coventry" }],
  creator: "Cue Club Coventry",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://cueclubcoventry.com",
    title: "Cue Club Coventry",
    description: "Experience the pinnacle of cue sports in Coventry.",
    siteName: "Cue Club Coventry",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cue Club Coventry",
    description: "Experience the pinnacle of cue sports in Coventry.",
  },
  alternates: {
    canonical: "https://cueclubcoventry.com"
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Cue Club Coventry",
  "image": "https://cueclubcoventry.com/og-image.jpg",
  "description": "Experience the pinnacle of cue sports in Coventry. Premium snooker tables, professional pool slates, and a luxurious lounge atmosphere.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Precision Way",
    "addressLocality": "Coventry",
    "postalCode": "CV1 2AB",
    "addressCountry": "UK"
  },
  "telephone": "+442412345678",
  "openingHours": "Mo-Su 12:00-02:00"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        id="root"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <Loader />
          <CustomCursor />
          {children}
          <AudioManager />
        </LenisProvider>
        <GlobalCanvasWrapper />
      </body>
    </html>
  );
}

