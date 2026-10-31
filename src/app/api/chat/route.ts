import { NextRequest, NextResponse } from "next/server";
import { RuntimeContext, EventPlan } from "@/lib/types";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { savePlanToDb } from "@/lib/db";
import { PlanSchema } from "@/lib/schema";

// Priority queue: fast, available Gemini Flash models
const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

interface GeminiResponse {
  reply: string;
  plan: EventPlan | null;
}

function cleanAndParseJson(text: string): GeminiResponse {
  let clean = text.trim();
  // Strip code fences if present
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }

  // Find outermost { and }
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(clean);
}

async function fetchGeminiWithFallback(
  apiKey: string,
  requestBody: any,
  perModelTimeoutMs = 25000
): Promise<{ data: any; model: string }> {
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), perModelTimeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        return { data, model };
      }

      const errText = await res.text();
      console.warn(`Gemini model ${model} returned ${res.status}: ${errText.slice(0, 100)}`);

      // If high demand (503) or rate-limit (429), immediately try next model
      if (res.status === 503 || res.status === 429) {
        lastError = new Error(`Model ${model} busy (${res.status})`);
        continue;
      }

      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    } catch (err: any) {
      clearTimeout(timer);
      const isAbort = err?.name === "AbortError" || err?.message?.includes("abort");
      console.warn(`Gemini model ${model} ${isAbort ? "timed out" : "error"}: ${err?.message || err}`);
      lastError = err;
      // Try next candidate model
      continue;
    }
  }

  throw lastError || new Error("All Gemini candidate models failed to respond.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], context: clientContext, plan_state } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          role: "assistant",
          content: "GEMINI_API_KEY is not configured in .env. Please check your API key configuration.",
        },
        { status: 500 }
      );
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const context: RuntimeContext = {
      today: clientContext?.today || todayStr,
      locale: clientContext?.locale || "en-IN",
      country: clientContext?.country || "IN",
      currency: clientContext?.currency || "INR",
      mode: clientContext?.mode || "CHAT",
      viewport: clientContext?.viewport || "desktop",
      plan_state: plan_state || "none",
    };

    const activeEventId =
      context.plan_state !== "none" && context.plan_state?.id
        ? context.plan_state.id
        : null;

    const basePrompt = buildSystemPrompt(context);

    // Streamlined system prompt instruction for high speed, reliability, and precision
    const systemInstructionText = `${basePrompt}

# INSTRUCTION FOR THIS REQUEST:
You are Eventra.

1. SELECTED EVENT:
${
  activeEventId
    ? `The user is currently modifying event ID "${activeEventId}".
- In your returned "plan" object, you MUST KEEP "id": "${activeEventId}".
- Apply the user's requested adjustments to this existing event (budget, timeline, vendors, etc.).`
    : `No event selected. If creating a plan, set "id": null.`
}

2. OUTPUT RULES:
- Output a single JSON object with keys "reply" and "plan".
- "reply": Friendly, warm conversational message for the chat panel (2-3 short paragraphs summarizing highlights and asking a clear next question). Do NOT repeat the full budget table or timeline in text, because the UI renders them directly from "plan".
- "plan": Full plan object matching PLAN SCHEMA (with id: "${activeEventId || ""}"), or null if purely conversational.
- Contingency in budget must be 8-10% and the last item with icon "piggy-bank".
- All icons must be from the allowed ICON list: building-2, utensils, camera, flower-2, music, mic, shirt, mail, car, shield-check, piggy-bank, cake, gift, megaphone, tent, users, package.
- Return ONLY the raw JSON object, without markdown code fences.`;

    // Send the last 6 messages to keep context focused and avoid bloat
    const recentMessages = messages.slice(-6);
    const contents = recentMessages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstructionText }],
      },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192, // Generous token ceiling to prevent JSON cutoffs
        responseMimeType: "application/json",
      },
    };

    const { data, model: activeModel } = await fetchGeminiWithFallback(apiKey, requestBody);
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed: GeminiResponse;
    try {
      parsed = cleanAndParseJson(rawText);
    } catch (parseErr) {
      console.error("JSON parse failure on model output:", parseErr);
      return NextResponse.json({
        role: "assistant",
        content: "I put together your plan, but had a slight formatting glitch. Could you send your request once more?",
        model: activeModel,
      });
    }

    let savedPlan: EventPlan | undefined = undefined;

    if (parsed.plan) {
      if (activeEventId) {
        parsed.plan.id = activeEventId;
      }

      const validated = PlanSchema.safeParse(parsed.plan);
      if (validated.success) {
        savedPlan = await savePlanToDb(validated.data);
      } else {
        console.warn("Schema validation warnings:", validated.error.issues);
        savedPlan = await savePlanToDb(parsed.plan);
      }
    }

    if (context.mode === "PLAN") {
      return NextResponse.json(savedPlan || parsed.plan || {});
    }

    return NextResponse.json({
      role: "assistant",
      content: parsed.reply || "I've updated your event plan.",
      mode: "CHAT",
      plan: savedPlan,
      model: activeModel,
    });
  } catch (error: any) {
    const isAbort = error?.name === "AbortError" || error?.message?.includes("abort");
    console.error("Gemini route error:", isAbort ? "Request timed out" : error?.message || error);

    return NextResponse.json({
      role: "assistant",
      content: isAbort
        ? "The request took longer than expected. Please try again with a shorter message or specific request."
        : "Gemini API experienced a temporary network delay. Please click send again.",
      error: error?.message || String(error),
    });
  }
}
