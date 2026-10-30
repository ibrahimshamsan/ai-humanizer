"use client";

import { useLang } from "@/contexts/LanguageProvider";

export default function Features() {
  const { t } = useLang();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-5 md:grid-cols-3">
        {t.features.items.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all hover:shadow-lift"
          >
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {i === 0 && <path d="M12 2v20M2 12h20" />}
                {i === 1 && <path d="M20 6L9 17l-5-5" />}
                {i === 2 && (
                  <>
                    <path d="M3 3v18h18" />
                    <path d="M7 14l4-4 4 4 5-5" />
                  </>
                )}
              </svg>
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">{f.t}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
