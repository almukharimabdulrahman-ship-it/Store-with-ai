"use client";

import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "./actions";

type Defaults = {
  fullName?: string; email?: string; phone?: string; country?: string; city?: string; area?: string; line1?: string; line2?: string; postalCode?: string;
};

export function CheckoutForm({ defaults, checkoutToken }: { defaults: Defaults; checkoutToken: string }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  return <form action={action} className="grid gap-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Contact</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><input name="fullName" defaultValue={defaults.fullName} required placeholder="Full name" className="rounded-lg border px-3 py-2"/><input name="email" defaultValue={defaults.email} type="email" placeholder="Email" className="rounded-lg border px-3 py-2"/><input name="phone" defaultValue={defaults.phone} required placeholder="Phone" className="rounded-lg border px-3 py-2 sm:col-span-2"/></div></section>
      <section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Shipping</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><input name="country" defaultValue={defaults.country} required placeholder="Country" className="rounded-lg border px-3 py-2"/><input name="city" defaultValue={defaults.city} required placeholder="City" className="rounded-lg border px-3 py-2"/><input name="area" defaultValue={defaults.area} placeholder="Area" className="rounded-lg border px-3 py-2"/><input name="postalCode" defaultValue={defaults.postalCode} placeholder="Postal code" className="rounded-lg border px-3 py-2"/><input name="line1" defaultValue={defaults.line1} required placeholder="Address line 1" className="rounded-lg border px-3 py-2 sm:col-span-2"/><input name="line2" defaultValue={defaults.line2} placeholder="Address line 2" className="rounded-lg border px-3 py-2 sm:col-span-2"/><textarea name="notes" placeholder="Order notes" className="min-h-24 rounded-lg border px-3 py-2 sm:col-span-2"/></div></section>
    </div>
    <aside className="h-fit space-y-5 rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Payment & discount</h2><input type="hidden" name="checkoutToken" value={checkoutToken}/><input name="coupon" placeholder="Coupon code" className="w-full rounded-lg border px-3 py-2"/><select name="paymentMethod" defaultValue="CASH_ON_DELIVERY" className="w-full rounded-lg border px-3 py-2"><option value="CASH_ON_DELIVERY">Cash on delivery</option><option value="CARD">Card (pending gateway)</option><option value="BANK_TRANSFER">Bank transfer</option><option value="WALLET">Wallet (pending gateway)</option><option value="OTHER">Other</option></select>{state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}<button disabled={pending} className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Placing order…" : "Place order"}</button><p className="text-xs text-neutral-500">Prices, stock, discounts, shipping and payment status are recalculated securely on the server.</p></aside>
  </form>;
}
