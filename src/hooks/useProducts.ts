import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import { sleep } from "@/lib/utils";

let productsStore: Product[] = productsData as Product[];

async function fetchProducts(): Promise<Product[]> {
  await sleep(500);
  return productsStore;
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      await sleep(400);
      const newProduct: Product = { ...product, id: `PRD-${3000 + productsStore.length + Math.floor(Math.random() * 999)}` };
      productsStore = [newProduct, ...productsStore];
      return newProduct;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      await sleep(400);
      productsStore = productsStore.map((p) => (p.id === product.id ? product : p));
      return product;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sleep(400);
      productsStore = productsStore.filter((p) => p.id !== id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
