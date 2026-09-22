"use server"

import prisma from "@/backend/module/Prisma";
import { getUserFromCookie } from "@/backend/actions/user/getUser.action";
import { GameType } from "@prisma/client";

export async function loadGameData(gameType: GameType): Promise<any | null> {
    const user = await getUserFromCookie();
    if (!user) return null;

    const record = await prisma.gameData.findUnique({
        where: {
            userId_gameType: {
                userId: user.id,
                gameType,
            },
        },
    });

    return record?.data ?? null;
}

export async function saveGameData(gameType: GameType, data: any): Promise<boolean> {
    const user = await getUserFromCookie();
    if (!user) return false;

    await prisma.gameData.upsert({
        where: {
            userId_gameType: {
                userId: user.id,
                gameType,
            },
        },
        create: {
            userId: user.id,
            gameType,
            data,
        },
        update: {
            data,
        },
    });

    return true;
}
