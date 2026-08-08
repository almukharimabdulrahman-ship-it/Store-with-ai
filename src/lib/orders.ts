import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashGuestAccessToken } from "@/lib/checkout";

export async function getOrderForReceipt(orderNumber: string, access?: string) {
  const session = await auth();
  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true, payments: { select: { status: true, method: true, amount: true, currency: true } } } }).catch(() => null);
  if (!order) return null;
  if (order.userId) return session?.user?.id === order.userId ? order : null;
  if (!access || !order.guestAccessTokenHash) return null;
  return hashGuestAccessToken(access) === order.guestAccessTokenHash ? order : null;
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({ where: { userId }, select: { orderNumber: true, createdAt: true, total: true, currency: true, status: true, paymentStatus: true, _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } });
}

export async function getUserOrder(userId: string, orderNumber: string) {
  return prisma.order.findFirst({ where: { userId, orderNumber }, include: { items: true } });
}
