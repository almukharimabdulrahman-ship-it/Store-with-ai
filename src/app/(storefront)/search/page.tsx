import { CatalogView } from "@/components/storefront/catalog";
import { getCatalog, getStoreProfile } from "@/lib/storefront";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, profile] = await Promise.all([getCatalog(params), getStoreProfile()]);
  return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="mb-8 text-3xl font-black">Search</h1><CatalogView data={data} currency={profile.currency} params={params}/></div>;
}
