"use client";

import { forwardRef } from "react";
import { Box, Sphere, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the GLTF (Commented out until asset exists)
// useGLTF.preload('/models/snooker_table.glb')

export const SnookerTable = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  
  // TOGGLE THIS TO TRUE WHEN /public/models/snooker_table.glb IS ADDED
  const USE_GLTF = false;
  
  // To allow easy swap with GLB later:
  // const { scene } = useGLTF('/models/snooker_table.glb')
  // if (USE_GLTF && scene) return <primitive ref={ref} object={scene} {...props} />
  return (
    <group ref={ref} {...props}>
      {/* Snooker Table Bed (Larger, Deep Green Velvet Felt) */}
      <Box args={[7.2, 0.2, 12]} position={[0, -0.1, 0]} receiveShadow>
        <meshPhysicalMaterial 
          color="#031a08" // Deep Snooker Green
          roughness={0.9}
          metalness={0.1}
          clearcoat={0}
        />
      </Box>

      {/* Rails / Cushions (Darker Mahogany/Walnut Trim) */}
      <Box args={[7.6, 0.4, 12.4]} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshPhysicalMaterial 
          color="#1a0f0a" 
          metalness={0.5} 
          roughness={0.2} 
          clearcoat={1} 
          clearcoatRoughness={0.2}
        />
      </Box>
      
      {/* Inner Trim / Pockets Placeholder */}
      <Box args={[7.3, 0.25, 12.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Snooker Balls (Triangle Setup of Reds) */}
      <group position={[0, 0.25, -2]}>
        {/* Generate a simple triangle of 15 red balls */}
        {[0, 1, 2, 3, 4].map((row) => (
          Array.from({ length: row + 1 }).map((_, col) => (
            <Sphere 
              key={`${row}-${col}`}
              args={[0.15, 32, 32]} 
              position={[
                (col - row / 2) * 0.31, 
                0, 
                -row * 0.27
              ]} 
              castShadow 
              receiveShadow
            >
              <meshPhysicalMaterial color="#c01111" metalness={0.1} roughness={0.05} clearcoat={1} />
            </Sphere>
          ))
        ))}
      </group>

      {/* Cue Ball */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0.25, 3]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>

      {/* Black Ball on its spot */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0.25, -4.5]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#050505" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
      
      {/* Pink Ball on its spot */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0.25, -1]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ff7a9f" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
    </group>
  );
});

SnookerTable.displayName = "SnookerTable";
