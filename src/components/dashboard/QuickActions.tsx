import { useNavigate } from "react-router-dom";
import { PackagePlus, UserCheck, BarChart3, Settings, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Action {
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
  to: string;
}

const actions: Action[] = [
  { icon: PackagePlus, label: "Add Product", description: "Create new listing", gradient: "from-primary-500 to-primary-700", to: "/products" },
  { icon: UserCheck, label: "Approve Users", description: "Review pending", gradient: "from-emerald-400 to-emerald-600", to: "/users" },
  { icon: BarChart3, label: "View Reports", description: "Analytics data", gradient: "from-orange-400 to-orange-600", to: "/analytics" },
  { icon: Settings, label: "Settings", description: "Configure system", gradient: "from-violet-400 to-violet-600", to: "/settings" },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used admin tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(action.to)}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} p-4 text-left text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-elevated`}
          >
            <action.icon className="h-6 w-6 opacity-90" />
            <p className="mt-3 text-sm font-semibold">{action.label}</p>
            <p className="text-xs text-white/70">{action.description}</p>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
}
