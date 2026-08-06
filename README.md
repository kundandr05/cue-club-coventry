# 🎱 The Cue Club Coventry — Next-Gen 3D Web Experience

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)](https://docs.pmnd.rs/react-three-fiber)
[![GSAP](https://img.shields.io/badge/Motion-GSAP%20%2B%20ScrollTrigger-green)](https://greensock.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-gold)](LICENSE)

An **Awwwards-quality**, immersive digital experience for **The Cue Club Coventry** (Est. 1994). Inspired by Apple product showcases and Stripe/Linear-level motion design, this web application combines interactive 3D WebGL scenes, smooth-scrolled narrative transitions, physics-inspired ball splash animations, and dedicated digital booking passes.

---

## 🔗 Live Links

- **Live Production Demo:** [cueclubcoventry.com](https://www.cueclubcoventry.com/) *(or Vercel deployment link)*
- **GitHub Repository:** [github.com/kundandr05/cue-club-coventry](https://github.com/kundandr05/cue-club-coventry)

---

## ✨ Features & Highlights

### 1. 🎬 Full-Screen Cinematic 3D Hero
- **Interactive 3D Pool Table Scene:** Custom Three.js / React Three Fiber canvas featuring a tournament slate table, brass corner pockets, and warm overhead spot lighting.
- **Instanced 15-Ball Triangle Splash Break:** Real-time physics-inspired animation where the cue ball strikes forward and 15 billiard balls explode outward from the triangle rack.
- **Secondary Motion:** Cue stick with a 4.5s breathing sway cycle resting near the cue ball.

### 2. 🌫️ Atmospheric Particle Systems & Effects
- **Chalk Dust Burst:** 80 Three.js point particles arc outward with gravity upon cue strike impact.
- **God Rays & Bloom:** Selective postprocessing Bloom and volumetric light shafts over the felt.
- **Spotlight Text Sweep:** Warm brass highlight sweep across the display headline.

### 3. 📜 Smooth Scroll Storytelling & Sections
- **Lenis Smooth Scroll:** Inertial scrolling integrated with GSAP ScrollTrigger.
- **Complete Section Suite:**
  1. **Hero**: 3D entrance walk-in & triangle break splash.
  2. **About**: Heritage story & match-grade statistics.
  3. **Tables & Facilities**: Interactive specifications (Simonis 860 Cloth, Heated Italian Slate, Aramith Balls, Match Lighting).
  4. **Gallery**: Masonry grid with staggered entrance & brass corner shimmer.
  5. **Events & Tournaments**: Weekly 8-Ball Open (£500 Prize Pool) & Snooker Handicap cards.
  6. **Book a Table**: Direct reservation form & navigation.
  7. **Membership**: Tier selection cards with digital membership pass generation modal.
  8. **Contact & Location**: Interactive footer with dynamic room lighting rig.

### 4. 📱 Dedicated Booking & Member Pass System
- **Dedicated `/booking` Route:** 3-step reservation flow (Discipline Picker → Time Slots & Date → Guest Info → Confirmation Code `#CUE-XXXX`).
- **Member History (`/booking/history`):** Persistent reservation dashboard stored locally with direct WhatsApp pass integration.
- **Floating WhatsApp Pass:** One-tap direct reservation chat.
- **Membership Application Modal (`MembershipModal.tsx`):** Instant digital member card pass generation for Standard (£25/mo) and Premier (£50/mo) tiers.

---

## ⚡ Technical Architecture & Performance Optimizations

| Optimization | Method | Benefit |
|---|---|---|
| **1 Draw Call Instanced Mesh** | `THREE.InstancedMesh` with `setMatrixAt` & `setColorAt` | Reduced 15 ball mesh nodes to 1 single draw call |
| **Mobile 3D CSS Fallback** | Pure CSS radial gradient spheres & felt lighting | Zero WebGL GPU overhead on mobile devices (60fps guaranteed) |
| **Quality Tier Detection** | `useQualityTier()` hook | Dynamic DPR scaling (`1.0`–`2.0`) & postprocessing gating |
| **Motion Standardization** | `src/utils/easings.ts` | 3 unified signature curves (`easeSettle`, `easeStrike`, `easeDrift`) |
| **Accessibility Compliance** | `useReducedMotion()` hook | Auto-detects OS `prefers-reduced-motion` and bypasses 3D motion |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **3D Engine:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Postprocessing:** `@react-three/postprocessing` (Bloom, Vignette, ToneMapping)
- **Animation:** GSAP (GreenSock), ScrollTrigger, Lenis Smooth Scroll
- **Styling:** Tailwind CSS, Custom HSL Hues, Glassmorphism backdrop filters

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kundandr05/cue-club-coventry.git
   cd cue-club-coventry
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch dev server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

© 2026 The Cue Club Coventry. All Rights Reserved.
