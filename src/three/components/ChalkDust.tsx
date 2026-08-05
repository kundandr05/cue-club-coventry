"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ChalkDust({ count = 200, bounds = 15 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create random initial positions and velocities for dust particles
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds,
          Math.random() * bounds * 0.5 + 2, // Floating primarily in the upper half (spotlights)
          (Math.random() - 0.5) * bounds
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01 + 0.005, // Slight upward drift
          (Math.random() - 0.5) * 0.01
        ),
        scale: Math.random() * 0.02 + 0.01, // Very small
      });
    }
    return temp;
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      // Add subtle turbulence
      particle.position.x += Math.sin(time * 0.5 + i) * 0.002 + particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += Math.cos(time * 0.5 + i) * 0.002 + particle.velocity.z;

      // Wrap around bounds
      if (particle.position.y > 8) particle.position.y = 2;
      if (particle.position.x > bounds / 2) particle.position.x = -bounds / 2;
      if (particle.position.x < -bounds / 2) particle.position.x = bounds / 2;
      if (particle.position.z > bounds / 2) particle.position.z = -bounds / 2;
      if (particle.position.z < -bounds / 2) particle.position.z = bounds / 2;

      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      {/* Chalk dust material: highly emissive to catch light, highly transparent */}
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}
