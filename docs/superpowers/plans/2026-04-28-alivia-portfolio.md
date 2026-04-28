# Alivia Clark Interactive Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive single-page portfolio where a persistent Three.js particle world reacts to Alivia Clark's music in real time, with per-song visual themes and content in floating glassmorphism cards.

**Architecture:** Next.js App Router with a fixed full-viewport React Three Fiber canvas behind a scrollable overlay of content sections. A Web Audio API engine analyzes playing tracks and feeds frequency data to the particle system via React context. Each song defines a color palette and particle behavior that the scene lerps into when playing.

**Tech Stack:** Next.js 15 (App Router), React Three Fiber + Drei, Web Audio API, Tailwind CSS v4, Framer Motion

---

## File Structure

```
src/
  app/
    layout.tsx              — Root layout, fonts, metadata
    page.tsx                — Main page, composes all sections + canvas
    globals.css             — Tailwind imports, custom properties, glassmorphism utilities
  components/
    three/
      ParticleScene.tsx     — R3F Canvas wrapper, fixed position
      ParticleSystem.tsx    — Instanced particle mesh, audio-reactive + song-themed
      shaders.ts            — Vertex/fragment shaders for glow particles
    audio/
      AudioProvider.tsx     — React context: audio engine, play/pause, frequency data
      AudioEngine.ts        — Web Audio API class: load, play, pause, analyse
      MiniPlayer.tsx        — Persistent bottom mini-player bar
    sections/
      HeroSection.tsx       — Name, tagline, play button
      MusicSection.tsx      — Song list card, streaming links, waveform viz
      AboutSection.tsx      — Photo + bio card
      PressSection.tsx      — Press grid cards
      CreditsSection.tsx    — Split music/acting credits card
      ContactSection.tsx    — Booking CTA, socials, mailing list
    ui/
      GlassCard.tsx         — Reusable glassmorphism card wrapper
      ScrollIndicator.tsx   — Animated scroll chevron
      StreamingIcons.tsx    — Row of streaming platform icon links
      SocialIcons.tsx       — Row of social media icon links
  data/
    songs.ts                — Song metadata: title, file, colors, particle config
    press.ts                — Press items: publication, quote, url
    credits.ts              — Acting + music credits data
  hooks/
    useScrollSection.ts     — Tracks which section is in view
    useIsMobile.ts          — Responsive breakpoint hook
public/
  audio/
    breathless.mp3          — (user provides)
    imagine-that.mp3        — (user provides)
  images/
    alivia-hero.avif        — (move from root)
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Initialize Next.js with Tailwind**

```bash
cd /Users/dsfdasv/Projects/Code/Web/AliviaPortfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

This will scaffold into the current directory. Say yes to overwrite if prompted.

- [ ] **Step 2: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Move hero image to public directory**

```bash
mkdir -p public/images public/audio
mv alivia-hero.avif public/images/alivia-hero.avif
```

- [ ] **Step 4: Set up globals.css with custom properties and glassmorphism**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --color-pink: #FFC2ED;
  --color-sage: #7AA479;
  --color-blue: #C0E8F9;
  --color-bg: #0A0A0F;
  --color-text: #F5F5F5;
  --color-text-muted: #A0A0B0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Alivia Clark — Singer. Songwriter. Storyteller.",
  description:
    "Experience the music of Alivia Clark. Pop, EDM, and R&B artist from New Jersey, based in Miami.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-[family-name:var(--font-inter)]">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create minimal page.tsx placeholder**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-bold text-[var(--color-pink)]">
        ALIVIA CLARK
      </h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify it runs**

```bash
npm run dev
```

Open http://localhost:3000 — should see "ALIVIA CLARK" in pink on dark background.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, R3F deps, and base layout"
```

---

### Task 2: Data Layer — Songs, Press, Credits

**Files:**
- Create: `src/data/songs.ts`, `src/data/press.ts`, `src/data/credits.ts`

- [ ] **Step 1: Create song data with per-song theme configs**

Create `src/data/songs.ts`:

```ts
export interface SongTheme {
  colors: [string, string, string];
  particleBehavior: "swirl" | "scatter" | "drift";
  speed: number;
  clusterBottom: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioSrc: string | null;
  spotifyUrl: string;
  coverArt: string | null;
  featured: boolean;
  theme: SongTheme;
}

