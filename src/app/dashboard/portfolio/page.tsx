import { auth } from "@/lib/auth";
import { Card, EmptyState, Metric, MetricsRow, SectionLabel } from "@/components/ui";
import { TIER_LIMITS } from "@/types";

export default async function PortfolioPage() {
  const session = await auth();
  const tier = session?.user.tier ?? "free";
  const limits = TIER_LIMITS[tier];

  return (
    <div>
      <SectionLabel>// PORTFOLIO TRACKER</SectionLabel>

      <MetricsRow>
        <Metric label="TOTAL VALUE" value="—" sub="No exchange connected" valueColor="var(--text3)" />
        <Metric label="INVESTED" value="—" sub="—" valueColor="var(--text3)" />
        <Metric label="BEST ASSET" value="—" sub="—" valueColor="var(--text3)" />
        <Metric label="TOTAL P&L" value="—" sub="—" valueColor="var(--text3)" />
      </MetricsRow>

      {limits.exchanges === 0 ? (
        <div style={{
          padding: "2rem", background: "var(--red-muted)",
          border: "1px solid var(--red-border)", borderRadius: "4px",
          textAlign: "center",
        }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "var(--red)", marginBottom: "0.5rem" }}>
            // EXCHANGE INTEGRATIONS — PRO & ELITE ONLY
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: "1rem" }}>
            Connect your exchange APIs to automatically track your portfolio.
          </p>
          <a href="/pricing" style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.72rem",
            color: "var(--red)", border: "1px solid var(--red-border)",
            padding: "8px 20px", borderRadius: "3px", textDecoration: "none",
          }}>
            UPGRADE →
          </a>
        </div>
      ) : (
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>Assets</p>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "var(--text3)" }}>
              LIMIT: {limits.portfolioAssets === Infinity ? "UNLIMITED" : limits.portfolioAssets} ASSETS
            </span>
          </div>

          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
            padding: "6px 10px",
            borderBottom: "1px solid var(--border)",
          }}>
            {["ASSET","AMOUNT","AVG BUY","CURRENT","VALUE","P&L"].map(h => (
              <span key={h} style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
                color: "var(--text3)", letterSpacing: "1px",
              }}>{h}</span>
            ))}
          </div>

          <EmptyState
            title="// NO ASSETS TRACKED"
            sub="Connect Binance, Coinbase, or another exchange in Settings → API Connections"
          />

          {/*
          When connected, map over portfolio.assets:
          assets.map(asset => (
            <div key={asset.symbol} style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr 1fr", padding:"10px", borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div>
                <p style={{fontWeight:600}}>{asset.name}</p>
                <p style={{fontFamily:"'Space Mono',monospace",fontSize:"0.6rem",color:"var(--text3)"}}>{asset.symbol}</p>
              </div>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.78rem"}}>{asset.amount}</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.78rem",color:"var(--text3)"}}>${asset.avgBuyPrice.toLocaleString()}</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.78rem"}}>${asset.currentPrice.toLocaleString()}</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.8rem",fontWeight:600}}>${(asset.amount * asset.currentPrice).toLocaleString()}</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:"0.75rem",color:pnl>=0?"var(--green)":"var(--red)"}}>{pnl>=0?"+":""}{pnlPct.toFixed(2)}%</span>
            </div>
          ))
          */}
        </Card>
      )}
    </div>
  );
}
