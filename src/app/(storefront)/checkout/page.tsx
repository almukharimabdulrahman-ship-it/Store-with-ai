import { cookies } from "next/headers";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStoreProfile } from "@/lib/storefront";
import { newCheckoutToken } from "@/lib/checkout";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const session = await auth();
  const jar = await cookies();
  const guest = jar.get("store_cart")?.value;
  const [profile, user, cart] = await Promise.all([
    getStoreProfile(),
    session?.user?.id ? prisma.user.findUnique({ where: { id: session.user.id }, include: { addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }], take: 1 } } }).catch(() => null) : Promise.resolve(null),
    prisma.cart.findFirst({
      where: session?.user?.id ? { userId: session.user.id } : guest ? { sessionToken: guest } : { id: "00000000-0000-0000-0000-000000000000" },
      include: { items: { include: { variant: { include: { product: true, inventory: true } } } } },
    }).catch(() => null),
  ]);

  const items = (cart?.items ?? []).filter((item) => item.quantity > 0 && item.variant.active && item.variant.product.status === "ACTIVE" && item.variant.inventory);
  if (!items.length) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl font-black">Checkout</h1><p className="mt-4 text-neutral-500">Your cart has no checkout-ready items.</p><Link href="/cart" className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-white">Return to cart</Link></div>;
  const subtotal = items.reduce((sum, item) => sum + Number(item.variant.salePrice ?? item.variant.price) * item.quantity, 0);
  const address = user?.addresses[0];
  const defaults = { fullName: address?.fullName ?? user?.name ?? "", email: user?.email ?? session?.user?.email ?? "", phone: address?.phone ?? user?.phone ?? "", country: address?.country ?? profile.country, city: address?.city ?? "", area: address?.area ?? "", line1: address?.line1 ?? "", line2: address?.line2 ?? "", postalCode: address?.postalCode ?? "" };

  return <div className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><h1 className="text-3xl font-black">Checkout</h1><p className="mt-2 text-neutral-500">{items.length} item(s) · {subtotal.toFixed(2)} {profile.currency} before discounts and shipping</p></div><CheckoutForm defaults={defaults} checkoutToken={newCheckoutToken()}/></div>;
}
