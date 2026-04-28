import { SiInstagram, SiTiktok } from "react-icons/si";

const socials = [
  { name: "Instagram", url: "https://www.instagram.com/alivia314", icon: SiInstagram },
  { name: "TikTok", url: "https://www.tiktok.com/@aliviaaaclark", icon: SiTiktok },
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
