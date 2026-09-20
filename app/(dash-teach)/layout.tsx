import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {cookies} from "next/headers";

import {getUserByToken} from "@/backend/utils/getIser";
import {getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";

export default async function RootLayout({children}: { children: ReactNode }) {
    const user = await getUserFromCookieWithAllData()
    if (!user || !user.activePackage) return redirect("/dashboard")


    return (
        <div>
            {children}
        </div>
    )
}