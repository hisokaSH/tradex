"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TradingViewWidget = dynamic(
  () => import("@/components/dashboard/TradingViewWidget"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const PAIRS = [
  { label: "BTC/USDT",  symbol: "BINANCE:BTCUSDT",   market: "CRYPTO" },
  { label: "ETH/USDT",  symbol: "BINANCE:ETHUSDT",   market: "CRYPTO" },
  { label: "SOL/USDT",  symbol: "BINANCE:SOLUSDT",   market: "CRYPTO" },
  { label: "BNB/USDT",  symbol: "BINANCE:BNBUSDT",   market: "CRYPTO" },
  { label: "XRP/USDT",  symbol: "BINANCE:XRPUSDT",   market: "CRYPTO" },
  { label: "AVAX/USDT", symbol: "BINANCE:AVAXUSDT",  market: "CRYPTO" },
  { label: "EUR/USD",   symbol: "FX:EURUSD",         market: "FOREX"  },
  { label: "GBP/USD",   symbol: "FX:GBPUSD",         market: "FOREX"  },
  { label: "USD/JPY",   symbol: "FX:USDJPY",         market: "FOREX"  },
  { label: "USD/CAD",   symbol: "FX:USDCAD",         market: "FOREX"  },
  { label: "AAPL",      symbol: "NASDAQ:AAPL",       market: "STOCKS" },
  { label: "TSLA",      symbol: "NASDAQ:TSLA",       market: "STOCKS" },
  { label: "SPY",       symbol: "AMEX:SPY",          market: "STOCKS" },
  { label: "NVDA",      symbol: "NASDAQ:NVDA",       market: "STOCKS" },
];

const TIMEFRAMES = [
  { label: "1M",  value: "1"    },
  { label: "5M",  value: "5"    },
  { label: "15M", value: "15"   },
  { label: "1H",  value: "60"   },
  { label: "4H",  value: "240"  },
  { label: "1D",  value: "D"    },
  { label: "1W",  value: "W"    },
];

const MARKETS = ["ALL", "CRYPTO", "FOREX", "STOCKS"];

export default function ChartsClient() {
  const [activePair, setActivePair] = useState(PAIRS[0]);
  const [activeInterval, setActiveInterval] = useState("60");
  const [marketFilter, setMarketFilter] = useState("ALL");

  const filteredPairs = marketFilter === "ALL"
    ? PAIRS
    : PAIRS.filter((p) => p.market === marketFilter);

  const marketColor: Record<string, string> = {
    CRYPTO: "var(--orange)",
    FOREX:  "var(--green)",
    STOCKS: "#5865F2",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Top bar: market filter + timeframes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        {/* Market filter */}
        <div style={{ display: "flex", gap: "4px" }}>
          {MARKETS.map((m) => (
            <button key={m} onClick={() => setMarketFilter(m)} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
              padding: "5px 14px", borderRadius: "2px", cursor: "pointer",
              letterSpacing: "1px", transition: "all 0.15s",
              background: marketFilter === m ? "var(--red-muted)" : "transparent",
              border: `1px solid ${marketFilter === m ? "var(--red-border)" : "var(--border)"}`,
              color: marketFilter === m ? "var(--red)" : "var(--text3)",
            }}>{m}</button>
          ))}
        </div>

        {/* Timeframes */}
        <div style={{ display: "flex", gap: "4px" }}>
          {TIMEFRAMES.map((tf) => (
            <button key={tf.value} onClick={() => setActiveInterval(tf.value)} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
              padding: "5px 12px", borderRadius: "2px", cursor: "pointer",
              letterSpacing: "1px", transition: "all 0.15s",
              background: activeInterval === tf.value ? "var(--red-muted)" : "transparent",
              border: `1px solid ${activeInterval === tf.value ? "var(--red-border)" : "var(--border)"}`,
              color: activeInterval === tf.value ? "var(--red)" : "var(--text3)",
            }}>{tf.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "1.25rem" }}>

        {/* Pair list */}
        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "4px", overflow: "hidden",
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
            color: "var(--text3)", letterSpacing: "2px",
            padding: "10px 14px", borderBottom: "1px solid var(--border)",
          }}>
            PAIRS
          </div>
          {filteredPairs.map((pair) => (
            <button key={pair.symbol} onClick={() => setActivePair(pair)} style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "9px 14px",
              background: activePair.symbol === pair.symbol ? "var(--red-muted)" : "transparent",
              borderLeft: `2px solid ${activePair.symbol === pair.symbol ? "var(--red)" : "transparent"}`,
              border: "none", borderBottom: "1px solid rgba(255,255,255,0.03)",
              cursor: "pointer", transition: "all 0.1s",
            }}>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.72rem",
                color: activePair.symbol === pair.symbol ? "var(--text)" : "var(--text2)",
                fontWeight: activePair.symbol === pair.symbol ? "700" : "400",
              }}>
                {pair.label}
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.55rem",
                color: marketColor[pair.market],
              }}>
                {pair.market}
              </span>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "4px", overflow: "hidden",
        }}>
          {/* Chart header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 1.25rem", borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>{activePair.label}</span>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
              color: marketColor[activePair.market], padding: "2px 8px",
              background: `${marketColor[activePair.market]}18`,
              borderRadius: "2px",
            }}>
              {activePair.market}
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
              color: "var(--text3)", marginLeft: "auto",
            }}>
              {activePair.symbol}
            </span>
          </div>

          {/* TradingView embed */}
          <TradingViewWidget
            key={`${activePair.symbol}-${activeInterval}`}
            symbol={activePair.symbol}
            interval={activeInterval}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div style={{
      height: "520px", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
    }}>
      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
        color: "var(--text3)", letterSpacing: "1px",
      }}>
        // LOADING CHART...
      </p>
    </div>
  );
}
