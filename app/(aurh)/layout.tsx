import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const token = (await cookies()).get("token")?.value;

    if (token) return redirect("/");

    return <>{children}</>;
}
