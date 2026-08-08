import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminOrders } from "@/lib/admin";

export default async function OrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrders();
  return <div><h1 className="text-3xl font-bold">Orders</h1><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead><tr className="border-b bg-neutral-50 text-left"><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Total</th><th className="p-3">Date</th></tr></thead><tbody>{orders.map(o=><tr key={o.id} className="border-b"><td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium underline">{o.orderNumber}</Link></td><td className="p-3">{o.customerName}</td><td className="p-3">{o.status}</td><td className="p-3">{o.paymentStatus}</td><td className="p-3">{Number(o.total).toFixed(2)} {o.currency}</td><td className="p-3">{o.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table>{orders.length===0&&<p className="p-6 text-neutral-500">No orders yet.</p>}</div></div>;
}
