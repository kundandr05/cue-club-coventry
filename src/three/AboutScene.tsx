"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";

export default function AboutScene() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const tableRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !tableRef.current) return;

    // We start the table rotated 180 degrees (Math.PI) to perfectly match the end of HeroScene
    gsap.set(tableRef.current.rotation, { y: Math.PI });
    
    // Set initial camera group position (macro shot of the table edge)
    gsap.set(cameraGroupRef.current.position, { x: -2, y: 1, z: 4 });
    gsap.set(cameraGroupRef.current.rotation, { x: -0.2, y: -0.4, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 1. Move camera across the felt to the cue ball
    tl.to(cameraGroupRef.current.position, {
      x: 0,
      y: 0.8,
      z: 2.5,
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      x: -0.1,
      y: 0,
      z: 0,
      ease: "power2.inOut",
    }, "<")
    
    // 2. Rotate table slowly while zooming in
    .to(tableRef.current.rotation, {
      y: Math.PI + Math.PI / 2, // Rotate another 90 degrees
      ease: "none",
    }, "<")

    // 3. Extreme macro on the cue ball
    .to(cameraGroupRef.current.position, {
      x: 0,
      y: 0.5,
      z: 2.2, // Very close
      ease: "power2.inOut",
    })
    .to(cameraGroupRef.current.rotation, {
      x: -0.05,
      ease: "power2.inOut",
    }, "<");

  }, []);

  return (
    <>
      {/* Matching Hero Lighting */}
      <ambientLight intensity={0.1} />
      <SpotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={3}
        color="#c6a87c"
        castShadow
      />
      <SpotLight
        position={[5, 2, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />

      {/* The Camera Group that moves around the table */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera makeDefault fov={45} near={0.1} far={100} />
      </group>

      <Center>
        <PoolTable ref={tableRef} />
      </Center>
    </>
  );
}
