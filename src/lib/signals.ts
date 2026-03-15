export interface Signal {
  id: string;
  pair: string;
  market: string;
  signal_type: "buy" | "sell" | "hold";
  confidence: number;
  timeframe: string;
  price: number;
  reasons: string[];
  indicators: {
    rsi?: number;
    macd?: number;
    macd_hist?: number;
    bb_upper?: number;
    bb_lower?: number;
    ema_20?: number;
    ema_50?: number;
    volume_ratio?: number;
  };
  timestamp: string;
  is_vip: boolean;
}

export interface SignalStats {
  total: number;
  buy: number;
  sell: number;
  hold: number;
  vip: number;
  avg_confidence: number;
  last_scan: string | null;
}

const BASE = process.env.SIGNAL_ENGINE_URL || "http://localhost:5001";
const KEY  = process.env.SIGNAL_ENGINE_KEY || "";

const headers: HeadersInit = { ...(KEY ? { "X-Signal-Key": KEY } : {}), "ngrok-skip-browser-warning": "true" };

export async function fetchSignals(tier: string, timeframe?: string, market?: string): Promise<Signal[]> {
  try {
    const params = new URLSearchParams({ tier });
    if (timeframe) params.set("timeframe", timeframe);
    if (market) params.set("market", market);

    const res = await fetch(`${BASE}/signals?${params}`, {
      headers,
      next: { revalidate: 60 }, // cache 1 min
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.signals ?? [];
  } catch {
    return [];
  }
}

export async function fetchSignalStats(): Promise<SignalStats | null> {
  try {
    const res = await fetch(`${BASE}/signals/stats`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLatestSignals(): Promise<Signal[]> {
  try {
    const res = await fetch(`${BASE}/signals/latest`, {
      headers,
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.signals ?? [];
  } catch {
    return [];
  }
}

export async function checkEngineHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/health`, { next: { revalidate: 30 } });
    return res.ok;
  } catch {
    return false;
  }
}
