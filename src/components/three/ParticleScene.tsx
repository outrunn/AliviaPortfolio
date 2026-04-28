"use client";

import { useAudio } from "@/components/audio/AudioProvider";

export function ParticleScene() {
  const { isPlaying, audioData } = useAudio();

  // Audio-reactive values
  const bass = isPlaying ? audioData.bass : 0;
  const mid = isPlaying ? audioData.mid : 0;
  const volume = isPlaying ? audioData.volume : 0;

  // Shift gradient based on audio — more bass = warmer/pinker, more volume = brighter
  const pinkIntensity = Math.round(194 + bass * 60);
  const purpleShift = Math.round(26 + mid * 40);
  const brighten = Math.round(volume * 20);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Clean pink/purple gradient — reacts to audio */}
      <div
        className="absolute inset-0 transition-[background] duration-150"
        style={{
          background: `linear-gradient(
            160deg,
            rgb(${42 + brighten}, ${16 + purpleShift}, ${64 + brighten}) 0%,
            rgb(${74 + brighten}, ${purpleShift}, ${107 + brighten}) 20%,
            rgb(${123 + brighten}, ${63 + brighten}, ${142 + brighten}) 40%,
            rgb(${199 + brighten}, ${107 + brighten}, ${174 + brighten}) 60%,
            rgb(${240 + Math.min(brighten, 15)}, ${160 + brighten}, ${200 + brighten}) 78%,
            rgb(255, ${pinkIntensity}, ${237 + Math.min(brighten, 18)}) 90%,
            rgb(255, ${214 + Math.min(brighten, 40)}, ${240 + Math.min(brighten, 15)}) 100%
          )`,
        }}
      />

      {/* Pulsing glow spot — reacts to bass */}
      <div
        className="absolute rounded-full transition-all duration-150"
        style={{
          width: `${50 + bass * 20}vw`,
          height: `${50 + bass * 20}vw`,
          top: "15%",
          right: "-5%",
          background: `radial-gradient(circle, rgba(255,${pinkIntensity},237,${0.12 + volume * 0.15}) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute rounded-full transition-all duration-150"
        style={{
          width: `${40 + mid * 15}vw`,
          height: `${40 + mid * 15}vw`,
          bottom: "5%",
          left: "-5%",
          background: `radial-gradient(circle, rgba(139,92,246,${0.1 + volume * 0.12}) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
