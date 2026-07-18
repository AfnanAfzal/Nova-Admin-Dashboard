import { Users, Package, ShoppingCart, Wallet } from "lucide-react";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopSellers } from "@/components/dashboard/TopSellers";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PendingActions } from "@/components/dashboard/PendingActions";
import { LatestOrdersTable } from "@/components/dashboard/LatestOrdersTable";
import { OrdersOverviewChart } from "@/components/dashboard/OrdersOverviewChart";
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart";
import { formatCurrency } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    label: "Total Users",
    value: "12,543",
    delta: 12.5,
    progress: 75,
    progressLabel: "vs last month: 11,156",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    barColor: "bg-primary",
  },
  {
    icon: Package,
    label: "Total Products",
    value: "3,842",
    delta: 8.2,
    progress: 62,
    progressLabel: "vs last month: 3,551",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    barColor: "bg-success",
  },
  {
    icon: ShoppingCart,
    label: "Total Orders",
    value: "9,238",
    delta: 15.3,
    progress: 85,
    progressLabel: "vs last month: 8,012",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
    barColor: "bg-violet-500",
  },
  {
    icon: Wallet,
    label: "Total Revenue",
    value: formatCurrency(2400000),
    delta: 23.1,
    progress: 90,
    progressLabel: "vs last month: " + formatCurrency(1950000),
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    barColor: "bg-warning",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      <WelcomeBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart />
        <RecentActivity />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OrdersOverviewChart />
        <CategoryBreakdownChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <QuickActions />
        <TopSellers />
      </div>

      <PendingActions />

      <LatestOrdersTable />
    </div>
  );
}
