import { Card, SectionLabel } from "@/components/ui";
import { fetchAllNews, timeAgo } from "@/lib/news";
import type { Sentiment } from "@/types";

const SENTIMENT_STYLE: Record<Sentiment, { bg: string; color: string; label: string; dot: string }> = {
  bullish: { bg: "rgba(0,217,126,0.08)", color: "var(--green)",   label: "BULLISH", dot: "var(--green)"  },
  bearish: { bg: "var(--red-muted)",      color: "var(--red)",    label: "BEARISH", dot: "var(--red)"    },
  neutral: { bg: "rgba(255,255,255,0.04)",color: "var(--text3)",  label: "NEUTRAL", dot: "var(--text3)"  },
};

const TAG_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", BNB: "#F3BA2F",
  XRP: "#00AAE4", ADA: "#0033AD", AVAX: "#E84142", MATIC: "#8247E5",
  DOGE: "#C2A633", LINK: "#2A5ADA", FOREX: "#00D97E", SPX: "#5865F2",
};

export const revalidate = 180; // refresh every 3 min

export default async function NewsPage() {
  const news = await fetchAllNews(30);

  const bullCount = news.filter((n) => n.sentiment === "bullish").length;
  const bearCount = news.filter((n) => n.sentiment === "bearish").length;
  const neutCount = news.filter((n) => n.sentiment === "neutral").length;
  const total = news.length || 1;
  const overall: Sentiment = bullCount > bearCount ? "bullish" : bearCount > bullCount ? "bearish" : "neutral";

  return (
    <div>
      <SectionLabel>// NEWS & SENTIMENT FEED</SectionLabel>

      {/* Sentiment stats */}
      {news.length > 0 && (
        <>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "1px", background: "var(--border)",
            border: "1px solid var(--border)", marginBottom: "1rem",
          }}>
            {[
              { label: "OVERALL", value: SENTIMENT_STYLE[overall].label, color: SENTIMENT_STYLE[overall].color },
              { label: "BULLISH",  value: `${bullCount} (${Math.round(bullCount/total*100)}%)`, color: "var(--green)"  },
              { label: "BEARISH",  value: `${bearCount} (${Math.round(bearCount/total*100)}%)`, color: "var(--red)"    },
              { label: "NEUTRAL",  value: `${neutCount} (${Math.round(neutCount/total*100)}%)`, color: "var(--text2)"  },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--bg2)", padding: "1rem 1.25rem" }}>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "var(--text3)", letterSpacing: "1px", marginBottom: "0.4rem" }}>{s.label}</p>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "1rem", fontWeight: "700", color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Sentiment bar */}
          <div style={{ display: "flex", height: "3px", borderRadius: "2px", overflow: "hidden", marginBottom: "1.5rem", gap: "1px" }}>
            <div style={{ width: `${bullCount/total*100}%`, background: "var(--green)" }} />
            <div style={{ width: `${neutCount/total*100}%`, background: "var(--text3)" }} />
            <div style={{ width: `${bearCount/total*100}%`, background: "var(--red)" }} />
          </div>
        </>
      )}

      <Card>
        {news.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "var(--text3)", marginBottom: "0.5rem" }}>// FEED UNAVAILABLE</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Could not reach news sources. Check your internet connection.</p>
          </div>
        ) : (
          news.map((item, idx) => {
            const s = SENTIMENT_STYLE[item.sentiment];
            return (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", gap: "14px", alignItems: "flex-start",
                padding: "13px 0",
                borderBottom: idx < news.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textDecoration: "none",
              }}>
                <div style={{ paddingTop: "5px", flexShrink: 0 }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot }} />
                </div>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: "0.6rem",
                  color: "var(--red)", letterSpacing: "1px", whiteSpace: "nowrap",
                  paddingTop: "2px", minWidth: "100px",
                }}>
                  {item.source.toUpperCase().slice(0, 14)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text)", lineHeight: "1.5", marginBottom: "5px" }}>
                    {item.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "var(--text3)" }}>
                      {timeAgo(item.publishedAt)}
                    </span>
                    {item.tags.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: "'Space Mono',monospace", fontSize: "0.58rem",
                        padding: "1px 7px", borderRadius: "2px",
                        background: `${TAG_COLORS[tag] ?? "#888"}18`,
                        color: TAG_COLORS[tag] ?? "var(--text3)",
                        border: `1px solid ${TAG_COLORS[tag] ?? "#888"}33`,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: "0.6rem",
                  padding: "3px 10px", borderRadius: "2px", whiteSpace: "nowrap",
                  background: s.bg, color: s.color, alignSelf: "flex-start", flexShrink: 0,
                }}>{s.label}</span>
              </a>
            );
          })
        )}
      </Card>

      <p style={{ textAlign: "center", marginTop: "1rem", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "var(--text3)" }}>
        {news.length} articles from {Array.from(new Set(news.map(n => n.source))).length} sources · Refreshes every 3 minutes · No API key required
      </p>
    </div>
  );
}
