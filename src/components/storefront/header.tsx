import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/authorization";
import { getStoreProfile } from "@/lib/storefront";
import { StoreWordmark } from "@/components/storefront/store-wordmark";

export async function StorefrontHeader() {
  const [session, profile, categories] = await Promise.all([
    auth(),
    getStoreProfile(),
    prisma.category.findMany({ where: { active: true, parentId: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 6 }).catch(() => []),
  ]);
  let cartCount = 0;
  if (session?.user?.id) {
    cartCount = await prisma.cartItem.aggregate({ where: { cart: { userId: session.user.id } }, _sum: { quantity: true } }).then(r => r._sum.quantity ?? 0).catch(() => 0);
  }
  return <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
      <Link href="/" className="shrink-0" aria-label={`${profile.name} home`}>
        <StoreWordmark name={profile.name} className="text-[1.85rem] leading-none" />
      </Link>
      <form action="/search" className="hidden flex-1 md:flex"><input name="q" placeholder="Search products" className="w-full rounded-l-xl border border-r-0 px-4 py-2 outline-none"/><button className="rounded-r-xl bg-black px-4 text-white">Search</button></form>
      <nav className="ml-auto flex items-center gap-4 text-sm">
        {isAdmin(session?.user?.role) ? <Link href="/admin" className="font-semibold">Admin</Link> : null}
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/cart">Cart ({cartCount})</Link>
        <Link href={session?.user ? "/account" : "/login"}>{session?.user ? "Account" : "Sign in"}</Link>
      </nav>
    </div>
    <div className="border-t bg-neutral-50"><nav className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-2 text-sm"><Link href="/products" className="font-semibold">All products</Link>{categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className="whitespace-nowrap">{c.name}</Link>)}</nav></div>
  </header>;
}
