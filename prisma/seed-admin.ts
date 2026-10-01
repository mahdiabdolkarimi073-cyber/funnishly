import { PrismaClient } from "../app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const phone = "09123456789";
  const password = "admin123456";

  const existing = await prisma.user.findUnique({ where: { phone } });

  if (existing) {
    if (existing.role === "ADMIN") {
      console.log("Admin user already exists:");
      console.log(`  Phone: ${phone}`);
      console.log(`  Password: ${password}`);
      await pool.end();
      return;
    }
    await prisma.user.update({
      where: { phone },
      data: { role: "ADMIN" },
    });
    console.log("Existing user upgraded to ADMIN:");
    console.log(`  Phone: ${phone}`);
    console.log(`  Password: ${password}`);
    await pool.end();
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: "ادمین",
      last_name: "سیستم",
      phone,
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully:");
  console.log(`  Name: ${admin.name} ${admin.last_name}`);
  console.log(`  Phone: ${phone}`);
  console.log(`  Password: ${password}`);
  console.log(`  Login at: /auth/login`);

  await pool.end();
}

main().catch((e) => {
  console.error("Failed to seed admin:", e);
  process.exit(1);
});
