"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import type { Tier } from "@/types";

interface Props {
  user: {
    name?: string | null;
    image?: string | null;
    tier: Tier;
    discordId: string;
  };
}

const TIER_COLOR: Record<Tier, string> = {
  free: "var(--text3)",
  pro: "var(--red)",
  elite: "var(--orange)",
};

export default function DashHeader({ user }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const initials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : "TX";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: "64px",
      background: "rgba(8,11,15,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: "1rem",
        color: "var(--red)", letterSpacing: "3px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <span className="pulse-dot" style={{
          width: "7px", height: "7px", background: "var(--red)",
          borderRadius: "50%", display: "inline-block",
        }} />
        TRADEX
      </div>

      {/* Title */}
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
        color: "var(--text3)", letterSpacing: "2px",
      }}>
        // TERMINAL
      </span>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
          color: "var(--text3)",
        }}>
          {time}
        </span>

        {/* Tier badge */}
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
          background: "rgba(255,107,53,0.08)", border: `1px solid rgba(255,107,53,0.2)`,
          color: TIER_COLOR[user.tier], padding: "3px 10px",
          borderRadius: "2px", letterSpacing: "1px", textTransform: "uppercase",
        }}>
          {user.tier}
        </span>

        {/* Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={user.name ?? ""}
            style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)" }}
          />
        ) : (
          <div style={{
            width: "32px", height: "32px", background: "var(--red-muted)",
            border: "1px solid var(--red-border)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--red)",
          }}>
            {initials}
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text3)", padding: "5px 12px", borderRadius: "3px",
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "1px", cursor: "pointer",
          }}
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
}
