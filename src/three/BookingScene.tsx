"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoungeArea } from "./components/LoungeArea";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { InteractiveCue } from "./components/InteractiveCue";

export default function BookingScene() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Initial state and GSAP timeline
  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !cameraRef.current) return;
    
    // Start exactly where Pricing ended
    gsap.set(cameraGroupRef.current.position, { x: 30, y: 3, z: 6 });
    gsap.set(cameraGroupRef.current.rotation, { x: 0, y: Math.PI / 8, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#booking",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Dolly deep into the lounge, looking right at the interactive cue
    tl.to(cameraGroupRef.current.position, {
      x: 30,
      y: 2,
      z: 2,
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      y: Math.PI / 4,
      x: -0.1,
      ease: "power2.inOut",
    }, "<");
  }, []);
  
  useFrame((state) => {
    if (cameraGroupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle breathing
      cameraGroupRef.current.position.y += Math.sin(time * 0.4) * 0.001;

      // Gentle look around based on mouse
      const targetX = (state.pointer.x * Math.PI) / 40;
      const targetY = (state.pointer.y * Math.PI) / 40;
      
      cameraGroupRef.current.rotation.y += 0.01 * (-targetX - cameraGroupRef.current.rotation.y);
      cameraGroupRef.current.rotation.x += 0.01 * (targetY - cameraGroupRef.current.rotation.x);
    }
    
    // Very subtle rotation of the environment itself
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <>
      {/* Dimmed, moody lighting emphasizing the "end of the journey" */}
      <ambientLight intensity={1.5} color="#001824" />
      
      {/* The Environment Layout (Club Architecture Base) */}
      <ClubEnvironment zone="club" />

      {/* Specific Booking Lighting */}
      <SpotLight position={[0, 6, 2]} angle={0.6} penumbra={1} intensity={1.5} color="#c6a87c" castShadow />
      <SpotLight position={[-4, 4, -2]} angle={0.8} penumbra={1} intensity={0.5} color="#c6a87c" />

      {/* Camera positioned to view the Lounge */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera 
          ref={cameraRef}
          makeDefault 
          fov={45} 
          near={0.1} 
          far={100} 
        />
      </group>

      <Center>
        <group ref={groupRef}>
          {/* Interactive Cue floats dramatically in the foreground */}
          <InteractiveCue position={[31, 2, 0]} />
        </group>
      </Center>
    </>
  );
}
