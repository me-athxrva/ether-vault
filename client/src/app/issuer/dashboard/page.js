"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { Loader2 } from "lucide-react";

// Dashboard components
import { StatCards } from "@/components/dashboard/stat-cards";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DocumentsTable } from "@/components/dashboard/documents-table";
import { UploadsChart, StatusChart } from "@/components/dashboard/charts";
import { QuickMetrics } from "@/components/dashboard/detail-views";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import {
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  BarChart3Icon,
  UploadIcon,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function IssuerDashboard() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  // Fetch dashboard data
  const {
    data: dashboard,
    loading: dashLoading,
    error,
  } = useDashboardData("/api/dashboard/issuer", {
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

  if (!session || session.role !== "admin") {
    return null;
  }

  const sidebarData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/issuer/dashboard",
        icon: <LayoutDashboardIcon />,
        isActive: true,
      },
      {
        title: "Documents",
        url: "/issuer/dashboard/documents",
        icon: <FileTextIcon />,
      },
      {
        title: "Upload",
        url: "/issuer/dashboard/upload",
        icon: <UploadIcon />,
      },
      {
        title: "Activity",
        url: "/issuer/dashboard/activity",
        icon: <ActivityIcon />,
      },
      {
        title: "Analytics",
        url: "/issuer/dashboard/analytics",
        icon: <BarChart3Icon />,
      },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Feedback", url: "#", icon: <SendIcon /> },
    ],
    projects: [],
  };

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={sidebarData} />
          <SidebarInset>
            {dashLoading ? (
              <DashboardSkeleton />
            ) : error ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                  <p className="text-sm text-red-400/80 mb-2">
                    Failed to load dashboard
                  </p>
                  <p className="text-xs text-muted-foreground/40">{error}</p>
                </div>
              </div>
            ) : dashboard ? (
              <div className="flex flex-1 flex-col gap-5 p-6 animate-in fade-in duration-500">
                {/* Section: Stats */}
                <StatCards
                  stats={dashboard.stats}
                  trend={dashboard.quickMetrics?.recentTrend}
                />

                {/* Section: Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                  <UploadsChart
                    data={dashboard.chartData?.uploadsPerDay}
                    title="Uploads — Last 30 Days"
                  />
                  <StatusChart
                    data={dashboard.chartData?.statusDistribution}
                    title="Document Status"
                  />
                </div>

                {/* Section: Recent Documents + Activity */}
                <div className="grid gap-4 lg:grid-cols-5">
                  <div className="lg:col-span-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Recent Documents
                      </h3>
                      <button
                        onClick={() =>
                          router.push("/issuer/dashboard/documents")
                        }
                        className="text-[10px] text-muted-foreground/50 hover:text-white uppercase tracking-widest font-bold transition-colors"
                      >
                        View All →
                      </button>
                    </div>
                    <DocumentsTable
                      documents={dashboard.recentDocuments}
                      role="admin"
                      onDocumentClick={(id) =>
                        router.push(`/issuer/dashboard/documents/${id}`)
                      }
                    />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <ActivityFeed activities={dashboard.recentActivity} />
                    <QuickMetrics metrics={dashboard.quickMetrics} />
                  </div>
                </div>
              </div>
            ) : null}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
