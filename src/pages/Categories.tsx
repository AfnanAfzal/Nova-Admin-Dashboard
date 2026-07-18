import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Icons from "lucide-react";
import { Plus, Pencil, Trash2, MoreVertical, FolderTree, Package } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  icon: z.string().min(2, "Icon name is required"),
  color: z.string().min(4, "Pick a color"),
  status: z.enum(["Active", "Inactive"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const COLOR_PRESETS = ["#3457F7", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#84CC16"];

export default function Categories() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const watchedColor = watch("color");
  const watchedStatus = watch("status");

  function openCreate() {
    setEditingCategory(null);
    reset({ name: "", description: "", icon: "Layers", color: COLOR_PRESETS[0], status: "Active" });
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      status: category.status,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    if (editingCategory) {
      await updateCategory.mutateAsync({ ...editingCategory, ...values });
    } else {
      await createCategory.mutateAsync(values);
    }
    setDialogOpen(false);
  }

  function getIcon(name: string) {
    return (Icons as any)[name] ?? Icons.Layers;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search categories..." className="max-w-xs" />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <ErrorState onRetry={() => refetch()} />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderTree}
            title="No categories found"
            description="Try a different search term, or create your first category."
            actionLabel="Add Category"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((category) => {
            const Icon = getIcon(category.icon);
            return (
              <Card key={category.id} className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${category.color}1A`, color: category.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(category)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onClick={() => setDeletingCategory(category)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-4 font-display text-base font-semibold">{category.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="h-3.5 w-3.5" /> {category.productsCount} products
                  </span>
                  <Badge variant={category.status === "Active" ? "success" : "secondary"}>{category.status}</Badge>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">Created {formatDate(category.createdAt)}</p>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category's details below." : "Create a new category for your products."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="cname">Category name</Label>
              <Input id="cname" placeholder="Handicrafts" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cdesc">Description</Label>
              <Textarea id="cdesc" placeholder="Traditional handmade Afghan crafts..." {...register("description")} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cicon">Icon name (Lucide)</Label>
              <Input id="cicon" placeholder="Hammer" {...register("icon")} />
              <p className="text-xs text-muted-foreground">Use any icon name from lucide.dev, e.g. Hammer, Gem, Shirt.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue("color", color)}
                    className="h-8 w-8 rounded-full ring-offset-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      boxShadow: watchedColor === color ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Active status</p>
                <p className="text-xs text-muted-foreground">Inactive categories are hidden from customers.</p>
              </div>
              <Switch checked={watchedStatus === "Active"} onCheckedChange={(v) => setValue("status", v ? "Active" : "Inactive")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Delete this category?"
        description={`This will permanently remove "${deletingCategory?.name}" and may affect ${deletingCategory?.productsCount} linked products.`}
        confirmLabel="Delete Category"
        loading={deleteCategory.isPending}
        onConfirm={async () => {
          if (deletingCategory) {
            await deleteCategory.mutateAsync(deletingCategory.id);
            setDeletingCategory(null);
          }
        }}
      />
    </div>
  );
}
