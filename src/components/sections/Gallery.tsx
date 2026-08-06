"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  {
    src: "/gallery_spotlight.jpg",
    alt: "Pool table under spotlight",
    label: "Match Tables",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/gallery_rack.jpg",
    alt: "Triangle rack of balls",
    label: "The Rack",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/gallery_lounge.jpg",
    alt: "Club lounge interior",
    label: "Members Lounge",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/gallery_topdown.jpg",
    alt: "Overhead view of pool table",
    label: "Top Down",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/gallery_cue.jpg",
    alt: "Premium cue and chalk",
    label: "Equipment",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/gallery_pocket.jpg",
    alt: "Ball at the pocket",
    label: "Precision",
    span: "col-span-1 row-span-1",
  },
];

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Staggered reveal for each card
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: i * 0.08,
        }
      );
    });
  }, []);

  return (
    <section
      id="gallery-section"
      ref={sectionRef}
      className="relative w-full py-24 px-6 md:px-20 pointer-events-auto"
    >
      {/* Section label */}
      <span className="absolute top-8 left-6 md:left-20 font-mono text-[10px] text-smoke/50 tracking-[0.3em] uppercase">
        05 — Gallery
      </span>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-6 h-[1px] bg-brass" />
          <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">
            The Club
          </span>
        </div>
        <h2 className="font-display text-[clamp(2rem,6vw,5rem)] text-porcelain uppercase leading-tight tracking-tighter">
          Inside the
          <br />
          <span className="text-brass">Cue Club.</span>
        </h2>
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px] gap-3 md:gap-4">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`gallery-item group relative overflow-hidden rounded-xl opacity-0 ${photo.span} cursor-pointer`}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Image */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              quality={85}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Brass shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brass/0 via-brass/0 to-brass/0 group-hover:from-brass/5 group-hover:to-brass/10 transition-all duration-700" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="font-mono text-[10px] text-brass tracking-[0.3em] uppercase">
                {photo.label}
              </span>
            </div>

            {/* Corner accent */}
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-brass/0 group-hover:border-brass/60 transition-all duration-500" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-brass/0 group-hover:border-brass/60 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
