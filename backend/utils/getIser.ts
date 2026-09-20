import prisma from "../module/Prisma";

export async function getUserByToken(token: string) {
    return await prisma.user.findUnique({
        where: {
            token
        },
        select: { last_name: true, name: true, phone: true }
    })
}