import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { getProductBySlug, getRelatedProducts, getStoreProfile } from "@/lib/storefront";
import { addToCart, addToWishlist } from "../../actions";

async function addToCartAction(formData: FormData) {
  "use server";
  await addToCart(formData);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product ? { title: product.name, description: product.description ?? undefined } : { title: "Product not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const [profile, related] = await Promise.all([getStoreProfile(), getRelatedProducts(product.id, product.categories.map(x => x.categoryId))]);
  const first = product.variants[0];
  const stock = first?.inventory?.availableQuantity ?? 0;
  const price = first ? Number(first.price) : null;
  const sale = first?.salePrice != null ? Number(first.salePrice) : null;
  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="grid gap-10 lg:grid-cols-2"><section><div className="aspect-square overflow-hidden rounded-3xl border bg-white p-6">{product.images[0] ? <img src={product.images[0].url} alt={product.images[0].alt ?? product.name} className="h-full w-full object-contain"/> : <div className="flex h-full items-center justify-center text-neutral-400">No image</div>}</div>{product.images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{product.images.slice(1, 5).map(img => <div key={img.id} className="aspect-square rounded-xl border bg-white p-2"><img src={img.url} alt={img.alt ?? product.name} className="h-full w-full object-contain"/></div>)}</div>}</section><section><p className="text-sm uppercase tracking-wider text-neutral-500">{product.brand?.name ?? "Store"}</p><h1 className="mt-2 text-4xl font-black">{product.name}</h1>{product.categories.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{product.categories.map(x => <Link key={x.categoryId} href={`/category/${x.category.slug}`} className="rounded-full bg-neutral-100 px-3 py-1 text-xs">{x.category.name}</Link>)}</div>}{price != null && <div className="mt-6 flex items-baseline gap-3"><span className="text-3xl font-black">{(sale ?? price).toFixed(2)} {profile.currency}</span>{sale != null && <span className="text-lg text-neutral-400 line-through">{price.toFixed(2)} {profile.currency}</span>}</div>}<p className={`mt-3 text-sm font-medium ${stock > 0 ? "text-emerald-700" : "text-red-700"}`}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>{product.description && <p className="mt-6 leading-7 text-neutral-600">{product.description}</p>}
      {product.variants.length > 0 && <form action={addToCartAction} className="mt-8 space-y-4"><div><label className="mb-2 block text-sm font-medium">Variant</label><select name="variantId" className="w-full rounded-xl border bg-white px-4 py-3">{product.variants.map(v => <option key={v.id} value={v.id}>{v.name ?? v.sku} · {Number(v.salePrice ?? v.price).toFixed(2)} {profile.currency}</option>)}</select></div><div><label className="mb-2 block text-sm font-medium">Quantity</label><input type="number" name="quantity" min="1" max={Math.max(1, stock)} defaultValue="1" className="w-28 rounded-xl border px-4 py-3"/></div><button disabled={stock < 1} className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-40">Add to cart</button></form>}
      <form action={addToWishlist} className="mt-3"><input type="hidden" name="productId" value={product.id}/><button className="w-full rounded-xl border bg-white px-5 py-3 font-semibold">Add to wishlist</button></form>
      <div className="mt-8 rounded-2xl border bg-white p-5 text-sm"><p><strong>SKU:</strong> {first?.sku ?? "—"}</p><p className="mt-2"><strong>Brand:</strong> {product.brand?.name ?? "—"}</p></div>
    </section></div>
    <section className="mt-14"><h2 className="text-2xl font-bold">Customer reviews</h2>{product.reviews.length ? <div className="mt-5 space-y-4">{product.reviews.map(r => <article key={r.id} className="rounded-2xl border bg-white p-5"><div className="flex justify-between"><strong>{r.user.name ?? "Customer"}</strong><span>{"★".repeat(Math.max(0, Math.min(5, r.rating)))}</span></div>{r.title && <h3 className="mt-2 font-semibold">{r.title}</h3>}{r.body && <p className="mt-2 text-neutral-600">{r.body}</p>}</article>)}</div> : <p className="mt-4 text-neutral-500">No approved reviews yet.</p>}</section>
    <section className="mt-14"><h2 className="mb-5 text-2xl font-bold">Related products</h2>{related.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map(p => <ProductCard key={p.id} product={p} currency={profile.currency}/>)}</div> : <p className="text-neutral-500">No related products available.</p>}</section>
  </div>;
}
