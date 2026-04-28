import {
  SiSpotify,
  SiApplemusic,
  SiTidal,
  SiAmazonmusic,
  SiSoundcloud,
} from "react-icons/si";

const platforms = [
  { name: "Spotify", url: "https://open.spotify.com/artist/1NjDq6lw5KyAKoFYetyhae", icon: SiSpotify },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/alivia-clark/1569520288", icon: SiApplemusic },
  { name: "Tidal", url: "https://tidal.com/artist/20961972", icon: SiTidal },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/B095XYHPZ3/alivia-clark", icon: SiAmazonmusic },
  { name: "SoundCloud", url: "https://soundcloud.com/aliviaclark", icon: SiSoundcloud },
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
