import Link from "next/link";
import { getAdminOverview } from "@/lib/admin";

export default async function AdminPage() {
  const data = await getAdminOverview();
  const cards = [
    ["Paid revenue", `${data.paidRevenue.toFixed(2)} LYD`],
    ["Recent orders", String(data.orders.length)],
    ["Customers", String(data.customers)],
    ["Active products", String(data.products)],
    ["Low stock", String(data.lowStock.length)],
  ];
  return <div className="space-y-8">
    <div><h1 className="text-3xl font-bold">Overview</h1><p className="mt-1 text-neutral-500">Store operations at a glance.</p></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-2xl border bg-white p-5"><p className="text-sm text-neutral-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section>
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border bg-white p-5"><div className="mb-4 flex justify-between"><h2 className="font-semibold">Recent orders</h2><Link href="/admin/orders" className="text-sm underline">View all</Link></div>{data.orders.length ? <div className="space-y-3">{data.orders.map(order => <div key={order.id} className="flex justify-between border-b pb-3 text-sm"><span>{order.orderNumber}</span><span>{Number(order.total).toFixed(2)} {order.currency}</span></div>)}</div> : <p className="text-sm text-neutral-500">No orders yet.</p>}</div>
      <div className="rounded-2xl border bg-white p-5"><h2 className="mb-4 font-semibold">Low stock</h2>{data.lowStock.length ? <div className="space-y-3">{data.lowStock.map(item => <div key={item.id} className="flex justify-between border-b pb-3 text-sm"><span>{item.variant.product.name} · {item.variant.sku}</span><span>{item.availableQuantity}</span></div>)}</div> : <p className="text-sm text-neutral-500">No low-stock items.</p>}</div>
    </section>
  </div>;
}
