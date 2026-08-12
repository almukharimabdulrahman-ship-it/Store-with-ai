import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const diagnosticCode = (error: unknown) => {
  const prismaCode =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "UNKNOWN";

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
