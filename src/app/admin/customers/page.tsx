import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminCustomers } from "@/lib/admin";

export default async function CustomersPage() {
  await requireAdmin();
  const customers = await getAdminCustomers();
  return <div><h1 className="text-3xl font-bold">Customers</h1><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead><tr className="border-b bg-neutral-50 text-left"><th className="p-3">Customer</th><th className="p-3">Verified</th><th className="p-3">Orders</th><th className="p-3">Total spend</th><th className="p-3">Joined</th></tr></thead><tbody>{customers.map((c) => <tr key={c.id} className="border-b"><td className="p-3"><Link className="font-medium underline" href={`/admin/customers/${c.id}`}>{c.name ?? c.email}</Link><div className="text-neutral-500">{c.email}</div></td><td className="p-3">{c.emailVerified ? "Yes" : "No"}</td><td className="p-3">{c.orders.length}</td><td className="p-3">{c.orders.reduce((s,o)=>s+Number(o.total),0).toFixed(2)} LYD</td><td className="p-3">{c.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table>{customers.length === 0 && <p className="p-6 text-neutral-500">No customers yet.</p>}</div></div>;
}
