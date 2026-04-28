"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { StreamingIcons } from "@/components/ui/StreamingIcons";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function ContactSection() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24">
      <GlassCard className="w-full max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">Let&apos;s Work Together</h2>
        <p className="text-[var(--color-text-muted)] mb-8">For bookings, collaborations, sync licensing, and press inquiries.</p>

        <a href="mailto:booking@aliviaclark.com" className="inline-block px-8 py-3 rounded-full bg-[var(--color-pink)] text-[var(--color-bg-top)] font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(255,110,199,0.4)]">
          Get in Touch
        </a>

        <div className="mt-10 pt-8 border-t border-white/10 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Follow</p>
            <SocialIcons className="justify-center" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Stream</p>
            <StreamingIcons className="justify-center" />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-sm text-[var(--color-text-muted)] mb-3">Join the mailing list</p>
          <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[var(--color-pink)]/50 transition-colors" />
            <button type="submit" className="px-5 py-2.5 rounded-full bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors">Subscribe</button>
          </form>
        </div>
      </GlassCard>
    </section>
  );
}
