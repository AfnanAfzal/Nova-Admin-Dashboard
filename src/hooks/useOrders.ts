import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ordersData from "@/data/orders.json";
import type { Order, OrderStatus } from "@/types";
import { sleep } from "@/lib/utils";

let ordersStore: Order[] = ordersData as Order[];

async function fetchOrders(): Promise<Order[]> {
  await sleep(500);
  return ordersStore;
}

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      await sleep(350);
      ordersStore = ordersStore.map((o) => (o.id === id ? { ...o, status } : o));
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(350);
      ordersStore = ordersStore.filter((o) => o.id !== id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
