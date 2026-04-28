"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio/AudioProvider";

export function MiniPlayer() {
  const { currentSong, isPlaying, togglePlayback, audioData } = useAudio();

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          className="fixed bottom-4 left-1/2 z-50 glass-card px-5 py-3 flex items-center gap-4"
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full bg-[var(--color-pink)]/20 flex items-center justify-center hover:bg-[var(--color-pink)]/30 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-pink)">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-pink)">
                <polygon points="8,4 20,12 8,20" />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentSong.title}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{currentSong.artist}</p>
          </div>

          {isPlaying && (
            <div className="flex items-end gap-[2px] h-4 ml-2">
              {[audioData.bass, audioData.mid, audioData.treble].map((val, i) => (
                <span key={i} className="w-[3px] bg-[var(--color-pink)] rounded-full transition-all duration-75" style={{ height: `${4 + val * 12}px` }} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
