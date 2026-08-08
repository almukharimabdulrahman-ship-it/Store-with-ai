"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const data = z.object({ name: z.string().min(2), parentId: z.string().optional(), sortOrder: z.coerce.number().int().default(0) }).parse(Object.fromEntries(formData));
  await prisma.category.create({ data: { name: data.name, slug: slugify(data.name), parentId: data.parentId || null, sortOrder: data.sortOrder } });
  revalidatePath("/admin/categories");
}

export async function toggleCategory(id: string, active: boolean) {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { active } });
  revalidatePath("/admin/categories");
}

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const data = z.object({ name: z.string().min(2), logoUrl: z.string().url().optional().or(z.literal("")) }).parse(Object.fromEntries(formData));
  await prisma.brand.create({ data: { name: data.name, slug: slugify(data.name), logoUrl: data.logoUrl || null } });
  revalidatePath("/admin/brands");
}

export async function toggleBrand(id: string, active: boolean) {
  await requireAdmin();
  await prisma.brand.update({ where: { id }, data: { active } });
  revalidatePath("/admin/brands");
}

export async function moderateReview(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reviews");
}

export async function createCoupon(formData: FormData) {
  await requireAdmin();
  const data = z.object({ code: z.string().min(2), discountType: z.enum(["PERCENTAGE", "FIXED"]), value: z.coerce.number().positive(), usageLimit: z.coerce.number().int().positive().optional() }).parse(Object.fromEntries(formData));
  await prisma.coupon.create({ data: { code: data.code.trim().toUpperCase(), discountType: data.discountType, value: data.value, usageLimit: data.usageLimit || null } });
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(id: string, active: boolean) {
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/admin/coupons");
}

export async function saveStoreSettings(formData: FormData) {
  await requireAdmin();
  const data = z.object({ name: z.string().min(2), currency: z.string().min(3).max(3), country: z.string().min(2), supportEmail: z.string().email().optional().or(z.literal("")), supportPhone: z.string().optional() }).parse(Object.fromEntries(formData));
  await prisma.storeSetting.upsert({
    where: { key: "store.profile" },
    update: { value: data },
    create: { key: "store.profile", value: data },
  });
  revalidatePath("/admin/settings");
}
