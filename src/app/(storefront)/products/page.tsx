import { CatalogView } from "@/components/storefront/catalog";
import { getCatalog, getStoreProfile } from "@/lib/storefront";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, profile] = await Promise.all([getCatalog(params), getStoreProfile()]);
  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="mb-8"><h1 className="text-3xl font-black">Products</h1><p className="mt-2 text-neutral-500">Browse our active catalog and filter by category, brand, price, and availability.</p></div><CatalogView data={data} currency={profile.currency} params={params}/></div>;
}
