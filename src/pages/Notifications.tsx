import { CheckCircle2, Info, AlertTriangle, XCircle, BellOff } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { timeAgo, cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = { CheckCircle2, Info, AlertTriangle, XCircle };
const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  success: { bg: "bg-success/10", color: "text-success" },
  info: { bg: "bg-primary/10", color: "text-primary" },
  warning: { bg: "bg-warning/10", color: "text-warning" },
  error: { bg: "bg-destructive/10", color: "text-destructive" },
};

export default function Notifications() {
  const { data: notifications = [], isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notifications`}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}>
              Mark all as read
            </Button>
          )
        }
      />

      <Card className="divide-y divide-border p-0">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : notifications.length === 0 ? (
          <EmptyState icon={BellOff} title="You're all caught up" description="New notifications will appear here." />
        ) : (
          notifications.map((n) => {
            const Icon = ICON_MAP[n.icon] ?? Info;
            const style = TYPE_STYLE[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markRead.mutate(n.id)}
                className={cn("flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-muted/40", !n.read && "bg-primary/[0.03]")}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.bg, style.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })
        )}
      </Card>
    </div>
  );
}
