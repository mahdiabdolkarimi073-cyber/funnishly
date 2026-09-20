"use server"

import {getUserFromCookie, getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";
import prisma from "@/backend/module/Prisma";
import {ActionResponse} from "@/types/Types";
import {error} from "@/backend/utils/response";

export default async function packagePayment({packageId}: { packageId: string }): Promise<ActionResponse> {
    const user = await getUserFromCookieWithAllData()


    console.log("user ", user)

    const pkg = await prisma.package.findUnique({
        where: {
            id: packageId
        }
    })

    if (!user) return error("کاربر لاگین نیست")
    if (!pkg) return error("پکیج یافت نشد")

    if(user.activePackage) return error("کاربر پکیج فعال دارد")

    try {
        await prisma.userPackage.create({
            data: {
                packageId,
                userId: user?.id
            }
        })


        return {ok: true, message: "با موفقیت ثبت شد"}

    } catch (e) {
        return {ok: false, message: e + ""}
    }


}