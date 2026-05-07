"use client";

import {
  UploadIcon,
  ShieldCheckIcon,
  XCircleIcon,
  LogInIcon,
  LogOutIcon,
  ArchiveIcon,
} from "lucide-react";

const typeConfig = {
  document_upload: {
    icon: UploadIcon,
    color: "text-blue-400/80",
    bg: "bg-blue-500/10",
    border: "border-blue-500/10",
  },
  verification_success: {
    icon: ShieldCheckIcon,
    color: "text-emerald-400/80",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/10",
  },
  verification_failed: {
    icon: XCircleIcon,
    color: "text-red-400/80",
    bg: "bg-red-500/10",
    border: "border-red-500/10",
  },
  login: {
    icon: LogInIcon,
    color: "text-purple-400/80",
    bg: "bg-purple-500/10",
    border: "border-purple-500/10",
  },
  logout: {
    icon: LogOutIcon,
    color: "text-amber-400/80",
    bg: "bg-amber-500/10",
    border: "border-amber-500/10",
  },
  document_revoke: {
    icon: ArchiveIcon,
    color: "text-orange-400/80",
    bg: "bg-orange-500/10",
    border: "border-orange-500/10",
  },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function ActivityFeed({ activities = [], title = "Recent Activity" }) {
  if (!activities.length) {
    return (
      <div className="rounded-xl border border-white/6 bg-white/2 p-6">
        <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-10 w-10 rounded-full bg-white/4 flex items-center justify-center mb-3">
            <ShieldCheckIcon className="size-5 text-muted-foreground/40" />
          </div>
          <p className="text-xs text-muted-foreground/50 font-medium">
            No activity yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-1">
        {activities.map((activity) => {
          const config = typeConfig[activity.type] || typeConfig.login;
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/3"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${config.bg} border ${config.border} mt-0.5`}
              >
                <Icon className={`size-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/80 leading-snug truncate">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {activity.user && (
                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                      {activity.user.name || activity.user.email}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/30">
                    {timeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
