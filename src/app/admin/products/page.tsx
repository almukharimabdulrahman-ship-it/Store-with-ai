import { getAdminProducts } from "@/lib/admin";

export default async function ProductsPage() {
  const products = await getAdminProducts();
  return <div><h1 className="text-3xl font-bold">Products</h1><div className="mt-6 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-3 text-left">Product</th><th className="p-3 text-left">Brand</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Variants</th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-t"><td className="p-3 font-medium">{p.name}</td><td className="p-3">{p.brand?.name ?? "—"}</td><td className="p-3">{p.status}</td><td className="p-3">{p.variants.length}</td></tr>)}</tbody></table>{!products.length && <p className="p-6 text-sm text-neutral-500">No products yet.</p>}</div></div>;
}
