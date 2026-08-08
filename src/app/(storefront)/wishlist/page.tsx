import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { getStoreProfile } from "@/lib/storefront";
import { moveWishlistToCart, removeWishlistItem } from "../actions";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [wishlist, profile] = await Promise.all([
    prisma.wishlist.findUnique({ where: { userId: session.user.id }, include: { items: { include: { product: { include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, orderBy: { price: "asc" }, take: 1 } } } }, orderBy: { createdAt: "desc" } } } }).catch(() => null),
    getStoreProfile(),
  ]);
  const items = (wishlist?.items ?? []).filter(item => item.product.status === "ACTIVE");
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-black">Wishlist</h1>{items.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map(item => <div key={item.id}><ProductCard product={item.product} currency={profile.currency}/><div className="mt-2 flex gap-2"><form action={moveWishlistToCart} className="flex-1"><input type="hidden" name="productId" value={item.productId}/><input type="hidden" name="variantId" value={item.product.variants[0]?.id ?? ""}/><input type="hidden" name="quantity" value="1"/><button disabled={!item.product.variants[0]} className="w-full rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-40">Move to cart</button></form><form action={removeWishlistItem}><input type="hidden" name="productId" value={item.productId}/><button className="rounded-lg border px-3 py-2 text-sm">Remove</button></form></div></div>)}</div> : <div className="mt-8 rounded-2xl border border-dashed bg-white p-10 text-center text-neutral-500">Your wishlist is empty.</div>}</div>;
}
