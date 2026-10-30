"use client";

import { useLang } from "@/contexts/LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-medium">
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 transition-all ${
          lang === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`rounded-full px-3 py-1.5 transition-all ${
          lang === "ar"
            ? "bg-primary text-white shadow-sm"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        ع
      </button>
    </div>
  );
}
