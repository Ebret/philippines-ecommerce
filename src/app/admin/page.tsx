import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Philippines E-Commerce",
  description: "Admin dashboard for managing the e-commerce platform",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/unauthorized");
  }
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">Welcome, {user.email}</p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/reports"
            className="bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 dark:from-secondary-500 dark:to-secondary-600 dark:hover:from-secondary-600 dark:hover:to-secondary-700 text-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-xl font-bold">View Reports</h3>
            <p className="text-secondary-100 dark:text-secondary-200 mt-2">Generate and view sales and revenue reports</p>
          </Link>
          <Link
            href="/admin/system"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-xl font-bold">System Status</h3>
            <p className="text-primary-100 dark:text-primary-200 mt-2">Check system health and view logs</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

