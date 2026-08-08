import Link from "next/link";
import { requireUser } from "@/lib/auth/authorization";
import { getUserOrders } from "@/lib/orders";

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);
  return <main className="mx-auto max-w-5xl p-8"><div className="flex items-center justify-between"><h1 className="text-3xl font-black">My orders</h1><Link href="/account" className="text-sm underline">Account</Link></div>{!orders.length ? <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-neutral-500">No orders yet.</div> : <div className="mt-8 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Order</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Items</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Payment</th><th className="p-3 text-left">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.orderNumber} className="border-t"><td className="p-3"><Link href={`/account/orders/${order.orderNumber}`} className="font-semibold underline">{order.orderNumber}</Link></td><td className="p-3">{order.createdAt.toLocaleDateString()}</td><td className="p-3">{order._count.items}</td><td className="p-3">{order.status}</td><td className="p-3">{order.paymentStatus}</td><td className="p-3 font-semibold">{Number(order.total).toFixed(2)} {order.currency}</td></tr>)}</tbody></table></div>}</main>;
}
