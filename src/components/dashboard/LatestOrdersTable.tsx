import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { Inbox } from "lucide-react";

export function LatestOrdersTable() {
  const { data: orders = [], isLoading } = useOrders();
  const navigate = useNavigate();
  const latest = orders.slice(0, 6);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Latest Orders</CardTitle>
          <CardDescription>Most recent transactions across the platform</CardDescription>
        </div>
        <button onClick={() => navigate("/orders")} className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline">
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : latest.length === 0 ? (
          <EmptyState icon={Inbox} title="No orders yet" description="New orders will appear here as they come in." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latest.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate("/orders")}>
                  <TableCell className="font-mono text-xs font-medium text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={order.customerAvatar} alt={order.customer} />
                        <AvatarFallback className="text-[10px]">{initials(order.customer)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{order.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right font-display text-sm font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
