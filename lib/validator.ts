import { analyzeText } from "./analyzer";
import { countPatterns } from "./aiPatterns";

function extractEntities(text: string): Set<string> {
  const entities = new Set<string>();
  (text.match(/\d+([.,]\d+)?/g) || []).forEach((n) => entities.add(n));
  (text.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || []).forEach((c) =>
    entities.add(c.toLowerCase()),
  );
  return entities;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 1 : inter / union;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function rhythmScore(text: string): number {
  const sentences = text
    .split(/(?<=[.!?؟])\s+|\n+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length < 3) return 0;

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((s, l) => s + Math.pow(l - avg, 2), 0) / lengths.length;
  const cv = Math.sqrt(variance) / (avg || 1);
  return Math.min(cv / 0.85, 1) * 100;
}

export type Validation = {
  integrityScore: number;
  humanScore: number;
  detectionScore: number;
  entityPreservation: number;
};

export function validate(original: string, rewritten: string): Validation {
  const originalTokens = tokenize(original);
  const rewrittenTokens = tokenize(rewritten);
  const sim = jaccard(originalTokens, rewrittenTokens);

  const origEnt = extractEntities(original);
  const newEnt = extractEntities(rewritten);
  let preserved = 0;
  if (origEnt.size === 0) preserved = 1;
  else {
    for (const e of origEnt) if (newEnt.has(e)) preserved++;
    preserved /= origEnt.size;
  }

  const lenRatio =
    Math.min(originalTokens.length, rewrittenTokens.length) /
    Math.max(originalTokens.length, rewrittenTokens.length);

  const a = analyzeText(rewritten);
  const rhythm = rhythmScore(rewritten);
  const patterns = countPatterns(rewritten);
  const markerPenalty = Math.min(patterns.total / 4, 1) * 35;
  const dashPenalty = /[—–]/.test(rewritten) ? 10 : 0;

  const integrityScore = Math.round(
    (sim * 0.4 + preserved * 0.4 + lenRatio * 0.2) * 100,
  );

  const rawHuman =
    Math.min(a.burstiness / 0.8, 1) * 30 +
    Math.min(a.lexicalDiversity / 0.75, 1) * 15 +
    (rhythm / 100) * 30 +
    (1 - a.aiFingerprintScore / 100) * 25;

  const humanScore = Math.round(clamp(rawHuman - markerPenalty - dashPenalty));

  const detectionScore = Math.round(humanScore * 0.65 + integrityScore * 0.35);

  return {
    integrityScore: clamp(integrityScore),
    humanScore: clamp(humanScore),
    detectionScore: clamp(detectionScore),
    entityPreservation: clamp(Math.round(preserved * 100)),
  };
}
