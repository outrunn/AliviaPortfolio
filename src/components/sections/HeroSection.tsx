"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAudio } from "@/components/audio/AudioProvider";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { StreamingIcons } from "@/components/ui/StreamingIcons";
import { SocialIcons } from "@/components/ui/SocialIcons";
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

      {/* Album art + play button */}
      <motion.div
        className="mt-10 flex items-center gap-5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,110,199,0.3)] ring-1 ring-white/10">
          <Image
            src="/images/breathless-cover.png"
            alt="Breathless"
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <button
            onClick={handlePlay}
            className="group relative flex items-center gap-3"
            aria-label={isPlayingFeatured ? "Pause" : "Press Play"}
          >
            <span className="relative w-14 h-14 rounded-full bg-[var(--color-pink)]/20 border border-[var(--color-pink)]/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-[var(--color-pink)]/30 transition-all shadow-[0_0_20px_rgba(255,110,199,0.2)]">
              {isPlayingFeatured ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-pink)">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-pink)">
                  <polygon points="9,4 20,12 9,20" />
                </svg>
              )}
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold">
                {isPlayingFeatured ? "Now Playing" : "Play"}
              </span>
              <span className="block text-xs text-[var(--color-text-muted)]">Breathless — New Single</span>
            </span>
          </button>
        </div>
      </motion.div>

      {/* Prominent links */}
      <motion.div
        className="mt-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <StreamingIcons className="justify-center" />
        <SocialIcons className="justify-center" />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
