import { analyzeText } from "./analyzer";

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

  const integrityScore = Math.round(
    (sim * 0.5 + preserved * 0.35 + lenRatio * 0.15) * 100,
  );

  const humanScore = Math.round(
    Math.min(a.burstiness / 0.6, 1) * 35 +
      Math.min(a.lexicalDiversity / 0.7, 1) * 30 +
      (1 - a.aiFingerprintScore / 100) * 35,
  );

  const detectionScore = Math.round(humanScore * 0.7 + integrityScore * 0.3);

  return {
    integrityScore: clamp(integrityScore),
    humanScore: clamp(humanScore),
    detectionScore: clamp(detectionScore),
    entityPreservation: clamp(Math.round(preserved * 100)),
  };
}
