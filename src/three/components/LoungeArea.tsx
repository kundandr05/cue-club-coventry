"use client";

import * as React from "react";
import { forwardRef } from "react";
import { Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export const LoungeArea = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Premium Bar Surface */}
      <Box args={[12, 1.2, 3]} position={[0, 0.6, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </Box>
      
      {/* Bar Base / Paneling */}
      <Box args={[11.8, 4, 2.8]} position={[0, -2, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
      </Box>

      {/* Gold Trim on Bar */}
      <Box args={[12.2, 0.1, 3.2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#c6a87c" metalness={1} roughness={0.2} />
      </Box>

      {/* Cue Rack */}
      <group position={[-5, 2, -1.2]}>
        <Box args={[0.2, 8, 0.5]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#1a0f0a" metalness={0.2} roughness={0.8} />
        </Box>
        {/* Abstract Cues */}
        {[0, 1, 2, 3].map((i) => (
          <Cylinder key={i} args={[0.03, 0.05, 5, 16]} position={[0.3 + i * 0.4, -1, 0.2]} rotation={[0, 0, 0.05]} castShadow>
            <meshStandardMaterial color="#dcd0b3" metalness={0.1} roughness={0.9} />
          </Cylinder>
        ))}
      </group>

      {/* Trophy Shelf / Display */}
      <group position={[4, 3, -1]}>
        <Box args={[4, 0.2, 1]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[4, 0.2, 1]} position={[0, 2, 0]} castShadow>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Abstract Trophy */}
        <Cylinder args={[0.2, 0.1, 0.8, 32]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#c6a87c" metalness={1} roughness={0.1} />
        </Cylinder>
      </group>

      {/* Seating Silhouette (Abstract Leather Sofa) */}
      <group position={[0, -2, 4]}>
        <Box args={[8, 1, 3]} position={[0, 0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#080808" metalness={0.1} roughness={0.9} />
        </Box>
        <Box args={[8, 2, 1]} position={[0, 1.5, -1]} castShadow receiveShadow>
          <meshStandardMaterial color="#080808" metalness={0.1} roughness={0.9} />
        </Box>
      </group>
    </group>
  );
});

LoungeArea.displayName = "LoungeArea";
