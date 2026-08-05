"use client";

import { Canvas } from "@react-three/fiber";
import { View, Preload, Bvh } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";

export default function GlobalCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Canvas
        eventSource={typeof window !== "undefined" ? document.getElementById("root") || document.body : undefined}
        className="pointer-events-auto"
        shadows
        dpr={[1, 2]} // Performance optimization: cap DPR at 2 for mobile
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} // Antialias false because we use postprocessing
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {/* Optimize raycasting with Bounding Volume Hierarchy */}
        <Bvh firstHitOnly>
          {/* View.Port is where the individual <View> components from DOM will render */}
          <View.Port />
        </Bvh>

        {/* Global Post Processing */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.8}
            intensity={1.5}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        {/* Preload assets for seamless transitions */}
        <Preload all />
      </Canvas>
    </div>
  );
}
