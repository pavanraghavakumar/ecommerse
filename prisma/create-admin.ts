/**
 * Creates the first Admin from `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD`
 * after the migrations, when both are set and no account exists yet.
 *
 * `npm run dev` runs it after the seed, so a fresh copy always has an Admin.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

/** Hashes a password as `scrypt$<salt>$<hash>`, the format `lib/accounts.ts` verifies. */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const email = process.env.FIRST_ADMIN_EMAIL?.trim();
  const password = process.env.FIRST_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("First Admin skipped: FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD are not both set.");
    return;
  }

  const existingAccounts = await prisma.account.count();
  if (existingAccounts > 0) {
    console.log("First Admin skipped: the database already has accounts.");
    return;
  }

  await prisma.account.create({
    data: {
      name: "Store Admin",
      email,
      passwordHash: hashPassword(password),
      address: "",
      role: "admin",
    },
  });
  console.log(`Created the first Admin ${email}.`);
}

main()
  .catch((error) => {
    console.error("First Admin creation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
