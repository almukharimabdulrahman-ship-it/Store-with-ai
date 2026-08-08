import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderForReceipt } from "@/lib/orders";
import { OrderDetail } from "@/components/storefront/order-detail";

export default async function CheckoutSuccessPage({ params, searchParams }: { params: Promise<{ orderNumber: string }>; searchParams: Promise<{ access?: string }> }) {
  const { orderNumber } = await params;
  const { access } = await searchParams;
  const order = await getOrderForReceipt(orderNumber, access);
  if (!order) notFound();
  return <div className="mx-auto max-w-5xl px-4 py-10"><div className="mb-6 rounded-2xl bg-emerald-50 p-5 text-emerald-900"><h1 className="text-2xl font-black">Order received</h1><p className="mt-2 text-sm">Your order was created successfully. Payment remains pending until the selected payment method is completed or confirmed.</p></div><OrderDetail order={order}/><div className="mt-6 flex gap-3"><Link href="/products" className="rounded-xl border px-4 py-2">Continue shopping</Link>{order.userId && <Link href="/account/orders" className="rounded-xl bg-black px-4 py-2 text-white">My orders</Link>}</div></div>;
}
