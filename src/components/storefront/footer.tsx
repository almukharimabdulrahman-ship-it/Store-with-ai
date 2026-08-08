import Link from "next/link";
import { getStoreProfile } from "@/lib/storefront";

export async function StorefrontFooter() {
  const profile = await getStoreProfile();
  return <footer className="mt-16 border-t bg-neutral-950 text-neutral-200"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3"><div><h2 className="text-lg font-bold text-white">{profile.name}</h2><p className="mt-2 text-sm text-neutral-400">Smart electronics and security products.</p></div><div className="space-y-2 text-sm"><Link href="/products" className="block">Products</Link><Link href="/wishlist" className="block">Wishlist</Link><Link href="/cart" className="block">Cart</Link></div><div className="text-sm text-neutral-400"><p>{profile.country}</p>{profile.supportEmail && <p>{profile.supportEmail}</p>}{profile.supportPhone && <p>{profile.supportPhone}</p>}</div></div></footer>;
}
