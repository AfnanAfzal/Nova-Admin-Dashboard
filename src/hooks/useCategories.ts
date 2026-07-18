import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoriesData from "@/data/categories.json";
import type { Category } from "@/types";
import { sleep } from "@/lib/utils";

let categoriesStore: Category[] = categoriesData as Category[];

async function fetchCategories(): Promise<Category[]> {
  await sleep(450);
  return categoriesStore;
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: Omit<Category, "id" | "createdAt" | "productsCount">) => {
      await sleep(400);
      const newCategory: Category = {
        ...category,
        id: `CAT-${100 + categoriesStore.length + Math.floor(Math.random() * 99)}`,
        productsCount: 0,
        createdAt: new Date().toISOString(),
      };
      categoriesStore = [newCategory, ...categoriesStore];
      return newCategory;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: Category) => {
      await sleep(400);
      categoriesStore = categoriesStore.map((c) => (c.id === category.id ? category : c));
      return category;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(400);
      categoriesStore = categoriesStore.filter((c) => c.id !== id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
