import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { sleep } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@novaadmin.com", password: "" },
  });

  async function onSubmit(values: LoginForm) {
    setServerError(null);
    await sleep(900);
    if (values.password !== "demo1234") {
      setServerError("Incorrect email or password. Try the demo password: demo1234");
      return;
    }
    login({
      id: "USR-1000",
      name: "Admin User",
      email: values.email,
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Admin",
    });
    navigate("/");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_70%,white,transparent_30%)]" />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold">Nova Admin</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="font-display text-4xl font-bold leading-tight">
            Run your entire marketplace from one command center.
          </h1>
          <p className="max-w-md text-white/70">
            Track orders, manage sellers, and grow revenue with real-time analytics built for enterprise teams.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: BarChart3, label: "Live Analytics" },
              { icon: ShieldCheck, label: "Enterprise Security" },
              { icon: Zap, label: "Instant Insights" },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <f.icon className="mb-2 h-5 w-5 text-white/80" />
                <p className="text-xs font-medium text-white/80">{f.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-xs text-white/50">© 2026 Nova Admin. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Nova Admin</span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="demo1234"
                  aria-invalid={!!errors.password}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive animate-fade-in">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
              Sign in
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Demo credentials — any email, password: <span className="font-mono font-medium text-foreground">demo1234</span>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
