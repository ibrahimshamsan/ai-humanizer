export type PatternSeverity = "critical" | "high" | "medium" | "low";

export type AIPattern = {
  id: string;
  severity: PatternSeverity;
  regex: RegExp;
  label: string;
  replacement?: string;
};

export const AI_PATTERNS: AIPattern[] = [
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
  {
    id: "h13",
    severity: "high",
    regex: /\bplays?\s+a\s+vital\s+role\b/gi,
    label: "plays a vital role",
  },
  {
    id: "h14",
    severity: "high",
    regex: /\bplays?\s+a\s+key\s+role\b/gi,
    label: "plays a key role",
  },
  {
    id: "h15",
    severity: "high",
    regex: /\bshed[s]?\s+light\s+on\b/gi,
    label: "shed light on",
  },
  {
    id: "h16",
    severity: "high",
    regex: /\bnavigat(e|ing)\s+the\s+complexit/gi,
    label: "navigating the complexity",
  },
  {
    id: "m1",
    severity: "medium",
    regex: /\btherefore\b/gi,
    label: "therefore",
  },
  {
    id: "m2",
    severity: "medium",
    regex: /\bconsequently\b/gi,
    label: "consequently",
  },
  {
    id: "m3",
    severity: "medium",
    regex: /\bsubsequently\b/gi,
    label: "subsequently",
  },
  {
    id: "m4",
    severity: "medium",
    regex: /\bnevertheless\b/gi,
    label: "nevertheless",
  },
  {
    id: "m5",
    severity: "medium",
    regex: /\bnonetheless\b/gi,
    label: "nonetheless",
  },
  { id: "m6", severity: "medium", regex: /\bthus\b/gi, label: "thus" },
  { id: "m7", severity: "medium", regex: /\bhence\b/gi, label: "hence" },
  { id: "m8", severity: "medium", regex: /\bnotably\b/gi, label: "notably" },
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
