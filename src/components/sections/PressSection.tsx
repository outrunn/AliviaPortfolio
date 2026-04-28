"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { pressItems } from "@/data/press";

export function PressSection() {
  return (
    <section id="press" className="min-h-screen flex items-center justify-center px-6 py-24">
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
              <p className="text-xs uppercase tracking-widest text-[var(--color-pink)] mb-3">{item.publication}</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-[var(--color-text-muted)] italic leading-relaxed">&ldquo;{item.pullQuote}&rdquo;</p>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-[var(--color-pink)] hover:underline">
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
