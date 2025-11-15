import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReportsPageClient from "./reports-client";

export const metadata = {
  title: "Admin Reports | Philippines E-Commerce",
  description: "View sales and revenue reports",
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/unauthorized");
  }

  return <ReportsPageClient />;
}

