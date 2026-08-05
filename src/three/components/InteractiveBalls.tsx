"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export function InteractiveBalls({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Interactive 8-Ball
  const ball8Ref = useRef<THREE.Mesh>(null);
  const [hovered8, setHovered8] = useState(false);

  // Interactive 9-Ball
  const ball9Ref = useRef<THREE.Mesh>(null);
  const [hovered9, setHovered9] = useState(false);

  useFrame((state, delta) => {
    if (ball8Ref.current) {
      // Base slow rotation
      ball8Ref.current.rotation.y += 0.005;
      ball8Ref.current.rotation.x += 0.002;
      
      // Speed up on hover
      if (hovered8) {
        ball8Ref.current.rotation.y += 0.05;
      }
    }

    if (ball9Ref.current) {
      ball9Ref.current.rotation.y -= 0.004;
      ball9Ref.current.rotation.z += 0.003;
      
      if (hovered9) {
        ball9Ref.current.rotation.y -= 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 8-Ball (Black) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <mesh 
          ref={ball8Ref} 
          position={[-1.5, 2, 0]} 
          castShadow 
          onPointerOver={() => setHovered8(true)} 
          onPointerOut={() => setHovered8(false)}
        >
          <sphereGeometry args={[0.8, 64, 64]} />
          {/* Extremely polished, glassy black material */}
          <meshPhysicalMaterial 
            color="#050505" 
            roughness={0.05} 
            metalness={0.2} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
          {/* White circle for the 8 */}
          <mesh position={[0, 0, 0.79]}>
            <circleGeometry args={[0.3, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
      </Float>

      {/* Cue Ball (White) */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.3, 0.3]}>
        <mesh 
          ref={ball9Ref} 
          position={[1.5, 1, -1]} 
          castShadow
          onPointerOver={() => setHovered9(true)} 
          onPointerOut={() => setHovered9(false)}
        >
          <sphereGeometry args={[0.7, 64, 64]} />
          {/* Extremely polished cue ball */}
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.05} 
            metalness={0.1} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}
