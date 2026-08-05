"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";

interface ClubWallsProps {
  width?: number;
  depth?: number;
  height?: number;
  position?: [number, number, number];
}

export function ClubWalls({
  width = 40,
  depth = 40,
  height = 10,
  position = [0, 0, 0]
}: ClubWallsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Reference Image 3: Dark, vertically ribbed acoustic wall panels.
  // We simulate this by instancing hundreds of thin vertical boxes along the perimeter.
  const panelWidth = 0.2;
  const panelGap = 0.05;
  const totalPanelWidth = panelWidth + panelGap;

  const numPanelsX = Math.floor(width / totalPanelWidth);
  const numPanelsZ = Math.floor(depth / totalPanelWidth);
  const totalPanels = (numPanelsX * 2) + (numPanelsZ * 2);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  React.useLayoutEffect(() => {
    if (!meshRef.current) return;

    let index = 0;
    const halfW = width / 2;
    const halfD = depth / 2;
    const halfH = height / 2;

    // Back Wall
    for (let i = 0; i < numPanelsX; i++) {
      dummy.position.set(-halfW + (i * totalPanelWidth), halfH, -halfD);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index++, dummy.matrix);
    }
    // Front Wall
    for (let i = 0; i < numPanelsX; i++) {
      dummy.position.set(-halfW + (i * totalPanelWidth), halfH, halfD);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index++, dummy.matrix);
    }
    // Left Wall
    for (let i = 0; i < numPanelsZ; i++) {
      dummy.position.set(-halfW, halfH, -halfD + (i * totalPanelWidth));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index++, dummy.matrix);
    }
    // Right Wall
    for (let i = 0; i < numPanelsZ; i++) {
      dummy.position.set(halfW, halfH, -halfD + (i * totalPanelWidth));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index++, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [width, depth, height, numPanelsX, numPanelsZ, totalPanelWidth, dummy]);

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, totalPanels]} receiveShadow castShadow>
        <boxGeometry args={[panelWidth, height, panelWidth]} />
        <meshStandardMaterial 
          color="#0a0a0a" // Very dark grey/black
          roughness={0.9} 
          metalness={0.1}
        />
      </instancedMesh>
      
      {/* Baseboards (Solid black band at bottom) */}
      <mesh position={[0, 0.5, -depth/2]} receiveShadow>
        <boxGeometry args={[width, 1, 0.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}
