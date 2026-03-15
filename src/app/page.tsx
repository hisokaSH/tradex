import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* NAV */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 3rem", height: "64px",
          background: "rgba(8,11,15,0.9)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--red-border)",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono, 'Space Mono')", fontSize: "1.1rem", color: "var(--red)", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="pulse-dot" style={{ width: "8px", height: "8px", background: "var(--red)", borderRadius: "50%", display: "inline-block" }} />
          TRADEX
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Features", "Pricing"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}
              style={{ color: "var(--text2)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: "1px" }}>
              {item}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/login" style={{
            background: "transparent", border: "1px solid var(--red-border)",
            color: "var(--text2)", padding: "8px 20px", borderRadius: "4px",
            fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "1px",
            textDecoration: "none",
          }}>
            Log in
          </Link>
          <Link href="/login" style={{
            background: "var(--red)", border: "none", color: "#fff",
            padding: "8px 20px", borderRadius: "4px",
            fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "1px",
            fontWeight: "700", textDecoration: "none",
          }}>
            Launch App
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="grid-bg"
        style={{ minHeight: "100vh", paddingTop: "64px", position: "relative", overflow: "hidden" }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,59,59,0.05) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "8rem 3rem 4rem" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--red-muted)", border: "1px solid var(--red-border)",
            color: "var(--red)", fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem", letterSpacing: "2px", padding: "6px 16px",
            borderRadius: "2px", marginBottom: "2rem",
          }}>
            <span className="pulse-dot" style={{ width: "6px", height: "6px", background: "var(--red)", borderRadius: "50%", display: "inline-block" }} />
            TRADING INTELLIGENCE PLATFORM
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-2px", marginBottom: "1.5rem" }}>
            Trade with<br />
            <span style={{ color: "var(--red)" }}>clarity.</span><br />
            Not noise.
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--text2)", maxWidth: "520px", lineHeight: "1.8", marginBottom: "3rem" }}>
            Signals, charts, portfolio tracking, and market news — for crypto, stocks & forex — all in one place. Built for our community.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              padding: "14px 32px", fontFamily: "'Space Mono', monospace", fontSize: "0.85rem",
              letterSpacing: "1px", borderRadius: "4px", fontWeight: "700",
              background: "var(--red)", border: "none", color: "#fff", textDecoration: "none",
            }}>
              Open Dashboard →
            </Link>
            <Link href="/pricing" style={{
              padding: "14px 32px", fontFamily: "'Space Mono', monospace", fontSize: "0.85rem",
              letterSpacing: "1px", borderRadius: "4px", fontWeight: "700",
              background: "transparent", border: "1px solid var(--border)", color: "var(--text2)",
              textDecoration: "none",
            }}>
              View Pricing
            </Link>
          </div>

          <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "var(--text3)", letterSpacing: "1px" }}>
              Currently in <span style={{ color: "var(--text2)" }}>early access</span> — invite-only via Discord. Features are actively being built.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
