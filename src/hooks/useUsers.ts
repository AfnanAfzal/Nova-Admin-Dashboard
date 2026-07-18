import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usersData from "@/data/users.json";
import type { User } from "@/types";
import { sleep } from "@/lib/utils";

let usersStore: User[] = usersData as User[];

async function fetchUsers(): Promise<User[]> {
  await sleep(500);
  return usersStore;
}

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user: Omit<User, "id">) => {
      await sleep(400);
      const newUser: User = { ...user, id: `USR-${1000 + usersStore.length + Math.floor(Math.random() * 999)}` };
      usersStore = [newUser, ...usersStore];
      return newUser;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      await sleep(400);
      usersStore = usersStore.map((u) => (u.id === user.id ? user : u));
      return user;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(400);
      usersStore = usersStore.filter((u) => u.id !== id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
