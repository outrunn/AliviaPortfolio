"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "@/components/audio/AudioProvider";
import { defaultTheme, type SongTheme } from "@/data/songs";
import { particleVertex, particleFragment } from "./shaders";

const PARTICLE_COUNT = 3000;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

function lerpColor(
  current: Float32Array,
  targetColors: THREE.Vector3[],
  index: number,
  factor: number
) {
  const ci = index % targetColors.length;
  const target = targetColors[ci];
  const i3 = index * 3;
  current[i3] += (target.x - current[i3]) * factor;
  current[i3 + 1] += (target.y - current[i3 + 1]) * factor;
  current[i3 + 2] += (target.z - current[i3 + 2]) * factor;
}

export function ParticleSystem() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { audioData, currentTheme } = useAudio();
  const prevThemeRef = useRef<SongTheme>(defaultTheme);

  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    const initColors = defaultTheme.colors.map(hexToVec3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const ci = i % initColors.length;
      colors[i * 3] = initColors[ci].x;
      colors[i * 3 + 1] = initColors[ci].y;
      colors[i * 3 + 2] = initColors[ci].z;

      sizes[i] = Math.random() * 3 + 1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, phases };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uVolume: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const mat = materialRef.current;

    mat.uniforms.uTime.value = time;
    mat.uniforms.uBass.value += (audioData.bass - mat.uniforms.uBass.value) * 0.1;
    mat.uniforms.uMid.value += (audioData.mid - mat.uniforms.uMid.value) * 0.1;
    mat.uniforms.uTreble.value += (audioData.treble - mat.uniforms.uTreble.value) * 0.1;
    mat.uniforms.uVolume.value += (audioData.volume - mat.uniforms.uVolume.value) * 0.1;

    const geo = meshRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const colorAttr = geo.getAttribute("aColor") as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const col = colorAttr.array as Float32Array;

    const targetColors = currentTheme.colors.map(hexToVec3);
    const speed = currentTheme.speed;
    const behavior = currentTheme.particleBehavior;
    const clusterBottom = currentTheme.clusterBottom;
    const bass = mat.uniforms.uBass.value;
    const mid = mat.uniforms.uMid.value;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      lerpColor(col, targetColors, i, 0.02);

      if (behavior === "swirl") {
        const angle = time * speed + phase;
        pos[i3] += Math.sin(angle) * 0.01 + bass * 0.02 * Math.sin(phase);
        pos[i3 + 1] += Math.cos(angle * 0.5) * 0.005;
        pos[i3 + 2] += Math.sin(angle * 0.3) * 0.005;
      } else if (behavior === "scatter") {
        pos[i3] += Math.sin(time * speed + phase) * 0.008;
        pos[i3 + 1] += (0.01 + bass * 0.05) * Math.sin(phase);
        pos[i3 + 2] += Math.cos(time * speed * 0.5 + phase) * 0.005;
      } else {
        pos[i3] += Math.sin(time * speed + phase) * 0.003;
        pos[i3 + 1] += Math.cos(time * speed * 0.7 + phase) * 0.003;
        pos[i3 + 2] += Math.sin(time * speed * 0.5 + phase) * 0.002;
      }

      if (clusterBottom) {
        pos[i3 + 1] += (-3 - pos[i3 + 1]) * 0.001;
      }

      if (pos[i3] > 12) pos[i3] = -12;
      if (pos[i3] < -12) pos[i3] = 12;
      if (pos[i3 + 1] > 12) pos[i3 + 1] = -12;
      if (pos[i3 + 1] < -12) pos[i3 + 1] = 12;
      if (pos[i3 + 2] > 10) pos[i3 + 2] = -10;
      if (pos[i3 + 2] < -10) pos[i3 + 2] = 10;
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
