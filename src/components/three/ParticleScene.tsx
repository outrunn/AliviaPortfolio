"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useAudio } from "@/components/audio/AudioProvider";
import { FloatingOrbs } from "./FloatingOrbs";

// Lerp between two RGB values
function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// Default purple gradient stops
const PURPLE_STOPS: [number, number, number][] = [
  [42, 16, 64],     // deep purple
  [74, 26, 107],    // dark purple
  [123, 63, 142],   // medium purple
  [199, 107, 174],  // light purple-pink
  [240, 160, 200],  // soft pink
  [255, 194, 237],  // light pink
  [255, 214, 240],  // very light pink
];

// Sunset gradient stops (warm yellow/orange)
const SUNSET_STOPS: [number, number, number][] = [
  [45, 20, 80],     // deep indigo (keep dark at top)
  [90, 30, 100],    // purple-indigo
  [160, 60, 90],    // warm mauve
  [220, 120, 70],   // burnt orange
  [245, 170, 60],   // golden orange
  [255, 200, 80],   // warm yellow
  [255, 230, 140],  // light golden
];

export function ParticleScene() {
  const { isPlaying, audioData } = useAudio();
  const mixRef = useRef(0);

  // Smoothly interpolate mix factor toward target
  const targetMix = isPlaying ? Math.min(audioData.volume * 2.5, 1) : 0;
  mixRef.current += (targetMix - mixRef.current) * 0.05;
  const mix = mixRef.current;

  // Interpolate each gradient stop between purple and sunset
  const stops = PURPLE_STOPS.map((purpleStop, i) =>
    lerpRgb(purpleStop, SUNSET_STOPS[i], mix)
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient that shifts from purple to sunset while music plays */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            160deg,
            rgb(${stops[0].join(",")}) 0%,
            rgb(${stops[1].join(",")}) 17%,
            rgb(${stops[2].join(",")}) 34%,
            rgb(${stops[3].join(",")}) 50%,
            rgb(${stops[4].join(",")}) 66%,
            rgb(${stops[5].join(",")}) 83%,
            rgb(${stops[6].join(",")}) 100%
          )`,
        }}
      />

      {/* Three.js floating orbs layer */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <FloatingOrbs />
        </Canvas>
      </div>
    </div>
  );
}
