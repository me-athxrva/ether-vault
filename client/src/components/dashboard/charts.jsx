"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  active: "#34d399",
  revoked: "#f87171",
};

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
            {entry.name === "count" ? "uploads" : entry.name}
          </span>
        </p>
      ))}
    </div>
  );
}

export function UploadsChart({ data = [], title = "Upload Activity" }) {
  // Fill missing days with 0
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
    count: d.count,
  }));

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground/40">
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "rgba(138,138,138,0.4)",
                fontFamily: "var(--font-body)",
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "rgba(138,138,138,0.3)",
              }}
              width={30}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
              fill="url(#uploadGrad)"
              dot={false}
              activeDot={{
                r: 3,
                fill: "#fff",
                stroke: "rgba(255,255,255,0.3)",
                strokeWidth: 4,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function StatusChart({ data = [], title = "Document Status" }) {
  const chartData = data.map((d) => ({
    name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    value: d.count,
    fill: COLORS[d.status] || "#8a8a8a",
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-xs text-muted-foreground/40">
          No data yet
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="w-[140px] h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-xs text-muted-foreground/60">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {entry.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground/30">
                    {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
