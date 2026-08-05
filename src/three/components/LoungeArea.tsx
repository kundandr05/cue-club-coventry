"use client";

import * as React from "react";
import { forwardRef } from "react";
import { Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

export const LoungeArea = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Premium Bar Surface (Polished Black Marble) */}
      <Box args={[12, 1.2, 3]} position={[0, 0.6, 0]} receiveShadow castShadow>
        <meshPhysicalMaterial color="#050505" metalness={0.8} roughness={0.05} clearcoat={1} clearcoatRoughness={0.1} />
      </Box>
      
      {/* Bar Base / Paneling (Dark Wood) */}
      <Box args={[11.8, 4, 2.8]} position={[0, -2, 0]} receiveShadow castShadow>
        <meshPhysicalMaterial color="#1a0f0a" metalness={0.2} roughness={0.8} clearcoat={0.5} />
      </Box>

      {/* Gold Trim on Bar */}
      <Box args={[12.2, 0.1, 3.2]} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial color="#c6a87c" metalness={1} roughness={0.2} clearcoat={1} />
      </Box>

      {/* Glassware on Bar */}
      <group position={[-2, 1.4, 0]}>
        <Cylinder args={[0.2, 0.15, 0.4, 32]} position={[0, 0, 0]} castShadow>
          <meshPhysicalMaterial color="#ffffff" transmission={1} ior={1.5} thickness={0.1} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 0.6, 32]} position={[0.8, 0.1, 0.2]} castShadow>
          <meshPhysicalMaterial color="#ffffff" transmission={1} ior={1.5} thickness={0.1} roughness={0.1} />
        </Cylinder>
      </group>

      {/* Cue Rack */}
      <group position={[-5, 2, -1.2]}>
        <Box args={[0.2, 8, 0.5]} position={[0, 0, 0]} castShadow>
          <meshPhysicalMaterial color="#1a0f0a" metalness={0.2} roughness={0.8} />
        </Box>
        {/* Realistic Cues */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[0.3 + i * 0.4, -1, 0.2]} rotation={[0, 0, 0.05]}>
            <Cylinder args={[0.02, 0.04, 5, 32]} castShadow>
              <meshPhysicalMaterial color="#4a2e15" clearcoat={1} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.02, 0.02, 0.1, 16]} position={[0, -2.55, 0]}>
              <meshStandardMaterial color="#0077ff" roughness={0.9} />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Trophy Shelf / Display */}
      <group position={[4, 3, -1]}>
        <Box args={[4, 0.2, 1]} position={[0, 0, 0]} castShadow>
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} clearcoat={1} />
        </Box>
        <Box args={[4, 0.2, 1]} position={[0, 2, 0]} castShadow>
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} clearcoat={1} />
        </Box>
        {/* Shiny Brass Trophy */}
        <Cylinder args={[0.2, 0.1, 0.8, 64]} position={[0, 0.5, 0]} castShadow>
          <meshPhysicalMaterial color="#c6a87c" metalness={1} roughness={0.1} clearcoat={1} />
        </Cylinder>
        <Sphere args={[0.3, 32, 32]} position={[0, 1, 0]} castShadow>
          <meshPhysicalMaterial color="#c6a87c" metalness={1} roughness={0.1} clearcoat={1} />
        </Sphere>
      </group>

      {/* Premium Leather Seating (Deep Buttoned Look) */}
      <group position={[0, -2, 4]}>
        <Box args={[8, 1, 3]} position={[0, 0.5, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1a110a" metalness={0.2} roughness={0.7} clearcoat={0.1} />
        </Box>
        <Box args={[8, 2, 1]} position={[0, 1.5, -1]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1a110a" metalness={0.2} roughness={0.7} clearcoat={0.1} />
        </Box>
      </group>
    </group>
  );
});

LoungeArea.displayName = "LoungeArea";
