"use client";

import { useLang } from "@/contexts/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
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
              <path d="M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 16.5 L5.5 21 L7.5 13.5 L2 9 L9 9 Z" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">
            {t.brand}
          </span>
        </div>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
