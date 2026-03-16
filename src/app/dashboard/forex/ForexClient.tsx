"use client";
import { useState, useRef } from "react";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:5001";
const PAIRS = ["EURUSD","GBPUSD","USDJPY","USDCHF","AUDUSD","NZDUSD","USDCAD","EURGBP","EURJPY","GBPJPY","XAUUSD","US30","NAS100","GER40","BTCUSDT","ETHUSDT"];
const TIMEFRAMES = ["1M","5M","15M","1H","4H","1D","1W"];

interface Analysis {
  pair: string; timeframe: string; trend: string; phase: string;
  support_levels: string[]; resistance_levels: string[]; key_level: string;
  near_key_level: boolean; distance_from_key_level_pct: number;
  chart_patterns: {name:string;status:string;implication:string;reliability:string;historical_winrate?:number}[];
  candlestick_patterns: {name:string;signal:string;strength:string}[];
  trend_lines: string;
  fibonacci: {visible:boolean;key_level:string};
  indicators: {rsi:string;rsi_divergence:string;macd:string;ma_position:string;volume:string};
  confluences: string[];
  confluence_count: number;
  confluence_direction: string;
  news_correlation: string;
  session_info: {name:string;quality:string};
  candle_info: {pct_complete:number;near_close:boolean;mins_remaining:number};
  dual_ai_conflict?: boolean;
  dual_confidence?: number;
  trade: {direction:string;wait_reason?:string;entry:string;stop_loss:string;sl_reasoning:string;take_profit_1:string;take_profit_2:string;rr_ratio:string;hold_duration:string;confidence:string;invalidation:string};
  pattern_history: string; summary: string; warnings: string[];
}

