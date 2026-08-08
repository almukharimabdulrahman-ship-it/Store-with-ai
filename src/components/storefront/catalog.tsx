import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import type { CatalogData, CatalogParams } from "@/lib/storefront";

export function CatalogView({ data, currency, params }: { data: CatalogData; currency: string; params: CatalogParams }) {
  const qs = (next: Record<string, string>) => {
    const search = new URLSearchParams();
    Object.entries({ ...params, ...next }).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    return `?${search.toString()}`;
  };

  return <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
    <aside className="h-fit rounded-2xl border bg-white p-5">
      <form className="space-y-4">
        <div><label className="mb-1 block text-sm font-medium">Search</label><input name="q" defaultValue={params.q} className="w-full rounded-lg border px-3 py-2"/></div>
        <div><label className="mb-1 block text-sm font-medium">Category</label><select name="category" defaultValue={params.category ?? ""} className="w-full rounded-lg border px-3 py-2"><option value="">All</option>{data.categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select></div>
        <div><label className="mb-1 block text-sm font-medium">Brand</label><select name="brand" defaultValue={params.brand ?? ""} className="w-full rounded-lg border px-3 py-2"><option value="">All</option>{data.brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2"><input name="min" inputMode="decimal" defaultValue={params.min} placeholder="Min" className="rounded-lg border px-3 py-2"/><input name="max" inputMode="decimal" defaultValue={params.max} placeholder="Max" className="rounded-lg border px-3 py-2"/></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="sale" value="1" defaultChecked={params.sale === "1"}/> Sale only</label>
        <select name="sort" defaultValue={params.sort ?? "newest"} className="w-full rounded-lg border px-3 py-2"><option value="newest">Newest</option><option value="featured">Featured</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select>
        <button className="w-full rounded-lg bg-black px-4 py-2 text-white">Apply filters</button>
      </form>
    </aside>
    <section><div className="mb-5 flex items-center justify-between"><p className="text-sm text-neutral-500">{data.total} products</p></div>{data.items.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((product) => <ProductCard key={product.id} product={product} currency={currency}/>)}</div> : <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-neutral-500">No matching products.</div>}
      {data.pages > 1 && <div className="mt-8 flex justify-center gap-2">{Array.from({ length: data.pages }, (_, index) => index + 1).map((page) => <Link key={page} href={qs({ page: String(page) })} className={`rounded-lg border px-3 py-2 text-sm ${page === data.page ? "bg-black text-white" : "bg-white"}`}>{page}</Link>)}</div>}
    </section>
  </div>;
}
