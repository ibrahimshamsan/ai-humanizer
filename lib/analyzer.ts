export type Analysis = {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  burstiness: number;
  lexicalDiversity: number;
  repetitionScore: number;
  aiFingerprintScore: number;
  hints: string[];
};

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?؟])\s+|\n+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function analyzeText(text: string): Analysis {
  const sentenceList = splitSentences(text);
  const allWords = words(text);
  const wordCount = allWords.length;
  const sentenceCount = sentenceList.length || 1;

  const lengths = sentenceList.map((s) => words(s).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / sentenceCount;
  const variance =
    lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / sentenceCount;
  const std = Math.sqrt(variance);
  const burstiness = avg > 0 ? std / avg : 0;

  const unique = new Set(allWords).size;
  const lexicalDiversity = wordCount > 0 ? unique / wordCount : 0;

  const freq = new Map<string, number>();
  for (const w of allWords) freq.set(w, (freq.get(w) || 0) + 1);
  const repeated = [...freq.values()].filter((c) => c > 3).length;
  const repetitionScore = wordCount > 0 ? Math.min(repeated / 20, 1) : 0;

  const hints: string[] = [];
  if (burstiness < 0.35)
    hints.push("الجمل متقاربة جداً في الطول — نمط شائع في النصوص الآلية.");
  if (lexicalDiversity < 0.45)
    hints.push("تنوع المفردات منخفض — يُفضّل استخدام مرادفات أكثر.");
  if (avg > 22) hints.push("متوسط طول الجملة مرتفع — قسّم الجمل الطويلة.");
  if (repetitionScore > 0.4) hints.push("هناك تكرار ملحوظ لكلمات معينة.");

  const fp =
    (1 - Math.min(burstiness / 0.7, 1)) * 40 +
    (1 - Math.min(lexicalDiversity / 0.7, 1)) * 30 +
    repetitionScore * 20 +
    Math.min(Math.max(avg - 12, 0) / 20, 1) * 10;

  const aiFingerprintScore = Math.round(Math.min(Math.max(fp, 0), 100));

  return {
    wordCount,
    sentenceCount,
    avgSentenceLength: Math.round(avg * 10) / 10,
    burstiness: Math.round(burstiness * 100) / 100,
    lexicalDiversity: Math.round(lexicalDiversity * 100) / 100,
    repetitionScore: Math.round(repetitionScore * 100) / 100,
    aiFingerprintScore,
    hints,
  };
}
