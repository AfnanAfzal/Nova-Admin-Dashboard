import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoreHorizontal, Plus, Package, Pencil, Trash2, Copy, Download, Star } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useTable } from "@/hooks/useTable";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "@/types";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(1, "Select a category"),
  vendor: z.string().min(2, "Vendor is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Products() {
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const table = useTable<Product>({
    data: products,
    searchKeys: ["name", "sku", "vendor"],
    initialSort: { key: "createdAt", dir: "desc" },
    filterFn: (p) =>
      (statusFilter === "all" || p.status === statusFilter) && (categoryFilter === "all" || p.category === categoryFilter),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) });

  function openCreate() {
    setEditingProduct(null);
    reset({ name: "", sku: "", category: categories[0]?.name ?? "", vendor: "", price: 0, cost: 0, stock: 0, description: "" });
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    reset({
      name: product.name,
      sku: product.sku,
      category: product.category,
      vendor: product.vendor,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      description: "",
    });
    setDialogOpen(true);
  }

  function deriveStatus(stock: number): Product["status"] {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  }

  async function onSubmit(values: ProductFormValues) {
    if (editingProduct) {
      await updateProduct.mutateAsync({
        ...editingProduct,
        ...values,
        status: deriveStatus(values.stock),
      });
    } else {
      await createProduct.mutateAsync({
        ...values,
        status: deriveStatus(values.stock),
        image: `https://picsum.photos/seed/${values.sku}/300/300`,
        rating: 4.5,
        sales: 0,
        createdAt: new Date().toISOString(),
      });
    }
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, inventory and pricing"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchInput value={table.search} onChange={table.setSearch} placeholder="Search products by name, SKU..." className="sm:max-w-xs" />
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : table.isEmpty ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your search or filters, or add a new product."
            actionLabel="Add Product"
            onAction={openCreate}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label="Product" sortKey="name" currentSort={table.sort} onSort={table.toggleSort} />
                  <TableHead>Category</TableHead>
                  <SortableHead label="Price" sortKey="price" currentSort={table.sort} onSort={table.toggleSort} className="text-right" />
                  <SortableHead label="Stock" sortKey="stock" currentSort={table.sort} onSort={table.toggleSort} className="text-right" />
                  <TableHead>Status</TableHead>
                  <SortableHead label="Sales" sortKey="sales" currentSort={table.sort} onSort={table.toggleSort} className="text-right" />
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold">{product.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{product.stock}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm">{product.sales}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        {product.rating}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive onClick={() => setDeletingProduct(product)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Product
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product's details below." : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Product name</Label>
                <Input id="name" placeholder="Herati Wool Rug" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="SKU-101-0001" {...register("sku")} />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="Kabul Handicrafts" {...register("vendor")} />
                {errors.vendor && <p className="text-xs text-destructive">{errors.vendor.message}</p>}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Category</Label>
                <select
                  {...register("category")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input id="cost" type="number" step="0.01" {...register("cost")} />
                {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="stock">Stock quantity</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" placeholder="Short description of the product..." {...register("description")} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingProduct ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Delete this product?"
        description={`This will permanently remove "${deletingProduct?.name}" from your catalog.`}
        confirmLabel="Delete Product"
        loading={deleteProduct.isPending}
        onConfirm={async () => {
          if (deletingProduct) {
            await deleteProduct.mutateAsync(deletingProduct.id);
            setDeletingProduct(null);
          }
        }}
      />
    </div>
  );
}
