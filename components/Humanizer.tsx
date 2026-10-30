"use client";

import { useRef, useState } from "react";
import ScoreRing from "./ScoreRing";
import { useLang } from "@/contexts/LanguageProvider";

type Result = {
  output: string;
  humanScore: number;
  integrityScore: number;
  detectionScore: number;
};

type Level = "light" | "medium" | "strong";

const ACCEPTED_EXT = [".txt", ".md", ".csv", ".json", ".rtf", ".log"];
const MAX_FILE_SIZE = 500 * 1024;
const MAX_WORDS = 1000; // الحد الأقصى للكلمات
const MAX_CHARS = 6000; // ما يعادل تقريباً 1000 كلمة

export default function Humanizer() {
  const { t } = useLang();
  const [input, setInput] = useState("");
  const [level, setLevel] = useState<Level>("strong");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;
  const isOverLimit = wordCount > MAX_WORDS || charCount > MAX_CHARS;

  async function readFile(file: File) {
    setError(null);
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPTED_EXT.includes(ext)) {
      setError(t.humanizer.uploadError);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t.humanizer.uploadError);
      return;
    }
    try {
      const text = await file.text();
      setInput(text.trim());
      setResult(null);
    } catch {
      setError(t.humanizer.uploadError);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function clearAll() {
    setInput("");
    setResult(null);
    setError(null);
  }

  async function handleHumanize() {
    setError(null);
    if (wordCount < 20) {
      setError(t.humanizer.errorMinWords || "Please enter at least 20 words.");
      return;
    }
    if (isOverLimit) {
      setError(`Character limit exceeded. Max ${MAX_WORDS} words.`);
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.humanizer.errorConnection);
      setResult(data);
    } catch (e: any) {
      setError(e.message || t.humanizer.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Input panel */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative flex flex-col rounded-2xl border bg-surface shadow-soft transition-colors ${
            dragging ? "border-primary bg-primary-soft/40" : "border-line"
          }`}
        >
          {dragging && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-primary-soft/70 backdrop-blur-sm">
              <div className="rounded-xl border-2 border-dashed border-primary bg-surface px-6 py-4 text-sm font-medium text-primary">
                {t.humanizer.uploadDrop}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold text-ink">
                {t.humanizer.originalTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${isOverLimit ? "bg-danger/10 text-danger" : "bg-brand-50 text-ink-muted"}`}
              >
                {wordCount} / {MAX_WORDS} words
              </span>
              {input && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-md px-2 py-0.5 text-xs font-medium text-ink-muted transition hover:bg-brand-50 hover:text-ink"
                >
                  {t.humanizer.clear}
                </button>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted transition hover:border-primary hover:text-primary"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                {t.humanizer.upload}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.csv,.json,.rtf,.log,text/plain"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.humanizer.inputPlaceholder}
            dir="auto"
            className={`text-body min-h-[300px] flex-1 resize-none border-0 bg-transparent p-5 text-[15px] leading-7 text-ink outline-none placeholder:text-ink-subtle ${isOverLimit ? "text-danger" : ""}`}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3">
            <div className="flex items-center gap-1.5">
              {(["light", "medium", "strong"] as Level[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    level === l
                      ? "bg-primary text-white shadow-sm"
                      : "text-ink-muted hover:bg-brand-50 hover:text-ink"
                  }`}
                >
                  {t.humanizer.levels[l]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col rounded-2xl border border-line bg-surface shadow-soft">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-300" />
              <h3 className="text-sm font-semibold text-ink">
                {t.humanizer.outputTitle}
              </h3>
            </div>
            {result && (
              <button
                onClick={copyOutput}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary-soft"
              >
                {copied ? t.humanizer.copied : t.humanizer.copy}
              </button>
            )}
          </div>

          <div className="min-h-[300px] flex-1 p-5">
            {loading ? (
              <div className="flex items-center gap-2.5 text-sm text-ink-muted">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                {t.humanizer.loading}
              </div>
            ) : result ? (
              <p className="text-body text-[15px] leading-7 text-ink">
                {result.output}
              </p>
            ) : (
              <p className="text-sm text-ink-subtle">
                {t.humanizer.outputPlaceholder}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={handleHumanize}
          disabled={loading || isOverLimit || wordCount < 20}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-hover hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t.humanizer.loading : t.humanizer.button}
        </button>
        {error && (
          <p className="text-center text-sm font-medium text-danger">{error}</p>
        )}
      </div>

      {/* Scores */}
      {result && (
        <div className="mt-12 animate-fade-in">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              {t.humanizer.reportTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <ScoreRing
              value={result.humanScore}
              label={t.humanizer.scores.human}
            />
            <ScoreRing
              value={result.integrityScore}
              label={t.humanizer.scores.integrity}
            />
            <ScoreRing
              value={result.detectionScore}
              label={t.humanizer.scores.detection}
            />
          </div>
        </div>
      )}
    </section>
  );
}
