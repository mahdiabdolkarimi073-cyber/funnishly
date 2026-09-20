"use server"

import prisma from "@/backend/module/Prisma";
import { error } from "@/backend/utils/response";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
};

type Data = {
    phone: string;
    password: string;
}

export default async function loginActions(data: Data): Promise<ActionResponse> {
    const { password, phone } = data

    try {
        const user = await prisma.user.findUnique({
            where: {
                phone: phone + ""
            }
        })

        if (!user || (user.password !== password)) return error(" نام کاربری یا رمز عبور اشتباه است")

        const cookie = await cookies()
        cookie.set("token", user.token, COOKIE_OPTIONS)

        return { data: user, ok: true }
    } catch (e) {
        return error(e + "")
    }
}
