"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function CueBall({ progress, onComplete }: { progress: number; onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Micro-jitter when loading is nearly done
  useFrame(() => {
    if (progress > 95 && progress < 100 && meshRef.current) {
      meshRef.current.position.x = (Math.random() - 0.5) * 0.05;
      meshRef.current.position.y = (Math.random() - 0.5) * 0.05;
    }
  });

  // The Break animation
  useEffect(() => {
    if (progress === 100 && meshRef.current) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // Strike
      tl.to(meshRef.current.position, {
        z: -5,
        duration: 0.12,
        ease: "power4.in"
      });
      // The burst/fade out is handled by the parent fading the canvas
    }
  }, [progress, onComplete]);

  return (
    <group>
      {/* Spot-lit cue ball */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Progress Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 64, 1, 0, (progress / 100) * Math.PI * 2]} />
        <meshBasicMaterial color="#C9A15A" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Loader({ onLoaded }: { onLoaded: () => void }) {
  const { progress: actualProgress } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Since we don't have heavy GLB assets yet, simulate a fast load
  // When real assets are added, this will just serve as a minimum loader time
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setSimulatedProgress(Math.max(current, actualProgress));
    }, 100);

    return () => clearInterval(interval);
  }, [actualProgress]);

  const progress = Math.min(simulatedProgress, 100);

  const handleComplete = () => {
    // Fade out the loader
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setVisible(false);
        onLoaded();
      }
    });
  };

  if (!visible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <spotLight position={[0, 5, 2]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />
          <CueBall progress={progress === 100 ? 100 : progress} onComplete={handleComplete} />
        </Canvas>
      </div>
      
      <div className="absolute bottom-8 left-8 text-porcelain font-mono text-sm tracking-widest">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
