import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image, description } = await req.json();
  if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: image },
          },
          {
            type: "text",
            text: `Analyze this trading chart and ${description ? `the user's strategy: "${description}"` : "suggest an optimized trading strategy"}.

Please:
1. Identify what you see in the chart (trend, key levels, patterns, indicators if visible)
2. ${description ? "Evaluate the user's strategy against what you see" : "Suggest entry and exit conditions"}
3. Provide an optimized strategy description in plain English
4. Format the final strategy as: "OPTIMIZED STRATEGY: [strategy description]"

Be specific about: which pairs, RSI levels, MACD conditions, Bollinger Band levels, EMA crossovers, volume conditions based on what's visible.`,
          },
        ],
      }],
    }),
  });

  const data = await response.json();
  if (!response.ok) return NextResponse.json({ error: data.error?.message || "Analysis failed" }, { status: 500 });

  return NextResponse.json({ text: data.content[0]?.text || "" });
}
