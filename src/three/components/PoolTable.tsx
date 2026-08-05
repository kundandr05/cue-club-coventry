"use client";

import * as React from "react";
import { forwardRef } from "react";
import * as THREE from "three";
import { Box, MeshReflectorMaterial } from "@react-three/drei";

export const PoolTable = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Main Table Bed (Felt) */}
      <Box args={[6, 0.2, 10]} position={[0, -0.1, 0]} receiveShadow>
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.5}
          mirror={0} // Required for MeshReflectorMaterial
        />
      </Box>

      {/* Rails / Cushions (Gold Trim) */}
      <Box args={[6.4, 0.4, 10.4]} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#121212" metalness={0.9} roughness={0.2} />
      </Box>
      
      {/* Inner Gold Accents */}
      <Box args={[6.1, 0.25, 10.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#c6a87c" metalness={1} roughness={0.1} />
      </Box>

      {/* Cue Ball */}
      <mesh position={[0, 0.4, 2]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 64, 64]} />
        <meshPhysicalMaterial 
          color="#ededed" 
          metalness={0.2} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Additional Balls (Abstract) */}
      <mesh position={[1, 0.4, -2]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 64, 64]} />
        <meshStandardMaterial color="#c6a87c" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
});

PoolTable.displayName = "PoolTable";
