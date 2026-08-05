"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, SpotLight, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { PendantLight } from "./components/PendantLight";

export default function AboutScene() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const tableRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !tableRef.current || !cameraRef.current) return;

    // We start the camera EXACTLY where the Hero scene ended.
    // Hero End State: cameraGroup.position = { x: 0, y: 2.5, z: 7 }
    // Hero End State: camera.rotation = { x: -0.1, y: 0, z: 0 }
    // Hero End State: table.rotation = { y: Math.PI }
    
    gsap.set(cameraGroupRef.current.position, { x: 0, y: 2.5, z: 7 });
    gsap.set(cameraRef.current.rotation, { x: -0.1, y: 0, z: 0 });
    gsap.set(tableRef.current.rotation, { y: Math.PI });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 1. Slow cinematic dolly toward the Lounge Area (which is at -10, 0, -10)
    // The camera smoothly glides past the pool table.
    tl.to(cameraGroupRef.current.position, {
      x: -6,
      y: 1.5,
      z: -4,
      ease: "power2.inOut",
    })
    .to(cameraRef.current.rotation, {
      x: 0,
      y: Math.PI / 6, // Slowly pan left toward the bar
      z: 0,
      ease: "power2.inOut",
    }, "<");

  }, []);

  // Handheld camera feel & continuous cinematic drift (Same as Hero to maintain continuity)
  useFrame((state, delta) => {
    if (cameraGroupRef.current) {
      const time = state.clock.getElapsedTime();

      // Subtle handheld breathing (vertical and horizontal drift)
      cameraGroupRef.current.position.y += Math.sin(time * 0.5) * 0.001;
      cameraGroupRef.current.position.x += Math.cos(time * 0.3) * 0.001;

      // Smooth mouse parallax applied to camera rotation
      const targetX = (state.pointer.x * Math.PI) / 30;
      const targetY = (state.pointer.y * Math.PI) / 30;
      
      cameraGroupRef.current.rotation.y += 0.02 * (-targetX - cameraGroupRef.current.rotation.y);
      cameraGroupRef.current.rotation.x += 0.02 * (targetY - cameraGroupRef.current.rotation.x);
    }
  });

  return (
    <>
      {/* Grounding the scene with the physical VIP architecture */}
      <ClubEnvironment zone="club" />

      {/* Camera Rig */}
      <group ref={cameraGroupRef}>
        <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={0.1} far={100} />
      </group>

      <Center>
        <group>
          <PendantLight position={[0, 4.5, 0]} intensity={10} distance={20} />
          <PoolTable ref={tableRef} />
        </group>
      </Center>
    </>
  );
}
