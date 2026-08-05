"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PoolTable } from "./components/PoolTable";
import { ClubEnvironment } from "./components/ClubEnvironment";
import { PendantLight } from "./components/PendantLight";
import { useStore } from "@/store/useStore";

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);

  const isAppLoaded = useStore((state) => state.isAppLoaded);

  // Cinematic Loading Animation (Entry)
  useLayoutEffect(() => {
    if (!cameraGroupRef.current || !cameraRef.current) return;
    
    if (!isAppLoaded) {
      // Start low and far
      gsap.set(cameraGroupRef.current.position, { y: 1, z: 12 });
      gsap.set(cameraRef.current.rotation, { x: 0.1 }); // Look slightly up
      return;
    }

    const tl = gsap.timeline();
    
    // Slow, elegant crane up and push in
    tl.to(cameraGroupRef.current.position, {
      y: 2.5,
      z: 7,
      duration: 3,
      ease: "power3.out"
    })
    .to(cameraRef.current.rotation, {
      x: -0.1, // Look slightly down at the table
      duration: 3,
      ease: "power3.out"
    }, "<");
    
    // Scroll transition choreography (rotate the table as we scroll down)
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI, 
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }

  }, [isAppLoaded]);

  // Handheld camera feel & continuous cinematic drift
  useFrame((state, delta) => {
    if (cameraGroupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Extremely slow continuous push-in (dolly)
      cameraGroupRef.current.position.z -= delta * 0.05;

      // Subtle handheld breathing (vertical and horizontal drift)
      cameraGroupRef.current.position.y += Math.sin(time * 0.5) * 0.001;
      cameraGroupRef.current.position.x += Math.cos(time * 0.3) * 0.001;

      // Smooth mouse parallax applied to camera rotation
      const targetX = (state.pointer.x * Math.PI) / 30;
      const targetY = (state.pointer.y * Math.PI) / 30;
      
      cameraGroupRef.current.rotation.y += 0.02 * (-targetX - cameraGroupRef.current.rotation.y);
      cameraGroupRef.current.rotation.x += 0.02 * (targetY - cameraGroupRef.current.rotation.x);
    }
    
    if (groupRef.current) {
      // Slow orbit of the environment
      groupRef.current.rotation.y += delta * 0.02;
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

      <group ref={groupRef} scale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 1}>
        <Center>
          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            <PoolTable />
          </Float>
        </Center>

        {/* Premium Pendant Light hovering right over the table */}
        <PendantLight position={[0, 4.5, 0]} intensity={10} distance={20} />
      </group>
    </>
  );
}
