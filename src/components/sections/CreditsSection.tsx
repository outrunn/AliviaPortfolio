"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { actingCredits, performanceCredits } from "@/data/credits";

export function CreditsSection() {
  return (
    <section id="credits" className="min-h-screen flex items-center justify-center px-6 py-24">
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

        <GlassCard className="text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--color-pink)] mb-3">Proudest Moment</p>
          <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl italic leading-relaxed max-w-2xl mx-auto">
            &ldquo;At 15, I was given full creative control at Carnegie Hall. Hundreds of people swaying, singing, and smiling — it felt like everyone was connected in the same breath.&rdquo;
          </p>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard delay={0.1}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">Performances</h3>
            {performanceCredits.map((cat) => (
              <div key={cat.category}>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-3 text-[var(--color-text-muted)]">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-pink)] shrink-0" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </GlassCard>

          <GlassCard delay={0.2}>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6">Acting</h3>
            <div className="space-y-5">
              {actingCredits.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-purple)] mb-2">{cat.category}</p>
                  <ul className="space-y-1.5">
                    {cat.items.map((item) => (
                      <li key={item.title} className="text-[var(--color-text-muted)]">{item.title}</li>
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
