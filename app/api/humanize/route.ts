import { NextResponse } from "next/server";
import { analyzeText } from "@/lib/analyzer";
import { rewriteWithLLM } from "@/lib/rewriter";
import { validate } from "@/lib/validator";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = { text: string; level?: "light" | "medium" | "strong" };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const text = (body.text || "").trim();
    const level = body.level || "strong";

    if (!text)
      return NextResponse.json({ error: "Empty text" }, { status: 400 });
    if (text.split(/\s+/).length < 20)
      return NextResponse.json(
        { error: "Please enter at least 20 words" },
        { status: 400 },
      );
    if (text.length > 6000)
      return NextResponse.json(
        { error: "Character limit exceeded (Max 6000 characters)." },
        { status: 400 },
      );

    const analysis = analyzeText(text);
    const rewritten = await rewriteWithLLM(text, level, analysis);

    if (!rewritten) throw new Error("Rewrite failed");

    const v = validate(text, rewritten);

    return NextResponse.json({
      output: rewritten,
      humanScore: v.humanScore,
      integrityScore: v.integrityScore,
      detectionScore: v.detectionScore,
    });
  } catch (e: any) {
    console.error("humanize error:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 },
    );
  }
}
