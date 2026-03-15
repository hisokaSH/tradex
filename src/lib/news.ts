import Parser from "rss-parser";
import type { NewsItem, Sentiment } from "@/types";

const parser = new Parser({ timeout: 6000, headers: { "User-Agent": "TradeX/1.0" } });

const SOURCES = [
  { name: "CoinDesk",      url: "https://www.coindesk.com/arc/outboundfeeds/rss/",  tag: "CRYPTO" },
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss",                    tag: "CRYPTO" },
  { name: "Decrypt",       url: "https://decrypt.co/feed",                          tag: "CRYPTO" },
  { name: "Bitcoinist",    url: "https://bitcoinist.com/feed/",                     tag: "CRYPTO" },
  { name: "CryptoSlate",   url: "https://cryptoslate.com/feed/",                    tag: "CRYPTO" },
  { name: "ForexLive",     url: "https://www.forexlive.com/feed/news",              tag: "FOREX"  },
  { name: "FX Street",     url: "https://www.fxstreet.com/rss/news",               tag: "FOREX"  },
];

const BULLISH = [
  "surge","surges","surging","rally","rallies","rallying","soar","soars","soaring",
  "breakout","all-time high","ath","record high","bullish","bull run","bull market",
  "gains","jumped","spikes","spiked","adoption","launches","partnership","upgrade",
  "approved","approval","etf","institutional","accumulate","upside","recovery",
  "recovers","rebound","rebounds","outperforms","milestone","growth","positive",
  "rises","rise","rising","climbs","climbing","tops","breaks","higher","uptrend",
];

const BEARISH = [
  "crash","crashes","crashing","plunge","plunges","plunging","drop","drops",
  "tumble","tumbles","collapse","collapses","bear","bearish","sell-off","selloff",
  "decline","declines","falling","slump","slumps","dump","dumps","hack","hacked",
  "exploit","scam","fraud","ban","banned","crackdown","lawsuit","sec","fined",
  "warning","fear","panic","liquidation","liquidated","bankruptcy","insolvent",
  "concern","worries","losses","loss","lower","downtrend","weakness","trouble",
  "pressure","struggling","plummets","sinks","slides","retreats","dips",
];

const COIN_PATTERNS: [RegExp, string][] = [
  [/\bbitcoin\b|\bbtc\b/i,    "BTC"],
  [/\bethereum\b|\beth\b/i,   "ETH"],
  [/\bsolana\b|\bsol\b/i,     "SOL"],
  [/\bbnb\b|\bbinance\b/i,    "BNB"],
  [/\bxrp\b|\bripple\b/i,     "XRP"],
  [/\bcardano\b|\bada\b/i,    "ADA"],
  [/\bavalanche\b|\bavax\b/i, "AVAX"],
  [/\bpolygon\b|\bmatic\b/i,  "MATIC"],
  [/\bdogecoin\b|\bdoge\b/i,  "DOGE"],
  [/\bchainlink\b|\blink\b/i, "LINK"],
  [/\bforex\b|\beur\/usd\b|\beurusd\b/i, "FOREX"],
  [/\bnasdaq\b|\bs&p\b|\bsp500\b/i,      "SPX"],
];

function scoreSentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  let bull = 0;
  let bear = 0;
  for (const w of BULLISH) if (lower.includes(w)) bull++;
  for (const w of BEARISH) if (lower.includes(w)) bear++;
  if (bull === bear) return "neutral";
  if (bull > bear) return "bullish";
  return "bearish";
}

function detectTags(text: string): string[] {
  const tags: string[] = [];
  for (const [pattern, tag] of COIN_PATTERNS) {
    if (pattern.test(text) && !tags.includes(tag)) tags.push(tag);
  }
  return tags.slice(0, 4);
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export async function fetchAllNews(limit = 30): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (src) => {
      const feed = await parser.parseURL(src.url);
      return (feed.items ?? []).slice(0, 8).map((item, i): NewsItem => {
        const title = item.title ?? "";
        const combined = `${title} ${item.contentSnippet ?? ""}`;
        return {
          id: `${src.name}-${i}`,
          title,
          source: src.name,
          url: item.link ?? "#",
          sentiment: scoreSentiment(combined),
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          tags: detectTags(combined),
        };
      });
    })
  );

  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  // Sort by newest first, deduplicate by title similarity
  return all
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .filter((item, idx, arr) =>
      arr.findIndex((x) => x.title.slice(0, 40) === item.title.slice(0, 40)) === idx
    )
    .slice(0, limit);
}

export { timeAgo };
