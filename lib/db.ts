import { PrismaClient } from "@prisma/client";

/**
 * The one Prisma client for the app.
 *
 * Next.js reloads modules in development, so the client is kept on
 * `globalThis` there to avoid opening a new connection pool on every reload.
 * `DATABASE_URL` is read by Prisma itself from the environment.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
