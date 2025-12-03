import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { BarChart3, Activity, FileText, Settings, TrendingUp, Users } from "lucide-react";

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

  // Mock KPI data
  const kpis = [
    { label: "Total Revenue", value: "₱125,430", change: "+12.5%", icon: TrendingUp, color: "from-primary to-primary/60" },
    { label: "Active Users", value: "2,847", change: "+8.2%", icon: Users, color: "from-accent to-accent/60" },
    { label: "Total Orders", value: "1,234", change: "+5.3%", icon: BarChart3, color: "from-secondary to-secondary/60" },
    { label: "System Status", value: "Healthy", change: "100%", icon: Activity, color: "from-success to-success/60" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, <span className="font-semibold text-primary">{user.email}</span></p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Activity className="w-5 h-5 text-success animate-pulse" />
              <span className="text-sm font-medium text-foreground">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reports Card */}
            <Link
              href="/admin/reports"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-secondary/20 to-secondary/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-secondary/50 hover:from-secondary/30 hover:to-secondary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/60 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">View Reports</h3>
                    <p className="text-sm text-muted-foreground">Sales & Revenue Analytics</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Generate comprehensive reports and analyze business metrics</p>
              </div>
            </Link>

            {/* System Status Card */}
            <Link
              href="/admin/system"
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/20 to-primary/5 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:from-primary/30 hover:to-primary/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">System Status</h3>
                    <p className="text-sm text-muted-foreground">Health & Logs</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Monitor system health, view logs, and manage settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">More Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/live-streams"
              className="group p-4 rounded-lg border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 hover:border-accent/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Live Streams</p>
                  <p className="text-xs text-muted-foreground">Manage live selling</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

