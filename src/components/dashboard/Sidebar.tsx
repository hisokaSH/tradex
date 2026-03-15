"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  {
    label: "MARKETS",
    items: [
      { href: "/dashboard", label: "Overview", icon: GridIcon },
      { href: "/dashboard/signals", label: "Signals", icon: SignalIcon },
      { href: "/dashboard/strategies", label: "Strategies", icon: StrategyIcon },
      { href: "/dashboard/charts", label: "Charts", icon: ChartIcon },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { href: "/dashboard/portfolio", label: "Portfolio", icon: PortfolioIcon },
      { href: "/dashboard/news", label: "News Feed", icon: NewsIcon },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      borderRight: "1px solid var(--border)",
      padding: "1.25rem 0",
      background: "var(--bg)",
    }}>
      {SECTIONS.map((section) => (
        <div key={section.label}>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "2px", color: "var(--text3)",
            padding: "1.25rem 1.5rem 0.4rem",
          }}>
            {section.label}
          </p>
          {section.items.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 1.5rem", fontSize: "0.82rem",
                  color: active ? "var(--red)" : "var(--text2)",
                  textDecoration: "none",
                  borderLeft: `2px solid ${active ? "var(--red)" : "transparent"}`,
                  background: active ? "var(--red-muted)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function GridIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function SignalIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}
function ChartIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function PortfolioIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  );
}
function NewsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a4 4 0 0 1-4-4V6"/>
      <line x1="10" y1="7" x2="18" y2="7"/><line x1="10" y1="11" x2="18" y2="11"/>
    </svg>
  );
}
function SettingsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function StrategyIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}
