import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopSellers } from "@/hooks/useDashboardData";
import { initials, formatCompactNumber, cn } from "@/lib/utils";

const RANK_STYLES = [
  "bg-gradient-to-br from-amber-300 to-amber-500 text-white",
  "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  "bg-gradient-to-br from-orange-300 to-orange-500 text-white",
];

export function TopSellers() {
  const { data: sellers = [], isLoading } = useTopSellers();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Top Sellers</CardTitle>
          <CardDescription>This month's leaders</CardDescription>
        </div>
        <button onClick={() => navigate("/analytics")} className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline">
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))
          : sellers.slice(0, 3).map((seller) => (
              <div key={seller.id} className="flex items-center gap-3 rounded-xl px-1 py-3 transition-colors hover:bg-muted/50">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold shadow-soft",
                    RANK_STYLES[seller.rank - 1] ?? "bg-muted text-muted-foreground"
                  )}
                >
                  {seller.rank}
                </div>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={seller.avatar} alt={seller.name} />
                  <AvatarFallback>{initials(seller.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{seller.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {seller.orders.toLocaleString()} orders •{" "}
                    <span className={cn("flex items-center font-medium", seller.growth >= 0 ? "text-success" : "text-destructive")}>
                      {seller.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(seller.growth)}%
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm font-bold">${formatCompactNumber(seller.revenue)}</p>
                  <p className="text-[11px] text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
