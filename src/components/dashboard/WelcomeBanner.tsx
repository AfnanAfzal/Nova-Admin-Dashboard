import { motion } from "framer-motion";
import { Download, RefreshCw, ShoppingBag, UserPlus, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const quickStats = [
  { icon: ShoppingBag, label: "Today's Orders", value: "58", delta: "+14.2%" },
  { icon: UserPlus, label: "New Users", value: "31", delta: "+9.4%" },
  { icon: Wallet, label: "Revenue Today", value: formatCurrency(96400), delta: "+21.6%" },
  { icon: TrendingUp, label: "Conversion Rate", value: "3.68%", delta: "+0.6%" },
];

export function WelcomeBanner() {
  const user = useAuthStore((s) => s.user);
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 via-primary-600 to-primary-500 p-6 text-white shadow-elevated sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_10%,white,transparent_30%),radial-gradient(circle_at_90%_90%,white,transparent_35%)]" />
      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋
            </h2>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">{today}</span>
          </div>
          <p className="mt-1.5 max-w-lg text-sm text-white/75">
            Here's how your platform is performing today. Revenue is trending up 18% versus last week.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" className="bg-white/15 text-white hover:bg-white/25">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="secondary" size="icon-sm" className="bg-white/15 text-white hover:bg-white/25">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <stat.icon className="h-4 w-4 text-white/70" />
              <span className="text-[11px] font-semibold text-emerald-300">{stat.delta}</span>
            </div>
            <p className="mt-2 font-display text-xl font-bold sm:text-2xl">{stat.value}</p>
            <p className="text-xs text-white/65">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
