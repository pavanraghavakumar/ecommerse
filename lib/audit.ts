import { prisma } from "./db";

/**
 * The audit log: every Admin change to a product or an order records who made
 * it and when, and the record is kept for 2 years (8.6).
 */

export type AuditEntity = "product" | "order";

export interface AuditEntry {
  actorId: string;
  actorName: string;
  action: string;
  entity: AuditEntity;
  entityId: string;
  detail: string;
}

/** How long an audit record is kept: 2 years (8.6). */
export const AUDIT_RETENTION_DAYS = 730;

/** Writes one audit record. */
export async function recordAudit(entry: AuditEntry) {
  return prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      actorName: entry.actorName,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      detail: entry.detail,
    },
  });
}

/** The audit records of one product or order, newest first. */
export async function listAudit(entity: AuditEntity, entityId: string) {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
  });
}

/** The audit records written since a date, newest first. */
export async function listAuditSince(since: Date) {
  return prisma.auditLog.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
}

/** The date before which audit records are older than the 2-year retention. */
export function auditCutoff(now: Date = new Date()): Date {
  return new Date(now.getTime() - AUDIT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/** Deletes audit records older than the 2-year retention. */
export async function pruneAudit(now: Date = new Date()): Promise<number> {
  const result = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: auditCutoff(now) } },
  });
  return result.count;
}
