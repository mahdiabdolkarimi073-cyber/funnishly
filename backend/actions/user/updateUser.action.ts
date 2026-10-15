"use server"

import prisma from "@/backend/module/Prisma"
import {getUserFromCookie} from "./getUser.action"
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import {cookies} from "next/headers";
import {ActionResponse} from "@/types/Types";
import {error, response} from "@/backend/utils/response";


export default async function updateUserAction(firstName: string, lastName: string) {
    const user = await getUserFromCookie()

    try {
        await prisma.user.update({
            where: {
                phone: user?.phone
            },
            data: {
                last_name: lastName,
                name: firstName
            }
        })
    } catch (e) {
        return redirect(`/dsshboard?error=${e}`)
    }


}


export async function changePassword({newPassword, currentPassword}: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}): Promise<ActionResponse> {
    const token = (await cookies()).get("token")?.value
    const user = await prisma.user.findUnique({
        where: {
            token
        }
    })

    if (!user) return error("کاربر یافت نشد")
    if (user.password !== currentPassword) return error("رمز عبور فعلی اشتباه است")

    try {
        await prisma.user.update({
            where: {
                token
            },
            data: {
                password: newPassword
            }
        })

        return response(true, {}, "رمز عبور با موفقیت تغییر کرد")
    } catch (e) {
        return error(e + "")
    }

}