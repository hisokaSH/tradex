// Shared small UI components

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      padding: "1.5rem", borderRadius: "4px", ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "1.25rem" }}>
      {children}
    </p>
  );
}

export function MetricsRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: "1px", background: "var(--border)",
      border: "1px solid var(--border)", marginBottom: "2rem",
    }}>
      {children}
    </div>
  );
}

export function Metric({
  label, value, sub, valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <div style={{ background: "var(--bg)", padding: "1.25rem 1.5rem" }}>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "var(--text3)", letterSpacing: "1px", marginBottom: "0.5rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.3rem", fontWeight: "700", color: valueColor ?? "var(--text)" }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "var(--text3)", marginTop: "4px" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "var(--text3)", letterSpacing: "1px", marginBottom: "0.5rem" }}>
        {title}
      </p>
      <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{sub}</p>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Space Mono', monospace", fontSize: "0.68rem",
      color: "var(--text3)", letterSpacing: "1px", marginBottom: "1.5rem",
    }}>
      {children}
    </p>
  );
}

export function SignalBadge({ type }: { type: "buy" | "sell" | "hold" }) {
  const colors = {
    buy: { bg: "rgba(0,217,126,0.1)", color: "var(--green)" },
    sell: { bg: "var(--red-muted)", color: "var(--red)" },
    hold: { bg: "rgba(255,107,53,0.1)", color: "var(--orange)" },
  };
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: "0.68rem",
      fontWeight: "700", padding: "3px 10px", borderRadius: "2px",
      background: colors[type].bg, color: colors[type].color,
    }}>
      {type.toUpperCase()}
    </span>
  );
}

export function SettingRow({ label, value, valueStyle }: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px", background: "var(--bg3)", borderRadius: "4px", marginBottom: "8px",
    }}>
      <span style={{ fontSize: "0.82rem" }}>{label}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", ...valueStyle }}>
        {value}
      </span>
    </div>
  );
}
