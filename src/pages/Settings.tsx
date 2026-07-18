import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Upload, Moon, Sun, Monitor } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { initials, sleep, cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

function SuccessBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success animate-fade-in">
      <CheckCircle2 className="h-4 w-4" /> Changes saved successfully.
    </div>
  );
}

export default function Settings() {
  const { user, login } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    newUsers: true,
    productAlerts: false,
    weeklyReports: true,
    marketing: false,
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "Admin User", email: user?.email ?? "admin@novaadmin.com", bio: "" },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  async function onProfileSubmit(values: ProfileForm) {
    await sleep(700);
    if (user) login({ ...user, name: values.name, email: values.email });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  }

  async function onPasswordSubmit(_values: PasswordForm) {
    await sleep(700);
    setPasswordSuccess(true);
    passwordForm.reset();
    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account settings and preferences" />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and public profile</CardDescription>
            </CardHeader>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">{user ? initials(user.name) : "AD"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" /> Upload new photo
                    </Button>
                    <p className="mt-1.5 text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pname">Full name</Label>
                    <Input id="pname" {...profileForm.register("name")} />
                    {profileForm.formState.errors.name && (
                      <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pemail">Email address</Label>
                    <Input id="pemail" type="email" {...profileForm.register("email")} />
                    {profileForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us a little about yourself..." {...profileForm.register("bio")} />
                  {profileForm.formState.errors.bio && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.bio.message}</p>
                  )}
                </div>
                <SuccessBanner show={profileSuccess} />
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button type="button" variant="outline" disabled={profileForm.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" loading={profileForm.formState.isSubmitting}>
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate>
              <CardContent className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" {...passwordForm.register("currentPassword")} />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" {...passwordForm.register("newPassword")} />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm new password</Label>
                  <Input id="confirm" type="password" {...passwordForm.register("confirmPassword")} />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <SuccessBanner show={passwordSuccess} />
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button type="submit" loading={passwordForm.formState.isSubmitting}>
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "orderUpdates", label: "Order updates", description: "Get notified when order status changes" },
                { key: "newUsers", label: "New user registrations", description: "Get notified when a new user signs up" },
                { key: "productAlerts", label: "Product alerts", description: "Low stock and product approval alerts" },
                { key: "weeklyReports", label: "Weekly reports", description: "Receive a weekly performance summary" },
                { key: "marketing", label: "Marketing emails", description: "Tips, product updates and offers" },
              ].map((item, i) => (
                <div key={item.key}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                      onCheckedChange={(v) => setNotifPrefs((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Nova Admin looks on your device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : (opt.value as "light" | "dark"))}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all hover:-translate-y-0.5",
                      theme === opt.value ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <opt.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