export const songs: Song[] = [
  {
    id: "breathless",
    title: "Breathless",
    artist: "Alivia Clark",
    audioSrc: "/audio/breathless.mp3",
    spotifyUrl:
      "https://open.spotify.com/album/5aGv38bHeqXzIKkxhNjTWA",
    coverArt: null,
    featured: true,
    theme: {
      colors: ["#2D1B4E", "#D4A574", "#E8734A"],
      particleBehavior: "swirl",
      speed: 0.3,
      clusterBottom: true,
    },
  },
  {
    id: "imagine-that",
    title: "Imagine That",
    artist: "Alivia Clark",
    audioSrc: "/audio/imagine-that.mp3",
    spotifyUrl:
      "https://open.spotify.com/album/5aGv38bHeqXzIKkxhNjTWA",
    coverArt: null,
    featured: false,
    theme: {
      colors: ["#FF69B4", "#87CEEB", "#FFFFFF"],
      particleBehavior: "scatter",
      speed: 0.6,
      clusterBottom: false,
    },
  },
];

export const defaultTheme: SongTheme = {
  colors: ["#FFC2ED", "#7AA479", "#C0E8F9"],
  particleBehavior: "drift",
  speed: 0.15,
  clusterBottom: false,
};
```

- [ ] **Step 2: Create press data**

Create `src/data/press.ts`:

```ts
export interface PressItem {
  id: string;
  publication: string;
  title: string;
  pullQuote: string;
  url: string | null;
  date: string | null;
}

export const pressItems: PressItem[] = [
  {
    id: "origin-interview",
    publication: "Artist Interview Series",
    title: "Alivia Clark: Alive With Faith",
    pullQuote:
      "I want to share my ideas, opinions, and moments of growth with the people around me.",
    url: null,
    date: null,
  },
  {
    id: "breathless-feature",
    publication: "Music Feature",
    title: "Behind 'Breathless'",
    pullQuote:
      "I was sitting under the palm trees and hot sun in Miami. The song just came to me instantly. I wrote it in about 10 minutes.",
    url: null,
    date: null,
  },
  {
    id: "carnegie-hall",
    publication: "Performance Spotlight",
    title: "Carnegie Hall at 15",
    pullQuote:
      "Hundreds of people swaying, singing, and smiling — it felt like everyone was connected in the same breath.",
    url: null,
    date: null,
  },
  {
    id: "diversity-interview",
    publication: "Industry Voices",
    title: "Diversity in Music",
    pullQuote:
      "When different voices are represented, it doesn't just build up the industry, but it truly shapes culture in a way that's more inclusive, inspiring, and just real.",
    url: null,
    date: null,
  },
];
```

- [ ] **Step 3: Create credits data**

Create `src/data/credits.ts`:

```ts
export interface Credit {
  title: string;
  role?: string;
}

export interface CreditCategory {
  category: string;
  items: Credit[];
}

export const actingCredits: CreditCategory[] = [
  {
    category: "Feature Film",
    items: [
      { title: "18 To Party" },
      { title: "Buttons: A Christmas Tale" },
    ],
  },
  {
    category: "Television",
    items: [
      { title: "Law & Order: OC" },
      { title: "NBC's Draftsville" },
    ],
  },
  {
    category: "Sketch Comedy",
    items: [
      { title: "Saturday Night Live" },
      { title: "Last Week Tonight with John Oliver" },
      { title: "Late Show with David Letterman" },
    ],
  },
  {
    category: "Voice Over",
    items: [
      { title: "Paw Patrol" },
      { title: "Bing Bunny" },
    ],
  },
];

