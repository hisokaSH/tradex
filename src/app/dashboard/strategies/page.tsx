import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StrategiesClient from "./StrategiesClient";

export default async function StrategiesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const tier = session.user.tier;

  if (tier === "free") {
    return (
      <div>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--text3)", letterSpacing: "1px", marginBottom: "1.5rem" }}>// STRATEGY BUILDER</p>
        <div style={{ padding: "3rem 2rem", background: "var(--red-muted)", border: "1px solid var(--red-border)", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: "var(--red)", marginBottom: "0.75rem" }}>// PRO & ELITE ONLY</p>
          <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: "1.5rem" }}>Upgrade to Pro to create custom AI-powered trading strategies.</p>
          <a href="/pricing" style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: "var(--red)", border: "1px solid var(--red-border)", padding: "10px 24px", borderRadius: "3px", textDecoration: "none" }}>UPGRADE →</a>
        </div>
      </div>
    );
  }

  return <StrategiesClient />;
}
