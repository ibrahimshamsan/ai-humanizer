"use client";

import { useLang } from "@/contexts/LanguageProvider";

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-20 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {t.hero.badge}
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {t.hero.title1}{" "}
          <span className="bg-gradient-to-r from-primary to-brand-200 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {t.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
