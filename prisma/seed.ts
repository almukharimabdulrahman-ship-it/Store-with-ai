import { PrismaClient, ProductStatus, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error("Refusing to seed in production. Set ALLOW_PRODUCTION_SEED=true to override.");
  }

  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    update: {},
    create: { code: "ADMIN", name: "Administrator" },
  });

  const customerRole = await prisma.role.upsert({
    where: { code: "CUSTOMER" },
    update: {},
    create: { code: "CUSTOMER", name: "Customer" },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Sample Customer",
      phone: "+218910000000",
      roleId: customerRole.id,
    },
  });

  await prisma.address.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: customer.id,
      label: "Home",
      fullName: "Sample Customer",
      phone: "+218910000000",
      country: "Libya",
      city: "Tripoli",
      line1: "Tripoli",
      isDefault: true,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "security-cameras" },
    update: {},
    create: {
      name: "Security Cameras",
      slug: "security-cameras",
      description: "Indoor and outdoor smart surveillance cameras.",
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "imou" },
    update: {},
    create: { name: "Imou", slug: "imou" },
  });

  const product = await prisma.product.upsert({
    where: { slug: "imou-cruiser-se-plus" },
    update: {},
    create: {
      name: "Imou Cruiser SE+",
      slug: "imou-cruiser-se-plus",
      description: "Smart outdoor pan-and-tilt security camera.",
      brandId: brand.id,
      status: ProductStatus.ACTIVE,
      featured: true,
    },
  });

  await prisma.productCategory.upsert({
    where: { productId_categoryId: { productId: product.id, categoryId: category.id } },
    update: {},
    create: { productId: product.id, categoryId: category.id },
  });

  const variant = await prisma.productVariant.upsert({
    where: { sku: "IMOU-CRUISER-SE-PLUS-WHITE" },
    update: {},
    create: {
      productId: product.id,
      sku: "IMOU-CRUISER-SE-PLUS-WHITE",
      name: "White",
      color: "White",
      price: 399,
      salePrice: 349,
    },
  });

  await prisma.inventory.upsert({
    where: { variantId: variant.id },
    update: { availableQuantity: 25 },
    create: {
      variantId: variant.id,
      availableQuantity: 25,
      reservedQuantity: 0,
      lowStockThreshold: 5,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off for new customers",
      discountType: DiscountType.PERCENTAGE,
      value: 10,
      active: true,
    },
  });

  await prisma.storeSetting.upsert({
    where: { key: "store.profile" },
    update: {},
    create: {
      key: "store.profile",
      value: {
        name: "Store with AI",
        currency: "LYD",
        country: "Libya",
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: "WELCOME",
      title: "Welcome",
      message: "Welcome to Store with AI.",
    },
  });

  console.log({ adminRole: adminRole.code, customer: customer.email, product: product.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
