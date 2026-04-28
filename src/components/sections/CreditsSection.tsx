"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { actingCredits, performanceCredits } from "@/data/credits";

export function CreditsSection() {
  return (
    <section id="credits" className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-pink)] mb-3">Credits</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold neon-glow-subtle">
            Beyond the Music
          </h2>
        </motion.div>

        {/* Carnegie Hall highlight */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic leading-relaxed max-w-3xl mx-auto text-[var(--color-pink-light)]">
            &ldquo;At 15, I was given full creative control at Carnegie Hall.
            Hundreds of people swaying, singing, and smiling — it felt like
            everyone was connected in the same breath.&rdquo;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard delay={0.1}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">Live</h3>
            {performanceCredits.map((cat) => (
              <div key={cat.category}>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-pink)] shrink-0" />
                      <span className="text-[var(--color-text-muted)]">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </GlassCard>

          <GlassCard delay={0.2}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">Screen</h3>
            <div className="space-y-5">
              {actingCredits.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-purple)] mb-2">{cat.category}</p>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item.title} className="text-[var(--color-text-muted)]">
                        {item.title}
                        {item.role && (
                          <span className="text-xs text-[var(--color-pink)]/70 ml-2">— {item.role}</span>
                        )}
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
