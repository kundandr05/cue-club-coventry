"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, Float, MeshReflectorMaterial, Box } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { PendantLight } from "./components/PendantLight";
import { useStore } from "@/store/useStore";

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  const isAppLoaded = useStore((state) => state.isAppLoaded);

  // Cinematic Loading Animation (Entry)
  useLayoutEffect(() => {
    if (!groupRef.current) return;
    
    // Initial State: Table is rotated and lower, ball is invisible
    if (!isAppLoaded) {
      gsap.set(groupRef.current.position, { y: -5 });
      gsap.set(groupRef.current.rotation, { x: Math.PI / 4, y: Math.PI / 4 });
      return;
    }

    
    const tl = gsap.timeline();
    
    // Animate table up and into perspective
    tl.to(groupRef.current.position, {
      y: 0,
      duration: 2.5,
      ease: "power4.out"
    })
    .to(groupRef.current.rotation, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: "power4.out"
    }, "<");
    
    // Scroll transition choreography
    gsap.to(groupRef.current.rotation, {
      y: Math.PI, // rotate 180 degrees on scroll
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

  }, [isAppLoaded]);

  // Mouse Parallax & Continuous Cinematic Drift
  useFrame((state, delta) => {
    if (parallaxGroupRef.current) {
      // Continuous slow drift for cinematic feel
      parallaxGroupRef.current.rotation.y += delta * 0.05;

      // Gentle floating/breathing effect combined with mouse parallax
      const targetX = (state.pointer.x * Math.PI) / 20;
      const targetY = (state.pointer.y * Math.PI) / 20;
      
      parallaxGroupRef.current.rotation.x += 0.02 * (targetY - parallaxGroupRef.current.rotation.x);
      parallaxGroupRef.current.rotation.y += 0.02 * (targetX - parallaxGroupRef.current.rotation.y);
    }
  });

  return (
    <>
      {/* Grounding the scene with the physical VIP architecture */}
      <ClubEnvironment zone="hero" />

      <group ref={groupRef} scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 1}>
        <group ref={parallaxGroupRef}>
          <Center>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <PoolTable />
            </Float>
          </Center>

          {/* Premium Pendant Light hovering right over the table */}
          <PendantLight position={[0, 4.5, 0]} intensity={10} distance={20} />
        </group>
      </group>
    </>
  );
}
