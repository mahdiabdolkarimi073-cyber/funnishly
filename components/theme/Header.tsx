
import Link from "next/link";
import {User} from "@/types/Types";
import Logo from "../logo/Logo";

export default function Header({user}: { user?: User }) {


    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/70 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* Right: Logo + Nav */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Logo />
                    </Link>

                    {/* Nav */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-2 lg:gap-3">
                            <li>
                                <Link
                                    href="/"
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                >
                                    خانه
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#about"
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                >
                                    معرفی
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#packages"
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                >
                                    پکیج ها
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#about-us"
                                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                                >
                                    درباره ما
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Link
                    href={user ? "/dashboard" : "/auth/login"}
                    className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-200"
                >
                    {user ? "پنل کاربری" : "ثبت‌نام و ورود"}
                </Link>

            </div>
        </header>
    )
}