import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * The health path (8.4): `200` with `{"status":"ok"}` when the database
 * answers, `503` when it does not, so the owner is alerted.
 */
export async function GET(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json({ status: "error" }, { status: 503 });
  }
}
