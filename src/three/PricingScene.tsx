"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { LoungeArea } from "./components/LoungeArea";

export default function PricingScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Minimal idle motion
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle floating/drifting
      cameraRef.current.position.y = 2 + Math.sin(time * 0.5) * 0.2;
      cameraRef.current.position.x = Math.cos(time * 0.3) * 0.2;
      
      // Gentle look around based on mouse
      const targetX = (state.pointer.x * Math.PI) / 30;
      const targetY = (state.pointer.y * Math.PI) / 30;
      
      cameraRef.current.rotation.y += 0.02 * (targetX - cameraRef.current.rotation.y);
      cameraRef.current.rotation.x += 0.02 * (targetY - cameraRef.current.rotation.x);
    }
  });

  return (
    <>
      {/* Dim, moody lighting for the background */}
      <ambientLight intensity={0.02} />
      
      {/* Warm Lounge Pendant Lighting */}
      <SpotLight position={[0, 6, 2]} angle={0.6} penumbra={1} intensity={2.5} color="#c6a87c" castShadow />
      <SpotLight position={[-4, 4, -2]} angle={0.8} penumbra={1} intensity={1} color="#c6a87c" />

      {/* Camera */}
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        fov={50} 
        near={0.1} 
        far={100} 
        position={[0, 2, 8]}
      />

      <Center>
        {/* We reuse the LoungeArea to provide continuity of space */}
        <LoungeArea />
      </Center>
    </>
  );
}
