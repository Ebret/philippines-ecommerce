import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/");
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user.email}</p>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/reports"
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow transition"
        >
          <h3 className="text-xl font-bold">View Reports</h3>
          <p className="text-blue-100 mt-2">Generate and view sales and revenue reports</p>
        </Link>
        <Link
          href="/admin/system"
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow transition"
        >
          <h3 className="text-xl font-bold">System Status</h3>
          <p className="text-green-100 mt-2">Check system health and view logs</p>
        </Link>
      </div>
    </div>
  );
}

