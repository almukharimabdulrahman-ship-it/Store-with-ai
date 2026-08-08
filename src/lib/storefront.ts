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
  q?: string; category?: string; brand?: string; min?: string; max?: string; sale?: string; sort?: string; page?: string;
};

export async function getCatalog(params: CatalogParams = {}) {
  const page = Math.max(1, Number(params.page || 1));
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
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
    ...(params.sale === "1" ? { variants: { some: { active: true, salePrice: { not: null } } } } : {}),
    ...((min !== undefined || max !== undefined) ? { variants: { some: { active: true, price: { ...(min !== undefined ? { gte: min } : {}), ...(max !== undefined ? { lte: max } : {}) } } } } : {}),
  };
  const orderBy: Prisma.ProductOrderByWithRelationInput = params.sort === "price-asc"
    ? { variants: { _count: "asc" } }
    : params.sort === "price-desc"
      ? { variants: { _count: "desc" } }
      : params.sort === "featured" ? { featured: "desc" } : { createdAt: "desc" };
  const [items, total, categories, brands] = await Promise.all([
    prisma.product.findMany({ where, include: { brand: true, images: { orderBy: { sortOrder: "asc" }, take: 1 }, variants: { where: { active: true }, include: { inventory: true }, orderBy: { price: "asc" }, take: 1 } }, orderBy, skip: (page - 1) * STOREFRONT_PAGE_SIZE, take: STOREFRONT_PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]).catch(() => [[], 0, [], []] as const);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / STOREFRONT_PAGE_SIZE)), categories, brands };
}

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
