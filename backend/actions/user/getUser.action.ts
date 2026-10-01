"use server"

import prisma from "@/backend/module/Prisma";
import {User} from "@/types/Types";
import {Package, Prisma} from "@/app/generated/prisma";
import {cookies} from "next/headers";


export async function getUserByToken(token: string, include?: Prisma.UserInclude) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return prisma.user.findUnique({
        where: {
            token
        },
        ...(include
                ? {include}
                : {select: {last_name: true, name: true, phone: true, id: true}}
        )
    });
}


export async function getUserFromCookie(include?: Prisma.UserInclude): Promise<User | null> {
    const token = (await cookies()).get("token")?.value
    if (!token) return null;
    return await getUserByToken(token!, include)
}

export async function getUserFromCookieWithAllData(): Promise<User & { activePackage: Package } | null> {
    return await getUserFromCookie({activePackage: true}) as User & { activePackage: Package };

}
