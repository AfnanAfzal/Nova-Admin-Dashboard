import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { MobileNav } from "./MobileNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/useNotifications";
import { timeAgo, initials, cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
};
const TYPE_COLOR: Record<string, string> = {
  success: "text-success",
  info: "text-primary",
  warning: "text-warning",
  error: "text-destructive",
};

export function Topbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { data: notifications = [] } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />

      <div className="hidden flex-1 max-w-md sm:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="border-none bg-muted pl-9 shadow-none focus-visible:ring-1"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="sm:hidden ml-auto">
        <Search className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator className="mx-0" />
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 6).map((n) => {
                const Icon = ICON_MAP[n.icon] ?? Info;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => markRead.mutate(n.id)}
                    className={cn("flex items-start gap-2.5 whitespace-normal rounded-lg px-3 py-2.5", !n.read && "bg-accent/60")}
                  >
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", TYPE_COLOR[n.type])} />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-medium leading-snug">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                      <p className="text-[11px] text-muted-foreground">{timeAgo(n.timestamp)}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
            <DropdownMenuSeparator className="mx-0" />
            <DropdownMenuItem
              onClick={() => navigate("/notifications")}
              className="justify-center rounded-none py-2.5 text-sm font-medium text-primary"
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user ? initials(user.name) : "AD"}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight lg:block">
                <p className="text-xs font-semibold">{user?.name ?? "Admin User"}</p>
                <p className="text-[11px] text-muted-foreground">{user?.role ?? "Admin"}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{user?.name ?? "Admin User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? "admin@afghanproduct.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
