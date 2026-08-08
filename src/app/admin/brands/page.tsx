import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { createBrand, toggleBrand } from "../actions";

export default async function BrandsPage() {
  await requireAdmin();
  const brands = await prisma.brand.findMany({ orderBy:{name:"asc"} }).catch(()=>[]);
  return <div><h1 className="text-3xl font-bold">Brands</h1><form action={createBrand} className="mt-6 grid gap-3 rounded-xl border p-4 sm:grid-cols-3"><input name="name" required placeholder="Brand name" className="rounded border px-3 py-2"/><input name="logoUrl" type="url" placeholder="Logo URL" className="rounded border px-3 py-2"/><button className="rounded bg-black px-4 py-2 text-white">Add brand</button></form><div className="mt-6 space-y-2">{brands.map(b=><div key={b.id} className="flex items-center justify-between rounded-lg border p-3"><div><b>{b.name}</b><div className="text-sm text-neutral-500">{b.logoUrl ?? "No logo"}</div></div><form action={toggleBrand.bind(null,b.id,!b.active)}><button className="rounded border px-3 py-1.5 text-sm">{b.active?"Deactivate":"Activate"}</button></form></div>)}{brands.length===0&&<p className="text-neutral-500">No brands yet.</p>}</div></div>;
}
