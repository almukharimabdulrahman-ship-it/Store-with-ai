import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin, requireUser } from "@/lib/auth/authorization";

export default async function DashboardPage() {
  const user = await requireUser();

  if (isAdmin(user.role)) redirect("/admin");

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="my-4">Welcome, {user.name ?? user.email}.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/account/orders" className="rounded bg-black px-4 py-2 text-white">
          My orders
        </Link>
        <Link href="/account" className="rounded border px-4 py-2">
          Account settings
        </Link>
      </div>
    </main>
  );
}
