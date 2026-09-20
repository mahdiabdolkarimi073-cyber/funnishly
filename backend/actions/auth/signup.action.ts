"use server";

import prisma from "@/backend/module/Prisma";
import { ActionResponse } from "@/types/Types";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
};

type Data = {
    name: string;
    last_name: string;
    phone: string;
    password: string;
}

export async function registerUser(data: Data): Promise<ActionResponse> {
    const { last_name, name, phone, password } = data

    const isExitstUser = await prisma.user.findFirst({
        where: {
            phone: phone + ""
        }
    })

    if (!!isExitstUser) return { ok: false, data: {}, message: "کاربر قبلا ثبت نام کرده است" }

    try {
        const user = await prisma.user.create({
            data: {
                ...data,
                phone: data?.phone + ""
            }
        })

        const cookie = await cookies()
        cookie.set("token", user.token, COOKIE_OPTIONS)
        return { data: user, ok: true }

    } catch (e) {
        console.log("ERROR , ", e)
        return { data: {}, message: `error : ${e}`, ok: false }
    }
}
