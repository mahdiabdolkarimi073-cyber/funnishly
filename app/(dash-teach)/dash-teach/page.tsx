"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import {
    MdTimer,
    MdDonutLarge,
    MdGridOn,
    MdSortByAlpha,
    MdViewColumn,
    MdQuiz,
    MdCasino,
} from "react-icons/md";
import { HiSparkles, HiArrowLeft, HiStar } from "react-icons/hi";
import { FaChalkboardTeacher, FaPuzzlePiece } from "react-icons/fa";
import { GiDiceSixFacesFive, GiTrophy } from "react-icons/gi";
import { TbTarget } from "react-icons/tb";
import { useServerAction } from "@/hooks/useServerAction";
import { getUserFromCookieWithAllData } from "@/backend/actions/user/getUser.action";

export default function DashTeachHome() {
    const router = useRouter();
    const { data: user, status } = useServerAction(getUserFromCookieWithAllData);

    const tools = [
        {
            id: "timer",
            label: "تایمر کلاس",
            description: "مدیریت زمان فعالیت‌های کلاسی",
            icon: <MdTimer size={28} />,
            color: "#3b82f6",
            bg: "#eff6ff",
            badge: "زمان‌سنج",
            badgeColor: "#3b82f6",
            badgeBg: "#eff6ff",
            size: "small",
        },
        {
            id: "wheel",
            label: "گردونه شانس",
            description: "انتخاب تصادفی دانش‌آموز یا فعالیت",
            icon: <MdDonutLarge size={36} />,
            color: "#a855f7",
            bg: "#faf5ff",
            badge: "تعاملی",
            badgeColor: "#a855f7",
            badgeBg: "#faf5ff",
            size: "large",
        },
        {
            id: "dice",
            label: "تاس",
            description: "اجرای فعالیت‌های تصادفی در کلاس",
            icon: <MdCasino size={28} />,
            color: "#f59e0b",
            bg: "#fffbeb",
            badge: "بازی",
            badgeColor: "#f59e0b",
            badgeBg: "#fffbeb",
            size: "small",
        },
        {
            id: "word-square",
            label: "مربع کلمات",
            description: "پیدا کردن کلمات در شبکه حروف",
            icon: <MdGridOn size={28} />,
            color: "#10b981",
            bg: "#ecfdf5",
            badge: "بازی کلمات",
            badgeColor: "#10b981",
            badgeBg: "#ecfdf5",
            size: "wide",
        },
        {
            id: "incomplete-sentence",
            label: "مرتب‌سازی جمله",
            description: "چیدمان کلمات و ساخت جمله",
            icon: <MdSortByAlpha size={28} />,
            color: "#8b5cf6",
            bg: "#f5f3ff",
            badge: "زبان",
            badgeColor: "#8b5cf6",
            badgeBg: "#f5f3ff",
            size: "small",
        },
        {
            id: "col-words",
            label: "تطبیق کلمات",
            description: "اتصال کلمات مرتبط در ستون‌ها",
            icon: <MdViewColumn size={28} />,
            color: "#06b6d4",
            bg: "#ecfeff",
            badge: "واژگان",
            badgeColor: "#06b6d4",
            badgeBg: "#ecfeff",
            size: "small",
        },
        {
            id: "quiz",
            label: "کوییز",
            description: "ساخت و اجرای کوییز تعاملی",
            icon: <MdQuiz size={28} />,
            color: "#ec4899",
            bg: "#fdf2f8",
            badge: "سازنده",
            badgeColor: "#ec4899",
            badgeBg: "#fdf2f8",
            size: "wide",
        },
    ];

    const quickActions = [
        { id: "wheel", label: "گردونه شانس", icon: <MdDonutLarge size={22} />, color: "#a855f7", bg: "#faf5ff" },
        { id: "timer", label: "تایمر کلاس", icon: <MdTimer size={22} />, color: "#3b82f6", bg: "#eff6ff" },
        { id: "dice", label: "تاس", icon: <GiDiceSixFacesFive size={22} />, color: "#f59e0b", bg: "#fffbeb" },
        { id: "quiz", label: "ساخت کوییز", icon: <MdQuiz size={22} />, color: "#ec4899", bg: "#fdf2f8" },
    ];

    const isLoading = status === "loading";

    return (
        <div className="mx-auto max-w-[1280px] space-y-6">
            {/* ===================== WELCOME HERO ===================== */}
            <div className="fn-fade-up">
                <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#eef2ff] via-[#f0f7ff] to-[#ecfdf5] shadow-[0_8px_40px_rgba(59,130,246,.08)]">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl"/>
                    <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-emerald-200/25 blur-2xl"/>
                    {/* Dot pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:28px_28px]"/>

                    <div className="relative flex flex-col gap-6 p-6 md:p-8 sm:flex-row sm:items-center sm:justify-between">
                        {/* Greeting text */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                                    <FaChalkboardTeacher size={13}/> پنل تدریس
                                </span>
                                <span className="w-2 h-2 rounded-full bg-amber-400 fn-pulse-ring"/>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1a2151] leading-tight">
                                سلام معلم{isLoading ? "" : (user?.name ? `، ${user.name}` : "")}! 👋
                            </h1>
                            <p className="mt-2 text-slate-500 text-sm md:text-base leading-7 max-w-lg">
                                آماده‌ای کلاس امروزت رو جذاب‌تر کنی؟ ابزار مناسب را انتخاب کن و فعالیت کلاسی خودت را شروع کن.
                            </p>
                        </div>

                        {/* Mascot visual */}
                        <div className="relative shrink-0 hidden sm:block">
                            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-300/20 to-blue-200/20 blur-xl"/>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white bg-white shadow-xl shadow-emerald-200/50 fn-float-slow">
                                <img
                                    src="/images/auth/Fig_01.png"
                                    alt="فانیشلی"
                                    className="h-full w-full object-cover rounded-2xl"
                                />
                            </div>
                            {/* Floating dice */}
                            <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100/50 ring-1 ring-blue-50 fn-float">
                                <GiDiceSixFacesFive size={20} className="text-blue-500"/>
                            </div>
                            {/* Floating sparkle */}
                            <div className="absolute -left-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-md fn-float-rev">
                                <HiSparkles size={16}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== QUICK ACTIONS ===================== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 fn-fade-up fn-delay-1">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => router.push(`/dash-teach/${action.id}`)}
                        className="group relative overflow-hidden rounded-2xl border border-white bg-white p-4 text-right shadow-[0_4px_24px_rgba(59,130,246,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,.12)] fn-card-hover"
                    >
                        <div className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full opacity-50" style={{ backgroundColor: action.bg }}/>
                        <div className="relative flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: action.bg, color: action.color }}>
                                {action.icon}
                            </div>
                            <span className="text-sm font-bold text-[#1a2151]">{action.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* ===================== EDUCATIONAL TOOLS BENTO ===================== */}
            <div className="fn-fade-up fn-delay-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                        <FaPuzzlePiece size={18}/>
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-[#1a2151]">ابزارهای آموزشی</h3>
                        <p className="text-slate-400 text-xs">ابزار مناسب را انتخاب کن و کلاس را شروع کن.</p>
                    </div>
                </div>

                <div className="grid auto-rows-[170px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {tools.map((tool, idx) => {
                        const sizeClass =
                            tool.size === "large" ? "lg:col-span-2 lg:row-span-2" :
                            tool.size === "wide" ? "lg:col-span-2" : "";
                        const delay = `fn-delay-${Math.min(idx + 1, 5)}`;

                        return (
                            <button
                                key={tool.id}
                                onClick={() => router.push(`/dash-teach/${tool.id}`)}
                                className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(59,130,246,.08)] fn-card-hover hover:shadow-[0_16px_50px_rgba(59,130,246,.14)] ${sizeClass} fn-fade-up ${delay}`}
                                style={{ minHeight: tool.size === "large" ? "100%" : undefined }}
                            >
                                <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full opacity-60" style={{ backgroundColor: tool.bg }}/>

                                {/* Top row: icon + badge */}
                                <div className="relative flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: tool.bg, color: tool.color }}>
                                        {tool.icon}
                                    </div>
                                    <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}>
                                        {tool.badge}
                                    </span>
                                </div>

                                {/* Bottom: title + description + action */}
                                <div className="relative">
                                    <h4 className="font-black text-lg text-[#1a2151]">{tool.label}</h4>
                                    {tool.size === "large" && (
                                        <p className="mt-1 text-sm leading-7 text-slate-500">{tool.description}</p>
                                    )}
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className="text-xs font-bold" style={{ color: tool.color }}>شروع ابزار</span>
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 group-hover:-translate-x-1" style={{ backgroundColor: tool.bg, color: tool.color }}>
                                            <HiArrowLeft size={14}/>
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===================== TEACHER CALL-TO-ACTION ===================== */}
            <div className="fn-fade-up fn-delay-3">
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border border-white p-6 md:p-8 shadow-[0_8px_30px_rgba(16,185,129,.08)]">
                    <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl"/>
                    <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-purple-200/25 blur-2xl"/>

                    {/* Floating decorative icons */}
                    <div className="pointer-events-none absolute left-[8%] top-[20%] fn-float-slow">
                        <HiSparkles size={18} className="text-emerald-400/60"/>
                    </div>
                    <div className="pointer-events-none absolute right-[10%] top-[15%] fn-float">
                        <HiStar size={14} className="text-blue-400/60"/>
                    </div>
                    <div className="pointer-events-none absolute right-[15%] bottom-[15%] fn-float-rev">
                        <TbTarget size={20} className="text-pink-400/50"/>
                    </div>
                    <div className="pointer-events-none absolute left-[20%] bottom-[10%] fn-float">
                        <GiTrophy size={18} className="text-amber-400/50"/>
                    </div>

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 max-w-xl">
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700 mb-3">
                                <HiSparkles size={13}/> ویژه معلمان
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-[#1a2151] leading-tight">
                                کلاس را از حالت معمولی خارج کن 🚀
                            </h3>
                            <p className="mt-2 text-slate-500 text-sm md:text-base leading-7">
                                با ابزارهای فانیشلی، فعالیت‌های کلاسی را سریع‌تر، جذاب‌تر و تعاملی‌تر اجرا کن.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Mascot */}
                            <div className="relative hidden md:block shrink-0">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white bg-white shadow-lg shadow-emerald-200/50 fn-float-slow">
                                    <FaChalkboardTeacher size={36} className="text-emerald-500"/>
                                </div>
                            </div>
                            <Button
                                onClick={() => router.push("/dash-teach/quiz")}
                                radius="xl"
                                size="lg"
                                rightSection={<HiArrowLeft size={18}/>}
                                className="fn-btn-press bg-gradient-to-l from-emerald-500 to-blue-500 shadow-lg shadow-emerald-200/50"
                            >
                                شروع فعالیت
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== QUIZ BUILDER HIGHLIGHT ===================== */}
            <div className="fn-fade-up fn-delay-4">
                <div className="relative overflow-hidden rounded-[24px] border border-pink-100 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/50 p-6 shadow-[0_8px_30px_rgba(236,72,153,.08)] fn-card-hover hover:shadow-[0_12px_40px_rgba(236,72,153,.14)]">
                    <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-pink-50/80"/>
                    <div className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-purple-50/60"/>

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 shrink-0">
                                <MdQuiz size={28}/>
                            </div>
                            <div>
                                <h4 className="font-black text-lg text-[#1a2151]">ساخت یک کوییز جدید 🧠</h4>
                                <p className="text-sm text-slate-500 mt-0.5">سؤال‌های خودت را اضافه کن و یک فعالیت تعاملی بساز.</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push("/dash-teach/quiz")}
                            radius="xl"
                            size="md"
                            rightSection={<HiArrowLeft size={16}/>}
                            className="fn-btn-press bg-gradient-to-l from-pink-500 to-purple-500 shadow-lg shadow-pink-200/50 shrink-0"
                        >
                            ساخت کوییز
                        </Button>
                    </div>
                </div>
            </div>

            {/* ===================== EMPTY RECENT ACTIVITIES ===================== */}
            <div className="fn-fade-up fn-delay-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                        <HiStar size={18}/>
                    </div>
                    <h3 className="font-black text-lg text-[#1a2151]">فعالیت‌های اخیر</h3>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-dashed border-blue-100 bg-white/60 p-10 text-center">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:28px_28px]"/>
                    <div className="relative flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-400 fn-float-slow">
                            <FaPuzzlePiece size={32}/>
                        </div>
                        <p className="text-[#1a2151] font-bold text-base">هنوز فعالیتی ایجاد نکرده‌ای</p>
                        <p className="text-slate-400 text-sm max-w-xs">اولین فعالیت کلاسی خودت را بساز و کلاس را زنده کن.</p>
                        <Button
                            onClick={() => router.push("/dash-teach/wheel")}
                            radius="xl"
                            size="md"
                            rightSection={<HiArrowLeft size={16}/>}
                            className="fn-btn-press bg-gradient-to-l from-blue-600 to-cyan-500 shadow-lg shadow-blue-200/50 mt-2"
                        >
                            شروع اولین فعالیت
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
