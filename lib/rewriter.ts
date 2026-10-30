import type { Analysis } from "./analyzer";
import { countPatterns } from "./aiPatterns";

type Level = "light" | "medium" | "strong";

// ============================================================
// ============== دالة الاتصال بـ Groq ==============
// ============================================================
async function callGroq(
  prompt: string,
  temperature = 1.0,
  modelOverride?: string,
): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const key = process.env.GROQ_API_KEY;
  const model = modelOverride || "openai/gpt-oss-120b";

  if (!key) throw new Error("GROQ_API_KEY is missing in .env.local");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

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
// ============== دالة الاتصال بـ Gemini ==============
// ============================================================
async function callGemini(prompt: string, temperature = 1.0): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  if (!key) throw new Error("GEMINI_API_KEY is missing in .env.local");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 8192,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Gemini timeout");
    throw err;
  }
}

// ============================================================
// ============== دالة تنظيف النص ==============
// ============================================================
function cleanOutput(raw: string): string {
  let cleaned = raw;
  // إزالة الإيموجي فقط (مع الحفاظ على الأسهم والرموز الأخرى)
  cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, "");
  // إزالة النجوم والشرطات السفلية (تنسيق ماركداون)
  cleaned = cleaned.replace(/[*_#~`]/g, "");
  // إزالة المقدمات الشائعة
  cleaned = cleaned.replace(
    /^(here is|here's|sure|of course|certainly|the rewritten text[:\s]*|final text[:\s]*|النص[:\s]*|بالطبع[،:\s]*|في هذا النص[،:\s]*|إليك النص[:\s]*|يمكنك مراجعة[^\n]*\n*|إليك النص المعدل[^\n]*\n*)/i,
    "",
  );
  cleaned = cleaned.replace(/^["'“”«»]+|["'“”«»]+$/g, "");
  return cleaned.trim();
}

// ============================================================
// ============== القواعد الصارمة للعربية ==============
// ============================================================
const AR_STRICT_RULES = `
ممنوع منعاً باتاً استخدام الكلمات والعبارات التالية:
1. يُعد، تعتبر، يعتبر، متكامل، شامل، يهدف، يسهم، ركيزة، حجر الزاوية.
2. بالإضافة إلى ذلك، علاوة على ذلك، تجدر الإشارة، من الجدير بالذكر، وبالتالي، ومن ثم، في الختام.
3. استخدام الشرطة الطويلة (—).

قواعد الأسلوب البشري:
1. اجعل أطوال الجمل متفاوتة جداً. جملة قصيرة (3 كلمات)، تليها جملة طويلة (25 كلمة).
2. استخدم أدوات ربط بسيطة مثل: "لكن"، "ومع ذلك"، "إلا أن"، "ثم".
3. لا تحذف أي معلومة أو رقم أو اسم أو سهم (←).
4. لا تضف أي مقدمات أو تعليقات. أخرج النص فقط.
`;

function buildArMasterPrompt(text: string, level: Level): string {
  return `أنت كاتب عربي محترف. أعد صياغة النص التالي بأسلوب بشري طبيعي.

${AR_STRICT_RULES}

مستوى التغيير المطلوب: ${level === "strong" ? "شامل وجذري" : "متوسط"}.

النص الأصلي:
"""
${text}
"""

النص البشري:`;
}

function buildArVerifyPrompt(text: string): string {
  return `أنت مدقق لغوي عربي. اقرأ النص التالي. إذا وجدت جملاً تبدو آلية (مصقولة جداً)، أعد صياغتها فقط لتبدو أكثر طبيعية. حافظ على المعنى 100% والأرقام والأسهم. أخرج النص فقط بدون رموز أو مقدمات.

النص:
"""
${text}
"""

النص المحسن:`;
}

// ============================================================
// ============== المسار الإنجليزي (كود 7%) ==============
// ============================================================
const EN_FORBIDDEN = `
ABSOLUTELY FORBIDDEN:
1. Never use em-dashes (—) or en-dashes (–).
2. Never use softeners: "genuinely", "absolutely", "totally", "really", "truly".
3. Never use formal-AI words: delve, leverage, utilize, facilitate, navigate, underscore, comprehensive, robust, holistic, seamless, multifaceted, myriad, plethora, tapestry, paradigm, synergy, furthermore, moreover, additionally, consequently, subsequently, therefore, nevertheless, nonetheless, thus, hence, pivotal, crucial.
4. Never use phrases: "it's worth noting", "it's important to note".
5. NEVER USE EMOJIS OR SYMBOLS.
6. NEVER add information not present in the original.
`;

function buildEnRemovalPrompt(text: string): string {
  return `You are a plain-speaking editor removing AI writing patterns.\n${EN_FORBIDDEN}\nTASK: Replace every AI-typical word with a plain one.\nKeep ALL facts, numbers, names, and structure. Output English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nCLEANED:`;
}
function buildEnVoicePrompt(text: string): string {
  return `You are rewriting this as a real human professional would.\n${EN_FORBIDDEN}\nVOICE RULES:\n1. Vary sentence length EXTREMELY.\n2. Start at least 2 sentences with "But", "And", or "So".\n3. Use contractions (doesn't, won't, it's).\n4. NO metaphors, NO flowery language.\n5. Keep a slightly uneven rhythm.\n6. Do NOT add opinions or commentary.\n7. Preserve 100% of facts.\n8. Preserve original paragraphs.\n\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nHUMANIZED:`;
}
function buildEnFracturePrompt(text: string): string {
  return `The text still has AI rhythm. AI writes sentences of similar length. Humans don't.\n${EN_FORBIDDEN}\nFRACTURE THE RHYTHM:\n1. Find any two consecutive sentences with similar length. Rewrite one to be much shorter or much longer.\n2. Find any sentence over 30 words. Break it.\n3. Find any sentence under 8 words. Merge it with next.\n4. Change the opening structure of at least 3 sentences.\n5. Do NOT change any facts.\n\nOutput English only. Output ONLY the text.\n\nTEXT:\n"""\n${text}\n"""\n\nFRACTURED:`;
}

// ============================================================
// ============== الدالة الرئيسية ============
// ============================================================
export async function rewriteWithLLM(
  text: string,
  level: Level,
  analysis: Analysis,
): Promise<string> {
  const info = deepAnalyze(text, analysis);

  // ============ المسار العربي (نظام احتياطي متعدد) ============
  if (info.isArabic) {
    let finalResult = "";

    // المحاولة الأولى: Gemini
    try {
      const raw = await callGemini(buildArMasterPrompt(text, level), 0.85);
      finalResult = cleanOutput(raw);
    } catch (geminiError) {
      console.warn("Gemini failed, trying Groq (gpt-oss-120b).");

      // المحاولة الثانية: Groq (gpt-oss-120b)
      try {
        const rawGroq = await callGroq(
          buildArMasterPrompt(text, level),
          0.85,
          "openai/gpt-oss-120b",
        );
        finalResult = cleanOutput(rawGroq);
      } catch (groqError) {
        console.warn("Groq gpt-oss failed, trying ALLaM-2.");

        // المحاولة الثالثة: Groq (allam-2-7b)
        try {
          const rawAllam = await callGroq(
            buildArMasterPrompt(text, level),
            0.85,
            "allam-2-7b",
          );
          finalResult = cleanOutput(rawAllam);
        } catch (allamError) {
          throw new Error(
            "Arabic rewrite failed on all providers (Gemini, Groq, ALLaM).",
          );
        }
      }
    }

    if (!finalResult || finalResult.trim().length < 10) {
      throw new Error("Arabic rewrite produced empty result.");
    }

    // مرحلة التحقق (إذا كان النص لا يزال يحتوي على أنماط)
    const remainingPatterns = countPatterns(finalResult);
    if (remainingPatterns.total > 2) {
      try {
        const verifiedRaw = await callGemini(
          buildArVerifyPrompt(finalResult),
          0.7,
        );
        const verified = cleanOutput(verifiedRaw);
        if (verified.trim().length > 20) finalResult = verified;
      } catch (e) {
        console.warn("Verification pass failed, returning first pass.");
      }
    }

    return finalResult.replace(/[—–]/g, "،").replace(/،\s*،/g, "،").trim();
  }

  // ============ المسار الإنجليزي (كود 7% - لا تغيير) ============
  let result = await callGroq(
    buildEnRemovalPrompt(text),
    0.85,
    "openai/gpt-oss-120b",
  );
  result = cleanOutput(result);
  if (!result) throw new Error("Removal pass failed");

  if (level !== "light") {
    try {
      const voiced = await callGroq(
        buildEnVoicePrompt(result),
        0.95,
        "openai/gpt-oss-120b",
      );
      if (voiced && voiced.length > 30) result = cleanOutput(voiced);
    } catch (e) {
      console.warn("En voice failed", e);
    }
  }

  if (level === "strong") {
    try {
      const fractured = await callGroq(
        buildEnFracturePrompt(result),
        1.0,
        "openai/gpt-oss-120b",
      );
      if (fractured && fractured.length > 30) result = cleanOutput(fractured);
    } catch (e) {
      console.warn("En fracture failed", e);
    }
  }

  return result.replace(/[—–]/g, ",").replace(/,\s*,/g, ",");
}

function deepAnalyze(text: string, a: Analysis) {
  return { isArabic: /[\u0600-\u06FF]/.test(text) };
}