export const performanceCredits: CreditCategory[] = [
  {
    category: "Notable Performances",
    items: [
      { title: "Carnegie Hall — Annual Performance (Creative Director, Age 15)" },
      { title: "Little Miss Sunshine: The Musical — Second Stage Theater, NYC" },
      { title: "University of Miami — Patio Jams" },
      { title: "Cat 5 — Live Recording" },
      { title: "Bar A" },
    ],
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add song, press, and credits data layers"
```

---

### Task 3: Audio Engine and Provider

**Files:**
- Create: `src/components/audio/AudioEngine.ts`, `src/components/audio/AudioProvider.tsx`

- [ ] **Step 1: Create the AudioEngine class**

Create `src/components/audio/AudioEngine.ts`:

```ts
export interface AudioData {
  bass: number;
  mid: number;
  treble: number;
  volume: number;
  frequencies: Uint8Array;
}

const EMPTY_AUDIO: AudioData = {
  bass: 0,
  mid: 0,
  treble: 0,
  volume: 0,
  frequencies: new Uint8Array(64),
};

export class AudioEngine {
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private buffer: AudioBuffer | null = null;
  private frequencyData: Uint8Array = new Uint8Array(64);
  private _isPlaying = false;
  private startOffset = 0;
  private startTime = 0;
  private loadedSrc: string | null = null;

  get isPlaying() {
    return this._isPlaying;
  }

  async load(src: string): Promise<void> {
    if (this.loadedSrc === src && this.buffer) return;

    if (!this.context) {
      this.context = new AudioContext();
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    this.stop();
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(arrayBuffer);
    this.loadedSrc = src;
    this.startOffset = 0;
  }

  play(): void {
    if (!this.context || !this.buffer || !this.analyser || !this.gainNode)
      return;
    if (this._isPlaying) return;

    if (this.context.state === "suspended") {
      this.context.resume();
    }

    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.source.onended = () => {
      if (this._isPlaying) {
        this._isPlaying = false;
        this.startOffset = 0;
      }
    };
    this.source.start(0, this.startOffset);
    this.startTime = this.context.currentTime;
    this._isPlaying = true;
  }

  pause(): void {
    if (!this.context || !this.source || !this._isPlaying) return;
    this.startOffset += this.context.currentTime - this.startTime;
    this.source.stop();
    this.source.disconnect();
    this.source = null;
    this._isPlaying = false;
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
        this.source.disconnect();
      } catch {
        // already stopped
      }
      this.source = null;
    }
    this._isPlaying = false;
    this.startOffset = 0;
  }

  toggle(): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getAudioData(): AudioData {
    if (!this.analyser || !this._isPlaying) return EMPTY_AUDIO;

    this.analyser.getByteFrequencyData(this.frequencyData);

    const len = this.frequencyData.length;
    const third = Math.floor(len / 3);

    let bassSum = 0;
    for (let i = 0; i < third; i++) bassSum += this.frequencyData[i];
    const bass = bassSum / third / 255;

    let midSum = 0;
    for (let i = third; i < third * 2; i++) midSum += this.frequencyData[i];
    const mid = midSum / third / 255;

    let trebleSum = 0;
    for (let i = third * 2; i < len; i++) trebleSum += this.frequencyData[i];
    const treble = trebleSum / (len - third * 2) / 255;

    const volume = (bass + mid + treble) / 3;

    return {
      bass,
      mid,
      treble,
      volume,
      frequencies: this.frequencyData,
    };
  }

  getCurrentTime(): number {
    if (!this.context || !this._isPlaying) return this.startOffset;
    return this.startOffset + (this.context.currentTime - this.startTime);
  }

  getDuration(): number {
    return this.buffer?.duration ?? 0;
  }

  destroy(): void {
    this.stop();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}
```

- [ ] **Step 2: Create AudioProvider context**

Create `src/components/audio/AudioProvider.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Should compile with no errors (unused components are fine for now).

- [ ] **Step 4: Commit**

```bash
git add src/components/audio/
git commit -m "feat: add Web Audio API engine and React audio context provider"
```

---

### Task 4: Three.js Particle System

**Files:**
- Create: `src/components/three/shaders.ts`, `src/components/three/ParticleSystem.tsx`, `src/components/three/ParticleScene.tsx`

- [ ] **Step 1: Create particle shaders**

Create `src/components/three/shaders.ts`:

```ts
export const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vAlpha;

  uniform float uTime;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uVolume;

  void main() {
    vColor = aColor;

    float pulse = 1.0 + uBass * 0.5 + sin(uTime * 2.0 + aPhase) * 0.1;
    float size = aSize * pulse;

    vAlpha = 0.4 + uVolume * 0.6;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);

    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;
```

- [ ] **Step 2: Create ParticleSystem component**

Create `src/components/three/ParticleSystem.tsx`:

```tsx
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
    mat.uniforms.uTreble.value +=
      (audioData.treble - mat.uniforms.uTreble.value) * 0.1;
    mat.uniforms.uVolume.value +=
      (audioData.volume - mat.uniforms.uVolume.value) * 0.1;

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

      // Boundary wrap
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
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          array={colors}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          array={phases}
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
```

- [ ] **Step 3: Create ParticleScene canvas wrapper**

Create `src/components/three/ParticleScene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "./ParticleSystem";

export function ParticleScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Wire into page.tsx to test**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { AudioProvider } from "@/components/audio/AudioProvider";
import { ParticleScene } from "@/components/three/ParticleScene";

export default function Home() {
  return (
    <AudioProvider>
      <ParticleScene />
      <main className="relative z-10 min-h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold text-[var(--color-pink)]">
          ALIVIA CLARK
        </h1>
      </main>
    </AudioProvider>
  );
}
```

- [ ] **Step 5: Verify dev server — particles should float behind the text**

```bash
npm run dev
```

Open http://localhost:3000 — colorful particles drifting on dark background with her name overlaid.

- [ ] **Step 6: Commit**

```bash
git add src/components/three/ src/app/page.tsx
git commit -m "feat: add Three.js particle system with audio-reactive shaders"
```

---

### Task 5: Reusable UI Components

**Files:**
- Create: `src/components/ui/GlassCard.tsx`, `src/components/ui/ScrollIndicator.tsx`, `src/components/ui/StreamingIcons.tsx`, `src/components/ui/SocialIcons.tsx`
- Create: `src/hooks/useScrollSection.ts`, `src/hooks/useIsMobile.ts`

- [ ] **Step 1: Create GlassCard**

Create `src/components/ui/GlassCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card p-8 md:p-12 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create ScrollIndicator**

Create `src/components/ui/ScrollIndicator.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <span className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase">
        Scroll
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[var(--color-text-muted)]"
      >
        <path
          d="M5 8L10 13L15 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create StreamingIcons**

Create `src/components/ui/StreamingIcons.tsx`:

```tsx
import {
  SiSpotify,
  SiApplemusic,
  SiTidal,
  SiAmazonmusic,
  SiSoundcloud,
} from "react-icons/si";

const platforms = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/1NjDq6lw5KyAKoFYetyhae",
    icon: SiSpotify,
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/us/artist/alivia-clark/1569520288",
    icon: SiApplemusic,
  },
  {
    name: "Tidal",
    url: "https://tidal.com/artist/20961972",
    icon: SiTidal,
  },
  {
    name: "Amazon Music",
    url: "https://music.amazon.com/artists/B095XYHPZ3/alivia-clark",
    icon: SiAmazonmusic,
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com/aliviaclark",
    icon: SiSoundcloud,
  },
];

export function StreamingIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.name}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-pink)] transition-colors duration-300"
        >
          <p.icon size={24} />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create SocialIcons**

Create `src/components/ui/SocialIcons.tsx`:

```tsx
import { SiInstagram, SiTiktok } from "react-icons/si";

const socials = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/alivia314",
    icon: SiInstagram,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@aliviaaaclark",
    icon: SiTiktok,
  },
];

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-pink)] transition-colors duration-300"
        >
          <s.icon size={24} />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Install react-icons**

