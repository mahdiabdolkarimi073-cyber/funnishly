import { PrismaClient } from "../app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PACKAGES = [
    {
        id: "pkg-creative-teacher",
        title: "معلم خلاق",
        description: "ویژه معلمان پرانرژی که دوست دارند محتوای شخصی‌سازی‌شده بسازند. شامل تمام ابزارهای تعاملی فانیشلی.",
        price1m: 200000,
        price3m: 400000,
        price6m: 800000,
        price1y: 0,
        options: ["timer", "dice", "wheel", "incomplete-sentence", "word-square", "col-words", "quiz"],
    },
    {
        id: "pkg-dynamic-class",
        title: "کلاس پویا",
        description: "ابزارهای ضروری برای ایجاد پویایی در هر کلاس درسی (بدون ابزارهای تخصصی زبانی). دسترسی به تایمر، تاس، گردونه و کوییز.",
        price1m: 150000,
        price3m: 300000,
        price6m: 600000,
        price1y: 0,
        options: ["timer", "dice", "wheel", "quiz"],
    },
];

async function seedAdmin() {
    const phone = "09123456789";
    const password = "admin123456";

    const existing = await prisma.user.findUnique({ where: { phone } });

    if (existing) {
        if (existing.role === "ADMIN") {
            console.log("Admin user already exists:");
            console.log(`  Phone: ${phone}`);
            console.log(`  Password: ${password}`);
            return;
        }
        await prisma.user.update({
            where: { phone },
            data: { role: "ADMIN" },
        });
        console.log("Existing user upgraded to ADMIN:");
        console.log(`  Phone: ${phone}`);
        console.log(`  Password: ${password}`);
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
}

async function seedPackages() {
    for (const pkg of PACKAGES) {
        const existing = await prisma.package.findUnique({ where: { id: pkg.id } });
        if (existing) {
            await prisma.package.update({
                where: { id: pkg.id },
                data: {
                    title: pkg.title,
                    description: pkg.description,
                    price1m: pkg.price1m,
                    price3m: pkg.price3m,
                    price6m: pkg.price6m,
                    price1y: pkg.price1y,
                    options: pkg.options,
                },
            });
            console.log(`Package updated: ${pkg.title}`);
        } else {
            await prisma.package.create({ data: pkg });
            console.log(`Package created: ${pkg.title}`);
        }
    }
}

async function main() {
    await seedAdmin();
    await seedPackages();
    await pool.end();
}

main().catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
});
