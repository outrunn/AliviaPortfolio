"use client";

import { useAudio } from "@/components/audio/AudioProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { StreamingIcons } from "@/components/ui/StreamingIcons";
import { songs } from "@/data/songs";

export function MusicSection() {
  const { playSong, isPlaying, currentSong, audioData } = useAudio();

  return (
    <section id="music" className="min-h-screen flex items-center justify-center px-6 py-24">
      <GlassCard className="w-full max-w-2xl">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-8">Music</h2>

        <div className="space-y-3">
          {songs.map((song) => {
            const isActive = currentSong?.id === song.id;
            const isCurrentlyPlaying = isActive && isPlaying;

            return (
              <button
                key={song.id}
                onClick={() => playSong(song.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${
                  isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                } ${song.featured ? "ring-1 ring-[var(--color-pink)]/30" : ""}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? "bg-[var(--color-pink)]/30" : "bg-white/10"
                }`}>
                  {isCurrentlyPlaying ? (
                    <div className="flex items-end gap-[3px] h-5">
                      <span className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce" style={{ height: `${8 + audioData.bass * 12}px`, animationDelay: "0ms" }} />
                      <span className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce" style={{ height: `${8 + audioData.mid * 12}px`, animationDelay: "150ms" }} />
                      <span className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce" style={{ height: `${8 + audioData.treble * 12}px`, animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8,4 20,12 8,20" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{song.title}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {song.artist}
                    {song.featured && <span className="ml-2 text-xs text-[var(--color-pink)]">Featured</span>}
                  </p>
                </div>

                {!song.audioSrc && (
                  <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-pink)] transition-colors">
                    Spotify →
                  </a>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">Stream everywhere</p>
          <StreamingIcons />
        </div>
      </GlassCard>
    </section>
  );
}
