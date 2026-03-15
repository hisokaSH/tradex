import { fetchAllNews, timeAgo } from "@/lib/news";
import type { Sentiment } from "@/types";
import Link from "next/link";

const DOT: Record<Sentiment, string> = {
  bullish: "var(--green)",
  bearish: "var(--red)",
  neutral: "var(--text3)",
};

const LABEL: Record<Sentiment, string> = {
  bullish: "BULL",
  bearish: "BEAR",
  neutral: "NEUT",
};

const LABEL_COLOR: Record<Sentiment, string> = {
  bullish: "var(--green)",
  bearish: "var(--red)",
  neutral: "var(--text3)",
};

export default async function NewsPreview() {
  const news = await fetchAllNews(5);

  if (news.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "var(--text3)" }}>
          // FEED UNAVAILABLE
        </p>
      </div>
    );
  }

  return (
    <div>
      {news.map((item, idx) => (
        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          padding: "9px 0",
          borderBottom: idx < news.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          textDecoration: "none",
        }}>
          <div style={{ paddingTop: "5px", flexShrink: 0 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: DOT[item.sentiment] }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: "0.75rem", color: "var(--text)", lineHeight: "1.4",
              overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>{item.title}</p>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "var(--text3)", marginTop: "3px" }}>
              {item.source.toUpperCase().slice(0, 12)} · {timeAgo(item.publishedAt)}
            </p>
          </div>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: "0.58rem",
            color: LABEL_COLOR[item.sentiment], flexShrink: 0, paddingTop: "2px",
          }}>{LABEL[item.sentiment]}</span>
        </a>
      ))}
      <Link href="/dashboard/news" style={{
        display: "block", textAlign: "center", marginTop: "1rem",
        fontFamily: "'Space Mono',monospace", fontSize: "0.62rem",
        color: "var(--red)", textDecoration: "none", letterSpacing: "1px",
      }}>
        VIEW ALL NEWS →
      </Link>
    </div>
  );
}
