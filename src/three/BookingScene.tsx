"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { LoungeArea } from "./components/LoungeArea";
import { Atmosphere } from "./components/Atmosphere";

export default function BookingScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Minimal idle motion to keep the space feeling alive but not distracting
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Extremely slow push-in over time
      cameraRef.current.position.z = 8 - (Math.sin(time * 0.1) * 0.5);
      
      // Gentle breathing
      cameraRef.current.position.y = 2 + Math.sin(time * 0.4) * 0.1;

      // Gentle look around based on mouse
      const targetX = (state.pointer.x * Math.PI) / 40;
      const targetY = (state.pointer.y * Math.PI) / 40;
      
      cameraRef.current.rotation.y += 0.01 * (targetX - cameraRef.current.rotation.y);
      cameraRef.current.rotation.x += 0.01 * (targetY - cameraRef.current.rotation.x);
    }
    
    // Very subtle rotation of the environment itself
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <>
      {/* Dimmed, moody lighting emphasizing the "end of the journey" */}
      <ambientLight intensity={0.01} />
      
      {/* Environment */}
      <Atmosphere />

      <SpotLight position={[0, 6, 2]} angle={0.6} penumbra={1} intensity={1.5} color="#c6a87c" castShadow />
      <SpotLight position={[-4, 4, -2]} angle={0.8} penumbra={1} intensity={0.5} color="#c6a87c" />

      {/* Camera positioned to view the Lounge */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        fov={45} 
        near={0.1} 
        far={100} 
        position={[0, 2, 8]}
      />

      <Center>
        <group ref={groupRef}>
          <LoungeArea />
        </group>
      </Center>
    </>
  );
}
