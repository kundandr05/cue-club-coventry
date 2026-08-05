"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PendantLightProps {
  position?: [number, number, number];
  color?: string;
  intensity?: number;
  distance?: number;
  scale?: number;
}

export function PendantLight({
  position = [0, 4, 0],
  color = "#ffb347", // Warm amber/gold
  intensity = 5,
  distance = 15,
  scale = 1,
}: PendantLightProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Subtle sway
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* The Cord */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 4, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      
      {/* The Fixture / Shade */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 0.5, 32]} />
        <meshPhysicalMaterial 
          color="#111" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1} 
        />
      </mesh>

      {/* The Glowing Bulb */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* The Light Source */}
      <pointLight color={color} intensity={intensity} distance={distance} decay={2} castShadow position={[0, -0.5, 0]} />
      {/* A tight spotlight for table focus */}
      <spotLight 
        color={color} 
        intensity={intensity * 2} 
        angle={Math.PI / 4} 
        penumbra={0.5} 
        position={[0, -0.5, 0]} 
        target-position={[0, -5, 0]} 
        castShadow
      />
    </group>
  );
}
