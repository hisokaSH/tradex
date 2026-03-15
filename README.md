# TradeX — Trading Intelligence Platform

Dark-themed trading dashboard for your Discord community. Built with Next.js 14, NextAuth v5, and Tailwind CSS.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS variables |
| Auth | NextAuth v5 — Discord OAuth |
| News | CryptoPanic API (free tier) |
| Charts | TradingView widget (to embed) |
| Hosting | Vercel (recommended) |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in your values (see section below).

### 3. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Discord OAuth
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Create a new application
3. Go to **OAuth2** → add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy **Client ID** and **Client Secret** → `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET`

### Discord Bot (role checking)
1. In the same application, go to **Bot**
2. Enable **Server Members Intent**
3. Copy the bot token → `DISCORD_BOT_TOKEN`
4. Invite the bot to your server with `bot` + `guilds.members.read` scopes
5. Copy your server ID (right-click server → Copy Server ID) → `DISCORD_GUILD_ID`

### Auth Secret
```bash
openssl rand -base64 32
```
Paste output into `AUTH_SECRET`

### CryptoPanic (news feed)
- Sign up at [cryptopanic.com/developers/api](https://cryptopanic.com/developers/api/)
- Free tier gives 200 requests/day
- Add key to `CRYPTOPANIC_API_KEY`

---

## Role → Tier Mapping

Edit `src/types/index.ts` to map your Discord role IDs to tiers:

```ts
export const DISCORD_ROLE_TIER_MAP: Record<string, Tier> = {
  "1234567890123456789": "elite",  // your Elite role ID
  "9876543210987654321": "pro",    // your Pro role ID
};
```

To find a role ID: Discord → Server Settings → Roles → right-click role → Copy Role ID (Developer Mode must be on).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page (redirects if logged in)
│   ├── login/page.tsx            # Discord OAuth login
│   ├── pricing/page.tsx          # Pricing tiers
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth guard + sidebar layout
│   │   ├── page.tsx              # Overview
│   │   ├── signals/page.tsx      # Signal terminal
│   │   ├── charts/page.tsx       # Chart analysis
│   │   ├── portfolio/page.tsx    # Portfolio tracker
│   │   ├── news/page.tsx         # News & sentiment feed
│   │   └── settings/page.tsx     # Account + API connections
│   └── api/auth/[...nextauth]/   # NextAuth handler
├── components/
│   ├── dashboard/
│   │   ├── DashHeader.tsx        # Top navigation bar
│   │   └── Sidebar.tsx           # Left navigation
│   └── ui/index.tsx              # Shared UI components
├── lib/
│   └── auth.ts                   # NextAuth config + role resolution
├── types/index.ts                # TypeScript types + tier limits
└── styles/globals.css            # Global CSS + design tokens
```

---

## What to Build Next

### Backend (Flask / FastAPI)
- Signal engine using `ccxt` + `ta-lib` (RSI, MACD, Bollinger)
- WebSocket for real-time signal push to frontend
- Per-user exchange API key storage (encrypted)
- Portfolio sync endpoint (fetch balances from exchanges)

### Charts
- Add `TradingViewWidget.tsx` client component:
```tsx
"use client";
import { useEffect, useRef } from "react";

export default function TradingViewWidget({ symbol = "BINANCE:BTCUSDT" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: "tv_chart",
        symbol,
        interval: "60",
        theme: "dark",
        style: "1",
        width: "100%",
        height: 500,
      });
    };
    ref.current?.appendChild(script);
  }, [symbol]);
  return <div id="tv_chart" ref={ref} />;
}
```

### Database
- Add Prisma + PostgreSQL (Supabase free tier) for:
  - User profiles + encrypted API keys
  - Signal history
  - Portfolio snapshots

### Deployment
```bash
# Deploy to Vercel
vercel
# Set env vars in Vercel dashboard
# Update NEXTAUTH_URL to your production URL
# Update Discord OAuth redirect URI to production URL
```

---

## Discord Role Access Flow

```
User visits /login
  → Discord OAuth
  → Bot fetches guild member roles
  → Role IDs mapped to tier (elite / pro / free)
  → Tier stored in JWT session
  → UI gates features by tier
```
