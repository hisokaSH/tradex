"use client";

import { useState, useRef } from "react";

const WEBHOOK_URL = "http://localhost:5002";
const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_WEBHOOK_SECRET || "";

const PAIRS = ["EURUSD","GBPUSD","USDJPY","USDCHF","AUDUSD","NZDUSD","USDCAD","EURGBP","EURJPY","GBPJPY","XAUUSD","US30","NAS100","GER40"];
const TIMEFRAMES = ["1M","5M","15M","1H","4H","1D"];

export default function ForexClient() {
  const [screenshot, setScreenshot]   = useState<string | null>(null);
  const [screenshotName, setName]     = useState("");
  const [pair, setPair]               = useState("EURUSD");
  const [action, setAction]           = useState<"buy"|"sell">("buy");
  const [price, setPrice]             = useState("");
  const [timeframe, setTimeframe]     = useState("1H");
  const [strategy, setStrategy]       = useState("");
  const [rsi, setRsi]                 = useState("");
  const [notes, setNotes]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState<string | null>(null);
  const [error, setError]             = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setScreenshot((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  }

  async function analyzeAndSubmit() {
    if (!price) { setError("Enter the current price"); return; }
    setLoading(true); setError(""); setResult(null);

    // If screenshot provided, run Claude vision analysis first
    let chartAnalysis = "";
    if (screenshot) {
      try {
        const r = await fetch("/api/analyze-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: screenshot,
            description: `This is a ${pair} ${timeframe} chart. The trader wants to ${action}. ${notes}`,
          }),
        });
        const d = await r.json();
        chartAnalysis = d.text || "";
      } catch {}
    }

    // Send to webhook for full processing
    try {
      const payload = {
        pair, action, price, timeframe,
        strategy: strategy || "Manual Analysis",
        rsi: rsi || undefined,
        message: chartAnalysis ? `Chart analysis: ${chartAnalysis.slice(0,300)}` : notes,
        source: "dashboard",
      };

      const r = await fetch(`${WEBHOOK_URL}/webhook${WEBHOOK_SECRET ? `?secret=${WEBHOOK_SECRET}` : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        setResult("✅ Signal submitted for analysis! Check Discord in ~30 seconds for the full report with backtest, security checks, and CSX AI verdict.");
        setScreenshot(null); setName(""); setPrice(""); setNotes("");
      } else {
        throw new Error("Webhook server not running");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed — make sure webhook server is running (py -3.12 webhook.py)");
    } finally {
      setLoading(false);
    }
  }

  const mono = { fontFamily: "'Space Mono',monospace" };
  const inputStyle: React.CSSProperties = {
    background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "3px",
    color: "var(--text)", fontFamily: "'Syne',sans-serif", fontSize: "0.85rem",
    padding: "9px 12px", outline: "none", width: "100%",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
  const labelStyle: React.CSSProperties = { ...mono, fontSize: "0.6rem", color: "var(--text3)", letterSpacing: "1px", display: "block", marginBottom: "5px" };

  return (
    <div>
      <p style={{ ...mono, fontSize: "0.68rem", color: "var(--text3)", letterSpacing: "1px", marginBottom: "1.5rem" }}>
        // FOREX SIGNAL ANALYZER
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Left — chart upload + details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Screenshot upload */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.25rem" }}>Chart Screenshot <span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>(optional)</span></p>
            <p style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: "1rem" }}>Upload your TradingView chart — CSX AI will analyze it visually</p>
            <div onClick={() => fileRef.current?.click()} style={{
              border: `2px dashed ${screenshot ? "var(--green)" : "var(--border)"}`,
              borderRadius: "4px", padding: "1.5rem", textAlign: "center", cursor: "pointer",
              background: screenshot ? "rgba(0,217,126,0.04)" : "var(--bg3)",
            }}>
              {screenshot ? (
                <div>
                  <p style={{ ...mono, fontSize: "0.68rem", color: "var(--green)", marginBottom: "0.5rem" }}>✓ {screenshotName}</p>
                  <img src={`data:image/png;base64,${screenshot}`} alt="chart" style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "3px" }} />
                </div>
              ) : (
                <p style={{ ...mono, fontSize: "0.72rem", color: "var(--text3)" }}>📸 Click to upload chart</p>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>

          {/* Trade details */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>Trade Details</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>PAIR</label>
                <select value={pair} onChange={e => setPair(e.target.value)} style={selectStyle}>
                  {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>TIMEFRAME</label>
                <select value={timeframe} onChange={e => setTimeframe(e.target.value)} style={selectStyle}>
                  {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>DIRECTION</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["buy","sell"] as const).map(a => (
                  <button key={a} onClick={() => setAction(a)} style={{
                    flex: 1, padding: "9px", ...mono, fontSize: "0.75rem", letterSpacing: "1px",
                    fontWeight: "700", cursor: "pointer", borderRadius: "3px",
                    background: action === a ? (a === "buy" ? "rgba(0,217,126,0.15)" : "var(--red-muted)") : "var(--bg3)",
                    border: `1px solid ${action === a ? (a === "buy" ? "rgba(0,217,126,0.4)" : "var(--red-border)") : "var(--border)"}`,
                    color: action === a ? (a === "buy" ? "var(--green)" : "var(--red)") : "var(--text3)",
                  }}>{a === "buy" ? "🟢 BUY / LONG" : "🔴 SELL / SHORT"}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>CURRENT PRICE</label>
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 1.08450" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>RSI VALUE (optional)</label>
                <input value={rsi} onChange={e => setRsi(e.target.value)} placeholder="e.g. 28.4" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>STRATEGY NAME (optional)</label>
              <input value={strategy} onChange={e => setStrategy(e.target.value)} placeholder="e.g. RSI Divergence, Supply/Demand" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>NOTES (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Any context about the setup — key levels, patterns, confluence..."
                rows={2} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} />
            </div>
          </div>
        </div>

        {/* Right — what happens + submit */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "1rem" }}>What happens when you submit</p>
            {[
              { step: "01", title: "Chart Analysis", desc: "If you uploaded a screenshot, CSX AI reads the chart visually — trend, key levels, patterns" },
              { step: "02", title: "Security Checks", desc: "Session filter, news event scan, R:R check, volatility check — all must pass" },
              { step: "03", title: "Backtest", desc: "Strategy conditions tested against 500 historical candles — win rate, R:R, profit factor" },
              { step: "04", title: "CSX AI Verdict", desc: "AI gives TAKE / SKIP / WAIT recommendation with full reasoning" },
              { step: "05", title: "Discord Post", desc: "Full report posted to your signal channel with all data visible to community" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" }}>
                <span style={{ ...mono, fontSize: "0.65rem", color: "var(--red)", minWidth: "24px" }}>{s.step}</span>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: "600", marginBottom: "2px" }}>{s.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: "1.5" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: "var(--red-muted)", border: "1px solid var(--red-border)", borderRadius: "3px", padding: "10px 14px" }}>
              <p style={{ ...mono, fontSize: "0.68rem", color: "var(--red)" }}>⚠ {error}</p>
            </div>
          )}

          {result && (
            <div style={{ background: "rgba(0,217,126,0.08)", border: "1px solid rgba(0,217,126,0.3)", borderRadius: "3px", padding: "10px 14px" }}>
              <p style={{ ...mono, fontSize: "0.68rem", color: "var(--green)" }}>{result}</p>
            </div>
          )}

          <button onClick={analyzeAndSubmit} disabled={loading} style={{
            padding: "14px", background: loading ? "var(--bg4)" : "var(--red)",
            border: "none", color: loading ? "var(--text3)" : "#fff",
            ...mono, fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "700",
            borderRadius: "3px", cursor: loading ? "not-allowed" : "pointer", width: "100%",
          }}>
            {loading ? "// ANALYZING..." : "ANALYZE & SUBMIT TO DISCORD →"}
          </button>

          <p style={{ ...mono, fontSize: "0.6rem", color: "var(--text3)", textAlign: "center" }}>
            Make sure webhook.py is running on port 5002
          </p>
        </div>
      </div>
    </div>
  );
}
