/**
 * The seed script.
 *
 * It seeds only an empty database (no account yet) and never when
 * `NODE_ENV` is `production`. It creates the Admin and Shopper test logins of
 * `design.md`, about 500 active products across 8 categories, and three
 * sample orders for the Shopper.
 *
 * `npm run dev` runs it before `next dev`, so a fresh copy shows the store
 * with data and the test logins work.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@shop.test";
const ADMIN_PASSWORD = "Admin1234";
const SHOPPER_EMAIL = "shopper@shop.test";
const SHOPPER_PASSWORD = "Shopper1234";
const SHOPPER_ADDRESS = "12 Market Street, Springfield, IL 62704";

const PRODUCT_COUNT = 500;

/** Hashes a password as `scrypt$<salt>$<hash>`, the format `lib/accounts.ts` verifies. */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

const CATEGORIES = [
  "Electronics",
  "Home & Kitchen",
  "Books",
  "Clothing",
  "Sports & Outdoors",
  "Toys & Games",
  "Beauty",
  "Grocery",
] as const;

const ADJECTIVES = [
  "Classic",
  "Modern",
  "Compact",
  "Premium",
  "Everyday",
  "Deluxe",
  "Essential",
  "Portable",
  "Smart",
  "Rustic",
  "Sleek",
  "Durable",
  "Eco",
  "Pro",
  "Mini",
  "Ultra",
  "Vintage",
  "Bright",
  "Soft",
  "Heavy-Duty",
];

const NOUNS: Record<(typeof CATEGORIES)[number], string[]> = {
  Electronics: [
    "Wireless Earbuds",
    "Bluetooth Speaker",
    "USB-C Charger",
    "Smart Watch",
    "4K Monitor",
    "Mechanical Keyboard",
    "Wireless Mouse",
    "Noise-Cancelling Headphones",
    "Power Bank",
    "Webcam",
  ],
  "Home & Kitchen": [
    "Coffee Maker",
    "Cast Iron Skillet",
    "Chef's Knife",
    "Blender",
    "Storage Jars",
    "Table Lamp",
    "Cotton Throw",
    "Cutting Board",
    "Electric Kettle",
    "Dinner Plate Set",
  ],
  Books: [
    "Cookbook",
    "Mystery Novel",
    "History Book",
    "Gardening Guide",
    "Travel Journal",
    "Poetry Collection",
    "Business Handbook",
    "Children's Storybook",
    "Science Almanac",
    "Art Sketchbook",
  ],
  Clothing: [
    "Cotton T-Shirt",
    "Denim Jacket",
    "Running Shoes",
    "Wool Sweater",
    "Chino Trousers",
    "Rain Coat",
    "Leather Belt",
    "Knit Scarf",
    "Canvas Sneakers",
    "Flannel Shirt",
  ],
  "Sports & Outdoors": [
    "Yoga Mat",
    "Water Bottle",
    "Camping Tent",
    "Hiking Backpack",
    "Dumbbell Set",
    "Tennis Racket",
    "Cycling Helmet",
    "Fishing Rod",
    "Sleeping Bag",
    "Jump Rope",
  ],
  "Toys & Games": [
    "Building Blocks",
    "Board Game",
    "Puzzle Set",
    "Remote Control Car",
    "Plush Bear",
    "Art Kit",
    "Chess Set",
    "Action Figure",
    "Card Game",
    "Model Train",
  ],
  Beauty: [
    "Face Moisturizer",
    "Shampoo",
    "Lip Balm",
    "Body Lotion",
    "Facial Cleanser",
    "Hair Brush",
    "Nail Care Kit",
    "Sunscreen",
    "Perfume",
    "Makeup Palette",
  ],
  Grocery: [
    "Coffee Beans",
    "Olive Oil",
    "Green Tea",
    "Dark Chocolate",
    "Pasta",
    "Honey",
    "Granola",
    "Almonds",
    "Sea Salt",
    "Maple Syrup",
  ],
};

