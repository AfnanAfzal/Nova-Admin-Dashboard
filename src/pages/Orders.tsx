import { useState } from "react";
import { MoreHorizontal, ShoppingCart, Trash2, Eye, Download, MapPin, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SortableHead } from "@/components/common/SortableHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrders";
import { useTable } from "@/hooks/useTable";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function Orders() {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const table = useTable<Order>({
    data: orders,
    searchKeys: ["id", "customer", "email"],
    initialSort: { key: "date", dir: "desc" },
    filterFn: (o) =>
      (statusFilter === "all" || o.status === statusFilter) && (paymentFilter === "all" || o.paymentStatus === paymentFilter),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Track and manage customer orders across your platform"
        actions={
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchInput value={table.search} onChange={table.setSearch} placeholder="Search by order ID, customer..." className="sm:max-w-xs" />
          <div className="flex gap-2">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : table.isEmpty ? (
          <EmptyState icon={ShoppingCart} title="No orders found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label="Order ID" sortKey="id" currentSort={table.sort} onSort={table.toggleSort} />
                  <TableHead>Customer</TableHead>
                  <SortableHead label="Date" sortKey="date" currentSort={table.sort} onSort={table.toggleSort} />
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableHead label="Total" sortKey="total" currentSort={table.sort} onSort={table.toggleSort} className="text-right" />
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.data.map((order) => (
                  <TableRow key={order.id}>
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
                      <StatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v as OrderStatus })}
                      >
                        <SelectTrigger className="h-8 w-[130px] border-none bg-muted text-xs font-medium shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-display text-sm font-semibold">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive onClick={() => setDeletingOrder(order)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={table.page}
              pageSize={table.pageSize}
              total={table.total}
              onPageChange={table.setPage}
              onPageSizeChange={table.setPageSize}
            />
          </>
        )}
      </Card>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-lg">
          {viewingOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order {viewingOrder.id}
                  <StatusBadge status={viewingOrder.status} />
                </DialogTitle>
                <DialogDescription>Placed on {formatDate(viewingOrder.date)}</DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={viewingOrder.customerAvatar} alt={viewingOrder.customer} />
                  <AvatarFallback>{initials(viewingOrder.customer)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{viewingOrder.customer}</p>
                  <p className="text-xs text-muted-foreground">{viewingOrder.email}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
                <div className="space-y-2 rounded-xl border border-border p-3">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>
                        {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                      </span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-display text-sm font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(viewingOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2 rounded-xl border border-border p-3">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium">{viewingOrder.paymentMethod}</p>
                    <StatusBadge status={viewingOrder.paymentStatus} className="mt-1" />
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-border p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping</p>
                    <p className="font-medium">{viewingOrder.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
        title="Delete this order?"
        description={`This will permanently remove order ${deletingOrder?.id} from your records.`}
        confirmLabel="Delete Order"
        loading={deleteOrder.isPending}
        onConfirm={async () => {
          if (deletingOrder) {
            await deleteOrder.mutateAsync(deletingOrder.id);
            setDeletingOrder(null);
          }
        }}
      />
    </div>
  );
}