```bash
npm install react-icons
```

- [ ] **Step 6: Create hooks**

Create `src/hooks/useScrollSection.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useScrollSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.4 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
```

Create `src/hooks/useIsMobile.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/ src/hooks/
git commit -m "feat: add GlassCard, icons, scroll indicator, and utility hooks"
```

---

### Task 6: Hero Section

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create HeroSection**

Create `src/components/sections/HeroSection.tsx`:

```tsx
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

  const isPlayingFeatured =
    isPlaying && currentSong?.id === featuredSong?.id;

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <motion.h1
        className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: add Hero section with animated play button"
```

---

### Task 7: Music Section with Song List

**Files:**
- Create: `src/components/sections/MusicSection.tsx`, `src/components/audio/MiniPlayer.tsx`

- [ ] **Step 1: Create MusicSection**

Create `src/components/sections/MusicSection.tsx`:

```tsx
"use client";

import { useAudio } from "@/components/audio/AudioProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { StreamingIcons } from "@/components/ui/StreamingIcons";
import { songs } from "@/data/songs";

export function MusicSection() {
  const { playSong, isPlaying, currentSong, audioData } = useAudio();

  return (
    <section
      id="music"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <GlassCard className="w-full max-w-2xl">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-8">
          Music
        </h2>

        <div className="space-y-3">
          {songs.map((song) => {
            const isActive = currentSong?.id === song.id;
            const isCurrentlyPlaying = isActive && isPlaying;

            return (
              <button
                key={song.id}
                onClick={() => playSong(song.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${
                  isActive
                    ? "bg-white/10"
                    : "bg-white/5 hover:bg-white/10"
                } ${song.featured ? "ring-1 ring-[var(--color-pink)]/30" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-[var(--color-pink)]/30"
                      : "bg-white/10"
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <div className="flex items-end gap-[3px] h-5">
                      <span
                        className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce"
                        style={{
                          height: `${8 + audioData.bass * 12}px`,
                          animationDelay: "0ms",
                        }}
                      />
                      <span
                        className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce"
                        style={{
                          height: `${8 + audioData.mid * 12}px`,
                          animationDelay: "150ms",
                        }}
                      />
                      <span
                        className="w-[3px] bg-[var(--color-pink)] rounded-full animate-bounce"
                        style={{
                          height: `${8 + audioData.treble * 12}px`,
                          animationDelay: "300ms",
                        }}
                      />
                    </div>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="8,4 20,12 8,20" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{song.title}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {song.artist}
                    {song.featured && (
                      <span className="ml-2 text-xs text-[var(--color-pink)]">
                        Featured
                      </span>
                    )}
                  </p>
                </div>

                {!song.audioSrc && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-pink)] transition-colors"
                  >
                    Spotify →
                  </a>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Stream everywhere
          </p>
          <StreamingIcons />
        </div>
      </GlassCard>
    </section>
  );
}
```

