"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { InteractiveBalls } from "./components/InteractiveBalls";

export default function PricingScene() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Initial state and GSAP timeline
  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !cameraRef.current) return;
    
    // Start exactly where Facilities ends
    gsap.set(cameraGroupRef.current.position, { x: 30, y: 3, z: 8 });
    gsap.set(cameraGroupRef.current.rotation, { x: -0.05, y: Math.PI / 6, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#pricing",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Dolly closer to the interactive balls
    tl.to(cameraGroupRef.current.position, {
      x: 30,
      y: 3,
      z: 6, // Move in closer
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      y: Math.PI / 8, // Square up slightly
      ease: "power2.inOut",
    }, "<");
  }, []);

  // Minimal idle motion
  useFrame((state) => {
    if (cameraGroupRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle floating/drifting
      cameraGroupRef.current.position.y += Math.sin(time * 0.5) * 0.001;
      
      // Gentle look around based on mouse
      const targetX = (state.pointer.x * Math.PI) / 30;
      const targetY = (state.pointer.y * Math.PI) / 30;
      
      cameraGroupRef.current.rotation.y += 0.02 * (-targetX - cameraGroupRef.current.rotation.y);
      cameraGroupRef.current.rotation.x += 0.02 * (targetY - cameraGroupRef.current.rotation.x);
    }
  });

  return (
    <>
      {/* Dim, moody lighting for the background */}
      <ambientLight intensity={1.5} color="#001824" />
      
      {/* Dynamic Lighting for the floating balls */}
      <SpotLight position={[30, 6, 8]} angle={0.8} penumbra={1} intensity={5} color="#ffffff" castShadow />
      <SpotLight position={[35, 4, 10]} angle={0.8} penumbra={1} intensity={3} color="#c6a87c" />

      {/* Camera */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera 
          ref={cameraRef}
          makeDefault 
          fov={45} 
          near={0.1} 
          far={100} 
        />
      </group>

      {/* Grounding the scene with the physical VIP architecture */}
      <ClubEnvironment zone="club" />

      {/* Interactive 3D Elements floating right in front of the camera */}
      <InteractiveBalls position={[30, 3, 5]} />
    </>
  );
}
