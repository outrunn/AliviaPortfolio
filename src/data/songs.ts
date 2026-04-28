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
    spotifyUrl: "https://open.spotify.com/album/5aGv38bHeqXzIKkxhNjTWA",
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
    spotifyUrl: "https://open.spotify.com/album/5aGv38bHeqXzIKkxhNjTWA",
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
