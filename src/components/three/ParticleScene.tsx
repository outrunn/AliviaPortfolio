"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "./ParticleSystem";

export function ParticleScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
