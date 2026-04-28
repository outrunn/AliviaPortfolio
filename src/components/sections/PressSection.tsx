"use client";

import { motion } from "framer-motion";
import { pressItems } from "@/data/press";

export function PressSection() {
  return (
    <section id="press" className="min-h-screen flex flex-col justify-center py-24">
      <motion.div
        className="text-center mb-12 px-6"
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

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto scrollbar-hide px-6 md:px-0">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:max-w-5xl md:mx-auto md:px-6 pb-4">
          {pressItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-[280px] md:w-auto glass-card p-6 flex flex-col justify-between hover:border-[var(--color-pink)]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[var(--color-pink)] font-semibold text-sm">
                    {item.publication}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[var(--color-text-muted)] group-hover:text-[var(--color-pink)] transition-colors"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-3 group-hover:text-[var(--color-pink)] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-[var(--color-text-muted)] italic text-sm leading-relaxed">
                  &ldquo;{item.pullQuote}&rdquo;
                </p>
              </div>

              <p className="text-xs text-[var(--color-text-muted)]/60 mt-4 pt-3 border-t border-white/10">
                {item.date}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
