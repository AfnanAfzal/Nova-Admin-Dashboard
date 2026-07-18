import { Mail, Phone, MapPin, Calendar, ShieldCheck, ShoppingBag, Wallet, Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useActivity } from "@/hooks/useDashboardData";
import { initials, timeAgo, formatDate } from "@/lib/utils";

const stats = [
  { icon: ShoppingBag, label: "Orders Managed", value: "1,284" },
  { icon: Wallet, label: "Revenue Overseen", value: "$2.4M" },
  { icon: Star, label: "Team Rating", value: "4.9/5" },
];

export default function Profile() {
  const { user } = useAuthStore();
  const { data: activity = [] } = useActivity();

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your public profile information" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <Avatar className="mx-auto h-24 w-24 ring-4 ring-primary/10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl">{user ? initials(user.name) : "AD"}</AvatarFallback>
            </Avatar>
            <p className="mt-4 font-display text-lg font-bold">{user?.name ?? "Admin User"}</p>
            <p className="text-sm text-muted-foreground">{user?.role ?? "Admin"} at Nova Admin</p>
            <Badge variant="success" className="mt-3">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified Account
            </Badge>

            <Separator className="my-5" />

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email ?? "admin@novaadmin.com"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+93 70 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Kabul, Afghanistan</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate("2024-03-12")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-5">
                <stat.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.slice(0, 6).map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    {i < 5 && <span className="mt-1 h-full w-px bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm">
                      <span className="font-semibold">{item.actor}</span> {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
