"use client";

import React from "react";
import { ClubFloor } from "./ClubFloor";
import { ClubWalls } from "./ClubWalls";
import { ClubCeiling } from "./ClubCeiling";
import { AmbientLight, SpotLight } from "three";

interface ClubEnvironmentProps {
  zone: "hero" | "lounge" | "facilities";
}

export function ClubEnvironment({ zone }: ClubEnvironmentProps) {
  
  // Teal and Orange cinematic lighting rig (Ref: Image 4)
  const renderLighting = () => (
    <>
      {/* Deep Teal Ambient fill */}
      <ambientLight intensity={1.5} color="#001824" />
      
      {/* Warm Orange Practical Glow */}
      <spotLight 
        position={[0, 5, 0]} 
        color="#ff8c00" 
        intensity={5} 
        angle={1.2} 
        penumbra={1} 
        distance={20} 
        castShadow
      />

      {/* Wall Washers (Highlighting the ribbed walls) */}
      <spotLight position={[-15, 6, -15]} color="#ff8c00" intensity={2} angle={0.8} penumbra={1} distance={20} target-position={[-20, 0, -20]} />
      <spotLight position={[15, 6, -15]} color="#ff8c00" intensity={2} angle={0.8} penumbra={1} distance={20} target-position={[20, 0, -20]} />
    </>
  );

  if (zone === "hero") {
    // Reference Image 3: The VIP Monolith
    return (
      <group>
        {renderLighting()}
        <ClubFloor type="marble" position={[0, -2, 0]} />
        <ClubWalls width={40} depth={40} height={12} position={[0, 4, 0]} />
        <ClubCeiling type="ornate" position={[0, 10, 0]} />
      </group>
    );
  }

  if (zone === "lounge") {
    // Reference Image 4: The Cinematic Lounge
    return (
      <group>
        {renderLighting()}
        <ClubFloor type="carpet" position={[0, -2, 0]} />
        <ClubWalls width={40} depth={40} height={12} position={[0, 4, 0]} />
        <ClubCeiling type="grid" position={[0, 10, 0]} />
      </group>
    );
  }

  if (zone === "facilities") {
    // Reference Image 2 & 4: Structural hall
    return (
      <group>
        {renderLighting()}
        <ClubFloor type="carpet" position={[0, -2, 0]} />
        <ClubWalls width={60} depth={40} height={10} position={[0, 3, 0]} />
        <ClubCeiling type="grid" position={[0, 8, 0]} width={60} />
      </group>
    );
  }

  return null;
}
