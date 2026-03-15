"use client";

import dynamic from "next/dynamic";

const TradingViewWidget = dynamic(
  () => import("@/components/dashboard/TradingViewWidget"),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "var(--text3)", letterSpacing: "1px" }}>
          // LOADING...
        </p>
      </div>
    ),
  }
);

export default function OverviewChart() {
  return <TradingViewWidget symbol="BINANCE:BTCUSDT" interval="60" height={420} />;
}
