import { requireAdmin } from "@/lib/auth/authorization";
import { AdminShell } from "@/components/admin/admin-shell";
import { getStoreProfile } from "@/lib/storefront";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, profile] = await Promise.all([requireAdmin(), getStoreProfile()]);
  return <AdminShell storeName={profile.name} user={user}>{children}</AdminShell>;
}
