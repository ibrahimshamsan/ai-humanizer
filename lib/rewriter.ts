import type { Analysis } from "./analyzer";

type Level = "light" | "medium" | "strong";

// ============================================================
// ============== دالة الاتصال بـ Groq ==============
// ============================================================
async function callGroq(prompt: string, temperature = 1.0): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const key = process.env.GROQ_API_KEY;
  const model = "openai/gpt-oss-120b";

  if (!key) throw new Error("GROQ_API_KEY is missing in .env.local");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.5,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Groq error: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Groq timeout");
    throw err;
  }
}

// ============================================================
// ============== دالة تنظيف النص ==============
// ============================================================
function cleanOutput(raw: string): string {
  let cleaned = raw;
  cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, "");
  cleaned = cleaned.replace(/[*_#~`]/g, "");
  cleaned = cleaned.replace(
    /^(here is|here's|sure|of course|certainly|the rewritten text[:\s]*|final text[:\s]*)/i,
    "",
  );
  cleaned = cleaned.replace(/^["'“”«»]+|["'“”«»]+$/g, "");

  cleaned = cleaned.replace(/\bsophisticated\b/gi, "advanced");
  cleaned = cleaned.replace(/\bintricate\b/gi, "complex");
  cleaned = cleaned.replace(/\baccelerate[sd]?\b/gi, "speed up");
  cleaned = cleaned.replace(/\bfacilitate[sd]?\b/gi, "help");
  cleaned = cleaned.replace(/\bcomprehensive\b/gi, "full");

  return cleaned.trim();
}

// ============================================================
// ============== القواعد الصارمة ==============
// ============================================================
const EN_FORBIDDEN = `
CRITICAL RULE: Do NOT summarize. Do NOT shorten the text. Your output must have roughly the same word count as the input. Keep ALL facts, numbers, names, and ideas.
ABSOLUTELY FORBIDDEN:
1. Never use em-dashes (—) or en-dashes (–).
2. Never use formal-AI words: delve, leverage, utilize, facilitate, navigate, underscore, comprehensive, robust, holistic, seamless, multifaceted, myriad, plethora, tapestry, paradigm, synergy, furthermore, moreover, additionally, consequently, subsequently, therefore, nevertheless, nonetheless, thus, hence, pivotal, crucial, sophisticated, intricate, ensure, values.
3. Never use phrases: "it's worth noting", "it's important to note", "the biggest challenge".
4. NEVER USE EMOJIS OR SYMBOLS.
5. Never start two consecutive sentences with the same word.
6. NEVER write sentence fragments. Every sentence must be complete.
`;

// ============================================================
// ============== المراحل الأربع ==============
// ============================================================

// 1. إزالة الأنماط
function buildEnRemovalPrompt(text: string): string {
  return `You are a plain-speaking editor removing AI writing patterns.\n${EN_FORBIDDEN}\nTASK: Replace every AI-typical word with a plain one.\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nCLEANED:`;
}

// 2. حقن الصوت البشري
function buildEnVoicePrompt(text: string): string {
  return `You are rewriting this as a real human blogger would. Not a robot. Not a professor.\n${EN_FORBIDDEN}\nVOICE RULES:\n1. Vary sentence length EXTREMELY. Some 3-6 words. Others 25-40 words.\n2. Start at least 2 sentences with "But", "And", or "So".\n3. Use simple words.\n4. Use contractions (doesn't, won't, it's).\n5. Do NOT add opinions.\n\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nHUMANIZED:`;
}

// 3. تكسير الإيقاع (بدون حذف أي معلومة)
function buildEnFracturePrompt(text: string): string {
  return `The text still has AI rhythm. AI writes sentences of similar length. Humans don't.\n${EN_FORBIDDEN}\nFRACTURE THE RHYTHM (WITHOUT DELETING ANYTHING):\n1. If a sentence is over 25 words, split it into two sentences, BUT keep all the words and information. Just change the punctuation.\n2. If two sentences in a row are short, merge them using "and" or "but".\n3. Change the opening structure of at least 3 sentences.\n4. You MUST preserve every single fact. DO NOT DROP ANY INFORMATION.\n\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nFRACTURED:`;
}

// 4. التبسيط
function buildEnSimplifyPrompt(text: string): string {
  return `Final pass. Make the text sound less academic and more conversational.\n${EN_FORBIDDEN}\nSIMPLIFY RULES:\n1. If a sentence sounds like a textbook, rewrite it casually, but keep all the facts.\n2. Use simple verbs.\n3. Ensure the output is the SAME LENGTH as the input. Do not summarize.\n\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nSIMPLIFIED:`;
}

// ============================================================
// ============== الدالة الرئيسية ============
// ============================================================
export async function rewriteWithLLM(
  text: string,
  level: Level,
  analysis: Analysis,
): Promise<string> {
  if (/[\u0600-\u06FF]/.test(text)) {
    throw new Error("This version is optimized for English only.");
  }

  // 1. إزالة
  let result = await callGroq(buildEnRemovalPrompt(text), 0.7);
  result = cleanOutput(result);
  if (!result) throw new Error("Removal pass failed");

  // 2. صوت بشري
  if (level !== "light") {
    try {
      const voiced = await callGroq(buildEnVoicePrompt(result), 0.85); // خفضنا الحرارة قليلاً
      if (voiced && voiced.length > 30) result = cleanOutput(voiced);
    } catch (e) {
      console.warn("En voice failed", e);
    }
  }

  // 3. تكسير
  if (level === "strong") {
    try {
      const fractured = await callGroq(buildEnFracturePrompt(result), 0.9); // خفضنا الحرارة لمنع الاختصار
      if (fractured && fractured.length > 30) result = cleanOutput(fractured);
    } catch (e) {
      console.warn("En fracture failed", e);
    }
  }

  // 4. تبسيط نهائي
  if (level === "strong") {
    try {
      const simplified = await callGroq(buildEnSimplifyPrompt(result), 0.8);
      if (simplified && simplified.length > 30)
        result = cleanOutput(simplified);
    } catch (e) {
      console.warn("En simplify failed", e);
    }
  }

  return result.replace(/[—–]/g, ",").replace(/,\s*,/g, ",");
}