export default function ForexClient() {
  const [screenshot, setScreenshot] = useState<string|null>(null);
  const [screenshotName, setName] = useState("");
  const [pair, setPair]     = useState("EURUSD");
  const [timeframe, setTF]  = useState("1H");
  const [notes, setNotes]   = useState("");
  const [price, setPrice]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [analysis, setAnalysis] = useState<Analysis|null>(null);
  const [error, setError]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setScreenshot((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!screenshot) { setError("Upload a chart screenshot first"); return; }
    setLoading(true); setError(""); setAnalysis(null); setSubmitted(false);
    try {
      const r = await fetch("/api/analyze-chart", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: screenshot, description: notes, pair, timeframe }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Analysis failed");
      if (d.analysis) setAnalysis(d.analysis);
      else setError("Could not parse analysis");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  async function submitToDiscord() {
    if (!analysis || !price) { setError("Enter current price first"); return; }
    setLoading(true);
    try {
      const r = await fetch(`${WEBHOOK_URL}/webhook`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair, action: analysis.trade.direction?.toLowerCase(), price, timeframe, strategy: "CSX AI Chart Analysis", message: analysis.summary }),
      });
      if (r.ok) setSubmitted(true); else throw new Error("Webhook server not running");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Submit failed"); }
    finally { setLoading(false); }
  }

  const mono: React.CSSProperties = { fontFamily: "'Space Mono',monospace" };
  const inp: React.CSSProperties = { background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"3px",color:"var(--text)",fontFamily:"'Syne',sans-serif",fontSize:"0.85rem",padding:"9px 12px",outline:"none",width:"100%" };
  const lbl: React.CSSProperties = { ...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px",display:"block",marginBottom:"5px" };

  const dirColor = analysis?.trade.direction === "BUY" ? "var(--green)" : analysis?.trade.direction === "SELL" ? "var(--red)" : "var(--orange)";
  const confColor = analysis?.trade.confidence === "HIGH" ? "var(--green)" : analysis?.trade.confidence === "MEDIUM" ? "var(--orange)" : "var(--red)";
  const sessionColor = {"PRIME":"var(--green)","HIGH":"var(--green)","MEDIUM":"var(--orange)","LOW":"var(--red)"}[analysis?.session_info?.quality||""] || "var(--text3)";

  return (
    <div>
      <p style={{...mono,fontSize:"0.68rem",color:"var(--text3)",letterSpacing:"1px",marginBottom:"1.5rem"}}>// FOREX CHART ANALYZER v2</p>
      <div style={{display:"grid",gridTemplateColumns:analysis?"1fr 1.8fr":"1fr 1fr",gap:"1.5rem"}}>

        {/* Left */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}>
            <p style={{fontSize:"0.85rem",fontWeight:"600",marginBottom:"1rem"}}>Upload Chart</p>
            <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${screenshot?"var(--green)":"var(--border)"}`,borderRadius:"4px",padding:"1.25rem",textAlign:"center",cursor:"pointer",background:screenshot?"rgba(0,217,126,0.04)":"var(--bg3)",marginBottom:"0.75rem"}}>
              {screenshot ? <div><p style={{...mono,fontSize:"0.68rem",color:"var(--green)",marginBottom:"0.5rem"}}>✓ {screenshotName}</p><img src={`data:image/png;base64,${screenshot}`} alt="chart" style={{maxHeight:"120px",maxWidth:"100%",borderRadius:"3px"}}/></div>
              : <p style={{...mono,fontSize:"0.72rem",color:"var(--text3)"}}>📸 Click to upload TradingView chart</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              <div><label style={lbl}>PAIR</label><select value={pair} onChange={e=>setPair(e.target.value)} style={inp}>{PAIRS.map(p=><option key={p}>{p}</option>)}</select></div>
              <div><label style={lbl}>TIMEFRAME</label><select value={timeframe} onChange={e=>setTF(e.target.value)} style={inp}>{TIMEFRAMES.map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div style={{marginBottom:"10px"}}><label style={lbl}>CURRENT PRICE</label><input value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 1.08450" style={inp}/></div>
            <div><label style={lbl}>NOTES (optional)</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any context..." rows={2} style={{...inp,resize:"vertical",lineHeight:"1.6"}}/></div>
          </div>

          {error && <div style={{background:"var(--red-muted)",border:"1px solid var(--red-border)",borderRadius:"3px",padding:"10px 14px"}}><p style={{...mono,fontSize:"0.68rem",color:"var(--red)"}}>⚠ {error}</p></div>}
          {submitted && <div style={{background:"rgba(0,217,126,0.08)",border:"1px solid rgba(0,217,126,0.3)",borderRadius:"3px",padding:"10px 14px"}}><p style={{...mono,fontSize:"0.68rem",color:"var(--green)"}}>✅ Posted to Discord!</p></div>}

          <button onClick={analyze} disabled={loading||!screenshot} style={{padding:"12px",background:loading?"var(--bg4)":"var(--red)",border:"none",color:loading?"var(--text3)":"#fff",...mono,fontSize:"0.78rem",letterSpacing:"1px",fontWeight:"700",borderRadius:"3px",cursor:loading?"not-allowed":"pointer"}}>
            {loading?"// CSX AI ANALYZING...":"🔍 ANALYZE CHART →"}
          </button>
          {analysis && analysis.trade.direction !== "WAIT" && !submitted &&
            <button onClick={submitToDiscord} disabled={loading} style={{padding:"12px",background:"rgba(0,217,126,0.15)",border:"1px solid rgba(0,217,126,0.4)",color:"var(--green)",...mono,fontSize:"0.78rem",letterSpacing:"1px",fontWeight:"700",borderRadius:"3px",cursor:"pointer"}}>
              📤 POST TO DISCORD →
            </button>}
        </div>

        {/* Right — Results */}
        {analysis ? (
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>

            {/* Header */}
            <div style={{background:"var(--bg2)",border:`1px solid ${analysis.trade.direction==="WAIT"?"var(--orange)":analysis.trade.direction==="BUY"?"rgba(0,217,126,0.3)":"var(--red-border)"}`,borderRadius:"4px",padding:"1.25rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap",marginBottom:"0.75rem"}}>
                <span style={{...mono,fontSize:"1rem",fontWeight:"700",color:dirColor}}>
                  {analysis.trade.direction==="BUY"?"🟢":analysis.trade.direction==="SELL"?"🔴":"⏳"} {analysis.trade.direction} — {analysis.pair}
                </span>
                <span style={{...mono,fontSize:"0.65rem",color:confColor,background:`${confColor}18`,padding:"2px 10px",borderRadius:"2px"}}>{analysis.trade.confidence} CONF</span>
                <span style={{...mono,fontSize:"0.65rem",color:sessionColor,background:`${sessionColor}18`,padding:"2px 10px",borderRadius:"2px"}}>{analysis.session_info?.name} ({analysis.session_info?.quality})</span>
                {analysis.dual_ai_conflict === false && <span style={{...mono,fontSize:"0.62rem",color:"var(--green)",background:"rgba(0,217,126,0.1)",padding:"2px 8px",borderRadius:"2px"}}>✓ DUAL AI CONFIRMED</span>}
                {analysis.dual_ai_conflict && <span style={{...mono,fontSize:"0.62rem",color:"var(--red)",background:"var(--red-muted)",padding:"2px 8px",borderRadius:"2px"}}>⚠ AI CONFLICT</span>}
              </div>
              {analysis.trade.direction === "WAIT"
                ? <p style={{fontSize:"0.82rem",color:"var(--orange)",lineHeight:"1.6"}}>⏳ {analysis.trade.wait_reason}</p>
                : <p style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:"1.6"}}>{analysis.summary}</p>}
            </div>

            {/* Confluence meter */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                <p style={{...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px"}}>CONFLUENCE SCORE</p>
                <span style={{...mono,fontSize:"0.75rem",fontWeight:"700",color:analysis.confluence_count>=5?"var(--green)":analysis.confluence_count>=3?"var(--orange)":"var(--red)"}}>
                  {analysis.confluence_count}/7
                </span>
              </div>
              <div style={{display:"flex",gap:"4px",marginBottom:"0.75rem"}}>
                {[...Array(7)].map((_,i) => (
                  <div key={i} style={{flex:1,height:"8px",borderRadius:"2px",background:i<analysis.confluence_count?(analysis.confluence_count>=5?"var(--green)":analysis.confluence_count>=3?"var(--orange)":"var(--red)"):"var(--bg4)"}}/>
                ))}
              </div>
              {analysis.confluences?.map((c,i) => <p key={i} style={{fontSize:"0.72rem",color:"var(--text2)",marginBottom:"3px"}}>✓ {c}</p>)}
            </div>

            {/* Candle + Key level status */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              <div style={{background:"var(--bg2)",border:`1px solid ${analysis.candle_info?.near_close?"rgba(0,217,126,0.3)":"var(--orange-border,var(--border))"}`,borderRadius:"4px",padding:"1rem"}}>
                <p style={{...mono,fontSize:"0.58rem",color:"var(--text3)",marginBottom:"0.4rem"}}>CANDLE STATUS</p>
                <p style={{...mono,fontSize:"0.8rem",fontWeight:"700",color:analysis.candle_info?.near_close?"var(--green)":"var(--orange)"}}>
                  {analysis.candle_info?.near_close?"✓ Near Close":"⏳ Mid-Candle"}
                </p>
                <p style={{fontSize:"0.68rem",color:"var(--text3)",marginTop:"3px"}}>{analysis.candle_info?.pct_complete}% complete • {analysis.candle_info?.mins_remaining}m remaining</p>
              </div>
              <div style={{background:"var(--bg2)",border:`1px solid ${analysis.near_key_level?"rgba(0,217,126,0.3)":"var(--border)"}`,borderRadius:"4px",padding:"1rem"}}>
                <p style={{...mono,fontSize:"0.58rem",color:"var(--text3)",marginBottom:"0.4rem"}}>KEY LEVEL</p>
                <p style={{...mono,fontSize:"0.8rem",fontWeight:"700",color:analysis.near_key_level?"var(--green)":"var(--orange)"}}>
                  {analysis.near_key_level?"✓ At Level":"⚠ Away from Level"}
                </p>
                <p style={{fontSize:"0.68rem",color:"var(--text3)",marginTop:"3px"}}>{analysis.key_level} • {analysis.distance_from_key_level_pct}% away</p>
              </div>
            </div>

            {/* Trade levels */}
            {analysis.trade.direction !== "WAIT" && (
              <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}>
                <p style={{...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px",marginBottom:"0.75rem"}}>TRADE LEVELS</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
                  {[
                    {l:"ENTRY",v:analysis.trade.entry,c:"var(--text)"},
                    {l:"STOP LOSS",v:analysis.trade.stop_loss,c:"var(--red)"},
                    {l:"TP1",v:analysis.trade.take_profit_1,c:"var(--green)"},
                    {l:"TP2",v:analysis.trade.take_profit_2,c:"var(--green)"},
                    {l:"R:R",v:analysis.trade.rr_ratio,c:"var(--orange)"},
                    {l:"HOLD",v:analysis.trade.hold_duration,c:"var(--text2)"},
                  ].map(({l,v,c})=>v&&<div key={l} style={{background:"var(--bg3)",padding:"8px 10px",borderRadius:"3px"}}>
                    <p style={{...mono,fontSize:"0.55rem",color:"var(--text3)",marginBottom:"3px"}}>{l}</p>
                    <p style={{...mono,fontSize:"0.78rem",fontWeight:"700",color:c}}>{v}</p>
                  </div>)}
                </div>
                {analysis.trade.sl_reasoning && <p style={{fontSize:"0.7rem",color:"var(--text3)",marginTop:"8px"}}>SL: {analysis.trade.sl_reasoning}</p>}
                {analysis.trade.invalidation && <p style={{fontSize:"0.7rem",color:"var(--red)",marginTop:"4px"}}>❌ {analysis.trade.invalidation}</p>}
              </div>
            )}

            {/* Patterns */}
            {(analysis.chart_patterns?.length>0||analysis.candlestick_patterns?.length>0) && (
              <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}>
                <p style={{...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px",marginBottom:"0.75rem"}}>PATTERNS DETECTED</p>
                {analysis.chart_patterns?.map((p,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px",paddingBottom:"8px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{flex:1}}>
                      <span style={{fontSize:"0.78rem",fontWeight:"600"}}>{p.implication==="bullish"?"🔺":"🔻"} {p.name}</span>
                      <span style={{...mono,fontSize:"0.58rem",color:"var(--text3)",marginLeft:"8px"}}>({p.status})</span>
                      {p.historical_winrate!==undefined&&<span style={{...mono,fontSize:"0.6rem",marginLeft:"8px",color:p.historical_winrate>=60?"var(--green)":p.historical_winrate>=50?"var(--orange)":"var(--red)"}}>{p.historical_winrate}% WR</span>}
                    </div>
                    <span style={{...mono,fontSize:"0.6rem",color:p.reliability==="high"?"var(--green)":p.reliability==="medium"?"var(--orange)":"var(--red)",marginLeft:"8px"}}>{p.reliability?.toUpperCase()}</span>
                  </div>
                ))}
                {analysis.candlestick_patterns?.map((p,i)=>(
                  <p key={i} style={{fontSize:"0.75rem",color:"var(--text2)",marginBottom:"4px"}}>🕯️ {p.name} — <span style={{color:p.signal==="bullish"?"var(--green)":"var(--red)"}}>{p.signal}</span> ({p.strength})</p>
                ))}
              </div>
            )}

            {/* Indicators */}
            <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}>
              <p style={{...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px",marginBottom:"0.75rem"}}>INDICATORS</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                {Object.entries(analysis.indicators||{}).filter(([,v])=>v&&v!=="N/A").map(([k,v])=>(
                  <div key={k} style={{background:"var(--bg3)",padding:"6px 12px",borderRadius:"3px"}}>
                    <p style={{...mono,fontSize:"0.55rem",color:"var(--text3)",marginBottom:"2px"}}>{k.replace("_"," ").toUpperCase()}</p>
                    <p style={{...mono,fontSize:"0.72rem",fontWeight:"700",color:v==="bullish"||v==="above"||v==="increasing"?"var(--green)":v==="bearish"||v==="below"||v==="decreasing"?"var(--red)":"var(--text2)"}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* News + warnings */}
            {analysis.news_correlation && <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.25rem"}}><p style={{...mono,fontSize:"0.6rem",color:"var(--text3)",letterSpacing:"1px",marginBottom:"0.5rem"}}>NEWS CONTEXT</p><p style={{fontSize:"0.78rem",color:"var(--text2)",lineHeight:"1.6"}}>{analysis.news_correlation}</p></div>}
            {analysis.warnings?.length>0 && <div style={{background:"var(--red-muted)",border:"1px solid var(--red-border)",borderRadius:"4px",padding:"1rem 1.25rem"}}><p style={{...mono,fontSize:"0.6rem",color:"var(--red)",letterSpacing:"1px",marginBottom:"0.5rem"}}>⚠️ WARNINGS</p>{analysis.warnings.map((w,i)=><p key={i} style={{fontSize:"0.75rem",color:"var(--red)",marginBottom:"3px"}}>• {w}</p>)}</div>}
          </div>
        ) : (
          <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"4px",padding:"1.5rem"}}>
            <p style={{fontSize:"0.85rem",fontWeight:"600",marginBottom:"1.25rem"}}>CSX AI v2 — What's new</p>
            {[
              ["🔄","Dual AI confirmation","Runs the analysis twice — only signals if both agree"],
              ["📊","3+ confluences required","Pattern + momentum + level + session must all align"],
              ["⏰","Candle close check","Warns if you're mid-candle — wait for confirmation"],
              ["🔑","Key level validation","Checks if price is actually near a proven S/R level"],
              ["📈","Pattern win rate tracking","Tracks which patterns win/lose and warns on bad ones"],
              ["🕐","Session filter","Flags Asian session as risky, prioritizes London/NY"],
            ].map(([e,t,d])=>(
              <div key={t} style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
                <span style={{fontSize:"1.1rem",flexShrink:0}}>{e}</span>
                <div><p style={{fontSize:"0.8rem",fontWeight:"600",marginBottom:"2px"}}>{t}</p><p style={{fontSize:"0.72rem",color:"var(--text2)",lineHeight:"1.5"}}>{d}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
