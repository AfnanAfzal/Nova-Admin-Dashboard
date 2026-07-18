import { ShoppingBag, UserPlus, Package, Star, Settings2, Radio } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useActivity } from "@/hooks/useDashboardData";
import { initials, timeAgo, cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG: Record<string, { icon: any; bg: string; color: string }> = {
  order: { icon: ShoppingBag, bg: "bg-primary/10", color: "text-primary" },
  user: { icon: UserPlus, bg: "bg-success/10", color: "text-success" },
  product: { icon: Package, bg: "bg-violet-500/10", color: "text-violet-600" },
  review: { icon: Star, bg: "bg-warning/10", color: "text-warning" },
  system: { icon: Settings2, bg: "bg-muted", color: "text-muted-foreground" },
};

export function RecentActivity() {
  const { data: activity = [], isLoading } = useActivity();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Live Activity</CardTitle>
          <CardDescription>Real-time updates</CardDescription>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          <Radio className="h-3 w-3 animate-pulse" /> Live
        </span>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </div>
          ))
        ) : activity.length === 0 ? (
          <EmptyState title="No recent activity" description="New actions from your users will show up here." />
        ) : (
          <>
            {activity.slice(0, 5).map((item) => {
              const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
              const Icon = config.icon;
              return (
                <div key={item.id} className="flex items-start gap-3 rounded-xl px-1 py-2.5 transition-colors hover:bg-muted/50">
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.avatar} alt={item.actor} />
                      <AvatarFallback>{initials(item.actor)}</AvatarFallback>
                    </Avatar>
                    <div className={cn("absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-2 ring-card", config.bg)}>
                      <Icon className={cn("h-2.5 w-2.5", config.color)} />
                    </div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{item.actor}</span> {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.timestamp)}</p>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => navigate("/notifications")}
              className="mt-2 w-full rounded-lg py-2 text-center text-sm font-medium text-primary hover:bg-accent"
            >
              View All Activities
            </button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
