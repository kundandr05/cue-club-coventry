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
  title: "The Cue Club Coventry | Pool, Snooker, Darts & Poker Members Club",
  description: "Coventry's home for pool, snooker, darts & poker. Premium snooker tables, professional pool slates, and a luxurious lounge atmosphere.",
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
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
