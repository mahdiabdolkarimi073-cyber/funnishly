"use client"
import logoutAction from "@/backend/actions/auth/logout.action";
import {closeAllModals, modals} from "@mantine/modals";
import {ReactNode, useEffect, useState} from "react";
import {
    MdDashboard,
    MdLogout,
    MdCasino,
    MdTimer,
    MdGridOn,
    MdViewColumn,
    MdQuiz,
    MdDonutLarge,
    MdSortByAlpha,
    MdMenu,
    MdClose,
} from "react-icons/md";
import {Popover, Button, Stack, Text} from '@mantine/core';
import {FaChalkboardTeacher, FaUser} from "react-icons/fa";
import {useRouter, usePathname} from "next/navigation";
import {ReactNode as RN} from "react";
import {useServerAction} from "@/hooks/useServerAction";
import {getUserFromCookieWithAllData} from "@/backend/actions/user/getUser.action";
import Logo from "@/components/logo/Logo";
import {HiSparkles, HiStar} from "react-icons/hi";
import {GiDiceSixFacesFive} from "react-icons/gi";

interface MenuItem {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
}

export default function DashboardLayout({children}: { children?: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [activePage, setActivePage] = useState<string>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {data: user, status, refetch} = useServerAction(getUserFromCookieWithAllData);

    useEffect(() => {
        if (activePage === "dashboard") {
            router.push("/dash-teach");
            return;
        }
        router.push(activePage.startsWith("/") ? activePage : `/dash-teach/${activePage}`);
    }, [activePage]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window._refetch_teach_user = refetch;
        }
    }, [refetch]);

    useEffect(() => {
        const segments = pathname?.split("/") ?? [];
        if (pathname === "/dash-teach") {
            setActivePage("dashboard");
        } else if (segments.length >= 3 && segments[1] === "dash-teach") {
            setActivePage(segments[2]);
        }
    }, [pathname]);

    const mk = (id: string, label: string, description: string, icon: React.ReactNode, color: string, bg: string): MenuItem => ({
        id, label, description, icon, color, bg
    });

    const allowedPages = user?.activePackage?.package?.options ?? [];

    const allMenuItems: MenuItem[] = [
        mk("dashboard", "خانه", "صفحه اصلی پنل تدریس", <MdDashboard size={20}/>, "#3b82f6", "#eff6ff"),
        mk("timer", "تایمر کلاس", "مدیریت زمان فعالیت‌ها", <MdTimer size={20}/>, "#3b82f6", "#eff6ff"),
        mk("wheel", "گردونه شانس", "انتخاب تصادفی دانش‌آموز یا فعالیت", <MdDonutLarge size={20}/>, "#a855f7", "#faf5ff"),
        mk("dice", "تاس", "اجرای فعالیت‌های تصادفی در کلاس", <MdCasino size={20}/>, "#f59e0b", "#fffbeb"),
        mk("word-square", "مربع کلمات", "پیدا کردن کلمات در شبکه حروف", <MdGridOn size={20}/>, "#10b981", "#ecfdf5"),
        mk("incomplete-sentence", "مرتب‌سازی جمله", "چیدمان کلمات و ساخت جمله", <MdSortByAlpha size={20}/>, "#8b5cf6", "#f5f3ff"),
        mk("col-words", "تطبیق کلمات", "اتصال کلمات مرتبط در ستون‌ها", <MdViewColumn size={20}/>, "#06b6d4", "#ecfeff"),
        mk("quiz", "کوییز", "ساخت و اجرای کوییز تعاملی", <MdQuiz size={20}/>, "#ec4899", "#fdf2f8"),
    ];

    const menuItems: MenuItem[] = allMenuItems.filter(
        (item) => item.id === "dashboard" || allowedPages.includes(item.id)
    );

    const handleNavigate = (id: string) => {
        setActivePage(id);
        setSidebarOpen(false);
    };

    const currentItem = menuItems.find((m) => m.id === activePage);

    return (
        <div className="relative flex min-h-[calc(100dvh-79px)]" dir="rtl"
             style={{background: "linear-gradient(135deg, #eef2ff 0%, #f0f7ff 40%, #f5f0ff 70%, #fef3f8 100%)"}}>

            {/* Decorative background blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl"/>
                <div className="absolute left-[40%] top-[10%] h-64 w-64 rounded-full bg-purple-100/30 blur-3xl"/>
                <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-pink-100/25 blur-3xl"/>
            </div>

            {/* Scattered sparkle decorations */}
            <div className="pointer-events-none absolute left-[6%] top-[15%] fn-float-slow">
                <HiSparkles size={16} className="text-blue-300/60"/>
            </div>
            <div className="pointer-events-none absolute right-[8%] top-[25%] fn-float">
                <HiStar size={14} className="text-amber-300/60"/>
            </div>
            <div className="pointer-events-none absolute left-[12%] bottom-[15%] fn-float-rev">
                <HiSparkles size={14} className="text-emerald-300/60"/>
            </div>

            {/* Mobile sidebar toggle */}
            <button
                className="md:hidden fixed top-[88px] right-4 z-40 flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-blue-100 text-blue-700 shadow-lg shadow-blue-100/50 transition active:scale-95"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="منو"
            >
                {sidebarOpen ? <MdClose size={22}/> : <MdMenu size={22}/>}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-[#1a2151]/20 backdrop-blur-sm z-30 transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 flex flex-col justify-between
                fixed md:static inset-y-0 right-0 top-0 z-30 md:z-auto
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                bg-white/90 backdrop-blur-md border-l border-blue-50
                shadow-[0_8px_32px_rgba(59,130,246,.08)]
            `}>

                {/* Logo + Nav */}
                <div>
                    {/* Brand area */}
                    <div className="px-6 py-6 flex items-center justify-between">
                        <Logo width={120} height={44}/>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 fn-pulse-ring"/>
                            <span className="text-[10px] font-bold text-emerald-600">پنل تدریس</span>
                        </div>
                    </div>

                    <div className="mx-4 h-px bg-gradient-to-l from-transparent via-blue-100 to-transparent mb-4"/>

                    <nav className="flex flex-col gap-1.5 px-3">
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
                            ابزارهای آموزشی
                        </p>
                        {menuItems.map((item) => {
                            const isActive = activePage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 w-full text-right
                                        ${isActive
                                        ? "shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                    }`}
                                    style={isActive ? {
                                        backgroundColor: item.bg,
                                        color: item.color,
                                    } : {}}
                                >
                                    {isActive && (
                                        <span
                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-l-full"
                                            style={{backgroundColor: item.color}}/>
                                    )}
                                    <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "text-slate-400 group-hover:text-slate-500 group-hover:scale-105"}`}
                                          style={isActive ? {color: item.color} : {}}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Back to dashboard link */}
                    <div className="mx-3 mt-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 w-full text-right text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        >
                            <span className="text-slate-400 group-hover:text-slate-500 group-hover:scale-105 transition-transform duration-200">
                                <MdDashboard size={20}/>
                            </span>
                            <span>بازگشت به حساب کاربری</span>
                        </button>
                    </div>

                    {/* Funishly mascot mini card */}
                    <div className="mx-4 mt-6 hidden md:block">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border border-white p-4">
                            <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-white/40"/>
                            <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-amber-100/40"/>
                            <div className="relative flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md shadow-emerald-100/50">
                                    <FaChalkboardTeacher size={20} className="text-emerald-500"/>
                                </div>
                                <div>
                                    <p className="text-[#1a2151] text-xs font-bold">کلاس فانیشلی</p>
                                    <p className="text-slate-400 text-[10px]">زمین بازی آموزشی</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Box */}
                <div className="p-4">
                    <div className="rounded-2xl w-full bg-gradient-to-br from-emerald-50/80 to-blue-50/50 border border-emerald-100/50 p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                                <div
                                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-emerald-200/60">
                                    {user?.name?.at(0)}
                                </div>
                                <span
                                    className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"/>
                            </div>
                            <div className="min-w-0">
                                <p className="text-slate-800 text-sm font-semibold truncate">{user?.name} {user?.last_name}</p>
                                <p className="text-emerald-500 text-[11px]">معلم فانیشلی</p>
                            </div>
                        </div>

                        <Button
                            size="xs"
                            color="red"
                            variant="light"
                            radius="lg"
                            onClick={() => {
                                modals.openConfirmModal({
                                    title: "خروج از حساب کاربری",
                                    labels: {cancel: "انصراف", confirm: "خروج"},
                                    confirmProps: {color: "red"},
                                    onConfirm: async () => {
                                        await logoutAction();
                                        closeAllModals();
                                    }
                                });
                            }}
                            className="shrink-0"
                            aria-label="خروج"
                        >
                            <MdLogout size={16}/>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Top Header */}
                <div className="sticky top-0 z-20 px-5 md:px-8 py-4 md:py-5 border-b border-blue-50 flex items-center justify-between bg-white/70 backdrop-blur-md">
                    <div className="min-w-0">
                        <h2 className="font-black text-lg md:text-xl text-[#1a2151] truncate">
                            {currentItem?.label ?? "پنل تدریس"}
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm mt-0.5 truncate">
                            {currentItem?.description ?? "ابزارهای تعاملی کلاس"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Text size="sm" c="dimmed" className="hidden lg:block text-slate-400">
                            {new Date().toLocaleDateString("fa-IR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </Text>

                        <Popover width={200} position="bottom-end" withArrow>
                            <Popover.Target>
                                <Button variant="outline" size="sm" radius="xl"
                                    leftSection={<FaUser size={14}/>}
                                    className="border-blue-100 text-blue-700 hover:bg-blue-50">
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
                                            onClick={() => handleNavigate(item.id)}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
