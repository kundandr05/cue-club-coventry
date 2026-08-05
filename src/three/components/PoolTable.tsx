"use client";

import { forwardRef } from "react";
import * as THREE from "three";
import { Box, Cylinder, Sphere, useGLTF } from "@react-three/drei";

// Preload the GLTF (Commented out until asset exists)
// useGLTF.preload('/models/pool_table.glb')

export const PoolTable = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  
  // TOGGLE THIS TO TRUE WHEN /public/models/pool_table.glb IS ADDED
  const USE_GLTF = false;
  
  // To allow easy swap with GLB later:
  // const { scene } = useGLTF('/models/pool_table.glb')
  // if (USE_GLTF && scene) return <primitive ref={ref} object={scene} {...props} />

  return (
    <group ref={ref} {...props}>
      {/* Main Table Bed (Premium Velvet Felt) */}
      <Box args={[6, 0.2, 10]} position={[0, -0.1, 0]} receiveShadow>
        <meshPhysicalMaterial 
          color="#061208" // deep rich green/black
          roughness={0.9} 
          metalness={0.1}
          clearcoat={0}
        />
      </Box>

      {/* Rails / Cushions (Polished Mahogany / Black Wood with clearcoat) */}
      <Box args={[6.4, 0.4, 10.4]} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshPhysicalMaterial 
          color="#121212" 
          metalness={0.8} 
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Box>
      
      {/* Inner Gold Accents */}
      <Box args={[6.1, 0.25, 10.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c6a87c" metalness={1} roughness={0.1} />
      </Box>

      {/* 
        BALLS & DETAILS 
        Added scattered balls and a chalk block to make it feel alive and in-use 
      */}
      
      {/* Cue Ball (Highly polished resin) */}
      <Sphere args={[0.15, 64, 64]} position={[0, 0.15, 3]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
      
      {/* 8-Ball */}
      <Sphere args={[0.15, 64, 64]} position={[0.2, 0.15, -2]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#111111" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>

      {/* Scattered Solids & Stripes */}
      <Sphere args={[0.15, 32, 32]} position={[-0.4, 0.15, -1.8]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#c60000" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.5, 0.15, -2.3]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffcc00" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[-0.1, 0.15, -2.5]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#0055ff" metalness={0.1} roughness={0.05} clearcoat={1} />
      </Sphere>
      
      {/* Cue Stick resting on the table */}
      <group position={[1.5, 0.1, 0]} rotation={[0, 0.3, Math.PI / 2]}>
        <Cylinder args={[0.02, 0.04, 5, 32]} castShadow>
          <meshPhysicalMaterial color="#4a2e15" clearcoat={1} roughness={0.2} />
        </Cylinder>
        {/* Cue Tip */}
        <Cylinder args={[0.02, 0.02, 0.1, 16]} position={[0, -2.55, 0]}>
          <meshStandardMaterial color="#0077ff" roughness={0.9} />
        </Cylinder>
      </group>

      {/* Chalk Cube on rail */}
      <Box args={[0.1, 0.1, 0.1]} position={[3.1, 0.05, 2]} rotation={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#0077ff" roughness={1} />
      </Box>

    </group>
  );
});

PoolTable.displayName = "PoolTable";
