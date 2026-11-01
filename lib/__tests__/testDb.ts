/**
 * A test database helper.
 *
 * Each test file gets its own SQLite file in a temporary folder, with the
 * migrations applied to it, and `DATABASE_URL` points at it, so no test needs
 * a database someone started and no two test files share rows.
 *
 * Import it before `lib/db` (a dynamic import after `setupTestDatabase()`),
 * so the Prisma client opens the test file.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

// Loaded through `require` so Vite leaves Node's built-in module alone.
const nodeRequire = createRequire(import.meta.url);
const { DatabaseSync } = nodeRequire("node:sqlite") as typeof import("node:sqlite");

const repoRoot = path.resolve(__dirname, "..", "..");
const migrationsDir = path.join(repoRoot, "prisma", "migrations");

export interface TestDatabase {
  url: string;
  dir: string;
  cleanup: () => void;
}

/**
 * Applies every migration in `prisma/migrations` to the database file, in
 * order, with Node's built-in SQLite driver, so no Prisma CLI process is
 * needed and the test file is the same one `prisma migrate deploy` builds.
 */
function applyMigrations(file: string): void {
  const db = new DatabaseSync(file);
  try {
    const folders = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const folder of folders) {
      const sql = readFileSync(
        path.join(migrationsDir, folder, "migration.sql"),
        "utf8",
      );
      db.exec(sql);
    }
  } finally {
    db.close();
  }
}

/** Creates a temporary SQLite database with the migrations applied. */
export function setupTestDatabase(): TestDatabase {
  const dir = mkdtempSync(path.join(tmpdir(), "shop-test-"));
  const file = path.join(dir, "test.db");
  const url = `file:${file.replace(/\\/g, "/")}`;

  applyMigrations(file);

  process.env.DATABASE_URL = url;

  return {
    url,
    dir,
    cleanup: () => {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // A locked file on Windows is left for the system to clean up.
      }
    },
  };
}
