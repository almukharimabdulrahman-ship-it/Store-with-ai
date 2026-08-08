import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CatalogView } from "@/components/storefront/catalog";
import { getCatalog, getStoreProfile } from "@/lib/storefront";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { slug } = await params;
  const category = await prisma.category.findFirst({ where: { slug, active: true } }).catch(() => null);
  if (!category) notFound();
  const incoming = await searchParams;
  const merged = { ...incoming, category: slug };
  const [data, profile] = await Promise.all([getCatalog(merged), getStoreProfile()]);
  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="mb-8"><h1 className="text-3xl font-black">{category.name}</h1>{category.description && <p className="mt-2 text-neutral-500">{category.description}</p>}</div><CatalogView data={data} currency={profile.currency} params={merged}/></div>;
}
