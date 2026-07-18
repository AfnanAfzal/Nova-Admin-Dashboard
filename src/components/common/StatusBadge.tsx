import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { variant: "success" | "warning" | "destructive" | "secondary" | "default"; dot: string }> = {
  Active: { variant: "success", dot: "bg-success" },
  "In Stock": { variant: "success", dot: "bg-success" },
  Delivered: { variant: "success", dot: "bg-success" },
  Paid: { variant: "success", dot: "bg-success" },
  Completed: { variant: "success", dot: "bg-success" },
  Pending: { variant: "warning", dot: "bg-warning" },
  Processing: { variant: "warning", dot: "bg-warning" },
  "Low Stock": { variant: "warning", dot: "bg-warning" },
  Unpaid: { variant: "warning", dot: "bg-warning" },
  Shipped: { variant: "default", dot: "bg-primary" },
  Inactive: { variant: "secondary", dot: "bg-muted-foreground" },
  Discontinued: { variant: "secondary", dot: "bg-muted-foreground" },
  Suspended: { variant: "destructive", dot: "bg-destructive" },
  Cancelled: { variant: "destructive", dot: "bg-destructive" },
  Refunded: { variant: "destructive", dot: "bg-destructive" },
  Failed: { variant: "destructive", dot: "bg-destructive" },
  "Out of Stock": { variant: "destructive", dot: "bg-destructive" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_MAP[status] ?? { variant: "secondary" as const, dot: "bg-muted-foreground" };
  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {status}
    </Badge>
  );
}
