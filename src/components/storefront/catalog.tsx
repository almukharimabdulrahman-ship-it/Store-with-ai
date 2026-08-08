import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";

export function CatalogView({ data, currency, params }: { data: any; currency: string; params: Record<string, string | undefined> }) {
  const qs = (next: Record<string, string>) => {
    const search = new URLSearchParams();
    Object.entries({ ...params, ...next }).forEach(([k, v]) => { if (v) search.set(k, v); });
    return `?${search.toString()}`;
  };
  return <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
    <aside className="h-fit rounded-2xl border bg-white p-5">
      <form className="space-y-4">
        <div><label className="mb-1 block text-sm font-medium">Search</label><input name="q" defaultValue={params.q} className="w-full rounded-lg border px-3 py-2"/></div>
        <div><label className="mb-1 block text-sm font-medium">Category</label><select name="category" defaultValue={params.category ?? ""} className="w-full rounded-lg border px-3 py-2"><option value="">All</option>{data.categories.map((c: any) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></div>
        <div><label className="mb-1 block text-sm font-medium">Brand</label><select name="brand" defaultValue={params.brand ?? ""} className="w-full rounded-lg border px-3 py-2"><option value="">All</option>{data.brands.map((b: any) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2"><input name="min" inputMode="decimal" defaultValue={params.min} placeholder="Min" className="rounded-lg border px-3 py-2"/><input name="max" inputMode="decimal" defaultValue={params.max} placeholder="Max" className="rounded-lg border px-3 py-2"/></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="sale" value="1" defaultChecked={params.sale === "1"}/> Sale only</label>
        <select name="sort" defaultValue={params.sort ?? "newest"} className="w-full rounded-lg border px-3 py-2"><option value="newest">Newest</option><option value="featured">Featured</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select>
        <button className="w-full rounded-lg bg-black px-4 py-2 text-white">Apply filters</button>
      </form>
    </aside>
    <section><div className="mb-5 flex items-center justify-between"><p className="text-sm text-neutral-500">{data.total} products</p></div>{data.items.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((p: any) => <ProductCard key={p.id} product={p} currency={currency}/>)}</div> : <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-neutral-500">No matching products.</div>}
      {data.pages > 1 && <div className="mt-8 flex justify-center gap-2">{Array.from({ length: data.pages }, (_, i) => i + 1).map((p: number) => <Link key={p} href={qs({ page: String(p) })} className={`rounded-lg border px-3 py-2 text-sm ${p === data.page ? "bg-black text-white" : "bg-white"}`}>{p}</Link>)}</div>}
    </section>
  </div>;
}
