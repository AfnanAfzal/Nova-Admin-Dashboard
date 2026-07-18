import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import messagesData from "@/data/messages.json";
import type { Message } from "@/types";
import { sleep } from "@/lib/utils";

let messagesStore: Message[] = messagesData as Message[];

async function fetchMessages(): Promise<Message[]> {
  await sleep(450);
  return messagesStore;
}

export function useMessages() {
  return useQuery({ queryKey: ["messages"], queryFn: fetchMessages });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      await sleep(200);
      messagesStore = messagesStore.map((m) => (m.id === id ? { ...m, read } : m));
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useToggleStar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(200);
      messagesStore = messagesStore.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m));
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(300);
      messagesStore = messagesStore.filter((m) => m.id !== id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
}
