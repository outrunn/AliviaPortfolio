"use client";

import { AudioProvider } from "@/components/audio/AudioProvider";
import { ParticleScene } from "@/components/three/ParticleScene";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { HeroSection } from "@/components/sections/HeroSection";
import { MusicSection } from "@/components/sections/MusicSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PressSection } from "@/components/sections/PressSection";
import { CreditsSection } from "@/components/sections/CreditsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <AudioProvider>
      <ParticleScene />
      <main className="relative z-10">
        <HeroSection />
        <MusicSection />
        <AboutSection />
        <PressSection />
        <CreditsSection />
        <ContactSection />
      </main>
      <MiniPlayer />
    </AudioProvider>
  );
}
