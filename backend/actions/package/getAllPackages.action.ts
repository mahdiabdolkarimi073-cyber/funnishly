"use server"

import prisma from "@/backend/module/Prisma";
import { getUserFromCookie } from "@/backend/actions/user/getUser.action";

export default async function getAllPackagesPublic() {
    const user = await getUserFromCookie();

    const packages = await prisma.package.findMany({
        orderBy: { title: "asc" },
    });

    const activePackage = user
        ? await prisma.userPackage.findUnique({
              where: { userId: user.id },
              select: { packageId: true },
          })
        : null;

    return {
        packages,
        activePackageId: activePackage?.packageId ?? null,
    };
}
