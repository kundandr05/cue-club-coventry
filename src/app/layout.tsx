import type { Metadata } from "next";
import { Inter, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fontDisplay = Archivo_Black({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Cue Club Coventry | Premium Pool & Snooker",
    template: "%s | The Cue Club Coventry"
  },
  description: "Coventry's finest members club for pool, snooker, darts & poker. Experience a luxurious lounge atmosphere, professional pool slates, and a heritage of precision.",
  keywords: ["Cue Club", "Coventry", "Snooker", "Pool", "Billiards", "Darts", "Poker", "Members Club", "Sports Bar"],
  authors: [{ name: "The Cue Club Coventry" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://cueclubcoventry.com",
    title: "The Cue Club Coventry",
    description: "Coventry's finest members club for pool, snooker, darts & poker.",
    siteName: "The Cue Club Coventry",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cue Club Coventry",
    description: "Coventry's finest members club for pool, snooker, darts & poker.",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "The Cue Club Coventry",
  "description": "Coventry's finest members club for pool, snooker, darts & poker. Experience a luxurious lounge atmosphere.",
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
    <html lang="en" className="dark">
      <body
        className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased bg-ink text-porcelain`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
