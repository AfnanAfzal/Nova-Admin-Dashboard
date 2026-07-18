import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notificationsData from "@/data/notifications.json";
import type { NotificationItem } from "@/types";
import { sleep } from "@/lib/utils";

let notifStore: NotificationItem[] = notificationsData as NotificationItem[];

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationItem[]> => {
      await sleep(350);
      return notifStore;
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(150);
      notifStore = notifStore.map((n) => (n.id === id ? { ...n, read: true } : n));
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await sleep(200);
      notifStore = notifStore.map((n) => ({ ...n, read: true }));
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
