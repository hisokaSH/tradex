import { auth } from "@/lib/auth";
import { Card, CardTitle, EmptyState, Metric, MetricsRow } from "@/components/ui";
import OverviewChart from "@/components/dashboard/OverviewChart";
import NewsPreview from "@/components/dashboard/NewsPreview";

export default async function DashboardPage() {
  const session = await auth();
  const tier = session?.user.tier ?? "free";

  return (
    <div>
      <MetricsRow>
        <Metric label="PORTFOLIO VALUE" value="—" sub="Connect exchange to sync" valueColor="var(--text3)" />
        <Metric label="DAY P&L" value="—" sub="No positions tracked yet" valueColor="var(--text3)" />
        <Metric label="ACTIVE SIGNALS" value="0" sub="Signal engine starting" />
        <Metric label="WIN RATE (30D)" value="—" sub="Needs trade history" valueColor="var(--text3)" />
      </MetricsRow>

      {/* Main chart — full width */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 1.25rem", borderBottom: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>BTC/USDT — 1H</p>
          <a href="/dashboard/charts" style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
            color: "var(--red)", textDecoration: "none", letterSpacing: "1px",
          }}>
            OPEN CHARTS →
          </a>
        </div>
        <OverviewChart />
      </Card>

      {/* Signals + Holdings + News */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
        <Card>
          <CardTitle>Latest Signals</CardTitle>
          <EmptyState title="// NO SIGNALS YET" sub="Signal engine will populate this once running" />
        </Card>
        <Card>
          <CardTitle>Holdings</CardTitle>
          <EmptyState title="// CONNECT AN EXCHANGE" sub="Go to Settings → API Connections" />
        </Card>
        <Card>
          <CardTitle>News Sentiment</CardTitle>
          <NewsPreview />
        </Card>
      </div>

      {tier === "free" && (
        <div style={{
          marginTop: "1.5rem", padding: "1rem 1.5rem",
          background: "var(--red-muted)", border: "1px solid var(--red-border)",
          borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--red)", letterSpacing: "1px" }}>
            // FREE TIER — Upgrade to Pro for unlimited signals, charts & exchange integrations
          </p>
          <a href="/pricing" style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
            color: "var(--red)", textDecoration: "none", fontWeight: "700",
            border: "1px solid var(--red-border)", padding: "6px 14px", borderRadius: "3px",
          }}>
            UPGRADE →
          </a>
        </div>
      )}
    </div>
  );
}
