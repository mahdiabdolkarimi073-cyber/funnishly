"use server"

import prisma from "@/backend/module/Prisma";
import {getUserFromCookie} from "@/backend/actions/user/getUser.action";

export default async function getUserPackages() {
    const user = await getUserFromCookie()

    console.log("user", user)

    return prisma.userPackage.findUnique({
        where: {
            userId: user?.id
        },
        include: {
            package: true
        }
    })
}