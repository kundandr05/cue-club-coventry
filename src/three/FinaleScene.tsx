"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoungeArea } from "./components/LoungeArea";
import { Atmosphere } from "./components/Atmosphere";

export default function FinaleScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lightGroupRef = useRef<THREE.Group>(null);
  
  useLayoutEffect(() => {
    if (!lightGroupRef.current) return;

    // As the user scrolls through the finale, slowly fade the lights down
    gsap.to(lightGroupRef.current.position, {
      y: -2, // pull the lights away/down
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#contact-finale",
        start: "top center",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  // The camera slowly comes to a total rest
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Extremely slow, fading movement
      const drift = Math.sin(time * 0.05) * 0.1;
      cameraRef.current.position.y = 2 + drift;
      cameraRef.current.position.z = 7.5 + drift;

      // Mouse influence becomes almost imperceptible
      const targetX = (state.pointer.x * Math.PI) / 80;
      const targetY = (state.pointer.y * Math.PI) / 80;
      
      cameraRef.current.rotation.y += 0.005 * (targetX - cameraRef.current.rotation.y);
      cameraRef.current.rotation.x += 0.005 * (targetY - cameraRef.current.rotation.x);
    }
  });

  return (
    <>
      {/* The lighting fades out via the parent group moving */}
      <group ref={lightGroupRef}>
        <ambientLight intensity={0.005} />
        <SpotLight position={[0, 6, 2]} angle={0.7} penumbra={1} intensity={1} color="#c6a87c" castShadow />
        <SpotLight position={[-4, 4, -2]} angle={0.8} penumbra={1} intensity={0.2} color="#c6a87c" />
        {/* Soft Glow */}
        <spotLight position={[0, 5, -2]} angle={0.8} penumbra={1} intensity={1} color="#c6a87c" />
      </group>

      <Atmosphere />

      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        fov={45} 
        near={0.1} 
        far={100} 
        position={[0, 2, 7.5]}
      />

      <Center>
        <LoungeArea />
      </Center>
    </>
  );
}
