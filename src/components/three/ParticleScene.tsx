"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "./ParticleSystem";
import { useIsMobile } from "@/hooks/useIsMobile";

export function ParticleScene() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
