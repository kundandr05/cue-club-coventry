"use client";

import { useRef, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { SnookerTable } from "./components/SnookerTable";
import { LoungeArea } from "./components/LoungeArea";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { PendantLight } from "./components/PendantLight";

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

  // Continuous Cinematic Drift
  const driftRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (driftRef.current) {
      // Very slow breathing/floating
      driftRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Mouse Parallax
      const targetX = (state.pointer.x * Math.PI) / 40;
      const targetY = (state.pointer.y * Math.PI) / 40;
      
      driftRef.current.rotation.x += 0.02 * (targetY - driftRef.current.rotation.x);
      driftRef.current.rotation.y += 0.02 * (targetX - driftRef.current.rotation.y);
    }
  });

  return (
    <>
      {/* The Environment Layout (Club Architecture Base) */}
      <ClubEnvironment zone="facilities" />

      {/* Specific Table Practical Lights */}
      <SpotLight position={[0, 6, 0]} angle={0.8} penumbra={0.5} intensity={3} color="#c6a87c" castShadow />
      <SpotLight position={[15, 6, 0]} angle={0.8} penumbra={0.8} intensity={4} color="#ffffff" castShadow />
      <SpotLight position={[30, 4, 0]} angle={0.5} penumbra={1} intensity={2} color="#c6a87c" castShadow />

      {/* Camera Rig (Scroll Driven) */}
      <group ref={cameraGroupRef}>
        {/* Drift Rig (Time Driven) */}
        <group ref={driftRef}>
          <PerspectiveCamera 
            makeDefault 
            near={0.1} 
            far={100} 
            // Dynamically adjust FOV based on window aspect ratio 
            // (portrait mode gets a wider FOV so the tables aren't cut off)
            fov={typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 45}
          />
        </group>
      </group>

      {/* Tables layout over the environment */}
      {/* Pool Table at origin */}
      <group>
        <PendantLight position={[0, 4.5, 0]} intensity={8} distance={20} />
        <PoolTable ref={poolTableRef} />
      </group>
      
      {/* Snooker Table spaced to the right */}
      <group position={[15, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <PendantLight position={[0, 4.5, 0]} intensity={8} distance={20} />
        <SnookerTable />
      </group>
      
      {/* Lounge Area further right */}
      <group position={[30, -0.5, -2]} rotation={[0, -Math.PI / 8, 0]}>
        <PendantLight position={[0, 4.5, 0]} intensity={8} distance={20} />
        <LoungeArea />
      </group>
    </>
  );
}
