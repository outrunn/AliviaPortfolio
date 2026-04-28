"use client";

import { motion } from "framer-motion";
import { pressItems } from "@/data/press";

export function PressSection() {
  return (
    <section id="press" className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-pink)] mb-3">Press</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold neon-glow-subtle">
            In the Spotlight
          </h2>
        </motion.div>

        <div className="space-y-6">
          {pressItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass-card p-6 md:p-8 hover:border-[var(--color-pink)]/40 transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="shrink-0 md:w-48">
                  <p className="text-[var(--color-pink)] font-semibold text-sm md:text-base">{item.publication}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.date}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg md:text-xl font-semibold mb-2 group-hover:text-[var(--color-pink)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] italic text-sm md:text-base leading-relaxed line-clamp-2">
                    &ldquo;{item.pullQuote}&rdquo;
                  </p>
                </div>

                <div className="shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-pink)] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
