"use server"

import prisma from "@/backend/module/Prisma";
import { getUserFromCookie } from "@/backend/actions/user/getUser.action";
import { UserRole, PackageDuration, TransactionStatus } from "@prisma/client";
import { error, response } from "@/backend/utils/response";

async function requireAdmin() {
    const user = await getUserFromCookie({ activePackage: true });
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (user.role !== "ADMIN") return null;
    return user;
}

// ============ STATS ============

export async function getAdminStats() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const [userCount, packageCount, transactionCount, activePackageCount, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.package.count(),
        prisma.transaction.count(),
        prisma.userPackage.count(),
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    ]);

    return {
        userCount,
        packageCount,
        transactionCount,
        activePackageCount,
        totalRevenue: totalRevenue._sum.amount ?? 0,
    };
}

// ============ USERS ============

export async function getAllUsers() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const users = await prisma.user.findMany({
        include: {
            activePackage: { include: { package: true } },
            transactions: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { name: "asc" },
    });

    return users;
}

export async function updateUserRole(userId: string, role: UserRole) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    return response(true, undefined, "نقش کاربر با موفقیت تغییر کرد");
}

export async function deleteUser(userId: string) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    if (userId === admin.id) return error("نمی‌توانید حساب خودتان را حذف کنید");

    await prisma.user.delete({ where: { id: userId } });
    return response(true, undefined, "کاربر با موفقیت حذف شد");
}

export async function revokeUserPackage(userId: string) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    await prisma.userPackage.deleteMany({ where: { userId } });
    return response(true, undefined, "پکیج کاربر لغو شد");
}

// ============ PACKAGES ============

export async function getAllPackages() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const packages = await prisma.package.findMany({
        include: {
            _count: { select: { purchases: true } },
        },
        orderBy: { title: "asc" },
    });

    return packages;
}

export async function createPackage(data: {
    title: string;
    description: string;
    price1m: number;
    price3m: number;
    price6m: number;
    options: string[];
}) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    if (!data.title.trim()) return error("عنوان پکیج الزامی است");

    await prisma.package.create({
        data: {
            title: data.title.trim(),
            description: data.description.trim(),
            price1m: data.price1m,
            price3m: data.price3m,
            price6m: data.price6m,
            options: data.options,
        },
    });

    return response(true, undefined, "پکیج با موفقیت ایجاد شد");
}

export async function updatePackage(
    id: string,
    data: {
        title: string;
        description: string;
        price1m: number;
        price3m: number;
        price6m: number;
        options: string[];
    }
) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    if (!data.title.trim()) return error("عنوان پکیج الزامی است");

    await prisma.package.update({
        where: { id },
        data: {
            title: data.title.trim(),
            description: data.description.trim(),
            price1m: data.price1m,
            price3m: data.price3m,
            price6m: data.price6m,
            options: data.options,
        },
    });

    return response(true, undefined, "پکیج با موفقیت ویرایش شد");
}

export async function deletePackage(id: string) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    const hasPurchases = await prisma.userPackage.findFirst({ where: { packageId: id } });
    if (hasPurchases) return error("این پکیج توسط کاربرانی خریداری شده و قابل حذف نیست");

    await prisma.package.delete({ where: { id } });
    return response(true, undefined, "پکیج با موفقیت حذف شد");
}

// ============ TRANSACTIONS ============

export async function getAllTransactions() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const transactions = await prisma.transaction.findMany({
        include: {
            user: { select: { name: true, last_name: true, phone: true } },
            package: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return transactions;
}

export async function updateTransactionStatus(transactionId: string, status: TransactionStatus) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    await prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
    });

    return response(true, undefined, "وضعیت تراکنش تغییر کرد");
}

// ============ GAME DATA ============

export async function getAllGameData() {
    const admin = await requireAdmin();
    if (!admin) return null;

    const gameData = await prisma.gameData.findMany({
        include: {
            user: { select: { name: true, last_name: true, phone: true } },
        },
        orderBy: { updatedAt: "desc" },
    });

    return gameData;
}

export async function deleteGameData(gameDataId: string) {
    const admin = await requireAdmin();
    if (!admin) return error("دسترسی غیرمجاز");

    await prisma.gameData.delete({ where: { id: gameDataId } });
    return response(true, undefined, "داده بازی با موفقیت حذف شد");
}
