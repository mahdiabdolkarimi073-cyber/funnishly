import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {headers} from "next/headers";

import {getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";

export default async function RootLayout({children}: { children: ReactNode }) {
    const user = await getUserFromCookieWithAllData()
    if (!user || !user.activePackage) return redirect("/dashboard")

    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "";
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length >= 3 && segments[1] === "dash-teach") {
        const pageId = segments[2];
        const allowedPages = user.activePackage.package?.options ?? [];
        if (!allowedPages.includes(pageId)) {
            return redirect("/dash-teach");
        }
    }

    return (
        <div>
            {children}
        </div>
    )
}