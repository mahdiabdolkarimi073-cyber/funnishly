"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    MdDashboard,
    MdPeople,
    MdCardGiftcard,
    MdReceipt,
    MdSportsEsports,
    MdLogout,
    MdMenu,
    MdClose,
    MdSecurity,
} from "react-icons/md";
import { Button } from "@mantine/core";
import logoutAction from "@/backend/actions/auth/logout.action";
import { closeAllModals, modals } from "@mantine/modals";
import { getUserFromCookieWithAllData } from "@/backend/actions/user/getUser.action";
import { useServerAction } from "@/hooks/useServerAction";

interface MenuItem {
    id: string;
    label: string;
    icon: ReactNode;
}

export default function AdminLayout({ children }: { children?: ReactNode }) {
    const router = useRouter();
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: user } = useServerAction(getUserFromCookieWithAllData);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isAdmin = user?.role === "ADMIN";

    useEffect(() => {
        if (user && !isAdmin) {
            router.push("/dashboard");
        }
    }, [user, isAdmin, router]);

    useEffect(() => {
        if (activePage === "dashboard") {
            router.push("/admin");
            return;
        }
        router.push(`/admin/${activePage}`);
    }, [activePage]);

    const menuItems: MenuItem[] = [
        { id: "dashboard", label: "داشبورد", icon: <MdDashboard size={20} /> },
        { id: "users", label: "کاربران", icon: <MdPeople size={20} /> },
        { id: "packages", label: "پکیج‌ها", icon: <MdCardGiftcard size={20} /> },
        { id: "transactions", label: "تراکنش‌ها", icon: <MdReceipt size={20} /> },
        { id: "game-data", label: "داده بازی‌ها", icon: <MdSportsEsports size={20} /> },
    ];

    const handleNavigate = (id: string) => {
        setActivePage(id);
        setSidebarOpen(false);
    };

    return (
        <div className="flex bg-slate-50 min-h-screen" dir="rtl">
            {/* Mobile sidebar toggle */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 text-white shadow-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="منو"
            >
                {sidebarOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                w-64 bg-slate-900 flex flex-col justify-between fixed md:static inset-y-0 right-0 z-40
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}
            >
                <div>
                    {/* Logo */}
                    <div className="px-6 py-5 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <MdSecurity size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-sm">پنل ادمین</h1>
                                <p className="text-slate-400 text-[10px]">فانیشلی</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-col gap-1 px-3 py-4">
                        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                            مدیریت
                        </p>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id)}
                                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right
                                    ${
                                        activePage === item.id
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`}
                            >
                                {activePage === item.id && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 rounded-r-full" />
                                )}
                                <span className={activePage === item.id ? "text-sky-400" : ""}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* User & Logout */}
                <div className="p-4 border-t border-slate-700/50">
                    <div className="rounded-xl w-full bg-slate-800/50 p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {user?.name?.at(0) ?? "A"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-xs font-semibold truncate">
                                    {user?.name} {user?.last_name}
                                </p>
                                <p className="text-slate-500 text-[10px]">ادمین</p>
                            </div>
                        </div>
                        <Button
                            size="xs"
                            color="red"
                            variant="subtle"
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: "خروج از حساب",
                                    onConfirm: async () => {
                                        await logoutAction();
                                        closeAllModals();
                                        router.push("/");
                                    },
                                });
                            }}
                        >
                            <MdLogout size={16} />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Top bar */}
                <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
                    <span className="font-semibold text-base md:text-lg text-slate-800 pr-12 md:pr-0">
                        {menuItems.find((m) => m.id === activePage)?.label ?? "داشبورد"}
                    </span>
                    <a
                        href="/dashboard"
                        className="text-xs text-slate-500 hover:text-sky-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                        بازگشت به پنل کاربری
                    </a>
                </div>

                <div className="p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
