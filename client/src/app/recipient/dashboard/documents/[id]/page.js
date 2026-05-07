"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { DocumentDetail } from "@/components/dashboard/detail-views";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  ArrowLeftIcon,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function RecipientDocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const {
    data: docData,
    loading,
    error,
  } = useDashboardData(`/api/dashboard/recipient/documents/${params.id}`, {
    autoFetch: !sessionLoading && session?.role === "user" && !!params.id,
  });

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || session.role !== "user") {
        router.replace("/recipient/login");
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

  if (!session || session.role !== "user") return null;

  const sidebarData = {
    navMain: [
      { title: "Dashboard", url: "/recipient/dashboard", icon: <LayoutDashboardIcon /> },
      { title: "My Documents", url: "/recipient/dashboard/documents", icon: <FileTextIcon />, isActive: true },
      { title: "Activity", url: "/recipient/dashboard/activity", icon: <ActivityIcon /> },
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/recipient/dashboard/documents")}
                className="w-fit h-7 px-2 text-xs text-muted-foreground/50 hover:text-white"
              >
                <ArrowLeftIcon className="size-3.5 mr-1" />
                Back to Documents
              </Button>

              {loading ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
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
                <div className="max-w-3xl">
                  <DocumentDetail document={docData.document} />
                </div>
              ) : null}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
