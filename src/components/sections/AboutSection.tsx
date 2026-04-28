"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24">
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
              <Image src="/images/alivia-hero.avif" alt="Alivia Clark" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" priority />
            </div>
          </motion.div>

          <div className="flex-1 space-y-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold">The Story</h2>
            <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">
              I&apos;ve been singing since I could talk. Born in love with music, signed at 8, and I haven&apos;t stopped since. From New Jersey stages to Miami sunsets, I write music that makes you feel seen — then gets you up and dancing.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              My sound lives somewhere between pop, EDM, and R&amp;B — emotional, feminine, and passionate. At the core, I&apos;m a storyteller. Every song is meant to feel like a moment you&apos;ve lived through.
            </p>
            <blockquote className="border-l-2 border-[var(--color-pink)] pl-6 py-2">
              <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl italic text-[var(--color-pink)]">
                &ldquo;You only get one life. Spend it doing what you love, with the people you love.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
