import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardLayout from "./dashboard/layout";
import { cookies } from "next/headers";
import prisma from "@/backend/module/Prisma";
import { User } from "@/types/Types";
import { getUserByToken } from "@/backend/utils/getIser";

export default async function RootLayout({ children }: { children: ReactNode }) {
    const token = (await cookies()).get("token")?.value
    if (!token) return redirect("/")
    const user = await getUserByToken(token)
    if (!user) return redirect("/")
    return (
        <div>
           {children}
        </div>
    )
}