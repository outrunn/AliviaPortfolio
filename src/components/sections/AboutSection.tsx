"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <motion.div
            className="w-full md:w-[45%] shrink-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(255,110,199,0.2)]">
              <Image
                src="/images/alivia-hero.avif"
                alt="Alivia Clark"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-top)]/60 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-pink)] mb-3">About</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold leading-tight neon-glow-subtle">
                Alive with Faith
              </h2>
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-[var(--color-text-muted)]">
              I&apos;ve been singing since I could talk. Born in love with music,
              signed at 8, and I haven&apos;t stopped since. From New Jersey
              stages to Miami sunsets, I write music that makes you feel
              seen — then gets you up and dancing.
            </p>

            <p className="text-[var(--color-text-muted)] leading-relaxed">
              My sound lives somewhere between pop, EDM, and R&amp;B — emotional,
              feminine, and passionate. At the core, I&apos;m a storyteller. Every
              song is meant to feel like a moment you&apos;ve lived through.
            </p>

            <blockquote className="relative pl-6 py-4">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-pink)] to-[var(--color-purple)]" />
              <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic text-[var(--color-pink-light)] leading-snug">
                &ldquo;You only get one life. Spend it doing what you love,
                with the people you love.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
