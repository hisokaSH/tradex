"use client";

import { useState, useEffect, useRef } from "react";

const KEY = "k4+MJvDDRDAsppVPWkklUYiOLwcOgkkkGRJqpst9BzE=";
const BASE = "http://localhost:5001";

const EXAMPLES = [
  "Buy BTC when RSI drops below 30 and MACD crosses bullish. Sell when RSI goes above 70.",
  "Buy ETH and SOL when price is below the lower Bollinger Band and volume is 2x average. Sell when price hits the upper band.",
  "Golden cross strategy: buy when EMA20 crosses above EMA50 and price is above EMA200. Sell on death cross.",
  "Buy any pair when RSI is oversold AND MACD histogram turns positive. Only on 4H and 1D timeframes.",
];

interface Strategy {
  id: string;
  name: string;
  description: string;
  raw_input: string;
  pairs: string[];
  timeframes: string[];
  buy_conditions: { description: string; indicator: string; operator: string; value: string | number }[];
  sell_conditions: { description: string; indicator: string; operator: string; value: string | number }[];
  buy_logic: string;
  sell_logic: string;
  min_confidence: number;
  notes: string;
  active: boolean;
  created_at: string;
}

export default function StrategiesClient() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [engineOnline, setEngineOnline] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [tab, setTab] = useState<"text" | "chart">("text");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkEngine();
    loadStrategies();
  }, []);

  async function checkEngine() {
    try {
      const res = await fetch(`${BASE}/health`);
      setEngineOnline(res.ok);
    } catch { setEngineOnline(false); }
  }

  async function loadStrategies() {
    try {
      const res = await fetch(`${BASE}/strategies`, { headers: { "X-Signal-Key": KEY } });
      if (res.ok) {
        const data = await res.json();
        setStrategies(data.strategies || []);
      }
    } catch {}
  }

  async function createStrategy() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${BASE}/strategies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Signal-Key": KEY },
        body: JSON.stringify({ description: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess(`Strategy "${data.strategy.name}" created!`);
      setInput("");
      await loadStrategies();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create strategy");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setScreenshot(base64);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeChart() {
    if (!screenshot) return;
    setAnalyzing(true);
    setError("");
    setAnalysisResult("");

    try {
      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: screenshot, description: input }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      const text = data.text || "";
      setAnalysisResult(text);

      // Auto-extract optimized strategy into the text input
      const match = text.match(/OPTIMIZED STRATEGY:([\s\S]+?)(?:\n\n|$)/);
      if (match) {
        setInput(match[1].trim());
        setTab("text");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function deleteStrategy(id: string) {
    try {
      await fetch(`${BASE}/strategies/${id}`, { method: "DELETE", headers: { "X-Signal-Key": KEY } });
      await loadStrategies();
    } catch {}
  }

  async function toggleStrategy(id: string) {
    try {
      await fetch(`${BASE}/strategies/${id}/toggle`, { method: "POST", headers: { "X-Signal-Key": KEY } });
      await loadStrategies();
    } catch {}
  }

  const tabStyle = (t: "text" | "chart") => ({
    fontFamily: "'Space Mono',monospace", fontSize: "0.68rem",
    padding: "7px 18px", cursor: "pointer", letterSpacing: "1px",
    background: tab === t ? "var(--red-muted)" : "transparent",
    border: `1px solid ${tab === t ? "var(--red-border)" : "var(--border)"}`,
    color: tab === t ? "var(--red)" : "var(--text3)",
    borderRadius: "2px",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--text3)", letterSpacing: "1px" }}>// AI STRATEGY BUILDER</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: engineOnline ? "var(--green)" : "var(--red)", boxShadow: engineOnline ? "0 0 6px var(--green)" : "none" }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: engineOnline ? "var(--green)" : "var(--red)" }}>
            {engineOnline ? "ENGINE ONLINE" : "ENGINE OFFLINE"}
          </span>
        </div>
      </div>

      {/* Input card */}
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
          <button style={tabStyle("text")} onClick={() => setTab("text")}>TEXT STRATEGY</button>
          <button style={tabStyle("chart")} onClick={() => setTab("chart")}>📸 CHART ANALYSIS</button>
        </div>

        {/* Text tab */}
        {tab === "text" && (
          <>
            <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem" }}>Describe your strategy</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "1rem", lineHeight: "1.6" }}>
              Write your trading strategy in plain English. CSX AI will interpret it and apply it to live market data.
            </p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Buy BTC when RSI drops below 30 and MACD crosses bullish. Sell when RSI goes above 70 or price hits the upper Bollinger Band."
              rows={4} style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: "3px", color: "var(--text)", fontFamily: "'Syne', sans-serif",
                fontSize: "0.85rem", padding: "12px", resize: "vertical", lineHeight: "1.6", outline: "none",
              }} />
            <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "var(--text3)", marginBottom: "0.5rem", letterSpacing: "1px" }}>EXAMPLES:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => setInput(ex)} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", padding: "4px 10px",
                    background: "var(--bg4)", border: "1px solid var(--border)", color: "var(--text3)",
                    borderRadius: "2px", cursor: "pointer",
                  }}>Example {i + 1}</button>
                ))}
              </div>
            </div>
            {error && <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--red)", marginBottom: "0.75rem" }}>⚠ {error}</p>}
            {success && <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--green)", marginBottom: "0.75rem" }}>✓ {success}</p>}
            <button onClick={createStrategy} disabled={loading || !input.trim() || !engineOnline} style={{
              padding: "10px 24px", background: loading ? "var(--bg4)" : "var(--red)",
              border: "none", color: loading ? "var(--text3)" : "#fff",
              fontFamily: "'Space Mono',monospace", fontSize: "0.75rem",
              letterSpacing: "1px", fontWeight: "700", borderRadius: "3px",
              cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "// CSX AI IS THINKING..." : "CREATE STRATEGY →"}
            </button>
          </>
        )}

        {/* Chart analysis tab */}
        {tab === "chart" && (
          <>
            <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem" }}>Upload a chart screenshot</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "1.25rem", lineHeight: "1.6" }}>
              CSX AI will analyze your chart visually, identify patterns and indicators, then generate an optimized trading strategy from it.
            </p>

            {/* Upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${screenshot ? "var(--green)" : "var(--border)"}`,
                borderRadius: "4px", padding: "2rem", textAlign: "center",
                cursor: "pointer", marginBottom: "1rem",
                background: screenshot ? "rgba(0,217,126,0.04)" : "var(--bg3)",
                transition: "all 0.2s",
              }}
            >
              {screenshot ? (
                <div>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: "var(--green)", marginBottom: "0.5rem" }}>✓ {screenshotName}</p>
                  <img src={`data:image/png;base64,${screenshot}`} alt="chart" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "3px" }} />
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</p>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--text2)" }}>Click to upload chart screenshot</p>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "var(--text3)", marginTop: "0.25rem" }}>PNG, JPG, WEBP supported</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

            {/* Optional description */}
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Optional: describe your strategy or what you're looking for... (e.g. 'I want to buy at the support level and sell at resistance')"
              rows={2} style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: "3px", color: "var(--text)", fontFamily: "'Syne', sans-serif",
                fontSize: "0.85rem", padding: "10px 12px", resize: "vertical", lineHeight: "1.6",
                outline: "none", marginBottom: "1rem",
              }} />

            {error && <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--red)", marginBottom: "0.75rem" }}>⚠ {error}</p>}

            <button onClick={analyzeChart} disabled={analyzing || !screenshot} style={{
              padding: "10px 24px", background: analyzing ? "var(--bg4)" : "var(--orange)",
              border: "none", color: analyzing ? "var(--text3)" : "#fff",
              fontFamily: "'Space Mono',monospace", fontSize: "0.75rem",
              letterSpacing: "1px", fontWeight: "700", borderRadius: "3px",
              cursor: analyzing ? "not-allowed" : "pointer",
            }}>
              {analyzing ? "// CSX AI IS ANALYZING..." : "ANALYZE CHART →"}
            </button>

            {/* Analysis result */}
            {analysisResult && (
              <div style={{ marginTop: "1.5rem", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1.25rem" }}>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "var(--orange)", letterSpacing: "1px", marginBottom: "0.75rem" }}>// CSX AI ANALYSIS</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{analysisResult}</p>
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "var(--text3)" }}>
                    Strategy extracted and ready to create →
                  </p>
                  <button onClick={() => { setTab("text"); }} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: "0.65rem",
                    padding: "6px 14px", background: "var(--red)", border: "none",
                    color: "#fff", borderRadius: "2px", cursor: "pointer", fontWeight: "700",
                  }}>
                    CREATE FROM ANALYSIS →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Strategy list */}
      {strategies.length === 0 ? (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--text3)", marginBottom: "0.5rem" }}>// NO STRATEGIES YET</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Describe your first strategy or upload a chart screenshot above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "var(--text3)", letterSpacing: "1px" }}>
            {strategies.length} {strategies.length === 1 ? "STRATEGY" : "STRATEGIES"}
          </p>
          {strategies.map((strat) => (
            <div key={strat.id} style={{
              background: "var(--bg2)", border: `1px solid ${strat.active ? "var(--border)" : "rgba(255,255,255,0.03)"}`,
              borderRadius: "4px", padding: "1.5rem", opacity: strat.active ? 1 : 0.5,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>{strat.name}</span>
                    <span style={{
                      fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", padding: "2px 8px", borderRadius: "2px",
                      background: strat.active ? "rgba(0,217,126,0.1)" : "var(--bg4)",
                      color: strat.active ? "var(--green)" : "var(--text3)",
                    }}>{strat.active ? "ACTIVE" : "PAUSED"}</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text2)" }}>{strat.description}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "1rem" }}>
                  <button onClick={() => toggleStrategy(strat.id)} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", padding: "5px 12px",
                    background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", borderRadius: "2px", cursor: "pointer",
                  }}>{strat.active ? "PAUSE" : "RESUME"}</button>
                  <button onClick={() => deleteStrategy(strat.id)} style={{
                    fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", padding: "5px 12px",
                    background: "transparent", border: "1px solid var(--red-border)", color: "var(--red)", borderRadius: "2px", cursor: "pointer",
                  }}>DELETE</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "var(--text3)", marginBottom: "0.5rem", letterSpacing: "1px" }}>BUY ({strat.buy_logic})</p>
                  {strat.buy_conditions.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>{c.description}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "var(--text3)", marginBottom: "0.5rem", letterSpacing: "1px" }}>SELL ({strat.sell_logic})</p>
                  {strat.sell_conditions.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>{c.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {[
                  ["PAIRS", strat.pairs.join(", ")],
                  ["TIMEFRAMES", strat.timeframes.join(", ")],
                  ["MIN CONF", `${strat.min_confidence}%`],
                ].map(([label, val]) => (
                  <span key={label} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "var(--text3)" }}>
                    {label}: <span style={{ color: "var(--text2)" }}>{val}</span>
                  </span>
                ))}
              </div>
              {strat.notes && <p style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--text3)", fontStyle: "italic" }}>Note: {strat.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
