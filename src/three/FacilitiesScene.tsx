"use client";

import { useRef, useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { SnookerTable } from "./components/SnookerTable";
import { LoungeArea } from "./components/LoungeArea";

export default function FacilitiesScene() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const poolTableRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !poolTableRef.current) return;

    // 1. Initial State: Perfectly match the end of AboutScene
    // PoolTable was rotated 270 degrees
    gsap.set(poolTableRef.current.rotation, { y: Math.PI * 1.5 });
    
    // Camera was at macro cue-ball shot
    gsap.set(cameraGroupRef.current.position, { x: 0, y: 0.5, z: 2.2 });
    gsap.set(cameraGroupRef.current.rotation, { x: -0.05, y: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#facilities",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 2. The Pull Back: Reveal the full Pool Table
    tl.to(cameraGroupRef.current.position, {
      x: 0,
      y: 4,
      z: 10,
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      x: -0.2,
      ease: "power2.inOut",
    }, "<")

    // 3. The Pan: Move across to the Snooker Table (located at x: 15)
    .to(cameraGroupRef.current.position, {
      x: 15,
      ease: "power1.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      y: -Math.PI / 8, // slight turn to look at it dynamically
      ease: "power1.inOut",
    }, "<")
    
    // 4. The Sweep: Move to the Lounge Area (located at x: 30)
    .to(cameraGroupRef.current.position, {
      x: 30,
      y: 3,
      z: 8,
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      y: 0,
      x: -0.1,
      ease: "power2.inOut",
    }, "<");

  }, []);

  return (
    <>
      {/* Shared Lighting System */}
      <ambientLight intensity={0.05} />
      
      {/* Pool Table Light */}
      <SpotLight position={[0, 6, 0]} angle={0.8} penumbra={0.5} intensity={3} color="#c6a87c" castShadow />
      
      {/* Snooker Table Light */}
      <SpotLight position={[15, 6, 0]} angle={0.8} penumbra={0.8} intensity={4} color="#ffffff" castShadow />
      
      {/* Lounge Lighting (Pendant illusion) */}
      <SpotLight position={[30, 4, 0]} angle={0.5} penumbra={1} intensity={2} color="#c6a87c" castShadow />
      <SpotLight position={[25, 5, -2]} angle={0.6} penumbra={1} intensity={1.5} color="#c6a87c" />

      {/* Camera Rig */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera makeDefault fov={45} near={0.1} far={100} />
      </group>

      {/* The Environment Layout */}
      {/* Pool Table at origin */}
      <PoolTable ref={poolTableRef} />
      
      {/* Snooker Table spaced to the right */}
      <SnookerTable position={[15, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
      
      {/* Lounge Area further right */}
      <LoungeArea position={[30, -0.5, -2]} rotation={[0, -Math.PI / 8, 0]} />
    </>
  );
}
