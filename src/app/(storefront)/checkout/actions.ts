"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema, createGuestAccessToken, createOrderNumber, decimal, getShippingConfig, resolveCoupon } from "@/lib/checkout";

export type CheckoutState = { error?: string };

export async function placeOrder(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid checkout details" };

  const input = parsed.data;
  const session = await auth();
  const jar = await cookies();
  const guestToken = jar.get("store_cart")?.value;

  const existing = await prisma.order.findUnique({ where: { checkoutToken: input.checkoutToken } });
  if (existing) {
    if (existing.userId && existing.userId === session?.user?.id) redirect(`/checkout/success/${existing.orderNumber}`);
    return { error: "This checkout request has already been processed" };
  }

  const cart = await prisma.cart.findFirst({
    where: session?.user?.id ? { userId: session.user.id } : guestToken ? { sessionToken: guestToken } : { id: "00000000-0000-0000-0000-000000000000" },
    include: {
      items: {
        include: { variant: { include: { product: true, inventory: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart || !cart.items.length) return { error: "Your cart is empty" };

  for (const item of cart.items) {
    if (item.quantity < 1 || !item.variant.active || item.variant.product.status !== "ACTIVE" || !item.variant.inventory) return { error: "One or more cart items are unavailable" };
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.variant.salePrice ?? item.variant.price) * item.quantity, 0);
  const { coupon, discount } = await resolveCoupon(input.coupon || undefined, subtotal).catch((error: unknown) => { throw error; });
  const shipping = await getShippingConfig();
  if (shipping.allowedCountries.length && !shipping.allowedCountries.includes(input.country)) return { error: "Shipping is not available for this country" };
  if (shipping.allowedCities.length && !shipping.allowedCities.includes(input.city)) return { error: "Shipping is not available for this city" };
  const shippingCost = shipping.freeThreshold !== null && subtotal - discount >= shipping.freeThreshold ? 0 : shipping.flatRate;
  const total = Math.max(0, subtotal - discount + shippingCost);
  const guestAccess = session?.user?.id ? null : createGuestAccessToken();
  const orderNumber = createOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.order.findUnique({ where: { checkoutToken: input.checkoutToken } });
      if (duplicate) return duplicate;

      for (const item of cart.items) {
        const updated = await tx.inventory.updateMany({
          where: { variantId: item.variantId, availableQuantity: { gte: item.quantity } },
          data: { availableQuantity: { decrement: item.quantity }, reservedQuantity: { increment: item.quantity } },
        });
        if (updated.count !== 1) throw new Error(`Insufficient stock for ${item.variant.sku}`);
      }

      if (coupon) {
        const claimed = await tx.coupon.updateMany({
          where: { id: coupon.id, active: true, ...(coupon.usageLimit !== null ? { usedCount: { lt: coupon.usageLimit } } : {}) },
          data: { usedCount: { increment: 1 } },
        });
        if (claimed.count !== 1) throw new Error("Coupon is no longer available");
      }

      const created = await tx.order.create({
        data: {
          orderNumber,
          checkoutToken: input.checkoutToken,
          guestAccessTokenHash: guestAccess?.hash ?? null,
          userId: session?.user?.id ?? null,
          couponId: coupon?.id ?? null,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: input.paymentMethod,
          currency: shipping.currency,
          customerName: input.fullName,
          customerEmail: input.email || session?.user?.email || null,
          customerPhone: input.phone,
          shippingCountry: input.country,
          shippingCity: input.city,
          shippingArea: input.area || null,
          shippingLine1: input.line1,
          shippingLine2: input.line2 || null,
          shippingPostalCode: input.postalCode || null,
          subtotal: decimal(subtotal),
          discount: decimal(discount),
          shippingCost: decimal(shippingCost),
          total: decimal(total),
          notes: input.notes || null,
          items: {
            create: cart.items.map((item) => {
              const unitPrice = Number(item.variant.salePrice ?? item.variant.price);
              return {
                productId: item.variant.productId,
                variantId: item.variantId,
                productName: item.variant.product.name,
                variantName: item.variant.name,
                sku: item.variant.sku,
                unitPrice: decimal(unitPrice),
                quantity: item.quantity,
                lineTotal: decimal(unitPrice * item.quantity),
              };
            }),
          },
          payments: {
            create: {
              status: "PENDING",
              method: input.paymentMethod,
              provider: input.paymentMethod === "CASH_ON_DELIVERY" ? "cash_on_delivery" : "pending_provider",
              amount: decimal(total),
              currency: shipping.currency,
            },
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id, id: { in: cart.items.map((item) => item.id) } } });
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    const guestQuery = guestAccess ? `?access=${encodeURIComponent(guestAccess.token)}` : "";
    redirect(`/checkout/success/${order.orderNumber}${guestQuery}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    return { error: error instanceof Error ? error.message : "Unable to place order" };
  }
}
