import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";

const items = [
  ["Overview", "/admin"], ["Products", "/admin/products"], ["Categories", "/admin/categories"],
  ["Brands", "/admin/brands"], ["Orders", "/admin/orders"], ["Customers", "/admin/customers"],
  ["Inventory", "/admin/inventory"], ["Reviews", "/admin/reviews"], ["Coupons", "/admin/coupons"], ["Settings", "/admin/settings"],
] as const;

export function AdminShell({ user, children }: { user: { name?: string | null; email?: string | null; role?: string | null }; children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-100 text-neutral-950">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-white p-5 lg:block">
      <Link href="/admin" className="text-xl font-bold">Store with AI</Link>
      <nav className="mt-8 space-y-1">{items.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100">{label}</Link>)}</nav>
    </aside>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 px-5 py-4 backdrop-blur">
        <div><p className="font-semibold">{user.name ?? user.email ?? "Administrator"}</p><p className="text-xs text-neutral-500">{user.role}</p></div>
        <form action={logoutAction}><button className="rounded-lg border px-3 py-2 text-sm">Sign out</button></form>
      </header>
      <nav className="flex gap-2 overflow-x-auto border-b bg-white px-4 py-3 lg:hidden">{items.map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs">{label}</Link>)}</nav>
      <main className="p-5 md:p-8">{children}</main>
    </div>
  </div>;
}
