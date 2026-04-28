# Alivia Clark — Interactive Audio Portfolio

## Overview

A single-page interactive portfolio for singer-songwriter Alivia Clark. The site serves fans, industry professionals, and brands simultaneously. A persistent Three.js particle world fills the background while clean floating cards present content on scroll. Playing a song transforms the entire 3D scene to match that track's mood. Each scroll section has its own unique visual personality. Progressive wow factor — the deeper you scroll, the more impressive it gets.

## Tech Stack

- **Next.js** (App Router) — framework and deployment target
- **Three.js + React Three Fiber + Drei** — 3D particle scene
- **Web Audio API** — real-time frequency/amplitude analysis of playing tracks
- **Tailwind CSS v4** — card and typography styling
- **Framer Motion** — card entrance animations, parallax, scroll-triggered effects

## Color Palette

- **Brand colors:** #FFC2ED (pink), #7AA479 (sage green), #C0E8F9 (baby blue)
- **Background:** near-black (#0A0A0F or similar)
- **Text:** white and soft white (#F5F5F5)
- **Per-song palettes** override particle colors when a track is playing

## Architecture

### Core Layout

```
<ThreeCanvas />          ← Full-viewport, fixed position, always renders
<ScrollContainer>        ← Overlays the canvas, handles scroll
  <HeroSection />
  <MusicSection />
  <AboutSection />
  <PressSection />
  <CreditsSection />
  <ContactSection />
</ScrollContainer>
<AudioEngine />          ← Manages Web Audio API, exposes frequency data
```

### Audio System

- Custom audio engine using Web Audio API `AnalyserNode`
- Loads MP3 files hosted in `/public/audio/`
- Exposes real-time data: bass, mid, treble amplitudes + overall volume
- React context provides audio state to Three.js scene and UI components
- Play/pause controls in the Music section card and a persistent mini-player

### Three.js Scene

- Single persistent scene with a particle system (2000-5000 particles on desktop, 500-1000 on mobile)
- Particles rendered as points with custom shader material for glow effect
- Scene reacts to two inputs:
  1. **Audio data** — particles pulse size, speed, and spread based on frequency bands
  2. **Active song theme** — particle colors, behavior pattern, and ambient effects morph when song changes
  3. **Scroll position** — each section triggers subtle shifts in particle arrangement
- Smooth transitions between song themes using lerped color/position values

### Per-Song Worlds

| Song | Colors | Particle Behavior | Ambient Effect |
|------|--------|-------------------|----------------|
| Breathless | Deep purple (#2D1B4E), amber (#D4A574), sunset orange (#E8734A) | Slow horizontal swirl, particles cluster near bottom like a horizon | Gradient glow at bottom simulating sunset, heat shimmer distortion |
| Imagine That | Bright pink (#FF69B4), sky blue (#87CEEB), white (#FFFFFF) | Upward scatter, burst on beat, sparkle/twinkle | Light rays from above, confetti-like particle trails |
| Default (no song) | #FFC2ED, #7AA479, #C0E8F9 | Gentle ambient drift, slow orbit | Soft glow around center, calm breathing animation |

Additional songs will follow the same pattern — each gets a unique color set and behavior.

## Sections (Scroll Order)

### 1. Hero — "The Invitation"

- Full viewport height
- "ALIVIA CLARK" in bold, large display font (centered)
- Short tagline beneath: "Singer. Songwriter. Storyteller."
- Single pulsing play button with text "Press Play" or a play icon
- Particles drift gently, subtly gravitate toward the play button
- No other content — pure intrigue, invites interaction
- Scroll indicator at bottom (chevron or "scroll" text)

### 2. Music — "The Experience"

- Floating card with glassmorphism effect (frosted glass, subtle blur)
- Song list: each row has mini album art, song title, play/pause button
- Featured song "Breathless" is prominent at top with larger art
- When a song plays:
  - The Three.js scene transitions to that song's world (colors morph over ~1.5s)
  - An audio waveform/visualizer bar appears in the card
  - The play button pulses with the beat
- Row of streaming platform icons below the song list: Spotify, Apple Music, Tidal, Amazon Music, SoundCloud — each links out
- Mini persistent player appears at bottom of screen when user scrolls past this section

### 3. About — "The Story"

- Card with her photo (alivia-hero.avif) on one side, bio text on the other
- Photo has subtle parallax float on scroll (Framer Motion)
- Bio text — punchy, pulled from interviews:
  > "I've been singing since I could talk. Born in love with music, signed at 8, and I haven't stopped since. From New Jersey stages to Miami sunsets, I write music that makes you feel seen — then gets you up and dancing."
- Featured quote in large italic type: *"You only get one life. Spend it doing what you love, with the people you love."*
- 3D scene: particles slowly orbit around the card area, as if she's the center of gravity
- On mobile: photo stacks above text

### 4. Press — "The Buzz"

- Grid of press cards, each with:
  - Publication name/logo
  - Pull quote from the interview
  - "Read More" link to full article
- Cards animate in on scroll (staggered fade-up)
- 3D scene: particles form a subtle constellation/network pattern — nodes and lines, representing connections and reach
- Interview content sourced from the press collection (interview text provided by user)

### 5. Credits — "The Range"

- Split layout card: Music credits on left, Acting credits on right
- **Music side:** Key performances — Carnegie Hall, University of Miami, Cat 5 Live, Bar A
- **Acting side:** Organized by category:
  - Film: 18 To Party, Buttons A Christmas Tale
  - TV: Law & Order OC, NBC's Draftsville
  - Sketch: SNL, John Oliver, David Letterman
  - Voice: Paw Patrol, Bing Bunny
- Carnegie Hall story as a featured highlight card with larger text
- 3D scene: particles slow down, move more dramatically — cinematic feel
- On mobile: stacks vertically, music then acting

### 6. Contact — "The Connection"

- Clean centered card
- Heading: "Let's Work Together" or "Book Alivia"
- Email contact (or contact form if preferred)
- Social icons row: Instagram (@alivia314), TikTok (@aliviaaaclark)
- Streaming icons row: Spotify, Apple Music, Tidal, Amazon Music, SoundCloud
- Mailing list signup field
- 3D scene: particles converge gently into a warm central glow — invitation, warmth
- On mobile: full-width card, stacked icons

## Responsive Design

### Desktop (>1024px)
- Cards are ~600-800px wide, centered with generous padding
- Full particle count (2000-5000)
- All hover effects and parallax active
- Split layouts side-by-side

### Tablet (768-1024px)
- Cards nearly full-width with padding
- Reduced particle count (~1500)
- Split layouts still side-by-side but narrower

### Mobile (<768px)
- Cards full-width with small margins
- Minimal particle count (500-1000) for performance
- All split layouts stack vertically
- Simplified Three.js effects (no shader-heavy distortion)
- Touch-friendly play buttons (larger hit targets)
- Mini player stays at bottom

## Audio Files

- MP3 files stored in `/public/audio/`
- User will provide audio files for: Breathless, Imagine That, and any additional tracks
- Fallback: if no audio file, song row links directly to Spotify

## Performance Considerations

- Three.js scene uses instanced geometry for particles (single draw call)
- Audio analyser runs on requestAnimationFrame, throttled on mobile
- Cards use `will-change: transform` for smooth scroll animations
- Images use Next.js `<Image>` with AVIF/WebP optimization
- Lazy load sections below the fold
- Target: 60fps on desktop, 30fps acceptable on mobile

## Assets Needed

- [x] Hero photo: `alivia-hero.avif` (already in project)
- [ ] Audio files: MP3s for Breathless, Imagine That, other tracks
- [ ] Album/single artwork images
- [ ] Press article URLs (subagent collecting)
- [ ] Font choice (to be selected during implementation — likely a modern sans + display font)
