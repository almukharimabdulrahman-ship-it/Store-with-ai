import { createHash, randomBytes, randomUUID } from "node:crypto";
import { PaymentMethod, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStoreProfile } from "@/lib/storefront";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(6).max(30),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  area: z.string().trim().max(120).optional().or(z.literal("")),
  line1: z.string().trim().min(3).max(180),
  line2: z.string().trim().max(180).optional().or(z.literal("")),
  postalCode: z.string().trim().max(30).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  coupon: z.string().trim().max(64).optional().or(z.literal("")),
  paymentMethod: z.nativeEnum(PaymentMethod),
  checkoutToken: z.string().uuid(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export function createGuestAccessToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: createHash("sha256").update(token).digest("hex") };
}

export function hashGuestAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createOrderNumber() {
  const now = new Date();
  const date = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  return `ORD-${date}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export function newCheckoutToken() { return randomUUID(); }

export async function getShippingConfig() {
  const [setting, profile] = await Promise.all([
    prisma.storeSetting.findUnique({ where: { key: "shipping.config" } }).catch(() => null),
    getStoreProfile(),
  ]);
  const value = setting?.value && typeof setting.value === "object" ? setting.value as Record<string, unknown> : {};
  return {
    currency: profile.currency,
    flatRate: Number.isFinite(Number(value.flatRate)) ? Math.max(0, Number(value.flatRate)) : 0,
    freeThreshold: Number.isFinite(Number(value.freeThreshold)) ? Math.max(0, Number(value.freeThreshold)) : null,
    allowedCountries: Array.isArray(value.allowedCountries) ? value.allowedCountries.filter((v): v is string => typeof v === "string") : [],
    allowedCities: Array.isArray(value.allowedCities) ? value.allowedCities.filter((v): v is string => typeof v === "string") : [],
  };
}

export async function resolveCoupon(code: string | undefined, subtotal: number) {
  if (!code) return { coupon: null, discount: 0 };
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  const now = new Date();
  if (!coupon || !coupon.active || (coupon.startsAt && coupon.startsAt > now) || (coupon.endsAt && coupon.endsAt < now)) throw new Error("Coupon is invalid or expired");
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon usage limit reached");
  if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) throw new Error("Order does not meet coupon minimum");
  let discount = coupon.discountType === "PERCENTAGE" ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
  if (coupon.maximumDiscount) discount = Math.min(discount, Number(coupon.maximumDiscount));
  discount = Math.min(subtotal, Math.max(0, discount));
  return { coupon, discount };
}

export function decimal(value: number) { return new Prisma.Decimal(value.toFixed(2)); }
