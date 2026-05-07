"use client";

import {
  FileTextIcon,
  ShieldCheckIcon,
  XCircleIcon,
  UploadIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  ActivityIcon,
} from "lucide-react";

const iconMap = {
  totalDocuments: FileTextIcon,
  activeDocuments: ShieldCheckIcon,
  revokedDocuments: XCircleIcon,
  totalVerifications: ActivityIcon,
  documentsUploadedThisWeek: CalendarIcon,
  documentsUploadedThisMonth: UploadIcon,
  totalReceivedDocuments: FileTextIcon,
};

const labelMap = {
  totalDocuments: "Total Documents",
  activeDocuments: "Active Documents",
  revokedDocuments: "Revoked",
  totalVerifications: "Total Verifications",
  documentsUploadedThisWeek: "This Week",
  documentsUploadedThisMonth: "This Month",
  totalReceivedDocuments: "Received Documents",
};

export function StatCards({ stats = {}, trend = null }) {
  const entries = Object.entries(stats);

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
      {entries.map(([key, value]) => {
        const Icon = iconMap[key] || FileTextIcon;
        const label = labelMap[key] || key;

        return (
          <div
            key={key}
            className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.06]">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              {key === "documentsUploadedThisWeek" && trend && (
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                    trend.trend === "up"
                      ? "text-emerald-400/80"
                      : "text-red-400/80"
                  }`}
                >
                  {trend.trend === "up" ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {Math.abs(trend.changePercent)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold tracking-tight text-white">
              {value?.toLocaleString?.() ?? value}
            </p>
            <p className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