- [ ] **Step 2: Create MiniPlayer**

Create `src/components/audio/MiniPlayer.tsx`:

```tsx
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
            <p className="text-sm font-semibold truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {currentSong.artist}
            </p>
          </div>

          {isPlaying && (
            <div className="flex items-end gap-[2px] h-4 ml-2">
              {[audioData.bass, audioData.mid, audioData.treble].map(
                (val, i) => (
                  <span
                    key={i}
                    className="w-[3px] bg-[var(--color-pink)] rounded-full transition-all duration-75"
                    style={{ height: `${4 + val * 12}px` }}
                  />
                )
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MusicSection.tsx src/components/audio/MiniPlayer.tsx
git commit -m "feat: add Music section with song list and mini player"
```

---

### Task 8: About Section

**Files:**
- Create: `src/components/sections/AboutSection.tsx`

- [ ] **Step 1: Create AboutSection**

Create `src/components/sections/AboutSection.tsx`:

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <GlassCard className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <motion.div
            className="w-full md:w-2/5 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/alivia-hero.avif"
                alt="Alivia Clark"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </motion.div>

          <div className="flex-1 space-y-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold">
              The Story
            </h2>

            <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
              I&apos;ve been singing since I could talk. Born in love with music,
              signed at 8, and I haven&apos;t stopped since. From New Jersey
              stages to Miami sunsets, I write music that makes you feel
              seen — then gets you up and dancing.
            </p>

            <p className="text-[var(--color-text-muted)] leading-relaxed">
              My sound lives somewhere between pop, EDM, and R&B — emotional,
              feminine, and passionate. At the core, I&apos;m a storyteller. Every
              song is meant to feel like a moment you&apos;ve lived through.
            </p>

            <blockquote className="border-l-2 border-[var(--color-pink)] pl-6 py-2">
              <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl italic text-[var(--color-pink)]">
                &ldquo;You only get one life. Spend it doing what you love,
                with the people you love.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/AboutSection.tsx
git commit -m "feat: add About section with photo and bio"
```

---

### Task 9: Press Section

**Files:**
- Create: `src/components/sections/PressSection.tsx`

- [ ] **Step 1: Create PressSection**

Create `src/components/sections/PressSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { pressItems } from "@/data/press";

