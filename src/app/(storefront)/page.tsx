import Link from "next/link";
import { getHomepageData, getStoreProfile } from "@/lib/storefront";
import { ProductCard } from "@/components/storefront/product-card";

export default async function StorefrontHome() {
  const [data, profile] = await Promise.all([getHomepageData(), getStoreProfile()]);
  return <div>
    <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white"><div className="mx-auto max-w-7xl px-4 py-20 md:py-28"><p className="text-sm uppercase tracking-[0.25em] text-neutral-400">Smart security & electronics</p><h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Protect what matters with smarter technology.</h1><p className="mt-5 max-w-2xl text-neutral-300">Discover reliable security cameras, smart devices, and connected-home products selected for everyday use.</p><div className="mt-8 flex gap-3"><Link href="/products" className="rounded-xl bg-white px-5 py-3 font-semibold text-black">Shop products</Link><Link href="/search" className="rounded-xl border border-neutral-600 px-5 py-3 font-semibold">Search store</Link></div></div></section>
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
      {data.categories.length > 0 && <section><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Shop by category</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{data.categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className="rounded-2xl border bg-white p-5 hover:shadow-md"><h3 className="font-semibold">{c.name}</h3><p className="mt-2 text-sm text-neutral-500">Explore {c.name}</p></Link>)}</div></section>}
      <ProductSection title="Featured products" products={data.featured} currency={profile.currency}/>
      <ProductSection title="New arrivals" products={data.newest} currency={profile.currency}/>
      <section className="rounded-3xl bg-neutral-900 px-6 py-10 text-white md:px-10"><p className="text-sm uppercase tracking-widest text-neutral-400">Special offers</p><h2 className="mt-2 text-3xl font-bold">Upgrade your setup for less.</h2><p className="mt-3 text-neutral-300">Browse products currently available at sale pricing.</p><Link href="/products?sale=1" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black">View sale products</Link></section>
      <ProductSection title="On sale" products={data.sale} currency={profile.currency}/>
      {data.brands.length > 0 && <section><h2 className="mb-5 text-2xl font-bold">Brands</h2><div className="flex flex-wrap gap-3">{data.brands.map(b => <Link key={b.id} href={`/brand/${b.slug}`} className="rounded-full border bg-white px-5 py-2 text-sm font-medium">{b.name}</Link>)}</div></section>}
    </div>
  </div>;
}

function ProductSection({ title, products, currency }: { title: string; products: readonly any[]; currency: string }) {
  return <section><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">{title}</h2><Link href="/products" className="text-sm font-medium">View all →</Link></div>{products.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={p} currency={currency}/>)}</div> : <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-neutral-500">No products available yet.</div>}</section>;
}
