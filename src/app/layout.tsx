import type { Metadata } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "TradeX — Trading Intelligence",
  description: "AI-powered trading signals, portfolio tracking, and market analysis for crypto, stocks & forex.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
