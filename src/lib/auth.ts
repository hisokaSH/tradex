import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import type { Tier } from "@/types";
import { DISCORD_ROLE_TIER_MAP } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId: string;
      tier: Tier;
      roles: string[];
    };
  }
}

// ─── User ID whitelist ────────────────────────────────────────────────────────
const ELITE_USER_IDS: string[] = [
  "1482206262707097681", // friend
];

function resolveTier(discordId: string, roles: string[]): Tier {
  if (ELITE_USER_IDS.includes(discordId)) return "elite";
  for (const roleId of roles) {
    const tier = DISCORD_ROLE_TIER_MAP[roleId];
    if (tier === "elite") return "elite";
  }
  for (const roleId of roles) {
    const tier = DISCORD_ROLE_TIER_MAP[roleId];
    if (tier === "pro") return "pro";
  }
  return "free";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        url: "https://discord.com/api/oauth2/authorize",
        params: {
          scope: "identify email guilds guilds.members.read",
          response_type: "code",
        },
      },
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
      checks: ["state"],
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as { id: string }).id;
        token.roles = [];

        if (process.env.DISCORD_GUILD_ID && account.access_token) {
          try {
            const res = await fetch(
              `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${token.discordId}`,
              {
                headers: {
                  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
              }
            );

            if (res.ok) {
              const member = await res.json();
              token.roles = member.roles ?? [];
              console.log("[TradeX Auth] Discord ID:", token.discordId);
              console.log("[TradeX Auth] Roles fetched:", token.roles);
            } else {
              const body = await res.text();
              console.error(`[TradeX Auth] Role fetch failed — ${res.status}:`, body);
            }
          } catch (e) {
            console.error("[TradeX Auth] Role fetch exception:", e);
          }
        } else {
          console.warn("[TradeX Auth] Skipping role fetch — DISCORD_GUILD_ID or access_token missing");
        }

        token.tier = resolveTier(token.discordId as string, token.roles as string[]);
        console.log("[TradeX Auth] Resolved tier:", token.tier);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.discordId = token.discordId as string;
      session.user.tier = (token.tier as Tier) ?? "free";
      session.user.roles = (token.roles as string[]) ?? [];
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});