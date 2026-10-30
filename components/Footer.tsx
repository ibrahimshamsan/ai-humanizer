"use client";

import { useLang } from "@/contexts/LanguageProvider";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row">
        <span>
          © {new Date().getFullYear()} {t.brand}
        </span>
        <span>{t.footer}</span>
      </div>
    </footer>
  );
}
