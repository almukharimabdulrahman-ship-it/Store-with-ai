import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const [orders, customers, products, lowStock] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.count({ where: { role: { code: "CUSTOMER" } } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.inventory.findMany({ where: { availableQuantity: { lte: prisma.inventory.fields.lowStockThreshold } }, include: { variant: { include: { product: true } } }, take: 8 }),
  ]).catch(() => [[], 0, 0, []] as const);

  const paidRevenue = orders.reduce((sum, order) => order.paymentStatus === "PAID" ? sum + Number(order.total) : sum, 0);
  return { orders, customers, products, lowStock, paidRevenue };
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: { brand: true, variants: { include: { inventory: true } }, categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  }).catch(() => []);
}

export async function getAdminOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => []);
}

export async function getAdminCustomers() {
  return prisma.user.findMany({
    where: { role: { code: "CUSTOMER" } },
    select: { id: true, name: true, email: true, emailVerified: true, createdAt: true, orders: { select: { total: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  }).catch(() => []);
}

export async function getAdminInventory() {
  return prisma.inventory.findMany({ include: { variant: { include: { product: true } } }, orderBy: { availableQuantity: "asc" }, take: 200 }).catch(() => []);
}
