"use client";

import { Canvas } from "@react-three/fiber";
import { View, Preload } from "@react-three/drei";
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
        {/* View.Port is where the individual <View> components from DOM will render */}
        <View.Port />

        {/* Global Post Processing */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={2.5}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={1.3} />
        </EffectComposer>

        {/* Preload assets for seamless transitions */}
        <Preload all />
      </Canvas>
    </div>
  );
}
