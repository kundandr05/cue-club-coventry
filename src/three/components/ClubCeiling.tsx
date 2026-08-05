"use client";

import React from "react";
import * as THREE from "three";

interface ClubCeilingProps {
  type?: "ornate" | "grid";
  position?: [number, number, number];
  width?: number;
  depth?: number;
}

export function ClubCeiling({ 
  type = "ornate", 
  position = [0, 8, 0],
  width = 40,
  depth = 40
}: ClubCeilingProps) {

  // Reference Image 3: Ornate, multi-tiered circular ceiling with glowing inlays
  if (type === "ornate") {
    return (
      <group position={position}>
        {/* Main dark ceiling plane */}
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>

        {/* Outer glowing ring */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 10, 64]} />
          <meshStandardMaterial color="#c6a87c" emissive="#c6a87c" emissiveIntensity={2} />
        </mesh>

        {/* Mid carved dome (inverted cone/cylinder) */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[8, 10, 1.2, 64]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>

        {/* Inner glowing ring */}
        <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.5, 8, 64]} />
          <meshStandardMaterial color="#c6a87c" emissive="#c6a87c" emissiveIntensity={3} />
        </mesh>

        {/* Inner dome */}
        <mesh position={[0, 1.5, 0]} receiveShadow>
          <cylinderGeometry args={[3, 8, 1, 64]} />
          <meshStandardMaterial color="#080808" roughness={0.9} />
        </mesh>

        {/* Center Chandelier Core */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 3, 3, 32]} />
          <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  // Reference Image 4: Dark exposed architectural grid
  return (
    <group position={position}>
      {/* Base black ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
      
      {/* Grid pattern (Simulated using wireframe or grid helper for simplicity and performance) */}
      <gridHelper args={[width, Math.floor(width/2), 0x1a1a1a, 0x1a1a1a]} position={[0, -0.1, 0]} />
    </group>
  );
}
