import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const diagnosticCode = (error: unknown) => {
  const record = error && typeof error === "object"
    ? error as { code?: unknown; errorCode?: unknown }
    : undefined;
  const prismaCode = [record?.errorCode, record?.code]
    .find((value): value is string => typeof value === "string" && value.length > 0);
  const message = error instanceof Error ? error.message : "";

  if (!prismaCode) {
    if (message.includes("Environment variable not found")) return "DB_ENV_MISSING";
    if (message.includes("Authentication failed")) return "DB_AUTH_REJECTED";
    if (message.includes("Can't reach database server")) return "DB_HOST_UNREACHABLE";
    if (message.includes("Timed out fetching a new connection")) return "DB_POOL_TIMEOUT";
    if (message.includes("prepared statement") && message.includes("already exists")) {
      return "DB_POOLER_MODE_INVALID";
    }
    if (message.includes("invalid connection string") || message.includes("invalid port")) {
      return "DB_URL_INVALID";
    }
    return error instanceof Error
      ? `DB_${error.name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`
      : "DB_UNKNOWN";
  }

  switch (prismaCode) {
    case "P1000":
      return "DB_AUTH_REJECTED";
    case "P1001":
      return "DB_HOST_UNREACHABLE";
    case "P1002":
      return "DB_CONNECTION_TIMEOUT";
    case "P1013":
      return "DB_URL_INVALID";
    case "P2024":
      return "DB_POOL_TIMEOUT";
    default:
      return `DB_${prismaCode}`;
  }
};

export async function GET() {
  const startedAt = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      { ok: true, diagnostic: "DB_CONNECTED", durationMs: Date.now() - startedAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const diagnostic = diagnosticCode(error);

    console.error(
      JSON.stringify({
        level: "error",
        message: "Database health check failed",
        diagnostic,
        durationMs: Date.now() - startedAt,
      }),
    );

    return Response.json(
      { ok: false, diagnostic, durationMs: Date.now() - startedAt },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
