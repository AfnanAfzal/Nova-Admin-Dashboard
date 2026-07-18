export type Role = "Admin" | "Manager" | "Editor" | "Viewer";
export type UserStatus = "Active" | "Inactive" | "Pending" | "Suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: UserStatus;
  location: string;
  joinedAt: string;
  lastActive: string;
  ordersCount: number;
  totalSpent: number;
  phone: string;
}

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Discontinued";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: ProductStatus;
  image: string;
  rating: number;
  sales: number;
  vendor: string;
  createdAt: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded" | "Failed";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  customerAvatar: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
  shippingAddress: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productsCount: number;
  status: "Active" | "Inactive";
  color: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  label: "Support" | "Sales" | "General" | "Urgent";
}

export interface ActivityItem {
  id: string;
  actor: string;
  avatar: string;
  action: string;
  target?: string;
  timestamp: string;
  type: "order" | "user" | "product" | "review" | "system";
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  target: number;
}

export interface TopSeller {
  id: string;
  name: string;
  avatar: string;
  orders: number;
  revenue: number;
  growth: number;
  rank: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  icon: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface TableFilters {
  search: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page: number;
  pageSize: number;
}
