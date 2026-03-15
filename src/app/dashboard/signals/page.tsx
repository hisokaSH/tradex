import { auth } from "@/lib/auth";
import { Card, EmptyState, SectionLabel, SignalBadge } from "@/components/ui";
import { TIER_LIMITS } from "@/types";

export default async function SignalsPage() {
  const session = await auth();
  const tier = session?.user.tier ?? "free";
  const limits = TIER_LIMITS[tier];

  return (
    <div>
      <SectionLabel>// SIGNAL TERMINAL</SectionLabel>

      {/* Tier info bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 1.25rem", background: "var(--bg2)",
        border: "1px solid var(--border)", borderRadius: "4px", marginBottom: "1.5rem",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--text3)" }}>
          PLAN: <span style={{ color: "var(--text2)", textTransform: "uppercase" }}>{tier}</span>
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--text3)" }}>
          SIGNALS/DAY:{" "}
          <span style={{ color: "var(--text2)" }}>
            {limits.signalsPerDay === Infinity ? "Unlimited" : limits.signalsPerDay}
          </span>
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--text3)" }}>
          VIP SIGNALS:{" "}
          <span style={{ color: limits.vipSignals ? "var(--green)" : "var(--text3)" }}>
            {limits.vipSignals ? "ENABLED" : "ELITE ONLY"}
          </span>
        </span>
      </div>

      <Card>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 100px 80px 80px 1fr 120px",
          gap: "0", padding: "6px 12px",
          borderBottom: "1px solid var(--border)", marginBottom: "0.5rem",
        }}>
          {["PAIR", "SIGNAL", "CONF.", "TF", "REASON", "TIME"].map(h => (
            <span key={h} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
              color: "var(--text3)", letterSpacing: "1px",
            }}>{h}</span>
          ))}
        </div>

        {/* Empty state until backend is connected */}
        <EmptyState
          title="// SIGNAL ENGINE NOT YET ACTIVE"
          sub="Once the Python/Flask backend is running and connected, signals will stream here in real-time."
        />

        {/* Example row (UI preview only — commented data) */}
        {/* 
        When your backend is ready, map over signals array like:
        signals.map(s => (
          <div key={s.id} style={{ display:"grid", gridTemplateColumns:"1fr 100px 80px 80px 1fr 120px", padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
            <span style={{fontWeight:600}}>{s.pair}</span>
            <SignalBadge type={s.type} />
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem"}}>{s.confidence}%</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",color:"var(--text3)"}}>{s.timeframe}</span>
            <span style={{fontSize:"0.75rem",color:"var(--text2)"}}>{s.reason}</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.65rem",color:"var(--text3)"}}>{timeAgo(s.timestamp)}</span>
          </div>
        ))
        */}
      </Card>
    </div>
  );
}
