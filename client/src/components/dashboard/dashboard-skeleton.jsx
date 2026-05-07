"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6 animate-in fade-in duration-500">
      {/* Stat cards skeleton */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <Skeleton className="h-8 w-8 rounded-lg mb-3" />
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>

      {/* Table + Activity skeleton */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Skeleton className="h-4 w-28 mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <Skeleton className="h-7 w-7 rounded-md shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
