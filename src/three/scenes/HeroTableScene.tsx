"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, MeshReflectorMaterial, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Vector2 } from "three";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// POOL BALLS
// ─────────────────────────────────────────────
const BALL_COLORS = [
  "#F5F3EE", // cue ball
  "#F5C518", // 1 - yellow
  "#1565C0", // 2 - blue
  "#B71C1C", // 3 - red
  "#6A1B9A", // 4 - purple
  "#E65100", // 5 - orange
  "#1B5E20", // 6 - green
  "#880E4F", // 7 - maroon
  "#0A0A0A", // 8 - black
];

function PoolBalls({ isMobile }: { isMobile: boolean }) {
  const positions: [number, number, number][] = [
    [-1.5, -0.85, 0],
    [0, -0.85, -0.5],   [0, -0.85, 0.5],
    [1.5, -0.85, -1],   [1.5, -0.85, 0],   [1.5, -0.85, 1],
    [3, -0.85, -1.5],   [3, -0.85, -0.5],  [3, -0.85, 0.5],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <Float key={i} speed={isMobile ? 0 : 0.5 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.05}>
          <mesh position={pos} castShadow={!isMobile}>
            <sphereGeometry args={[0.14, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
            <meshStandardMaterial
              color={BALL_COLORS[i]}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// POOL TABLE
// ─────────────────────────────────────────────
function PoolTable({ isMobile }: { isMobile: boolean }) {
  return (
    <group>
      {/* Felt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow={!isMobile}>
        <planeGeometry args={[11, 5.5]} />
        <meshStandardMaterial color="#0B3D2E" roughness={0.9} metalness={0} />
      </mesh>

      {/* Table Body */}
      <mesh position={[0, -1.35, 0]} receiveShadow={!isMobile}>
        <boxGeometry args={[11.6, 0.18, 6.1]} />
        <meshStandardMaterial color="#1a0d07" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Rails */}
      {[
        { pos: [0, -0.82, -2.9] as [number,number,number], size: [11.6, 0.22, 0.4] as [number,number,number] },
        { pos: [0, -0.82, 2.9] as [number,number,number],  size: [11.6, 0.22, 0.4] as [number,number,number] },
        { pos: [-5.9, -0.82, 0] as [number,number,number], size: [0.4, 0.22, 6.2] as [number,number,number] },
        { pos: [5.9, -0.82, 0] as [number,number,number],  size: [0.4, 0.22, 6.2] as [number,number,number] },
      ].map((r, i) => (
        <mesh key={i} position={r.pos} castShadow={!isMobile} receiveShadow={!isMobile}>
          <boxGeometry args={r.size} />
          <meshStandardMaterial color="#0d0704" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* Brass Corner Pockets */}
      {[
        [-5.7, -0.82, -2.7] as [number,number,number],
        [ 5.7, -0.82, -2.7] as [number,number,number],
        [-5.7, -0.82,  2.7] as [number,number,number],
        [ 5.7, -0.82,  2.7] as [number,number,number],
        [ 0,   -0.82, -2.8] as [number,number,number],
        [ 0,   -0.82,  2.8] as [number,number,number],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.18, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#C9A15A" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Table Legs */}
      {[
        [-5, -1.9, -2.3] as [number,number,number],
        [ 5, -1.9, -2.3] as [number,number,number],
        [-5, -1.9,  2.3] as [number,number,number],
        [ 5, -1.9,  2.3] as [number,number,number],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow={!isMobile}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color="#0d0704" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// LOUNGE ENVIRONMENT
// ─────────────────────────────────────────────
function LoungeEnvironment({ isMobile }: { isMobile: boolean }) {
  return (
    <group>
      {/* Floor - Reflector on desktop, dark glossy material on mobile */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isMobile}>
        <planeGeometry args={[60, 60]} />
        {!isMobile ? (
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={15}
            roughness={0.5}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#080808"
            metalness={0.6}
            mirror={0.5}
          />
        ) : (
          <meshStandardMaterial color="#060606" roughness={0.4} metalness={0.5} />
        )}
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -18]} receiveShadow={!isMobile}>
        <boxGeometry args={[60, 20, 0.5]} />
        <meshStandardMaterial color="#060606" roughness={0.95} />
      </mesh>

      {/* Side Walls */}
      <mesh position={[-18, 5, 0]} receiveShadow={!isMobile}>
        <boxGeometry args={[0.5, 20, 60]} />
        <meshStandardMaterial color="#060606" roughness={0.95} />
      </mesh>
      <mesh position={[18, 5, 0]} receiveShadow={!isMobile}>
        <boxGeometry args={[0.5, 20, 60]} />
        <meshStandardMaterial color="#060606" roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#040404" roughness={1} />
      </mesh>

      {/* Leather Sofas */}
      {[-10, 10].map((x, i) => (
        <group key={i} position={[x, -2, -10]}>
          <mesh position={[0, 0.6, 0]} receiveShadow={!isMobile}>
            <boxGeometry args={[5, 1.2, 2.5]} />
            <meshStandardMaterial color="#1a0a05" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.5, -1.1]} receiveShadow={!isMobile}>
            <boxGeometry args={[5, 1.6, 0.4]} />
            <meshStandardMaterial color="#1a0a05" roughness={0.6} />
          </mesh>
          <mesh position={[-2.3, 1.1, 0]}>
            <boxGeometry args={[0.4, 1, 2.5]} />
            <meshStandardMaterial color="#120705" roughness={0.5} />
          </mesh>
          <mesh position={[2.3, 1.1, 0]}>
            <boxGeometry args={[0.4, 1, 2.5]} />
            <meshStandardMaterial color="#120705" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Cue Rack */}
      <mesh position={[0, 3, -17.7]}>
        <boxGeometry args={[10, 5, 0.3]} />
        <meshStandardMaterial color="#0a0604" roughness={0.3} />
      </mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, 3, -17.5]} rotation={[0, 0, 0.05 * (i - 2)]}>
          <cylinderGeometry args={[0.04, 0.02, 4.5, 8]} />
          <meshStandardMaterial color="#C9A15A" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Wall Sconces — Left */}
      {[-6, 0, 6].map((z, i) => (
        <group key={i} position={[-17.7, 4, z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.6, 12]} />
            <meshStandardMaterial color="#C9A15A" metalness={0.9} roughness={0.2} emissive="#C9A15A" emissiveIntensity={0.5} />
          </mesh>
          <pointLight intensity={isMobile ? 1.5 : 3} distance={10} color="#FFD97A" decay={2} />
        </group>
      ))}

      {/* Wall Sconces — Right */}
      {[-6, 0, 6].map((z, i) => (
        <group key={i} position={[17.7, 4, z]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.6, 12]} />
            <meshStandardMaterial color="#C9A15A" metalness={0.9} roughness={0.2} emissive="#C9A15A" emissiveIntensity={0.5} />
          </mesh>
          <pointLight intensity={isMobile ? 1.5 : 3} distance={10} color="#FFD97A" decay={2} />
        </group>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// DUST MOTES
// ─────────────────────────────────────────────
function DustMotes({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 120 : 350;

  const [{ positions, velocities }] = useState(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 8 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vel[i]         = Math.random() * 0.003 + 0.001;
    }
    return { positions: pos, velocities: vel };
  });

  useFrame(() => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += velocities[i];
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFD97A" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ─────────────────────────────────────────────
// OVERHEAD LAMP
// ─────────────────────────────────────────────
function OverheadLamp({ isMobile }: { isMobile: boolean }) {
  return (
    <group position={[0, 5.5, 0]}>
      <mesh>
        <coneGeometry args={[0.8, 0.6, 16, 1, true]} />
        <meshStandardMaterial color="#1a0a05" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshStandardMaterial color="#C9A15A" metalness={0.9} roughness={0.2} />
      </mesh>
      <spotLight
        position={[0, -0.2, 0]}
        intensity={isMobile ? 35 : 60}
        angle={0.7}
        penumbra={0.5}
        color="#FFF5E0"
        castShadow={!isMobile}
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
        distance={20}
        decay={1.5}
      />
      <pointLight position={[0, -0.3, 0]} intensity={2} color="#FFF5E0" distance={5} />
    </group>
  );
}

// ─────────────────────────────────────────────
// SCENE RIG — Camera Controller
// ─────────────────────────────────────────────
function SceneRig({ loaded, isMobile }: { loaded: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (!loaded || !groupRef.current) return;

    // Start position — adjusted slightly for mobile aspect ratio
    const initialZ = isMobile ? 12 : 9;
    const initialY = isMobile ? 3.2 : 2.5;

    gsap.set(groupRef.current.position, { y: 8, z: 18 });
    gsap.set(groupRef.current.rotation, { x: -0.3 });
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);

    // Hero: cinematic dolly-in
    gsap.to(groupRef.current.position, { y: initialY, z: initialZ, duration: 2.5, ease: "power2.out" });
    gsap.to(groupRef.current.rotation, { x: -0.12, duration: 2.5, ease: "power2.out" });

    // About: pull back to reveal lounge
    gsap.to(groupRef.current.position, {
      y: isMobile ? 7 : 6, z: isMobile ? 24 : 20,
      ease: "none",
      scrollTrigger: { trigger: "#hero-section", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(groupRef.current.rotation, {
      x: -0.18,
      ease: "none",
      scrollTrigger: { trigger: "#hero-section", start: "top top", end: "bottom top", scrub: 1 }
    });

    // Booking: top-down view
    gsap.to(groupRef.current.position, {
      y: isMobile ? 18 : 16, z: 0.5,
      ease: "none",
      scrollTrigger: { trigger: "#about-section", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(groupRef.current.rotation, {
      x: -Math.PI / 2 + 0.1,
      ease: "none",
      scrollTrigger: { trigger: "#about-section", start: "top top", end: "bottom top", scrub: 1 }
    });

    // Membership: macro dive to pocket
    gsap.to(groupRef.current.position, {
      y: isMobile ? 0.6 : 0.2, z: isMobile ? 5 : 4, x: isMobile ? -2 : -4,
      ease: "none",
      scrollTrigger: { trigger: "#booking-section", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(groupRef.current.rotation, {
      x: -0.05, y: 0.3,
      ease: "none",
      scrollTrigger: { trigger: "#booking-section", start: "top top", end: "bottom top", scrub: 1 }
    });

    // Footer: pull back to dark
    gsap.to(groupRef.current.position, {
      y: 5, z: 30, x: 0,
      ease: "none",
      scrollTrigger: { trigger: "#membership-section", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(groupRef.current.rotation, {
      x: -0.08, y: 0,
      ease: "none",
      scrollTrigger: { trigger: "#membership-section", start: "top top", end: "bottom top", scrub: 1 }
    });
  }, [loaded, camera, isMobile]);

  // Mouse/Touch Parallax
  useFrame((state) => {
    if (!groupRef.current || isMobile) return;
    const px = (state.pointer.x * Math.PI) / 40;
    groupRef.current.rotation.y += 0.04 * (px - groupRef.current.rotation.y);
  });

  return (
    <group ref={groupRef}>
      <PerspectiveCamera makeDefault fov={isMobile ? 50 : 40} near={0.1} far={200} />
    </group>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export function HeroTableScene({ loaded }: { loaded: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={!isMobile ? "soft" : false}
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
      >
        <SceneRig loaded={loaded} isMobile={isMobile} />

        {/* Environment */}
        <Environment preset="night" />
        <fog attach="fog" args={["#020202", 15, 60]} />
        <ambientLight intensity={0.2} color="#FFD97A" />

        <OverheadLamp isMobile={isMobile} />
        <PoolTable isMobile={isMobile} />
        <PoolBalls isMobile={isMobile} />
        <DustMotes isMobile={isMobile} />
        <LoungeEnvironment isMobile={isMobile} />

        {!isMobile ? (
          <EffectComposer>
            <Bloom luminanceThreshold={0.6} mipmapBlur intensity={2} radius={0.4} />
            <ChromaticAberration offset={new Vector2(0.0005, 0.0005)} radialModulation={false} modulationOffset={0} />
            <Vignette eskil={false} offset={0.15} darkness={1.3} />
          </EffectComposer>
        ) : (
          <EffectComposer>
            <Bloom luminanceThreshold={0.7} intensity={1} radius={0.3} />
            <Vignette eskil={false} offset={0.2} darkness={1.2} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
