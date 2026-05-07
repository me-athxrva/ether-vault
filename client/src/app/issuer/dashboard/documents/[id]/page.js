"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { DocumentDetail } from "@/components/dashboard/detail-views";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  ArrowLeftIcon,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  BarChart3Icon,
  UploadIcon,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function IssuerDocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const {
    data: docData,
    loading,
    error,
    refetch,
  } = useDashboardData(`/api/dashboard/issuer/documents/${params.id}`, {
    autoFetch: !sessionLoading && session?.role === "admin" && !!params.id,
  });

  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!window.confirm("Are you sure you want to revoke this document? This action cannot be undone and will mark the document as invalid.")) {
      return;
    }

    setRevoking(true);
    try {
      const res = await fetch(`/api/document/revoke/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      
      if (res.ok && data.status === "success") {
        await refetch();
      } else {
        alert(data.message || "Failed to revoke document");
      }
    } catch (err) {
      alert("Network error occurred");
    } finally {
      setRevoking(false);
    }
  };

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
      { title: "Documents", url: "/issuer/dashboard/documents", icon: <FileTextIcon />, isActive: true },
      { title: "Upload", url: "/issuer/dashboard/upload", icon: <UploadIcon /> },
      { title: "Activity", url: "/issuer/dashboard/activity", icon: <ActivityIcon /> },
      { title: "Analytics", url: "/issuer/dashboard/analytics", icon: <BarChart3Icon /> },
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
            <div className="flex flex-1 flex-col gap-5 p-6">
              {/* Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/issuer/dashboard/documents")}
                className="w-fit h-7 px-2 text-xs text-muted-foreground/50 hover:text-white"
              >
                <ArrowLeftIcon className="size-3.5 mr-1" />
                Back to Documents
              </Button>

              {loading ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/6 bg-white/2 p-5">
                    <Skeleton className="h-6 w-48 mb-3" />
                    <Skeleton className="h-3 w-32 mb-6" />
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full mb-2" />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              ) : docData ? (
                <div className="grid gap-4 lg:grid-cols-5">
                  <div className="lg:col-span-3">
                    <DocumentDetail 
                      document={docData.document} 
                      onRevoke={handleRevoke}
                      isRevoking={revoking}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <ActivityFeed
                      activities={docData.activityLogs || []}
                      title="Document Activity"
                    />
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
