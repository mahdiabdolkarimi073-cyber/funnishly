"use server"

import {getUserFromCookie, getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";
import prisma from "@/backend/module/Prisma";
import {ActionResponse} from "@/types/Types";
import {error} from "@/backend/utils/response";
import {PackageDuration} from "@/app/generated/prisma";

const DURATION_PRICES: Record<PackageDuration, keyof { price1m: number; price3m: number; price6m: number }> = {
    MONTH1: "price1m",
    MONTH3: "price3m",
    MONTH6: "price6m",
};

export default async function packagePayment({packageId, duration}: { packageId: string; duration: PackageDuration }): Promise<ActionResponse> {
    const user = await getUserFromCookieWithAllData()

    if (!user) return error("کاربر لاگین نیست")
    if (user.activePackage) return error("کاربر پکیج فعال دارد")

    const pkg = await prisma.package.findUnique({
        where: {
            id: packageId
        }
    })

    if (!pkg) return error("پکیج یافت نشد")

    const priceField = DURATION_PRICES[duration];
    const amount = pkg[priceField];

    try {
        await prisma.$transaction([
            prisma.userPackage.create({
                data: {
                    packageId,
                    userId: user.id,
                    duration,
                }
            }),
            prisma.transaction.create({
                data: {
                    packageId,
                    userId: user.id,
                    amount,
                    status: "SUCCESS",
                }
            })
        ])

        return {ok: true, message: "با موفقیت ثبت شد"}

    } catch (e) {
        return {ok: false, message: e + ""}
    }
}
