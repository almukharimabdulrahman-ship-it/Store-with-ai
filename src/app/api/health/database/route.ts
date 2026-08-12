import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const safeDatabaseConfiguration = () => {
  const value = process.env.DATABASE_URL;
  if (!value) return { present: false };

  try {
    const url = new URL(value);
    return {
      present: true,
      parseable: true,
      protocolOk: ["postgres:", "postgresql:"].includes(url.protocol),
      usernameOk: url.username === "postgres.lnzpdfotfutkqsiknrbq",
      poolerHost: url.hostname.endsWith(".pooler.supabase.com"),
      regionHostOk: url.hostname === "aws-0-eu-west-1.pooler.supabase.com",
      port: url.port || "default",
      databaseOk: url.pathname === "/postgres",
      pgbouncer: url.searchParams.get("pgbouncer") === "true",
      connectionLimit: url.searchParams.get("connection_limit") ?? "unset",
      sslMode: url.searchParams.get("sslmode") ?? "unset",
    };
  } catch {
    return { present: true, parseable: false };
  }
};

const diagnosticCode = (error: unknown) => {
  const record = error && typeof error === "object"
    ? error as { code?: unknown; errorCode?: unknown }
    : undefined;
  const prismaCode = [record?.errorCode, record?.code]
    .find((value): value is string => typeof value === "string" && value.length > 0);
  const message = error instanceof Error ? error.message : "";
  const normalizedMessage = message.toLowerCase();

  if (!prismaCode) {
    if (normalizedMessage.includes("environment variable not found")) return "DB_ENV_MISSING";
    if (normalizedMessage.includes("authentication failed")) {
      return "DB_AUTH_REJECTED";
    }
    if (normalizedMessage.includes("tenant or user not found")) return "DB_POOLER_TENANT_INVALID";
    if (normalizedMessage.includes("can't reach database server")) return "DB_HOST_UNREACHABLE";
    if (normalizedMessage.includes("timed out fetching a new connection")) return "DB_POOL_TIMEOUT";
    if (normalizedMessage.includes("prepared statement") && normalizedMessage.includes("already exists")) {
      return "DB_POOLER_MODE_INVALID";
    }
    if (normalizedMessage.includes("invalid connection string") || normalizedMessage.includes("invalid port")) {
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
      {
        ok: true,
        diagnostic: "DB_CONNECTED",
        durationMs: Date.now() - startedAt,
        configuration: safeDatabaseConfiguration(),
      },
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
      {
        ok: false,
        diagnostic,
        durationMs: Date.now() - startedAt,
        configuration: safeDatabaseConfiguration(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
