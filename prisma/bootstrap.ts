import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    ["SUPER_ADMIN", "Super Administrator"],
    ["ADMIN", "Administrator"],
    ["MANAGER", "Manager"],
    ["CUSTOMER", "Customer"],
  ] as const;

  for (const [code, name] of roles) {
    await prisma.role.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    });
  }

  await prisma.storeSetting.upsert({
    where: { key: "store.profile" },
    update: {},
    create: {
      key: "store.profile",
      value: { name: "Store with AI", currency: "LYD", country: "Libya" },
    },
  });

  console.log("[db bootstrap] roles and store profile are ready");
}

main()
  .catch((error) => {
    console.error("[db bootstrap] failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
