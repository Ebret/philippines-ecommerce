import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/unauthorized");
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white dark:bg-neutral-950">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-800 shadow-lg border-r border-neutral-200 dark:border-neutral-700">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            <Link
              href="/admin"
              className="block px-6 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-l-4 border-transparent hover:border-primary-600 dark:hover:border-primary-500 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/reports"
              className="block px-6 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-l-4 border-transparent hover:border-primary-600 dark:hover:border-primary-500 transition-all duration-200"
            >
              Reports
            </Link>
            <Link
              href="/admin/system"
              className="block px-6 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-l-4 border-transparent hover:border-primary-600 dark:hover:border-primary-500 transition-all duration-200"
            >
              System
            </Link>
            <Link
              href="/admin/live-streams"
              className="block px-6 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-l-4 border-transparent hover:border-primary-600 dark:hover:border-primary-500 transition-all duration-200"
            >
              Live Streams
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white dark:bg-neutral-950">
          {children}
        </main>
      </div>
    </>
  );
}

