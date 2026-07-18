import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number;
  progress: number;
  progressLabel: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
  index?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  progress,
  progressLabel,
  iconBg,
  iconColor,
  barColor,
  index = 0,
}: StatCardProps) {
  const isPositive = delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg, iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        </div>
        <p className="mt-4 font-display text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn("h-full rounded-full", barColor)}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{progressLabel}</p>
        </div>
      </Card>
    </motion.div>
  );
}
