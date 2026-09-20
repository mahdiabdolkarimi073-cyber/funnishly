"use client"
import logoutAction from "@/backend/actions/auth/logout.action";
import {closeAllModals, modals} from "@mantine/modals";
import {ReactNode, useEffect, useState} from "react";
import {MdDashboard, MdLogout, MdWorkspacePremium, MdSecurity} from "react-icons/md";
import {Popover, Button, Stack, Text} from '@mantine/core';
import {FaChalkboardTeacher, FaUser} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {User} from "@/types/Types";
import {useServerAction} from "@/hooks/useServerAction";
import {getUserFromCookie, getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";
import {GiTeacher} from "react-icons/gi";


interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}


export default function DashboardLayout({children}: { children?: ReactNode }) {


    const router = useRouter();
    const [activePage, setActivePage] = useState<string>("dashboard");
    const {data: user, status, refetch} = useServerAction(getUserFromCookieWithAllData)

    useEffect(() => {
        console.log("user :", user)
    }, [user]);

    useEffect(() => {
        if (activePage === "dashboard") {
            router.push("/dashboard");
            return;
        }
        router.push(activePage.startsWith("/") ? activePage : `/dashboard/${activePage}`);
    }, [activePage]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window._refetch_dashboard_user = refetch
        }
    }, [])


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const menuItems: (MenuItem)[] = [
        {id: "dashboard", label: "حساب کاربری", icon: <MdDashboard size={18}/>},
        {id: "plan", label: "پلن", icon: <MdWorkspacePremium size={18}/>},
        {id: "security", label: "تنظیمات امنیتی", icon: <MdSecurity size={18}/>},
        user?.activePackage ? {id: "/dash-teach", label: "پنل تدریس", icon: <FaChalkboardTeacher size={18}/>} : null

    ].filter(Boolean);

    return (
        <div className="flex bg-sky-50 min-h-[calc(100dvh-79px)]" dir="rtl">

            {/* Sidebar */}
            <aside className="w-72 bg-white flex flex-col justify-between border-l border-sky-100 shadow-sm">

                {/* Logo */}
                <div>
                    <div className="px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-md shadow-sky-200">
                                <span className="text-white text-sm font-bold">P</span>
                            </div>
                            <h1 className="text-slate-800 font-bold text-sm">پنل کاربری</h1>
                        </div>
                    </div>

                    <div className="mx-4 h-px bg-sky-100 mb-4"/>

                    <nav className="flex flex-col gap-1 px-3">
                        <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                            منو اصلی
                        </p>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right
                                    ${activePage === item.id
                                    ? "bg-sky-50 text-sky-700"
                                    : "text-slate-500 hover:text-sky-700 hover:bg-sky-50"
                                }`}
                            >
                                {activePage === item.id && (
                                    <span
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-600 rounded-r-full"/>
                                )}
                                <span className={activePage === item.id ? "text-sky-600" : ""}>{item.icon}</span>
                                <span>{item.label}</span>
                                {activePage === item.id && (
                                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-sky-500"/>
                                )}
                            </button>
                        ))}

                    </nav>
                </div>

                {/* User Box */}
                <div className="p-4 flex w-full">
                    <div
                        className="rounded-2xl w-full items-center justify-between bg-sky-50 border border-sky-100 p-4 flex gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-200">
                                    {user?.name?.at(0)}
                                </div>
                                <span
                                    className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"/>
                            </div>
                            <div>
                                <p className="text-slate-800 text-sm font-semibold">{user?.name} {user?.last_name}</p>
                            </div>
                        </div>

                        <Button
                            size="xs"
                            color="red"
                            variant="outline"
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: "خروج از حساب کاربری",
                                    onConfirm: async () => {
                                        await logoutAction();
                                        closeAllModals();
                                    }
                                });
                            }}

                        >
                            <MdLogout size={16}/>

                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between bg-white">
                    <span className="font-semibold text-lg text-sky-800">
                        {menuItems.find((m) => m.id === activePage)?.label}
                    </span>

                    <div className="flex items-center gap-3">
                        <Text size="sm" c="dimmed">
                            {new Date().toLocaleDateString("fa-IR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </Text>

                        <Popover width={200} position="bottom-end" withArrow>
                            <Popover.Target>
                                <Button variant="outline" size="sm" leftSection={<FaUser size={16}/>}>
                                    {user?.name}
                                </Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack gap="xs">
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.id}
                                            variant="subtle"
                                            fullWidth
                                            justify="start"
                                            leftSection={item.icon}
                                            onClick={() => setActivePage(item.id)}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                    {!!user?.activePackage && (
                                        <Button
                                            key={"teach"}
                                            variant="subtle"
                                            fullWidth
                                            justify="start"
                                            leftSection={<GiTeacher/>}
                                        >
                                            پنل مدرس
                                        </Button>
                                    )}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </div>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
