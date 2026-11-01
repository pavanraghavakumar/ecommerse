import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestDatabase, type TestDatabase } from "./testDb";

let db: TestDatabase;
let audit: typeof import("../audit");
let prisma: (typeof import("../db"))["prisma"];

beforeAll(async () => {
  db = setupTestDatabase();
  audit = await import("../audit");
  prisma = (await import("../db")).prisma;
});

afterAll(async () => {
  await prisma?.$disconnect();
  db?.cleanup();
});

describe("audit log", () => {
  it("records who changed what and when", async () => {
    const entry = await audit.recordAudit({
      actorId: "admin_1",
      actorName: "Store Admin",
      action: "product.update",
      entity: "product",
      entityId: "prod_1",
      detail: "Changed the price",
    });

    expect(entry.actorId).toBe("admin_1");
    expect(entry.actorName).toBe("Store Admin");
    expect(entry.entity).toBe("product");
    expect(entry.createdAt).toBeInstanceOf(Date);

    const listed = await audit.listAudit("product", "prod_1");
    expect(listed.map((row) => row.id)).toContain(entry.id);
  });

  it("lists only the records of the entity asked for", async () => {
    await audit.recordAudit({
      actorId: "admin_1",
      actorName: "Store Admin",
      action: "order.status",
      entity: "order",
      entityId: "order_1",
      detail: "Shipped",
    });

    const products = await audit.listAudit("product", "order_1");
    expect(products).toHaveLength(0);

    const orders = await audit.listAudit("order", "order_1");
    expect(orders).toHaveLength(1);
    expect(orders[0].detail).toBe("Shipped");
  });

  it("keeps records for 2 years", () => {
    const now = new Date("2026-11-01T00:00:00.000Z");
    const cutoff = audit.auditCutoff(now);
    const days = (now.getTime() - cutoff.getTime()) / (24 * 60 * 60 * 1000);
    expect(days).toBe(730);
  });

  it("prunes records older than the retention", async () => {
    const old = await prisma.auditLog.create({
      data: {
        actorId: "admin_1",
        actorName: "Store Admin",
        action: "product.delete",
        entity: "product",
        entityId: "prod_old",
        detail: "Deleted",
        createdAt: new Date("2020-01-01T00:00:00.000Z"),
      },
    });

    const removed = await audit.pruneAudit(new Date("2026-11-01T00:00:00.000Z"));
    expect(removed).toBeGreaterThanOrEqual(1);
    await expect(
      prisma.auditLog.findUnique({ where: { id: old.id } }),
    ).resolves.toBeNull();
  });
});
