import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevenue } from "@/hooks/useDashboardData";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

const COLORS = ["#3457F7", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

function Tip({ active, payload, label, prefix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-elevated">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { data: revenue = [], isLoading: revLoading } = useRevenue();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const [range, setRange] = useState<"6m" | "12m">("12m");

  const chartData = range === "6m" ? revenue.slice(-6) : revenue;

  const topProducts = useMemo(() => [...products].sort((a, b) => b.sales - a.sales).slice(0, 5), [products]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => (counts[o.status] = (counts[o.status] ?? 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const kpis = [
    { icon: DollarSign, label: "Total Revenue (YTD)", value: formatCurrency(revenue.reduce((s, r) => s + r.revenue, 0)), delta: "+18.4%" },
    { icon: ShoppingBag, label: "Total Orders", value: orders.length.toLocaleString(), delta: "+11.2%" },
    { icon: Users, label: "Avg Order Value", value: formatCurrency(orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0), delta: "+4.7%" },
    { icon: TrendingUp, label: "Repeat Purchase Rate", value: "34.8%", delta: "+2.1%" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep insights into your platform's performance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">{kpi.delta}</span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{kpi.value}</p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Revenue vs Target</CardTitle>
            <CardDescription>Actual performance against monthly targets</CardDescription>
          </div>
          <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
            <TabsList>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="12m">12M</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {revLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={formatCompactNumber} width={48} />
                  <Tooltip content={<Tip prefix="$" />} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
            <CardDescription>Distribution of orders by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} cornerRadius={6}>
                    {statusBreakdown.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Ranked by total units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="4 6" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={130}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip content={<Tip />} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="sales" name="Units sold" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Order Volume</CardTitle>
          <CardDescription>Total number of orders placed each month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -12, right: 8 }}>
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={40} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="orders" name="Orders" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#ordersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
