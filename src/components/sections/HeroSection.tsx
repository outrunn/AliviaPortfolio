"use client";

import { motion } from "framer-motion";
import { useAudio } from "@/components/audio/AudioProvider";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { songs } from "@/data/songs";

export function HeroSection() {
  const { playSong, isPlaying, currentSong } = useAudio();
  const featuredSong = songs.find((s) => s.featured) ?? songs[0];

  const handlePlay = () => {
    if (featuredSong) {
      playSong(featuredSong.id);
    }
  };

  const isPlayingFeatured = isPlaying && currentSong?.id === featuredSong?.id;

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <motion.h1
        className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight neon-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        ALIVIA CLARK
      </motion.h1>

      <motion.p
        className="mt-4 text-lg md:text-xl text-[var(--color-text-muted)] tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Singer. Songwriter. Storyteller.
      </motion.p>

      <motion.button
        onClick={handlePlay}
        className="mt-12 group relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        aria-label={isPlayingFeatured ? "Pause" : "Press Play"}
      >
        <span className="absolute w-20 h-20 rounded-full bg-[var(--color-pink)] opacity-20 group-hover:opacity-40 transition-opacity animate-ping" />
        <span className="relative w-20 h-20 rounded-full bg-[var(--color-pink)]/20 border border-[var(--color-pink)]/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-[var(--color-pink)]/30 transition-all">
          {isPlayingFeatured ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-pink)">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-pink)">
              <polygon points="8,4 20,12 8,20" />
            </svg>
          )}
        </span>
      </motion.button>

      <motion.span
        className="mt-4 text-sm text-[var(--color-text-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {isPlayingFeatured ? "Now Playing: Breathless" : "Press Play"}
      </motion.span>

      <ScrollIndicator />
    </section>
  );
}
