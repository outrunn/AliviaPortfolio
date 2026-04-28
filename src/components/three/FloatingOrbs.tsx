"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "@/components/audio/AudioProvider";

interface OrbConfig {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  color: string;
  opacity: number;
}

const ORB_CONFIGS: OrbConfig[] = [
  { position: [-5, 3, -4], scale: 1.2, speed: 0.3, phase: 0, color: "#FF6EC7", opacity: 0.08 },
  { position: [6, -2, -6], scale: 1.8, speed: 0.2, phase: 1.5, color: "#A78BFA", opacity: 0.06 },
  { position: [-3, -4, -3], scale: 0.8, speed: 0.4, phase: 3, color: "#FFC2ED", opacity: 0.1 },
  { position: [4, 4, -5], scale: 1.4, speed: 0.25, phase: 4.5, color: "#8B5CF6", opacity: 0.07 },
  { position: [0, -1, -2], scale: 0.6, speed: 0.35, phase: 2, color: "#FF6EC7", opacity: 0.12 },
  { position: [-6, 0, -7], scale: 2.0, speed: 0.15, phase: 5, color: "#C084FC", opacity: 0.05 },
  { position: [3, -5, -4], scale: 0.9, speed: 0.3, phase: 1, color: "#FFC2ED", opacity: 0.09 },
  { position: [-2, 5, -5], scale: 1.1, speed: 0.22, phase: 3.5, color: "#A78BFA", opacity: 0.07 },
];

function Orb({ config }: { config: OrbConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { audioData, isPlaying } = useAudio();

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.color),
      transparent: true,
      opacity: config.opacity,
    });
  }, [config.color, config.opacity]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;
    const bass = isPlaying ? audioData.bass : 0;
    const volume = isPlaying ? audioData.volume : 0;

    // Gentle floating motion
    meshRef.current.position.x =
      config.position[0] + Math.sin(t * config.speed + config.phase) * 1.5;
    meshRef.current.position.y =
      config.position[1] + Math.cos(t * config.speed * 0.7 + config.phase) * 1.2;
    meshRef.current.position.z =
      config.position[2] + Math.sin(t * config.speed * 0.3 + config.phase) * 0.5;

    // Audio-reactive scale pulse
    const audioScale = 1 + bass * 0.3 + volume * 0.1;
    const breathe = 1 + Math.sin(t * 0.5 + config.phase) * 0.05;
    meshRef.current.scale.setScalar(config.scale * audioScale * breathe);

    // Audio-reactive opacity
    material.opacity = config.opacity + volume * 0.08;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  );
}

export function FloatingOrbs() {
  return (
    <>
      {ORB_CONFIGS.map((config, i) => (
        <Orb key={i} config={config} />
      ))}
    </>
  );
}
