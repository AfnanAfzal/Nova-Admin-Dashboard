import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenue } from "@/hooks/useDashboardData";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-elevated">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-sm font-bold text-primary">{formatCurrency(payload[0].value)}</p>
      <p className="text-xs text-muted-foreground">{payload[0].payload.orders} orders</p>
    </div>
  );
}

export function RevenueChart() {
  const { data, isLoading, isError, refetch } = useRevenue();
  const [range, setRange] = useState<"6m" | "12m">("6m");

  const chartData = useMemo(() => {
    if (!data) return [];
    return range === "6m" ? data.slice(-6) : data;
  }, [data, range]);

  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const avgOrders = chartData.length ? Math.round(chartData.reduce((s, d) => s + d.orders, 0) / chartData.length) : 0;

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Comprehensive revenue performance metrics</CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
          <TabsList>
            <TabsTrigger value="6m">6 Months</TabsTrigger>
            <TabsTrigger value="12m">12 Months</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : isError ? (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            Failed to load chart.{" "}
            <button onClick={() => refetch()} className="ml-1 font-medium text-primary hover:underline">
              Retry
            </button>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => formatCompactNumber(v)}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Revenue", value: formatCurrency(totalRevenue), bg: "bg-primary/5", text: "text-primary" },
            { label: "Growth Rate", value: "+18.5%", bg: "bg-success/5", text: "text-success" },
            { label: "Avg / Month", value: formatCurrency(Math.round(totalRevenue / (chartData.length || 1))), bg: "bg-violet-500/5", text: "text-violet-600" },
            { label: "Avg Orders", value: String(avgOrders), bg: "bg-warning/5", text: "text-warning" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3.5 ${s.bg}`}>
              <p className={`font-display text-lg font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
