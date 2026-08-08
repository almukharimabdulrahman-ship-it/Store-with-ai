"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "store_cart";

async function getCartOwner() {
  const session = await auth();
  if (session?.user?.id) return { userId: session.user.id, sessionToken: null as string | null };
  const jar = await cookies();
  let sessionToken = jar.get(CART_COOKIE)?.value;
  if (!sessionToken) {
    sessionToken = randomUUID();
    jar.set(CART_COOKIE, sessionToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return { userId: null as string | null, sessionToken };
}

async function getOrCreateCart() {
  const owner = await getCartOwner();
  if (owner.userId) {
    return prisma.cart.upsert({ where: { userId: owner.userId }, update: {}, create: { userId: owner.userId } });
  }
  return prisma.cart.upsert({ where: { sessionToken: owner.sessionToken! }, update: {}, create: { sessionToken: owner.sessionToken! } });
}

export async function addToCart(formData: FormData) {
  const variantId = String(formData.get("variantId") || "");
  const requested = Math.max(1, Number(formData.get("quantity") || 1));
  const variant = await prisma.productVariant.findFirst({ where: { id: variantId, active: true, product: { status: "ACTIVE" } }, include: { inventory: true } });
  if (!variant || !variant.inventory || variant.inventory.availableQuantity < 1) return;
  const cart = await getOrCreateCart();
  const existing = await prisma.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } });
  const quantity = Math.min(variant.inventory.availableQuantity, (existing?.quantity ?? 0) + requested);
  await prisma.cartItem.upsert({ where: { cartId_variantId: { cartId: cart.id, variantId } }, update: { quantity }, create: { cartId: cart.id, variantId, quantity } });
  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const requested = Math.max(0, Number(formData.get("quantity") || 0));
  const owner = await getCartOwner();
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: owner.userId ? { userId: owner.userId } : { sessionToken: owner.sessionToken! } }, include: { variant: { include: { inventory: true } } } });
  if (!item) return;
  if (requested <= 0) await prisma.cartItem.delete({ where: { id: item.id } });
  else await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: Math.min(requested, item.variant.inventory?.availableQuantity ?? 0) } });
  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const owner = await getCartOwner();
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cart: owner.userId ? { userId: owner.userId } : { sessionToken: owner.sessionToken! } } });
  if (item) await prisma.cartItem.delete({ where: { id: item.id } });
  revalidatePath("/cart");
}

export async function addToWishlist(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const productId = String(formData.get("productId") || "");
  const product = await prisma.product.findFirst({ where: { id: productId, status: "ACTIVE" } });
  if (!product) return;
  const wishlist = await prisma.wishlist.upsert({ where: { userId: session.user.id }, update: {}, create: { userId: session.user.id } });
  const existing = await prisma.wishlistItem.findUnique({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId } } });
  if (!existing) await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
  revalidatePath("/wishlist");
}

export async function removeWishlistItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const productId = String(formData.get("productId") || "");
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.user.id } });
  if (!wishlist) return;
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });
  revalidatePath("/wishlist");
}

export async function moveWishlistToCart(formData: FormData) {
  await addToCart(formData);
  await removeWishlistItem(formData);
  revalidatePath("/cart");
  revalidatePath("/wishlist");
}
