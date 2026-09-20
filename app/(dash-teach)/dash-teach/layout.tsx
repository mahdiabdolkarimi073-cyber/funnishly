"use client"
import logoutAction from "@/backend/actions/auth/logout.action";
import {closeAllModals, modals} from "@mantine/modals";
import {ReactNode, useEffect, useState} from "react";
import {
    MdDashboard,
    MdLogout,
    MdWorkspacePremium,
    MdSecurity,
    MdCasino,
    MdTimer,
    MdGridOn,
    MdViewColumn, MdQuiz, MdDonutLarge, MdSortByAlpha
} from "react-icons/md";
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


    const menuItems: (MenuItem)[] = [
        { id: "dashboard", label: "صفحه اصلی", icon: <MdDashboard size={18} /> },
        { id: "dice", label: "Dice", icon: <MdCasino size={18} /> },
        { id: "wheel", label: "Spin the Wheel", icon: <MdDonutLarge size={18} /> },
        { id: "timer", label: "Timer", icon: <MdTimer size={18} /> },
        { id: "incomplete-sentence", label: "Sentence Unscrabler", icon: <MdSortByAlpha size={18} /> },
        { id: "word-square", label: "Word Square", icon: <MdGridOn size={18} /> },
        { id: "col-words", label: "Vocabulary link", icon: <MdViewColumn size={18} /> },
        { id: "quiz", label: "Quiz", icon: <MdQuiz size={18} /> },
    ];

    useEffect(() => {
        if (activePage === "dashboard") {
            router.push("/dash-teach");
            return;
        }
        router.push(activePage.startsWith("/") ? activePage : `/dash-teach/${activePage}`);
    }, [activePage]);


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
                            <h1 className="text-slate-800 font-bold text-sm">پنل تدریس</h1>
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

            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 border-b border-sky-100 flex items-center justify-between bg-white">


                    <div className="flex items-center gap-3">
                        <Text size="sm" c="dimmed">
                            {new Date().toLocaleDateString("fa-IR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </Text>


                    </div>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
