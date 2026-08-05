"use client";

import * as React from "react";
import { forwardRef } from "react";
import { Box, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

export const SnookerTable = forwardRef<THREE.Group, React.ComponentProps<'group'>>((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Snooker Table Bed (Larger, Deep Green Felt) */}
      {/* English Snooker table is 12ft x 6ft, larger than American Pool */}
      <Box args={[7.2, 0.2, 12]} position={[0, -0.1, 0]} receiveShadow>
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.9} // Slightly rougher than pool table
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#061c0e" // Deep Snooker Green
          metalness={0.2}
          mirror={0}
        />
      </Box>

      {/* Rails / Cushions (Darker Mahogany/Walnut Trim) */}
      <Box args={[7.6, 0.4, 12.4]} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#1a0f0a" metalness={0.5} roughness={0.6} />
      </Box>
      
      {/* Inner Trim / Pockets Placeholder */}
      <Box args={[7.3, 0.25, 12.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Snooker Balls (Abstract setup) */}
      <mesh position={[0, 0.4, -3]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial color="#c0262c" metalness={0.1} roughness={0.2} clearcoat={1} />
      </mesh>
      
      <mesh position={[0.3, 0.4, -3.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial color="#111" metalness={0.1} roughness={0.2} clearcoat={1} />
      </mesh>
      
      <mesh position={[-0.3, 0.4, -3.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial color="#f0d58b" metalness={0.1} roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
});

SnookerTable.displayName = "SnookerTable";
