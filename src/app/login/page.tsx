"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid BG */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,59,59,0.06) 0%, transparent 70%)",
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        background: "var(--bg2)", border: "1px solid var(--red-border)",
        borderRadius: "8px", padding: "3rem", width: "100%", maxWidth: "420px",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: "1.3rem",
          color: "var(--red)", letterSpacing: "3px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "10px", marginBottom: "2rem",
        }}>
          <span className="pulse-dot" style={{ width: "8px", height: "8px", background: "var(--red)", borderRadius: "50%", display: "inline-block" }} />
          TRADEX
        </div>

        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.5px" }}>
          Access the terminal
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", lineHeight: "1.6", marginBottom: "2rem" }}>
          Sign in with your Discord account. Access tier assigned automatically based on your server role.
        </p>

        {error && (
          <div style={{
            background: "var(--red-muted)", border: "1px solid var(--red-border)",
            color: "var(--red)", fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem", padding: "10px 16px", borderRadius: "4px",
            marginBottom: "1.5rem", letterSpacing: "0.5px",
          }}>
            {error === "OAuthSignin" ? "Discord login failed. Try again." : `Error: ${error}`}
          </div>
        )}

        <button
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          style={{
            width: "100%", padding: "14px",
            background: "#5865F2", border: "none", color: "#fff",
            borderRadius: "4px", fontFamily: "'Space Mono', monospace",
            fontSize: "0.85rem", letterSpacing: "1px", fontWeight: "700",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "12px",
          }}
        >
          {/* Discord icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.953 13.953 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Sign in with Discord
        </button>

        <p style={{ marginTop: "1.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--text3)", letterSpacing: "0.5px", lineHeight: "1.6" }}>
          By signing in you accept the terms of service.<br />
          Access tier is determined by your Discord role.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
