import { auth } from "@/lib/auth";
import { Card, CardTitle, SectionLabel, SettingRow } from "@/components/ui";
import type { Tier } from "@/types";

const EXCHANGES = [
  { name: "Binance", type: "CEX" },
  { name: "Coinbase", type: "CEX" },
  { name: "Kraken", type: "CEX" },
  { name: "Bybit", type: "CEX" },
  { name: "Uniswap V3", type: "DEX" },
];

const TIER_COLOR: Record<Tier, string> = {
  free: "var(--text3)",
  pro: "var(--red)",
  elite: "var(--orange)",
};

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user;

  return (
    <div>
      <SectionLabel>// ACCOUNT SETTINGS</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Discord */}
        <Card>
          <CardTitle>Discord Integration</CardTitle>
          <SettingRow
            label="Account"
            value={user.name ?? "Not connected"}
            valueStyle={{ color: user.discordId ? "var(--green)" : "var(--text3)" }}
          />
          <SettingRow
            label="Discord ID"
            value={user.discordId ? `...${user.discordId.slice(-6)}` : "—"}
            valueStyle={{ color: "var(--text2)" }}
          />
          <SettingRow
            label="Roles synced"
            value={user.roles.length > 0 ? `${user.roles.length} role(s)` : "No roles"}
            valueStyle={{ color: "var(--text2)" }}
          />
          <SettingRow
            label="Signal alerts to Discord"
            value="COMING SOON"
            valueStyle={{ color: "var(--text3)" }}
          />
        </Card>

        {/* Plan */}
        <Card>
          <CardTitle>Your Plan</CardTitle>
          <SettingRow
            label="Current tier"
            value={user.tier.toUpperCase()}
            valueStyle={{ color: TIER_COLOR[user.tier], fontWeight: "700" }}
          />
          <SettingRow
            label="Signals/day"
            value={user.tier === "free" ? "5" : "Unlimited"}
            valueStyle={{ color: "var(--text2)" }}
          />
          <SettingRow
            label="AI queries/day"
            value={user.tier === "free" ? "0" : user.tier === "pro" ? "10" : "Unlimited"}
            valueStyle={{ color: "var(--text2)" }}
          />
          <SettingRow
            label="VIP signals"
            value={user.tier === "elite" ? "● ENABLED" : "ELITE ONLY"}
            valueStyle={{ color: user.tier === "elite" ? "var(--green)" : "var(--text3)" }}
          />
          {user.tier !== "elite" && (
            <a href="/pricing" style={{
              display: "block", width: "100%", marginTop: "1rem",
              padding: "10px", textAlign: "center",
              background: "var(--red)", color: "#fff", borderRadius: "3px",
              fontFamily: "'Space Mono', monospace", fontSize: "0.72rem",
              letterSpacing: "1px", textDecoration: "none", fontWeight: "700",
            }}>
              UPGRADE PLAN →
            </a>
          )}
        </Card>
      </div>

      {/* Exchange API connections */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>Exchange API Connections</p>
          {user.tier === "free" && (
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "var(--text3)" }}>
              PRO+ REQUIRED
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {EXCHANGES.map((ex) => (
            <div key={ex.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px", background: "var(--bg3)", borderRadius: "4px",
            }}>
              <div>
                <span style={{ fontSize: "0.82rem" }}>{ex.name}</span>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
                  color: "var(--text3)", marginLeft: "8px",
                }}>{ex.type}</span>
              </div>
              <button
                disabled={user.tier === "free"}
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
                  padding: "4px 12px", borderRadius: "2px", cursor: user.tier === "free" ? "not-allowed" : "pointer",
                  background: "transparent",
                  border: `1px solid ${user.tier === "free" ? "var(--border)" : "var(--red-border)"}`,
                  color: user.tier === "free" ? "var(--text3)" : "var(--text2)",
                  letterSpacing: "1px",
                }}
              >
                {user.tier === "free" ? "LOCKED" : "+ CONNECT"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Webhook */}
      {user.tier === "elite" && (
        <Card style={{ marginTop: "1.5rem" }}>
          <CardTitle>Webhook API</CardTitle>
          <div style={{
            padding: "1rem", background: "var(--bg3)", borderRadius: "4px",
            fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--text3)",
          }}>
            <p style={{ marginBottom: "0.5rem" }}>YOUR WEBHOOK URL</p>
            <p style={{ color: "var(--text2)" }}>
              {`https://api.yourdomain.com/webhook/${user.discordId}`}
            </p>
            <p style={{ marginTop: "0.75rem", fontSize: "0.65rem" }}>
              POST signals to this endpoint to forward them to your bot / automation.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
