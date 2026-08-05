"use client";

import React, { useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DustMotes() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // GPU instanced dust particles
  const particlesCount = 200;
  const [{ positions, velocities }] = React.useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    const vel = new Float32Array(particlesCount);
    for(let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i] = Math.random() * 0.005 + 0.001;
    }
    return { positions: pos, velocities: vel };
  });

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for(let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += velocities[i];
        if(positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = 0;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function PoolTable() {
  return (
    <group position={[0, -1, 0]}>
      {/* The Felt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#0B3D2E" roughness={0.8} />
      </mesh>
      
      {/* The Cushions/Rails */}
      <mesh position={[0, 0.2, -3.1]} receiveShadow castShadow>
        <boxGeometry args={[12.4, 0.4, 0.2]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 3.1]} receiveShadow castShadow>
        <boxGeometry args={[12.4, 0.4, 0.2]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
      </mesh>
      <mesh position={[-6.1, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
      </mesh>
      <mesh position={[6.1, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
      </mesh>

      {/* A single glossy ball */}
      <mesh position={[-2, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial color="#ffffff" clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </group>
  );
}

function LoungeEnvironment() {
  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, 4, -15]} receiveShadow>
        <boxGeometry args={[40, 15, 1]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      
      {/* Side Walls */}
      <mesh position={[-15, 4, 0]} receiveShadow>
        <boxGeometry args={[1, 15, 40]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh position={[15, 4, 0]} receiveShadow>
        <boxGeometry args={[1, 15, 40]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#020202" roughness={0.8} />
      </mesh>

      {/* Sofa Silhouette (Left) */}
      <mesh position={[-8, 0, -8]} receiveShadow>
        <boxGeometry args={[6, 2.5, 3]} />
        <meshStandardMaterial color="#080504" roughness={0.7} />
      </mesh>
      
      {/* Sofa Silhouette (Right) */}
      <mesh position={[8, 0, -8]} receiveShadow>
        <boxGeometry args={[6, 2.5, 3]} />
        <meshStandardMaterial color="#080504" roughness={0.7} />
      </mesh>

      {/* Cue Racks Silhouette */}
      <mesh position={[0, 3, -14.4]} receiveShadow>
        <boxGeometry args={[8, 6, 0.2]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.8} />
      </mesh>

      {/* Wall Sconces */}
      <group position={[-10, 5, -14.4]}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.2]} />
          <meshBasicMaterial color="#C9A15A" />
        </mesh>
        <pointLight intensity={2} distance={15} color="#C9A15A" castShadow />
      </group>
      
      <group position={[10, 5, -14.4]}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.2]} />
          <meshBasicMaterial color="#C9A15A" />
        </mesh>
        <pointLight intensity={2} distance={15} color="#C9A15A" castShadow />
      </group>
    </group>
  );
}

function SceneRig({ loaded }: { loaded: boolean }) {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Cinematic Dolly-In on Load
  useLayoutEffect(() => {
    if (loaded && cameraGroupRef.current) {
      // Start far and high
      gsap.set(cameraGroupRef.current.position, { x: 0, y: 5, z: 12 });
      gsap.set(cameraGroupRef.current.rotation, { x: -0.2, y: 0, z: 0 });

      // Dolly in slow for Hero Load
      gsap.to(cameraGroupRef.current.position, {
        x: 0,
        y: 2,
        z: 6,
        duration: 2.5,
        ease: "power2.out",
      });

      // ScrollTrigger: Pull back for About Lounge
      // We animate the camera group position and rotation as we scroll through the page
      gsap.to(cameraGroupRef.current.position, {
        y: 6,
        z: 18,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(cameraGroupRef.current.rotation, {
        x: -0.15,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  }, [loaded]);

  // Subtle Parallax on Mouse Move
  useFrame((state) => {
    if (cameraGroupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 30;
      const targetY = (state.pointer.y * Math.PI) / 30;
      
      cameraGroupRef.current.rotation.y += 0.05 * (-targetX - cameraGroupRef.current.rotation.y);
      cameraGroupRef.current.rotation.x += 0.05 * (-0.2 + targetY - cameraGroupRef.current.rotation.x);
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} near={0.1} far={100} />
    </group>
  );
}

export function HeroTableScene({ loaded }: { loaded: boolean }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows dpr={[1, 2]}>
        <SceneRig loaded={loaded} />
        
        {/* Mood Lighting */}
        <ambientLight intensity={0.2} color="#F5F3EE" />
        <spotLight 
          position={[0, 8, 0]} 
          intensity={5} 
          angle={0.8} 
          penumbra={1} 
          color="#C9A15A" 
          castShadow 
          shadow-bias={-0.0001}
        />

        <PoolTable />
        <LoungeEnvironment />
        <DustMotes />

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
