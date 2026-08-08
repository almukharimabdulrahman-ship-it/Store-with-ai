import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const customer = await prisma.user.findUnique({ where: { id }, select: { id:true,name:true,email:true,phone:true,emailVerified:true,createdAt:true,role:{select:{code:true}},orders:{select:{id:true,orderNumber:true,total:true,status:true,createdAt:true},orderBy:{createdAt:"desc"}} } }).catch(()=>null);
  if (!customer) notFound();
  const spend = customer.orders.reduce((s,o)=>s+Number(o.total),0);
  return <div><h1 className="text-3xl font-bold">Customer details</h1><div className="mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-2"><p><b>Name:</b> {customer.name ?? "—"}</p><p><b>Email:</b> {customer.email}</p><p><b>Phone:</b> {customer.phone ?? "—"}</p><p><b>Role:</b> {customer.role.code}</p><p><b>Verified:</b> {customer.emailVerified ? "Yes" : "No"}</p><p><b>Joined:</b> {customer.createdAt.toLocaleDateString()}</p><p><b>Orders:</b> {customer.orders.length}</p><p><b>Total spend:</b> {spend.toFixed(2)} LYD</p></div><h2 className="mt-8 text-xl font-semibold">Recent orders</h2><div className="mt-3 space-y-2">{customer.orders.map(o=><div key={o.id} className="rounded-lg border p-3">{o.orderNumber} · {o.status} · {Number(o.total).toFixed(2)} LYD</div>)}{customer.orders.length===0&&<p className="text-neutral-500">No orders yet.</p>}</div></div>;
}
