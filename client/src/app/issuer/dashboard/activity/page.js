"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  BarChart3Icon,
  UploadIcon,
  LifeBuoyIcon,
  SendIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function IssuerActivityPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const [page, setPage] = useState(1);
  const [type, setType] = useState("");

  const {
    data: activityData,
    loading,
    error,
  } = useDashboardData("/api/dashboard/issuer/activity", {
    autoFetch: !sessionLoading && session?.role === "admin",
    params: { page, type, limit: 20 },
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
      { title: "Activity", url: "/issuer/dashboard/activity", icon: <ActivityIcon />, isActive: true },
      { title: "Analytics", url: "/issuer/dashboard/analytics", icon: <BarChart3Icon /> },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Feedback", url: "#", icon: <SendIcon /> },
    ],
    projects: [],
  };

  const pagination = activityData?.pagination;

  const typeFilters = [
    { value: "", label: "All" },
    { value: "document_upload", label: "Uploads" },
    { value: "document_revoke", label: "Revocations" },
    { value: "verification_success", label: "Verified" },
    { value: "verification_failed", label: "Failed" },
    { value: "login", label: "Logins" },
  ];

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={sidebarData} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <div>
                <h1 className="text-lg font-bold text-white">Activity Log</h1>
                <p className="text-xs text-muted-foreground/50 mt-0.5">
                  {pagination
                    ? `${pagination.total} total events`
                    : "Loading..."}
                </p>
              </div>

              {/* Type filters */}
              <div className="flex flex-wrap gap-1.5">
                {typeFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setType(f.value); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                      type === f.value
                        ? "bg-white/[0.08] text-white border border-white/[0.1]"
                        : "text-muted-foreground/40 hover:text-muted-foreground/60 border border-transparent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <DashboardSkeleton />
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              ) : (
                <>
                  <div className="max-w-2xl">
                    <ActivityFeed
                      activities={activityData?.activities || []}
                      title=""
                    />
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2 max-w-2xl">
                      <p className="text-[11px] text-muted-foreground/40">
                        Page {pagination.page} of {pagination.totalPages}
                      </p>
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!pagination.hasPrevPage}
                          onClick={() => setPage((p) => p - 1)}
                          className="h-7 px-2 rounded-lg border-white/[0.06] text-xs"
                        >
                          <ChevronLeftIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!pagination.hasNextPage}
                          onClick={() => setPage((p) => p + 1)}
                          className="h-7 px-2 rounded-lg border-white/[0.06] text-xs"
                        >
                          <ChevronRightIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
