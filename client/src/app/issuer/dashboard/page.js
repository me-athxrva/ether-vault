"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { Loader2 } from "lucide-react";
import AccessDenied from "@/components/access-denied";
import { useSessionStore } from "@/store/useSessionStore";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react"

export const iframeHeight = "800px";
export const dynamic = "force-dynamic";
export const description = "A sidebar with a header and a search form.";

export default function Dashboard() {
  const router = useRouter();
  const { session, loading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  useEffect(() => {
    if (!loading) {
      if (!session || session.role !== "admin") {
        router.replace("/issuer/login");
      }
    }
    if (!loading && session) {
      setSession(session);
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session || session.role !== "admin") {
    return null;
  }

  const data = {
    navMain: [
      {
        title: "Playground2",
        url: "#",
        icon: <TerminalSquareIcon />,
        isActive: false,
        items: [
          { title: "History", url: "#" },
          { title: "Starred", url: "#" },
          { title: "Settings", url: "#" },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: <BotIcon />,
        items: [
          { title: "Genesis", url: "#" },
          { title: "Explorer", url: "#" },
          { title: "Quantum", url: "#" },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: <BookOpenIcon />,
        items: [
          { title: "Introduction", url: "#" },
          { title: "Get Started", url: "#" },
          { title: "Tutorials", url: "#" },
          { title: "Changelog", url: "#" },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: <Settings2Icon />,
        items: [
          { title: "General", url: "#" },
          { title: "Team", url: "#" },
          { title: "Billing", url: "#" },
          { title: "Limits", url: "#" },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: <FrameIcon />,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Travel",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  };

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={data} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
