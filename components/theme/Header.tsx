"use client"

import { useState } from "react";
import Link from "next/link";
import { User } from "@/types/Types";
import Logo from "../logo/Logo";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Header({ user }: { user?: User }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "خانه" },
        { href: "/#about", label: "معرفی" },
        { href: "/#packages", label: "پکیج ها" },
        { href: "/#about-us", label: "درباره ما" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* Right: Logo + Nav */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Logo />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-2 lg:gap-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={user ? "/dashboard" : "/auth/login"}
                        className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-200"
                    >
                        {user ? "پنل کاربری" : "ثبت‌نام و ورود"}
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-sky-200 bg-white text-sky-700 transition hover:bg-sky-50"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="منو"
                    >
                        {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {mobileOpen && (
                <nav className="md:hidden border-t border-sky-100 bg-white">
                    <ul className="flex flex-col gap-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    )
}
