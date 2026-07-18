import { useNavigate } from "react-router-dom";
import { UserCheck, PackageCheck, Flag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const items = [
  {
    icon: UserCheck,
    count: 12,
    title: "Seller Verifications",
    description: "New sellers awaiting approval and verification",
    action: "Review Now",
    color: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20",
    iconBg: "bg-orange-500 text-white",
    to: "/users",
  },
  {
    icon: PackageCheck,
    count: 8,
    title: "Product Approvals",
    description: "New product listings pending review",
    action: "Review Now",
    color: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
    iconBg: "bg-primary text-white",
    to: "/products",
  },
  {
    icon: Flag,
    count: 5,
    title: "Reported Issues",
    description: "Urgent disputes and flagged content",
    action: "View Issues",
    color: "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20",
    iconBg: "bg-destructive text-white",
    to: "/messages",
  },
];

export function PendingActions() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Pending Actions</CardTitle>
          <CardDescription>Items requiring your immediate attention</CardDescription>
        </div>
        <Badge variant="destructive" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> 25 Pending
        </Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className={`rounded-2xl bg-gradient-to-br ${item.color} p-5`}>
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} shadow-soft`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-foreground shadow-soft dark:bg-black/30">
                {item.count}
              </span>
            </div>
            <p className="mt-3 font-display text-sm font-semibold">{item.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            <Button size="sm" className="mt-4 w-full" onClick={() => navigate(item.to)}>
              {item.action}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
