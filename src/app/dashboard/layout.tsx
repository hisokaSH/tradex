import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashHeader from "@/components/dashboard/DashHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    discordId: session.user.discordId ?? "",
    tier: session.user.tier ?? "free",
    roles: session.user.roles ?? [],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "64px" }}>
      <DashHeader user={user} />
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 113px)" }}>
        <Sidebar />
        <main style={{ padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
