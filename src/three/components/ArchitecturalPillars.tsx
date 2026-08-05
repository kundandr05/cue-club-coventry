"use client";

import React from "react";
import * as THREE from "three";

interface ArchitecturalPillarsProps {
  count?: number;
  radius?: number;
  height?: number;
  depth?: number; // How far back they sit
  width?: number; // How wide the space is
}

export function ArchitecturalPillars({
  count = 6,
  radius = 0.5,
  height = 20,
  depth = -15,
  width = 40,
}: ArchitecturalPillarsProps) {
  // Generate positions for the pillars in an arc or line in the background
  const pillars = Array.from({ length: count }).map((_, i) => {
    // Spread them across the width
    const x = (i / (count - 1)) * width - width / 2;
    // Slight curve to wrap the space
    const z = depth + Math.abs(x) * 0.2;
    return { position: [x, 0, z] as [number, number, number] };
  });

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={p.position}>
          {/* Main Pillar Body */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[radius * 2, height, radius * 2]} />
            <meshPhysicalMaterial 
              color="#050505" 
              metalness={0.8} 
              roughness={0.2} 
              clearcoat={1}
            />
          </mesh>

          {/* Emissive LED Strip down the center */}
          <mesh position={[0, height / 2, radius + 0.01]}>
            <planeGeometry args={[0.05, height]} />
            <meshBasicMaterial color="#ffb347" />
          </mesh>
          
          {/* Small point light to fake global illumination from the strip */}
          <pointLight color="#ffb347" intensity={0.5} distance={10} position={[0, height / 2, radius + 0.5]} />
        </group>
      ))}
    </group>
  );
}
