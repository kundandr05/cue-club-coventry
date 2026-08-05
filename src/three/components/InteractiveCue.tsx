"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Cylinder } from "@react-three/drei";

export function InteractiveCue({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Smoothly track mouse pointer
  useFrame((state) => {
    if (groupRef.current) {
      // Convert pointer coordinates to rotation angles
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;

      // Smooth interpolation (lerp)
      groupRef.current.rotation.y += 0.05 * (-targetX - groupRef.current.rotation.y);
      groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* We offset the cue so it rotates around the "grip" end, not the center */}
        <group position={[0, 0, -4]}>
          {/* Main shaft (Ash Wood) */}
          <Cylinder args={[0.02, 0.04, 6, 32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#f0d5b6" roughness={0.6} />
          </Cylinder>
          
          {/* Butt (Ebony / Dark Wood with splicing) */}
          <Cylinder args={[0.04, 0.045, 1.5, 32]} position={[0, 0, 2.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#1a0f0a" roughness={0.3} metalness={0.1} />
          </Cylinder>

          {/* Brass Ferrule */}
          <Cylinder args={[0.02, 0.02, 0.1, 32]} position={[0, 0, -3.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#c6a87c" roughness={0.2} metalness={0.8} />
          </Cylinder>

          {/* Blue Chalk Tip */}
          <Cylinder args={[0.02, 0.02, 0.02, 32]} position={[0, 0, -3.11]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#1d4e89" roughness={0.9} />
          </Cylinder>
        </group>
      </group>
    </group>
  );
}