/** A small deterministic generator, so a seed run is repeatable. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProducts() {
  const random = makeRandom(20261101);
  const products: {
    name: string;
    description: string;
    priceCents: number;
    stock: number;
    category: string;
    imageUrl: string;
    status: string;
  }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < PRODUCT_COUNT; i += 1) {
    const category = CATEGORIES[i % CATEGORIES.length];
    let name = `${pick(random, ADJECTIVES)} ${pick(random, NOUNS[category])}`;
    let suffix = 2;
    while (seen.has(name)) {
      name = `${pick(random, ADJECTIVES)} ${pick(random, NOUNS[category])} ${suffix}`;
      suffix += 1;
    }
    seen.add(name);

    const priceCents = 499 + Math.floor(random() * 49_500);
    // A few products are low on stock, so the stock report has rows.
    const stock =
      random() < 0.08 ? Math.floor(random() * 6) : 5 + Math.floor(random() * 120);

    products.push({
      name,
      description: `${name} from our ${category} range. A dependable choice for everyday use, made to last and easy to care for.`,
      priceCents,
      stock,
      category,
      imageUrl: `https://picsum.photos/seed/${slugify(name)}/600/450`,
      status: "active",
    });
  }

  return products;
}

function orderNumber(date: Date, sequence: number): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `ORD-${y}${m}${d}-${String(sequence).padStart(4, "0")}`;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.log("Seed skipped: NODE_ENV is production.");
    return;
  }

  const existingAccounts = await prisma.account.count();
  if (existingAccounts > 0) {
    console.log("Seed skipped: the database already has accounts.");
    return;
  }

  const admin = await prisma.account.create({
    data: {
      name: "Store Admin",
      email: ADMIN_EMAIL,
      passwordHash: hashPassword(ADMIN_PASSWORD),
      address: "1 Commerce Plaza, Springfield, IL 62701",
      role: "admin",
    },
  });

  const shopper = await prisma.account.create({
    data: {
      name: "Sam Shopper",
      email: SHOPPER_EMAIL,
      passwordHash: hashPassword(SHOPPER_PASSWORD),
      address: SHOPPER_ADDRESS,
      role: "shopper",
    },
  });

  const products = buildProducts();
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products across ${CATEGORIES.length} categories.`);

  const seeded = await prisma.product.findMany({
    where: { status: "active" },
    orderBy: { name: "asc" },
    take: 12,
  });

  const now = new Date();
  const sampleOrders = [
    { daysAgo: 12, status: "delivered", lines: [0, 1] },
    { daysAgo: 5, status: "shipped", lines: [2, 3, 4] },
    { daysAgo: 1, status: "paid", lines: [5] },
  ];

  for (let i = 0; i < sampleOrders.length; i += 1) {
    const sample = sampleOrders[i];
    const placedAt = new Date(now.getTime() - sample.daysAgo * 24 * 60 * 60 * 1000);
    const lines = sample.lines.map((index, lineIndex) => {
      const product = seeded[(index + i * 3) % seeded.length];
      return {
        productId: product.id,
        productName: product.name,
        unitPriceCents: product.priceCents,
        quantity: lineIndex === 0 ? 2 : 1,
      };
    });
    const totalCents = lines.reduce(
      (sum, line) => sum + line.unitPriceCents * line.quantity,
      0,
    );

    await prisma.order.create({
      data: {
        orderNumber: orderNumber(placedAt, i + 1),
        accountId: shopper.id,
        totalCents,
        paymentStatus: "paid",
        status: sample.status,
        deliveryAddress: SHOPPER_ADDRESS,
        placedAt,
        lines: { create: lines },
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorName: admin.name,
      action: "seed",
      entity: "product",
      entityId: "seed",
      detail: `Seeded ${products.length} products and 3 sample orders`,
    },
  });

  console.log("Seeded the Admin and Shopper test logins and 3 sample orders.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
