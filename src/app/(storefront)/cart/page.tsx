import { cookies } from "next/headers";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStoreProfile } from "@/lib/storefront";
import { removeCartItem, updateCartItem } from "../actions";

export default async function CartPage() {
  const session = await auth();
  const jar = await cookies();
  const guest = jar.get("store_cart")?.value;
  const profile = await getStoreProfile();
  const cart = await prisma.cart.findFirst({
    where: session?.user?.id ? { userId: session.user.id } : guest ? { sessionToken: guest } : { id: "00000000-0000-0000-0000-000000000000" },
    include: { items: { include: { variant: { include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } }, inventory: true } } }, orderBy: { createdAt: "desc" } } },
  }).catch(() => null);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.variant.salePrice ?? item.variant.price) * item.quantity), 0);
  return <div className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-black">Cart</h1>{!items.length ? <div className="mt-8 rounded-2xl border border-dashed bg-white p-10 text-center"><p className="text-neutral-500">Your cart is empty.</p><Link href="/products" className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-white">Browse products</Link></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]"><div className="space-y-4">{items.map(item => { const price = Number(item.variant.salePrice ?? item.variant.price); const stock = item.variant.inventory?.availableQuantity ?? 0; return <article key={item.id} className="flex gap-4 rounded-2xl border bg-white p-4"><div className="h-24 w-24 shrink-0 rounded-xl bg-neutral-100">{item.variant.product.images[0] && <img src={item.variant.product.images[0].url} alt={item.variant.product.name} className="h-full w-full object-contain"/>}</div><div className="flex-1"><Link href={`/products/${item.variant.product.slug}`} className="font-semibold">{item.variant.product.name}</Link><p className="mt-1 text-sm text-neutral-500">{item.variant.name ?? item.variant.sku}</p><p className="mt-2 font-bold">{price.toFixed(2)} {profile.currency}</p><div className="mt-3 flex flex-wrap gap-2"><form action={updateCartItem} className="flex items-center gap-2"><input type="hidden" name="itemId" value={item.id}/><input type="number" name="quantity" min="1" max={stock} defaultValue={item.quantity} className="w-20 rounded-lg border px-2 py-1"/><button className="rounded-lg border px-3 py-1 text-sm">Update</button></form><form action={removeCartItem}><input type="hidden" name="itemId" value={item.id}/><button className="rounded-lg border px-3 py-1 text-sm text-red-700">Remove</button></form></div></div></article>; })}</div><aside className="h-fit rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Summary</h2><div className="mt-4 flex justify-between"><span>Subtotal</span><strong>{subtotal.toFixed(2)} {profile.currency}</strong></div><p className="mt-3 text-xs text-neutral-500">Shipping and discounts are calculated at checkout.</p><Link href="/checkout" className="mt-5 block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white">Proceed to checkout</Link></aside></div>}</div>;
}
