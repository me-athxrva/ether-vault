"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSessionStore } from "@/store/useSessionStore";
import { DocumentsTable } from "@/components/dashboard/documents-table";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  LifeBuoyIcon,
  SendIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function RecipientDocumentsPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const {
    data: docData,
    loading,
    error,
  } = useDashboardData("/api/dashboard/recipient/documents", {
    autoFetch: !sessionLoading && session?.role === "user",
    params: { page, search, status, sort, limit: 15 },
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

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

  const pagination = docData?.pagination;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={sidebarData} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <div>
                <h1 className="text-lg font-bold text-white">My Documents</h1>
                <p className="text-xs text-muted-foreground/50 mt-0.5">
                  {pagination
                    ? `${pagination.total} documents received`
                    : "Loading..."}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 h-8 text-xs rounded-lg border-white/[0.06] bg-white/[0.02] focus:border-white/[0.12]"
                  />
                </form>

                <div className="flex gap-1.5">
                  {["", "active", "revoked"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                        status === s
                          ? "bg-white/[0.08] text-white border border-white/[0.1]"
                          : "text-muted-foreground/40 hover:text-muted-foreground/60 border border-transparent"
                      }`}
                    >
                      {s === "" ? "All" : s}
                    </button>
                  ))}
                </div>

                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="h-8 px-2 rounded-lg text-[10px] uppercase tracking-widest font-bold bg-white/[0.02] border border-white/[0.06] text-muted-foreground/60 focus:outline-none"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {loading ? (
                <DashboardSkeleton />
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              ) : (
                <>
                  <DocumentsTable
                    documents={docData?.documents || []}
                    role="user"
                    onDocumentClick={(id) =>
                      router.push(`/recipient/dashboard/documents/${id}`)
                    }
                  />

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
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
