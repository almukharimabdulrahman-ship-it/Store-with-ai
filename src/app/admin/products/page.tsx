import Link from "next/link";
import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminProducts } from "@/lib/admin";

export default async function ProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  return <div><div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-bold">Products</h1><Link href="/admin/products/new" className="rounded bg-black px-4 py-2 text-white">New product</Link></div><div className="mt-6 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Product</th><th className="p-3 text-left">Brand</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Variants</th><th className="p-3 text-left">Stock</th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-t"><td className="p-3 font-medium"><Link href={`/admin/products/${p.id}`} className="underline">{p.name}</Link></td><td className="p-3">{p.brand?.name ?? "—"}</td><td className="p-3">{p.status}</td><td className="p-3">{p.variants.length}</td><td className="p-3">{p.variants.reduce((s,v)=>s+(v.inventory?.availableQuantity??0),0)}</td></tr>)}</tbody></table>{!products.length && <p className="p-6 text-sm text-neutral-500">No products yet.</p>}</div></div>;
}
