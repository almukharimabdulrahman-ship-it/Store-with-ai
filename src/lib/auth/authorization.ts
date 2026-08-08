import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "CUSTOMER"] as const;
export type RoleCode = (typeof ROLES)[number];
export const isAdmin = (role?: string | null) => role === "SUPER_ADMIN" || role === "ADMIN" || role === "MANAGER";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireRole(...roles: RoleCode[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as RoleCode)) redirect("/dashboard");
  return user;
}

export const requireAdmin = () => requireRole("SUPER_ADMIN", "ADMIN", "MANAGER");
