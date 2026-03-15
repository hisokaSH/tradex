import Link from "next/link";

const PLANS = [
  {
    tier: "FREE",
    price: "$0",
    desc: "Basic access for community members. Good starting point to explore the platform.",
    features: [
      { label: "5 signal alerts/day", included: true },
      { label: "News sentiment feed", included: true },
      { label: "Portfolio tracker (up to 3 assets)", included: true },
      { label: "Discord community access", included: true },
      { label: "AI-powered analysis", included: false },
      { label: "Chart drawing tools", included: false },
      { label: "Exchange integrations", included: false },
      { label: "Priority signals", included: false },
    ],
    cta: "Join Free",
    href: "/login",
    featured: false,
    accentColor: "var(--text2)",
  },
  {
    tier: "PRO",
    price: "$29",
    desc: "For active traders. Unlimited signals and full analytics across crypto & forex.",
    features: [
      { label: "Unlimited signals", included: true },
      { label: "Full portfolio tracker", included: true },
      { label: "Advanced charts + 50 indicators", included: true },
      { label: "AI analysis (10 queries/day)", included: true },
      { label: "5 exchange connections", included: true },
      { label: "Discord Pro role", included: true },
      { label: "Real-time news sentiment", included: true },
      { label: "VIP-only signals", included: false },
    ],
    cta: "Get Pro",
    href: "/login",
    featured: true,
    accentColor: "var(--red)",
  },
  {
    tier: "ELITE VIP",
    price: "$79",
    desc: "Full access. For serious traders who want every edge the platform offers.",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited AI analysis", included: true },
      { label: "Unlimited exchanges", included: true },
      { label: "VIP-only high-confidence signals", included: true },
      { label: "Private signal channel", included: true },
      { label: "Webhook API access", included: true },
      { label: "Priority support", included: true },
      { label: "Discord Elite + VIP role", included: true },
    ],
    cta: "Go Elite",
    href: "/login",
    featured: false,
    accentColor: "var(--orange)",
  },
];

export default function PricingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 3rem", height: "64px",
        background: "rgba(8,11,15,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--red-border)",
      }}>
        <Link href="/" style={{
          fontFamily: "'Space Mono', monospace", fontSize: "1rem",
          color: "var(--red)", letterSpacing: "3px", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span className="pulse-dot" style={{ width: "7px", height: "7px", background: "var(--red)", borderRadius: "50%", display: "inline-block" }} />
          TRADEX
        </Link>
        <Link href="/login" style={{
          background: "var(--red)", color: "#fff", padding: "8px 20px", borderRadius: "4px",
          fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "1px",
          fontWeight: "700", textDecoration: "none",
        }}>
          Get Started
        </Link>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "calc(8rem + 64px) 3rem 6rem" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>
          // PRICING
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: "800", letterSpacing: "-1px", marginBottom: "1rem" }}>
          Simple tiers.<br />No surprises.
        </h1>
        <p style={{ color: "var(--text2)", maxWidth: "460px", lineHeight: "1.7", marginBottom: "4rem" }}>
          Access is granted via Discord role. Upgrade your role to unlock more features. Cancel anytime.
        </p>

        {/* Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: "1px", background: "var(--border)", border: "1px solid var(--border)",
        }}>
          {PLANS.map((plan) => (
            <div key={plan.tier} style={{
              background: plan.featured ? "var(--bg3)" : "var(--bg)",
              padding: "2.5rem 2rem", position: "relative",
            }}>
              {plan.featured && (
                <span style={{
                  position: "absolute", top: "-1px", right: "2rem",
                  background: "var(--red)", color: "#fff",
                  fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "1px", padding: "4px 12px",
                  borderRadius: "0 0 4px 4px",
                }}>
                  POPULAR
                </span>
              )}

              <p style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "2px", color: plan.accentColor, marginBottom: "1rem",
              }}>
                {plan.tier}
              </p>

              <p style={{
                fontFamily: "'Space Mono', monospace", fontSize: "2.4rem",
                fontWeight: "700", color: plan.accentColor, marginBottom: "0.25rem",
              }}>
                {plan.price}
                <span style={{ fontSize: "0.8rem", color: "var(--text3)", fontWeight: "400" }}>/month</span>
              </p>

              <p style={{ fontSize: "0.8rem", color: "var(--text2)", margin: "0.75rem 0 1.5rem", lineHeight: "1.6" }}>
                {plan.desc}
              </p>

              <ul style={{ listStyle: "none", marginBottom: "2rem" }}>
                {plan.features.map((f) => (
                  <li key={f.label} style={{
                    fontSize: "0.78rem", color: "var(--text2)",
                    padding: "5px 0", display: "flex", gap: "10px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{
                      fontSize: "0.7rem", flexShrink: 0,
                      color: f.included ? "var(--green)" : "var(--text3)",
                    }}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} style={{
                display: "block", width: "100%", padding: "12px",
                textAlign: "center", borderRadius: "3px",
                fontFamily: "'Space Mono', monospace", fontSize: "0.75rem",
                letterSpacing: "1px", fontWeight: "700", textDecoration: "none",
                background: plan.featured ? "var(--red)" : "transparent",
                border: plan.featured ? "none" : `1px solid ${plan.accentColor}33`,
                color: plan.featured ? "#fff" : plan.accentColor,
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: "center", marginTop: "2rem",
          fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--text3)",
        }}>
          Discord OAuth required · Billed monthly · Cancel anytime
        </p>
      </div>
    </main>
  );
}
