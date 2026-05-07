"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import {
  Loader2,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  BarChart3Icon,
  UploadIcon,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export const dynamic = "force-dynamic";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/90 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] text-muted-foreground/50 font-mono mb-1">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold text-white">
          {entry.value}
          <span className="text-muted-foreground/50 text-xs ml-1">
            {entry.name}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function IssuerAnalyticsPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const {
    data: analytics,
    loading,
    error,
  } = useDashboardData("/api/dashboard/issuer/analytics", {
    autoFetch: !sessionLoading && session?.role === "admin",
  });

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || session.role !== "admin") {
        router.replace("/issuer/login");
      }
    }
    if (!sessionLoading && session) {
      setSession(session);
    }
  }, [sessionLoading, session, router, setSession]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || session.role !== "admin") return null;

  const sidebarData = {
    navMain: [
      { title: "Dashboard", url: "/issuer/dashboard", icon: <LayoutDashboardIcon /> },
      { title: "Documents", url: "/issuer/dashboard/documents", icon: <FileTextIcon /> },
      { title: "Upload", url: "/issuer/dashboard/upload", icon: <UploadIcon /> },
      { title: "Activity", url: "/issuer/dashboard/activity", icon: <ActivityIcon /> },
      { title: "Analytics", url: "/issuer/dashboard/analytics", icon: <BarChart3Icon />, isActive: true },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Feedback", url: "#", icon: <SendIcon /> },
    ],
    projects: [],
  };

  // Format data for charts
  const topRecipientsData = analytics?.topRecipients?.map((d) => ({
    name: d.name || d.email,
    count: d.count,
  })) || [];

  const activityByTypeData = analytics?.activityByType?.map((d) => ({
    name: d.type.replace(/_/g, ' '),
    count: d.count,
  })) || [];

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={sidebarData} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-5 p-6 animate-in fade-in duration-500">
              <div>
                <h1 className="text-lg font-bold text-white">Analytics</h1>
                <p className="text-xs text-muted-foreground/50 mt-0.5">
                  Deep dive into platform usage and verification metrics
                </p>
              </div>

              {loading ? (
                <DashboardSkeleton />
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              ) : analytics ? (
                <div className="grid gap-4 md:grid-cols-2">
                  
                  {/* Top Recipients Chart */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Top Recipients</h3>
                    {topRecipientsData.length === 0 ? (
                      <div className="flex items-center justify-center h-[250px] text-xs text-muted-foreground/40">
                        No data yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topRecipientsData} layout="vertical" margin={{ left: 20 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: "rgba(138,138,138,0.7)" }} 
                            width={100} 
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="count" fill="rgba(255,255,255,0.8)" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Activity By Type Chart */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Activity Breakdown</h3>
                    {activityByTypeData.length === 0 ? (
                      <div className="flex items-center justify-center h-[250px] text-xs text-muted-foreground/40">
                        No data yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={activityByTypeData} margin={{ bottom: 20 }}>
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: "rgba(138,138,138,0.7)", angle: -45, textAnchor: 'end' }} 
                          />
                          <YAxis hide />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="count" fill="#3b82f6" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="md:col-span-2 grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <p className="text-2xl font-bold text-white">{analytics.verificationRate || 0}%</p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase font-medium mt-1">Verification Rate</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <p className="text-2xl font-bold text-white">{analytics.totalUploads || 0}</p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase font-medium mt-1">Total Uploads</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <p className="text-2xl font-bold text-white">{analytics.activeUsers || 0}</p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase font-medium mt-1">Active Users</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <p className="text-2xl font-bold text-white">{analytics.avgDocumentsPerUser || 0}</p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase font-medium mt-1">Avg Docs/User</p>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
