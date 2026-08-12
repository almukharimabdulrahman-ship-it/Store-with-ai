import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

const retryableDatabaseError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  const code = "code" in error ? String(error.code) : "";
  return (
    ["P1001", "P1002", "P2024"].includes(code) ||
    error.message.includes("Can't reach database server") ||
    error.message.includes("Timed out fetching a new connection")
  );
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const prisma = basePrisma.$extends({
  name: "retry-transient-database-errors",
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt >= 2 || !retryableDatabaseError(error)) throw error;
            console.warn("[database] transient connection failure; retrying", {
              attempt: attempt + 1,
            });
            await wait(350 * (attempt + 1));
          }
        }
      },
    },
  },
});
