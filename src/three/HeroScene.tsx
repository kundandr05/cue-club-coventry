"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, SpotLight, Float, MeshReflectorMaterial, Box } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { Atmosphere } from "./components/Atmosphere";
import { LuxuryFloor } from "./components/LuxuryFloor";
import { ArchitecturalPillars } from "./components/ArchitecturalPillars";
import { PendantLight } from "./components/PendantLight";

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  // Cinematic Loading Animation (Entry)
  useLayoutEffect(() => {
    if (!groupRef.current) return;
    
    // Initial State: Table is rotated and lower, ball is invisible
    gsap.set(groupRef.current.position, { y: -5 });
    gsap.set(groupRef.current.rotation, { x: Math.PI / 4, y: Math.PI / 4 });

    
    const tl = gsap.timeline();
    
    // Animate table up and into perspective
    tl.to(groupRef.current.position, {
      y: 0,
      duration: 2.5,
      ease: "power4.out"
    })
    .to(groupRef.current.rotation, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: "power4.out"
    }, "<");
    
    // Scroll transition choreography
    gsap.to(groupRef.current.rotation, {
      y: Math.PI, // rotate 180 degrees on scroll
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

  }, []);

  // Mouse Parallax & Continuous Cinematic Drift
  useFrame((state, delta) => {
    if (parallaxGroupRef.current) {
      // Continuous slow drift for cinematic feel
      parallaxGroupRef.current.rotation.y += delta * 0.05;

      // Gentle floating/breathing effect combined with mouse parallax
      const targetX = (state.pointer.x * Math.PI) / 20;
      const targetY = (state.pointer.y * Math.PI) / 20;
      
      parallaxGroupRef.current.rotation.x += 0.02 * (targetY - parallaxGroupRef.current.rotation.x);
      parallaxGroupRef.current.rotation.y += 0.02 * (targetX - parallaxGroupRef.current.rotation.y);
    }
  });

  return (
    <>
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.1} />
      <SpotLight
        ref={lightRef}
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={3}
        color="#c6a87c" // Gold accent
        castShadow
      />
      <SpotLight
        position={[5, 2, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />
      {/* Ambient moody light */}
      <ambientLight intensity={0.2} color="#000510" />

      {/* Cinematic Atmosphere (Particles, Fog) */}
      <Atmosphere />

      {/* Grounding the scene with a highly reflective luxury floor */}
      <LuxuryFloor isReflective={true} position={[0, -2, 0]} />

      {/* Architectural boundary */}
      <ArchitecturalPillars depth={-20} width={60} count={8} />

      <group ref={groupRef} scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 1}>
        <group ref={parallaxGroupRef}>
          <Center>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <PoolTable />
            </Float>
          </Center>

          {/* Premium Pendant Light hovering right over the table */}
          <PendantLight position={[0, 4.5, 0]} intensity={10} distance={20} />
        </group>
      </group>
    </>
  );
}
