import { prisma } from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";

export const STOREFRONT_PAGE_SIZE = 12;

export async function getStoreProfile() {
  const setting = await prisma.storeSetting.findUnique({ where: { key: "store.profile" } }).catch(() => null);
  const value = setting?.value && typeof setting.value === "object" ? setting.value as Record<string, unknown> : {};
  return {
    name: typeof value.name === "string" ? value.name : "Store with AI",
    currency: typeof value.currency === "string" ? value.currency : "LYD",
    country: typeof value.country === "string" ? value.country : "Libya",
    supportEmail: typeof value.supportEmail === "string" ? value.supportEmail : "",
    supportPhone: typeof value.supportPhone === "string" ? value.supportPhone : "",
  };
}

export async function getHomepageData() {
  const [featured, newest, categories, brands, sale] = await Promise.all([
    prisma.product.findMany({ where: { status: ProductStatus.ACTIVE, featured: true }, include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, take: 1 } }, orderBy: { updatedAt: "desc" }, take: 8 }),
    prisma.product.findMany({ where: { status: ProductStatus.ACTIVE }, include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.category.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 8 }),
    prisma.brand.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 8 }),
    prisma.product.findMany({ where: { status: ProductStatus.ACTIVE, variants: { some: { active: true, salePrice: { not: null } } } }, include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, take: 1 } }, orderBy: { updatedAt: "desc" }, take: 8 }),
  ]).catch(() => [[], [], [], [], []] as const);
  return { featured, newest, categories, brands, sale };
}

export type CatalogParams = {
  q?: string;
  category?: string;
  brand?: string;
  min?: string;
  max?: string;
  sale?: string;
  sort?: string;
  page?: string;
};

const finiteNonNegative = (value?: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const safePage = (value?: string) => {
  const parsed = Number(value ?? "1");
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
};

export async function getCatalog(params: CatalogParams = {}) {
  const page = safePage(params.page);
  const min = finiteNonNegative(params.min);
  const max = finiteNonNegative(params.max);
  const low = min !== undefined && max !== undefined ? Math.min(min, max) : min;
  const high = min !== undefined && max !== undefined ? Math.max(min, max) : max;

  const and: Prisma.ProductWhereInput[] = [];

  if (params.sale === "1") {
    and.push({ variants: { some: { active: true, salePrice: { not: null } } } });
  }

  if (low !== undefined || high !== undefined) {
    const range = {
      ...(low !== undefined ? { gte: low } : {}),
      ...(high !== undefined ? { lte: high } : {}),
    };
    and.push({
      variants: {
        some: {
          active: true,
          OR: [
            { salePrice: { not: null, ...range } },
            { salePrice: null, price: range },
          ],
        },
      },
    });
  }

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
    ...(params.q ? { OR: [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { brand: { name: { contains: params.q, mode: "insensitive" } } },
      { categories: { some: { category: { name: { contains: params.q, mode: "insensitive" } } } } },
    ] } : {}),
    ...(params.category ? { categories: { some: { category: { slug: params.category, active: true } } } } : {}),
    ...(params.brand ? { brand: { slug: params.brand, active: true } } : {}),
    ...(and.length ? { AND: and } : {}),
  };

  const include = {
    brand: true,
    images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
    variants: { where: { active: true }, include: { inventory: true }, orderBy: { price: "asc" as const } },
  };

  const priceSort = params.sort === "price-asc" || params.sort === "price-desc";

  try {
    const [categories, brands, total] = await Promise.all([
      prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.brand.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
      prisma.product.count({ where }),
    ]);

    if (priceSort) {
      const all = await prisma.product.findMany({ where, include });
      const effectivePrice = (product: (typeof all)[number]) => {
        const prices = product.variants.map((variant) => Number(variant.salePrice ?? variant.price));
        return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
      };
      all.sort((a, b) => {
        const delta = effectivePrice(a) - effectivePrice(b);
        return params.sort === "price-desc" ? -delta : delta;
      });
      const start = (page - 1) * STOREFRONT_PAGE_SIZE;
      const items = all.slice(start, start + STOREFRONT_PAGE_SIZE);
      return { items, total, page, pages: Math.max(1, Math.ceil(total / STOREFRONT_PAGE_SIZE)), categories, brands };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = params.sort === "featured"
      ? { featured: "desc" }
      : { createdAt: "desc" };
    const items = await prisma.product.findMany({
      where,
      include: { ...include, variants: { ...include.variants, take: 1 } },
      orderBy,
      skip: (page - 1) * STOREFRONT_PAGE_SIZE,
      take: STOREFRONT_PAGE_SIZE,
    });
    return { items, total, page, pages: Math.max(1, Math.ceil(total / STOREFRONT_PAGE_SIZE)), categories, brands };
  } catch {
    return { items: [], total: 0, page: 1, pages: 1, categories: [], brands: [] };
  }
}

export type CatalogData = Awaited<ReturnType<typeof getCatalog>>;

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE },
    include: {
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { active: true }, include: { inventory: true }, orderBy: { price: "asc" } },
      categories: { include: { category: true } },
      reviews: { where: { status: "APPROVED" }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  }).catch(() => null);
}

export async function getRelatedProducts(productId: string, categoryIds: string[]) {
  return prisma.product.findMany({
    where: { id: { not: productId }, status: ProductStatus.ACTIVE, ...(categoryIds.length ? { categories: { some: { categoryId: { in: categoryIds } } } } : {}) },
    include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, take: 1 } },
    take: 4,
  }).catch(() => []);
}
