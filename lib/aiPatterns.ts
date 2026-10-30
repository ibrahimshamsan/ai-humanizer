export type PatternSeverity = "critical" | "high" | "medium" | "low";

export type AIPattern = {
  id: string;
  severity: PatternSeverity;
  regex: RegExp;
  label: string;
  replacement?: string;
};

export const AI_PATTERNS: AIPattern[] = [
  // ===== CRITICAL — English =====
  {
    id: "c1",
    severity: "critical",
    regex: /\bdelve[sd]?\s+into\b/gi,
    label: "delve into",
  },
  {
    id: "c2",
    severity: "critical",
    regex: /\bmoreover\b/gi,
    label: "moreover",
  },
  {
    id: "c3",
    severity: "critical",
    regex: /\bfurthermore\b/gi,
    label: "furthermore",
  },
  {
    id: "c4",
    severity: "critical",
    regex: /\badditionally\b/gi,
    label: "additionally",
  },
  {
    id: "c5",
    severity: "critical",
    regex: /\bin conclusion\b/gi,
    label: "in conclusion",
  },
  {
    id: "c6",
    severity: "critical",
    regex: /\bin summary\b/gi,
    label: "in summary",
  },
  {
    id: "c7",
    severity: "critical",
    regex: /\bit is important to note\b/gi,
    label: "it is important to note",
  },
  {
    id: "c8",
    severity: "critical",
    regex: /\bit is worth noting\b/gi,
    label: "it is worth noting",
  },
  {
    id: "c9",
    severity: "critical",
    regex: /\bnavigate\s+the\b/gi,
    label: "navigate the",
  },
  {
    id: "c10",
    severity: "critical",
    regex: /\bleverage\b/gi,
    label: "leverage",
  },
  { id: "c11", severity: "critical", regex: /\butilize\b/gi, label: "utilize" },
  {
    id: "c12",
    severity: "critical",
    regex: /\bfacilitate\b/gi,
    label: "facilitate",
  },
  {
    id: "c13",
    severity: "critical",
    regex: /\bunderscore[sd]?\b/gi,
    label: "underscore",
  },
  {
    id: "c14",
    severity: "critical",
    regex: /\bcomprehensive\b/gi,
    label: "comprehensive",
  },
  { id: "c15", severity: "critical", regex: /\brobust\b/gi, label: "robust" },
  {
    id: "c16",
    severity: "critical",
    regex: /\bmultifaceted\b/gi,
    label: "multifaceted",
  },
  {
    id: "c17",
    severity: "critical",
    regex: /\bplethora\s+of\b/gi,
    label: "plethora of",
  },
  {
    id: "c18",
    severity: "critical",
    regex: /\bmyriad\s+of\b/gi,
    label: "myriad of",
  },

  // ===== HIGH — English =====
  {
    id: "h1",
    severity: "high",
    regex: /\bseamless(ly)?\b/gi,
    label: "seamless",
  },
  { id: "h2", severity: "high", regex: /\bholistic\b/gi, label: "holistic" },
  { id: "h3", severity: "high", regex: /\bparadigm\b/gi, label: "paradigm" },
  {
    id: "h4",
    severity: "high",
    regex: /\bsynerg(y|ies)\b/gi,
    label: "synergy",
  },
  { id: "h5", severity: "high", regex: /\bpivotal\b/gi, label: "pivotal" },
  { id: "h6", severity: "high", regex: /\bcrucial\b/gi, label: "crucial" },
  {
    id: "h7",
    severity: "high",
    regex: /\blandscape\s+of\b/gi,
    label: "landscape of",
  },
  { id: "h8", severity: "high", regex: /\brealm\s+of\b/gi, label: "realm of" },
  { id: "h9", severity: "high", regex: /\btapestry\b/gi, label: "tapestry" },
  {
    id: "h10",
    severity: "high",
    regex: /\bmeticulous(ly)?\b/gi,
    label: "meticulous",
  },
  { id: "h11", severity: "high", regex: /\bintricate\b/gi, label: "intricate" },
  { id: "h12", severity: "high", regex: /\bparamount\b/gi, label: "paramount" },

  // ===== CRITICAL — Arabic (بصمات قوية) =====
  {
    id: "ar1",
    severity: "critical",
    regex: /بالإضافة إلى ذلك/g,
    label: "بالإضافة إلى ذلك",
  },
  {
    id: "ar2",
    severity: "critical",
    regex: /علاوة على ذلك/g,
    label: "علاوة على ذلك",
  },
  {
    id: "ar3",
    severity: "critical",
    regex: /تجدر الإشارة/g,
    label: "تجدر الإشارة",
  },
  {
    id: "ar4",
    severity: "critical",
    regex: /من الجدير بالذكر/g,
    label: "من الجدير بالذكر",
  },
  {
    id: "ar5",
    severity: "critical",
    regex: /يجدر الذكر/g,
    label: "يجدر الذكر",
  },
  { id: "ar6", severity: "critical", regex: /وبالتالي/g, label: "وبالتالي" },
  { id: "ar7", severity: "critical", regex: /ومن ثم/g, label: "ومن ثم" },
  { id: "ar8", severity: "critical", regex: /في الختام/g, label: "في الختام" },
  { id: "ar9", severity: "critical", regex: /لا سيما/g, label: "لا سيما" },
  {
    id: "ar10",
    severity: "critical",
    regex: /في سياق متصل/g,
    label: "في سياق متصل",
  },
  {
    id: "ar11",
    severity: "critical",
    regex: /في هذا السياق/g,
    label: "في هذا السياق",
  },
  {
    id: "ar12",
    severity: "critical",
    regex: /من ناحية أخرى/g,
    label: "من ناحية أخرى",
  },
  {
    id: "ar13",
    severity: "critical",
    regex: /إلى جانب ذلك/g,
    label: "إلى جانب ذلك",
  },
  {
    id: "ar14",
    severity: "critical",
    regex: /فضلاً عن ذلك/g,
    label: "فضلاً عن ذلك",
  },
  {
    id: "ar15",
    severity: "critical",
    regex: /يُعدّ من أهم/g,
    label: "يُعدّ من أهم",
  },
  {
    id: "ar16",
    severity: "critical",
    regex: /يعتبر من أبرز/g,
    label: "يعتبر من أبرز",
  },
  {
    id: "ar17",
    severity: "critical",
    regex: /من هذا المنطلق/g,
    label: "من هذا المنطلق",
  },
  { id: "ar18", severity: "critical", regex: /وعليه فإن/g, label: "وعليه فإن" },
  {
    id: "ar19",
    severity: "critical",
    regex: /بناءً على ذلك/g,
    label: "بناءً على ذلك",
  },
  { id: "ar20", severity: "critical", regex: /في إطار/g, label: "في إطار" },
  { id: "ar21", severity: "critical", regex: /على صعيد/g, label: "على صعيد" },
  { id: "ar22", severity: "critical", regex: /في ظل/g, label: "في ظل" },
  { id: "ar23", severity: "critical", regex: /في ضوء ما/g, label: "في ضوء ما" },
  { id: "ar24", severity: "critical", regex: /حيث أن/g, label: "حيث أن" },
  {
    id: "ar25",
    severity: "critical",
    regex: /الأمر الذي/g,
    label: "الأمر الذي",
  },

  // ===== HIGH — Arabic =====
  { id: "arh1", severity: "high", regex: /بالطبع/g, label: "بالطبع" },
  { id: "arh2", severity: "high", regex: /بشكل كبير/g, label: "بشكل كبير" },
  { id: "arh3", severity: "high", regex: /بشكل عام/g, label: "بشكل عام" },
  { id: "arh4", severity: "high", regex: /بشكل ملحوظ/g, label: "بشكل ملحوظ" },
  { id: "arh5", severity: "high", regex: /بشكل أساسي/g, label: "بشكل أساسي" },
  { id: "arh6", severity: "high", regex: /من المهم أن/g, label: "من المهم أن" },
  { id: "arh7", severity: "high", regex: /يجب الإشارة/g, label: "يجب الإشارة" },
  { id: "arh8", severity: "high", regex: /مع تطور/g, label: "مع تطور" },
  {
    id: "arh9",
    severity: "high",
    regex: /في الوقت الحاضر/g,
    label: "في الوقت الحاضر",
  },
  {
    id: "arh10",
    severity: "high",
    regex: /في عالمنا المعاصر/g,
    label: "في عالمنا المعاصر",
  },
];

export function countPatterns(text: string): {
  total: number;
  bySeverity: Record<PatternSeverity, number>;
  matches: string[];
} {
  const bySeverity: Record<PatternSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  let total = 0;
  const matches: string[] = [];

  for (const p of AI_PATTERNS) {
    const found = text.match(p.regex);
    if (found) {
      bySeverity[p.severity] += found.length;
      total += found.length;
      matches.push(...found.slice(0, 2));
    }
  }

  return { total, bySeverity, matches };
}
