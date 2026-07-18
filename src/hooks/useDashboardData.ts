import { useQuery } from "@tanstack/react-query";
import revenueData from "@/data/revenue.json";
import activityData from "@/data/activity.json";
import topSellersData from "@/data/topSellers.json";
import type { RevenuePoint, ActivityItem, TopSeller } from "@/types";
import { sleep } from "@/lib/utils";

export function useRevenue() {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: async (): Promise<RevenuePoint[]> => {
      await sleep(500);
      return revenueData as RevenuePoint[];
    },
  });
}

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async (): Promise<ActivityItem[]> => {
      await sleep(500);
      return activityData as ActivityItem[];
    },
  });
}

export function useTopSellers() {
  return useQuery({
    queryKey: ["topSellers"],
    queryFn: async (): Promise<TopSeller[]> => {
      await sleep(500);
      return topSellersData as TopSeller[];
    },
  });
}
