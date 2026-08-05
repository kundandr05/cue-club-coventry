"use client";

import React from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ClubFloorProps {
  type?: "marble" | "carpet";
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
}

export function ClubFloor({ 
  type = "marble", 
  position = [0, -1.5, 0], 
  rotation = [-Math.PI / 2, 0, 0], 
  size = [100, 100]
}: ClubFloorProps) {

  // Reference Image 3: Black marble floor with high reflectivity
  if (type === "marble") {
    return (
      <group position={position} rotation={rotation}>
        <mesh receiveShadow>
          <planeGeometry args={size} />
          {/* Pristine White Carrara Marble */}
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={80}
            roughness={0.05} // Highly polished
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#f0f0f0" // Bright white base
            metalness={0.1}
            mirror={1}
          />
        </mesh>
        
        {/* Brass Inlays (Reference Image 3) */}
        <mesh position={[0, 0, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4, 4.05, 128]} />
          <meshStandardMaterial color="#c6a87c" emissive="#c6a87c" emissiveIntensity={3} metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.02, 128]} />
          <meshStandardMaterial color="#c6a87c" emissive="#c6a87c" emissiveIntensity={1.5} metalness={1} roughness={0} />
        </mesh>
      </group>
    );
  }

  // Reference Image 4: Dark patterned carpet (matte, high roughness)
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshPhysicalMaterial 
        color="#1a1515" // Deep warm grey/brown
        roughness={1} 
        metalness={0}
        clearcoat={0}
      />
    </mesh>
  );
}
