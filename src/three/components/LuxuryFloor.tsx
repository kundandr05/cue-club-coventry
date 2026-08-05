"use client";

import React from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

interface LuxuryFloorProps {
  isReflective?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  size?: [number, number];
}

export function LuxuryFloor({ 
  isReflective = false, 
  position = [0, -1.5, 0], 
  rotation = [-Math.PI / 2, 0, 0], 
  color = "#050505",
  size = [100, 100]
}: LuxuryFloorProps) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      {isReflective ? (
        <MeshReflectorMaterial
          blur={[300, 100]} // Blur ground reflections (width, height), 0 skips blur
          resolution={512} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mixBlur={1} // How much blur mixes with surface roughness
          mixStrength={40} // Strength of the reflections
          roughness={0.2}
          depthScale={1.2} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={color}
          metalness={0.5}
          mirror={1}
        />
      ) : (
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.8} 
          metalness={0.2}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
        />
      )}
    </mesh>
  );
}
