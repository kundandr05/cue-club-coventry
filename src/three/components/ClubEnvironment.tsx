"use client";

import React from "react";
import { ClubFloor } from "./ClubFloor";
import { ClubWalls } from "./ClubWalls";
import { ClubCeiling } from "./ClubCeiling";
import { LoungeArea } from "./LoungeArea";
import { AmbientLight, SpotLight } from "three";

interface ClubEnvironmentProps {
  zone: "club" | "lounge" | "facilities";
}

export function ClubEnvironment({ zone }: ClubEnvironmentProps) {
  
  // Bright Daylight Gallery lighting rig (White Theme Experiment)
  const renderLighting = () => (
    <>
      {/* Soft bright daylight ambient fill */}
      <ambientLight intensity={3.5} color="#ffffff" />
      
      {/* Clean White Practical Glow */}
      <spotLight 
        position={[0, 5, 0]} 
        color="#f8fbff" 
        intensity={3} 
        angle={1.2} 
        penumbra={1} 
        distance={20} 
        castShadow
      />

      {/* Wall Washers (Clean gallery spotlights) */}
      <spotLight position={[-15, 6, -15]} color="#ffffff" intensity={1.5} angle={0.8} penumbra={1} distance={20} target-position={[-20, 0, -20]} />
      <spotLight position={[15, 6, -15]} color="#ffffff" intensity={1.5} angle={0.8} penumbra={1} distance={20} target-position={[20, 0, -20]} />
    </>
  );

  if (zone === "club") {
    // Reference Image 3 & 4: Continuous VIP Club Environment
    return (
      <group>
        {renderLighting()}
        <ClubFloor type="marble" position={[0, -2, 0]} />
        <ClubWalls width={40} depth={40} height={12} position={[0, 4, 0]} />
        <ClubCeiling type="ornate" position={[0, 10, 0]} />
        
        {/* The Lounge, Bar, and Cue Display situated in the background behind the pool table */}
        <LoungeArea position={[-10, 0, -10]} rotation={[0, Math.PI / 4, 0]} />
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
