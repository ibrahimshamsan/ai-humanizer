export type Lang = "ar" | "en";

export const translations = {
  en: {
    dir: "ltr" as const,
    brand: "Humanizer",
    hero: {
      badge: "Natural human writing",
      title1: "Turn any text into",
      title2: "natural human style",
      subtitle:
        "A precise rewriting engine that converts AI text into natural, human-sounding writing while preserving every detail of the original meaning.",
    },
    humanizer: {
      originalTitle: "Original text",
      outputTitle: "Human text",
      wordUnit: "words",
      inputPlaceholder: "Paste your text here, or drop a file...",
      outputPlaceholder: "Your rewritten text will appear here.",
      levels: {
        light: "Light",
        medium: "Medium",
        strong: "Strong",
      },
      button: "Humanize text",
      loading: "Rewriting...",
      copy: "Copy",
      copied: "Copied",
      reportTitle: "Analysis report",
      upload: "Upload file",
      uploadDrop: "Drop file here",
      uploadHint: "TXT, MD, CSV, JSON, RTF up to 500 KB",
      uploadError: "Unsupported file or too large",
      clear: "Clear",
      errorMinWords: "Please enter at least 20 words.",
      errorGeneric: "Something went wrong",
      errorConnection: "Could not reach the server",
      scores: {
        human: "Human style score",
        integrity: "Meaning integrity",
        detection: "Detection bypass",
      },
    },
    features: {
      items: [
        {
          t: "Three-stage pipeline",
          d: "Pattern removal, voice injection, and final polish for natural human output.",
        },
        {
          t: "Meaning preserved",
          d: "Names, numbers, dates and facts are never altered.",
        },
        {
          t: "Instant reports",
          d: "Three scores for every rewrite: humanity, integrity, and detection bypass.",
        },
      ],
    },
    footer: "All rights reserved.",
  },
  ar: {
    dir: "rtl" as const,
    brand: "هيومانايزر",
    hero: {
      badge: "كتابة بشرية طبيعية",
      title1: "حوّل أي نص إلى",
      title2: "أسلوب بشري طبيعي",
      subtitle:
        "محرك إعادة صياغة دقيق يحوّل النصوص الآلية إلى كتابة طبيعية بأسلوب بشري، مع الحفاظ الكامل على كل تفاصيل المعنى الأصلي.",
    },
    humanizer: {
      originalTitle: "النص الأصلي",
      outputTitle: "النص البشري",
      wordUnit: "كلمة",
      inputPlaceholder: "الصق النص هنا، أو أفلت ملفاً...",
      outputPlaceholder: "سيظهر النص المُعاد صياغته هنا.",
      levels: {
        light: "خفيف",
        medium: "متوسط",
        strong: "قوي",
      },
      button: "حوّل إلى أسلوب بشري",
      loading: "جارٍ التحويل...",
      copy: "نسخ",
      copied: "تم النسخ",
      reportTitle: "تقرير التحليل",
      upload: "رفع ملف",
      uploadDrop: "أفلت الملف هنا",
      uploadHint: "TXT، MD، CSV، JSON، RTF حتى 500 كيلوبايت",
      uploadError: "نوع الملف غير مدعوم أو الحجم كبير",
      clear: "مسح",
      errorMinWords: "الرجاء إدخال 20 كلمة على الأقل.",
      errorGeneric: "حدث خطأ غير متوقع",
      errorConnection: "فشل الاتصال بالخادم",
      scores: {
        human: "نسبة الأسلوب البشري",
        integrity: "نسبة الحفاظ على المعنى",
        detection: "نسبة تجاوز الكشف",
      },
    },
    features: {
      items: [
        {
          t: "نظام من ثلاث مراحل",
          d: "إزالة الأنماط، حقن الصوت البشري، ثم ضبط نهائي.",
        },
        {
          t: "حفاظ على المعنى",
          d: "لا يتم تغيير الأسماء أو الأرقام أو التواريخ أو الحقائق.",
        },
        {
          t: "تقارير فورية",
          d: "ثلاث نسب لكل عملية تحويل: البشرية، التكامل، وتجاوز الكشف.",
        },
      ],
    },
    footer: "جميع الحقوق محفوظة.",
  },
};
