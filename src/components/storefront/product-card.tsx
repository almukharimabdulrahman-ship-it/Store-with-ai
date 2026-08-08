import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    featured: boolean;
    brand: { name: string } | null;
    images: { url: string; alt: string | null }[];
    variants: { price: unknown; salePrice: unknown; inventory: { availableQuantity: number } | null }[];
  };
  currency?: string;
};

export function ProductCard({ product, currency = "LYD" }: ProductCardProps) {
  const variant = product.variants[0];
  const price = variant ? Number(variant.price) : null;
  const sale = variant?.salePrice != null ? Number(variant.salePrice) : null;
  const inStock = (variant?.inventory?.availableQuantity ?? 0) > 0;
  return (
    <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="aspect-square bg-neutral-100 p-4">
        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].alt ?? product.name} className="h-full w-full object-contain transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-neutral-400">No image</div>}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {sale != null && <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">Sale</span>}
          {product.featured && <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Featured</span>}
          <span className={`rounded-full px-2 py-1 ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>{inStock ? "In stock" : "Out of stock"}</span>
        </div>
        <p className="text-xs uppercase tracking-wide text-neutral-500">{product.brand?.name ?? "Store"}</p>
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        {price != null && <div className="flex items-baseline gap-2"><span className="text-lg font-bold">{(sale ?? price).toFixed(2)} {currency}</span>{sale != null && <span className="text-sm text-neutral-400 line-through">{price.toFixed(2)} {currency}</span>}</div>}
      </div>
    </Link>
  );
}
