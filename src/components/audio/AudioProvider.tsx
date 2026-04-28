"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AudioEngine, type AudioData } from "./AudioEngine";
import { songs, defaultTheme, type Song, type SongTheme } from "@/data/songs";

interface AudioContextValue {
  currentSong: Song | null;
  isPlaying: boolean;
  audioData: AudioData;
  currentTheme: SongTheme;
  playSong: (songId: string) => Promise<void>;
  togglePlayback: () => void;
  stopPlayback: () => void;
}

const EMPTY_AUDIO: AudioData = {
  bass: 0,
  mid: 0,
  treble: 0,
  volume: 0,
  frequencies: new Uint8Array(64),
};

const AudioCtx = createContext<AudioContextValue>({
  currentSong: null,
  isPlaying: false,
  audioData: EMPTY_AUDIO,
  currentTheme: defaultTheme,
  playSong: async () => {},
  togglePlayback: () => {},
  stopPlayback: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null);
  const rafRef = useRef<number>(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<AudioData>(EMPTY_AUDIO);

  useEffect(() => {
    engineRef.current = new AudioEngine();
    return () => {
      cancelAnimationFrame(rafRef.current);
      engineRef.current?.destroy();
    };
  }, []);

  const updateAudioData = useCallback(() => {
    if (engineRef.current?.isPlaying) {
      setAudioData(engineRef.current.getAudioData());
    }
    rafRef.current = requestAnimationFrame(updateAudioData);
  }, []);

  const playSong = useCallback(
    async (songId: string) => {
      const engine = engineRef.current;
      if (!engine) return;

      const song = songs.find((s) => s.id === songId);
      if (!song || !song.audioSrc) return;

      if (currentSong?.id === songId && engine.isPlaying) {
        engine.pause();
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
        return;
      }

      if (currentSong?.id !== songId) {
        engine.stop();
        await engine.load(song.audioSrc);
        setCurrentSong(song);
      }

      engine.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(updateAudioData);
    },
    [currentSong, updateAudioData]
  );

  const togglePlayback = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !currentSong) return;

    engine.toggle();
    setIsPlaying(engine.isPlaying);

    if (engine.isPlaying) {
      rafRef.current = requestAnimationFrame(updateAudioData);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
  }, [currentSong, updateAudioData]);

  const stopPlayback = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.stop();
    setIsPlaying(false);
    setCurrentSong(null);
    setAudioData(EMPTY_AUDIO);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const currentTheme = currentSong?.theme ?? defaultTheme;

  return (
    <AudioCtx.Provider
      value={{
        currentSong,
        isPlaying,
        audioData,
        currentTheme,
        playSong,
        togglePlayback,
        stopPlayback,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
