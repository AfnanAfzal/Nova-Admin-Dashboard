import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderTree,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronsLeft,
  Sparkles,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 5 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { collapsed, toggleCollapsed } = useSidebarStore();

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 items-center gap-2.5 px-5", collapsed && "justify-center px-0")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 shadow-glow">
          <Sparkles className="h-[18px] w-[18px] text-white" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-white">Nova Admin</p>
            <p className="text-[11px] text-white/50">Enterprise Suite</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const linkContent = (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-sidebar-accent hover:text-white",
                  collapsed && "justify-center px-0",
                  isActive && "bg-gradient-to-r from-primary-600/90 to-primary-500/80 text-white shadow-glow"
                )
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/15 px-1.5 text-[11px] font-semibold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <TooltipProvider key={item.to} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          return linkContent;
        })}
      </nav>

      <div className="p-3">
        <button
          onClick={toggleCollapsed}
          className={cn(
            "hidden md:flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-sidebar-accent hover:text-white",
            collapsed && "justify-center px-0"
          )}
        >
          <ChevronsLeft className={cn("h-[18px] w-[18px] transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed } = useSidebarStore();
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 bg-sidebar transition-all duration-300 md:block",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <SidebarContent />
    </aside>
  );
}
