import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { updateOrderStatus } from "../../actions";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where:{id}, include:{items:true,payments:true,user:{select:{name:true,email:true}}} }).catch(()=>null);
  if (!order) notFound();
  return <div><h1 className="text-3xl font-bold">Order {order.orderNumber}</h1><div className="mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-2"><p><b>Customer:</b> {order.customerName}</p><p><b>Email:</b> {order.customerEmail ?? order.user?.email ?? "—"}</p><p><b>Phone:</b> {order.customerPhone}</p><p><b>Total:</b> {Number(order.total).toFixed(2)} {order.currency}</p><p><b>Payment:</b> {order.paymentStatus} / {order.paymentMethod}</p><p><b>Created:</b> {order.createdAt.toLocaleString()}</p><p className="sm:col-span-2"><b>Shipping:</b> {order.shippingLine1}, {order.shippingArea ? `${order.shippingArea}, ` : ""}{order.shippingCity}, {order.shippingCountry}</p></div><form action={updateOrderStatus.bind(null,order.id)} className="mt-4 flex gap-2"><select name="status" defaultValue={order.status} className="rounded border px-3 py-2"><option>PENDING</option><option>CONFIRMED</option><option>PROCESSING</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option><option>REFUNDED</option></select><button className="rounded bg-black px-4 py-2 text-white">Update status</button></form><h2 className="mt-8 text-xl font-semibold">Items</h2><div className="mt-3 space-y-2">{order.items.map(i=><div key={i.id} className="rounded-lg border p-3">{i.productName} {i.variantName?`· ${i.variantName}`:""} · {i.quantity} × {Number(i.unitPrice).toFixed(2)} {order.currency} = {Number(i.lineTotal).toFixed(2)} {order.currency}</div>)}</div></div>;
}
