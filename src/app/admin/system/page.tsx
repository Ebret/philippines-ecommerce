import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SystemPageClient from "./system-client";

export const metadata = {
  title: "Admin System Status | Philippines E-Commerce",
  description: "Check system health and view logs",
};

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/unauthorized");
  }

  return <SystemPageClient />;
}

