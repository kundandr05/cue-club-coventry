"use client";

import * as React from "react";
import { Sparkles, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Atmosphere() {
  const groupRef = React.useRef<THREE.Group>(null);

  // Slow ambient rotation for the entire particle volume
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 
        Floating ambient dust particles 
        Scale 20 covers most of the camera view in our scenes 
      */}
      <Sparkles 
        count={300} 
        scale={25} 
        size={1.5} 
        speed={0.2} 
        opacity={0.3} 
        color="#c6a87c" 
      />
      <Sparkles 
        count={150} 
        scale={15} 
        size={3} 
        speed={0.1} 
        opacity={0.15} 
        color="#ffffff" 
      />
      
      {/* 
        Subtle global environment map for reflections 
        This provides a base level of lighting and reflection data to MeshPhysicalMaterials
        even in areas where SpotLights don't directly hit.
      <Environment preset="night" environmentIntensity={0.2} />

      {/* Global Fog for Depth and Volumetric atmosphere */}
      <fog attach="fog" args={["#000000", 10, 50]} />

      {/* Subtle Ceiling Glow (Fakes an ambient grid ceiling) */}
      <mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#05070a" />
      </mesh>
    </group>
  );
}