export function PressSection() {
  return (
    <section
      id="press"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-5xl">
        <motion.h2
          className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Buzz
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressItems.map((item, index) => (
            <GlassCard key={item.id} delay={index * 0.15}>
              <p className="text-xs uppercase tracking-widest text-[var(--color-pink)] mb-3">
                {item.publication}
              </p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-4">
                {item.title}
              </h3>
              <p className="text-[var(--color-text-muted)] italic leading-relaxed">
                &ldquo;{item.pullQuote}&rdquo;
              </p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-[var(--color-pink)] hover:underline"
                >
                  Read More →
                </a>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/PressSection.tsx
git commit -m "feat: add Press section with staggered card grid"
```

---

### Task 10: Credits Section

**Files:**
- Create: `src/components/sections/CreditsSection.tsx`

- [ ] **Step 1: Create CreditsSection**

Create `src/components/sections/CreditsSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { actingCredits, performanceCredits } from "@/data/credits";

export function CreditsSection() {
  return (
    <section
      id="credits"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-5xl space-y-8">
        <motion.h2
          className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Range
        </motion.h2>

        {/* Carnegie Hall highlight */}
        <GlassCard className="text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--color-pink)] mb-3">
            Proudest Moment
          </p>
          <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl italic leading-relaxed max-w-2xl mx-auto">
            &ldquo;At 15, I was given full creative control at Carnegie Hall.
            Hundreds of people swaying, singing, and smiling — it felt like
            everyone was connected in the same breath.&rdquo;
          </p>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performances */}
          <GlassCard delay={0.1}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">
              Performances
            </h3>
            {performanceCredits.map((cat) => (
              <div key={cat.category}>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-3 text-[var(--color-text-muted)]"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-pink)] shrink-0" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </GlassCard>

          {/* Acting */}
          <GlassCard delay={0.2}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">
              Acting
            </h3>
            <div className="space-y-5">
              {actingCredits.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-sage)] mb-2">
                    {cat.category}
                  </p>
                  <ul className="space-y-1.5">
                    {cat.items.map((item) => (
                      <li
                        key={item.title}
                        className="text-[var(--color-text-muted)]"
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/CreditsSection.tsx
git commit -m "feat: add Credits section with performances and acting"
```

---

### Task 11: Contact Section

**Files:**
- Create: `src/components/sections/ContactSection.tsx`

- [ ] **Step 1: Create ContactSection**

Create `src/components/sections/ContactSection.tsx`:

```tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { StreamingIcons } from "@/components/ui/StreamingIcons";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <GlassCard className="w-full max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
          Let&apos;s Work Together
        </h2>

        <p className="text-[var(--color-text-muted)] mb-8">
          For bookings, collaborations, sync licensing, and press inquiries.
        </p>

        <a
          href="mailto:booking@aliviaclark.com"
          className="inline-block px-8 py-3 rounded-full bg-[var(--color-pink)] text-[var(--color-bg)] font-semibold hover:opacity-90 transition-opacity"
        >
          Get in Touch
        </a>

        <div className="mt-10 pt-8 border-t border-white/10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
              Follow
            </p>
            <SocialIcons className="justify-center" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
              Stream
            </p>
            <StreamingIcons className="justify-center" />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            Join the mailing list
          </p>
          <form
            className="flex gap-2 max-w-sm mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[var(--color-pink)]/50 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </GlassCard>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ContactSection.tsx
git commit -m "feat: add Contact section with CTA, socials, and mailing list"
```

---

### Task 12: Compose Full Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wire all sections together in page.tsx**

Replace `src/app/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify full site in browser**

```bash
npm run dev
```

Open http://localhost:3000 — scroll through all sections. Verify:
- Particles float behind all content
- Cards animate in on scroll
- Play button in hero works (if audio files present)
- All sections render with correct content
- Mobile: resize browser to verify stacking

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose full single-page layout with all sections"
```

---

### Task 13: Polish, Performance, and Final Touches

**Files:**
- Modify: `src/components/three/ParticleScene.tsx` (mobile detection)
- Modify: `src/app/globals.css` (scrollbar, selection colors)
- Modify: `next.config.ts` (image optimization)

- [ ] **Step 1: Add mobile particle reduction**

Replace `src/components/three/ParticleScene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "./ParticleSystem";
import { useIsMobile } from "@/hooks/useIsMobile";

export function ParticleScene() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add polish CSS**

Add to end of `src/app/globals.css`:

```css
::selection {
  background: rgba(255, 194, 237, 0.3);
  color: white;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 3: Build and verify no errors**

```bash
npm run build
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add mobile optimization, polish CSS, and final touches"
```

- [ ] **Step 5: Push to remote**

```bash
git push origin main
```
