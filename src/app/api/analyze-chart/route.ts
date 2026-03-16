import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image, description, pair, timeframe = "1H" } = await req.json();
  if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });

  const now = new Date();
  const hour = now.getUTCHours();
  const sessionName = hour >= 7 && hour < 12 ? "London" : hour >= 12 && hour < 16 ? "London/NY Overlap" : hour >= 16 && hour < 20 ? "New York" : "Asian";
  const sessionQuality = sessionName === "London/NY Overlap" ? "PRIME" : sessionName === "Asian" ? "LOW" : "HIGH";

  const tfMins: Record<string, number> = { "1m":1,"5m":5,"15m":15,"30m":30,"1h":60,"4h":240,"1d":1440 };
  const mins = tfMins[timeframe.toLowerCase()] || 60;
  const elapsed = (now.getUTCHours() * 60 + now.getUTCMinutes()) % mins;
  const candlePct = Math.round(elapsed / mins * 100);

  const PROMPT = `You are CSX AI, an elite institutional trading analyst.

Analyze this ${timeframe} chart with extreme precision. ONLY call BUY/SELL with 3+ confluent factors.

Session: ${sessionName} (${sessionQuality}) | Candle: ${candlePct}% complete
${description ? `Trader notes: ${description}` : ""}
${pair ? `Pair: ${pair}` : ""}

CONFLUENCE CHECKLIST — count how many align for your direction:
□ Trend alignment (HTF trend matches signal direction)
□ Key level (price near significant S/R)  
□ Pattern confirmation (chart pattern confirmed, not just forming)
□ Momentum (RSI/MACD supporting direction, check for divergence)
□ Candlestick confirmation (last 1-3 candles confirm direction)
□ Session quality (London/NY = valid, Asian = risky)
□ Volume confirmation (volume increasing in signal direction)

If fewer than 3 confluences → set direction to "WAIT"
If ${sessionQuality === "LOW" ? "Asian session — add session warning to warnings array" : "session is favorable"}

Respond in JSON only:
{
  "pair": "detected pair or UNKNOWN",
  "timeframe": "${timeframe}",
  "trend": "uptrend/downtrend/ranging",
  "phase": "phase",
  "support_levels": ["price1"],
  "resistance_levels": ["price1"],
  "key_level": "most critical price",
  "near_key_level": true,
  "distance_from_key_level_pct": 0.2,
  "chart_patterns": [{"name": "...", "status": "confirmed/forming/broken", "implication": "bullish/bearish", "reliability": "high/medium/low"}],
  "candlestick_patterns": [{"name": "...", "signal": "bullish/bearish", "strength": "strong/weak"}],
  "trend_lines": "description",
  "fibonacci": {"visible": true, "key_level": "0.618 at X"},
  "indicators": {"rsi": "32", "rsi_divergence": "bullish/bearish/none", "macd": "bullish/bearish", "ma_position": "above/below", "volume": "increasing/decreasing"},
  "confluences": ["Trend alignment: downtrend confirmed", "Key level: price at major resistance"],
  "confluence_count": 4,
  "confluence_direction": "bullish/bearish/mixed",
  "news_correlation": "description",
  "trade": {
    "direction": "BUY/SELL/WAIT",
    "wait_reason": "why waiting if WAIT",
    "entry": "price or zone",
    "stop_loss": "price",
    "sl_reasoning": "why",
    "take_profit_1": "price",
    "take_profit_2": "price",
    "rr_ratio": "2.5:1",
    "hold_duration": "time",
    "confidence": "LOW/MEDIUM/HIGH",
    "invalidation": "what cancels this"
  },
  "pattern_history": "historical context",
  "summary": "2-3 sentence summary",
  "warnings": ["session warning if Asian", "mid-candle warning if <50% complete"]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: "image/png", data: image } },
          { type: "text", text: PROMPT }
        ]}],
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "Analysis failed" }, { status: 500 });

    let text = data.content[0]?.text || "";
    if (text.startsWith("```")) { text = text.split("```")[1]; if (text.startsWith("json")) text = text.slice(4); }

    try {
      const parsed = JSON.parse(text.trim());
      parsed.session_info = { name: sessionName, quality: sessionQuality };
      parsed.candle_info = { pct_complete: candlePct, near_close: candlePct >= 80, mins_remaining: mins - elapsed };
      return NextResponse.json({ analysis: parsed });
    } catch {
      return NextResponse.json({ text });
    }
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
