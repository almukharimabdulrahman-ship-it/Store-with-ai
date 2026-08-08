import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { createCoupon, toggleCoupon } from "../actions";

export default async function CouponsPage() {
  await requireAdmin();
  const coupons = await prisma.coupon.findMany({ orderBy:{createdAt:"desc"} }).catch(()=>[]);
  return <div><h1 className="text-3xl font-bold">Coupons</h1><form action={createCoupon} className="mt-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-4"><input name="code" required placeholder="CODE" className="rounded border px-3 py-2 uppercase"/><select name="discountType" className="rounded border px-3 py-2"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed</option></select><input name="value" type="number" step="0.01" min="0.01" required placeholder="Value" className="rounded border px-3 py-2"/><input name="usageLimit" type="number" min="1" placeholder="Usage limit" className="rounded border px-3 py-2"/><button className="rounded bg-black px-4 py-2 text-white sm:col-span-4">Create coupon</button></form><div className="mt-6 space-y-2">{coupons.map(c=><div key={c.id} className="flex items-center justify-between rounded-lg border p-3"><div><b>{c.code}</b><div className="text-sm text-neutral-500">{c.discountType} · {Number(c.value)} · used {c.usedCount}{c.usageLimit?`/${c.usageLimit}`:""}</div></div><form action={toggleCoupon.bind(null,c.id,!c.active)}><button className="rounded border px-3 py-1.5 text-sm">{c.active?"Deactivate":"Activate"}</button></form></div>)}{coupons.length===0&&<p className="text-neutral-500">No coupons yet.</p>}</div></div>;
}
