import { auth } from "@/lib/auth";
import { SectionLabel } from "@/components/ui";
import { TIER_LIMITS } from "@/types";
import ChartsClient from "./ChartsClient";

export default async function ChartsPage() {
  const session = await auth();
  const tier = session?.user.tier ?? "free";
  const hasCharts = TIER_LIMITS[tier].chartTools;

  if (!hasCharts) {
    return (
      <div>
        <SectionLabel>// CHART ANALYSIS</SectionLabel>
        <div style={{
          padding: "3rem 2rem", background: "var(--red-muted)",
          border: "1px solid var(--red-border)", borderRadius: "4px",
          textAlign: "center",
        }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "var(--red)", marginBottom: "0.75rem" }}>
            // CHART TOOLS — PRO & ELITE ONLY
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: "1.5rem" }}>
            Upgrade to Pro to access advanced TradingView charts with 50+ indicators.
          </p>
          <a href="/pricing" style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.75rem",
            color: "var(--red)", border: "1px solid var(--red-border)",
            padding: "10px 24px", borderRadius: "3px", textDecoration: "none",
          }}>
            UPGRADE →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel>// CHART ANALYSIS</SectionLabel>
      <ChartsClient />
    </div>
  );
}
