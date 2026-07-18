import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SortableHeadProps<T> {
  label: string;
  sortKey: T;
  currentSort: { key: T; dir: "asc" | "desc" } | null;
  onSort: (key: T) => void;
  className?: string;
}

export function SortableHead<T extends string>({ label, sortKey, currentSort, onSort, className }: SortableHeadProps<T>) {
  const isActive = currentSort?.key === sortKey;
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          "flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
        {isActive ? (
          currentSort?.dir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}
