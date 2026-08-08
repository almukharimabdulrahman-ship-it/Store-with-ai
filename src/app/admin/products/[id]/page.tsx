import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { archiveProduct } from "../../actions";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where:{id}, include:{brand:true,images:true,categories:{include:{category:true}},variants:{include:{inventory:true}}} }).catch(()=>null);
  if (!product) notFound();
  return <div><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">{product.name}</h1><p className="text-neutral-500">{product.status} · {product.featured?"Featured":"Standard"}</p></div><div className="flex gap-2"><Link href="/admin/products" className="rounded border px-3 py-2">Back</Link>{product.status!=="ARCHIVED"&&<form action={archiveProduct.bind(null,product.id)}><button className="rounded border px-3 py-2 text-red-700">Archive</button></form>}</div></div><div className="mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-2"><p><b>Brand:</b> {product.brand?.name ?? "—"}</p><p><b>Categories:</b> {product.categories.map(c=>c.category.name).join(", ")||"—"}</p><p className="sm:col-span-2"><b>Description:</b> {product.description ?? "—"}</p></div><h2 className="mt-8 text-xl font-semibold">Variants</h2><div className="mt-3 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead><tr className="border-b bg-neutral-50 text-left"><th className="p-3">SKU</th><th className="p-3">Variant</th><th className="p-3">Price</th><th className="p-3">Sale</th><th className="p-3">Stock</th></tr></thead><tbody>{product.variants.map(v=><tr key={v.id} className="border-b"><td className="p-3">{v.sku}</td><td className="p-3">{v.name ?? "Default"}</td><td className="p-3">{Number(v.price).toFixed(2)} LYD</td><td className="p-3">{v.salePrice?`${Number(v.salePrice).toFixed(2)} LYD`:"—"}</td><td className="p-3">{v.inventory?.availableQuantity ?? 0}</td></tr>)}</tbody></table></div></div>;
}
