"use client";

import { useState } from "react";
import { Badge, Button } from "@mantine/core";
import {
    MdTimer,
    MdDonutLarge,
    MdCasino,
    MdGridOn,
    MdSortByAlpha,
    MdViewColumn,
    MdQuiz,
    MdWorkspacePremium,
    MdCheck,
    MdLock,
} from "react-icons/md";
import { HiCheck, HiSparkles, HiArrowLeft } from "react-icons/hi";
import { GiTrophy } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { useServerAction } from "@/hooks/useServerAction";
import getAllPackagesPublic from "@/backend/actions/package/getAllPackages.action";
import getUserPackages from "@/backend/actions/user/getPackage.action";
import { PackageDuration } from "@/app/generated/prisma";

const OPTION_META: Record<string, { label: string; icon: React.ReactNode }> = {
    timer: { label: "تایمر کلاس", icon: <MdTimer size={16} /> },
    wheel: { label: "گردونه شانس", icon: <MdDonutLarge size={16} /> },
    dice: { label: "تاس", icon: <MdCasino size={16} /> },
    "word-square": { label: "مربع کلمات", icon: <MdGridOn size={16} /> },
    "incomplete-sentence": { label: "مرتب‌سازی جمله", icon: <MdSortByAlpha size={16} /> },
    "col-words": { label: "تطبیق کلمات", icon: <MdViewColumn size={16} /> },
    quiz: { label: "کوییز", icon: <MdQuiz size={16} /> },
};

const DURATIONS: {
    key: PackageDuration;
    label: string;
    priceField: "price1m" | "price3m" | "price6m" | "price1y";
}[] = [
    { key: "MONTH1", label: "۱ ماهه", priceField: "price1m" },
    { key: "MONTH3", label: "۳ ماهه", priceField: "price3m" },
    { key: "MONTH6", label: "۶ ماهه", priceField: "price6m" },
];

export default function PlanPage() {
    const router = useRouter();
    const { data: packageData, status } = useServerAction(getAllPackagesPublic);
    const { data: activePkg } = useServerAction(getUserPackages);

    const packages = packageData?.packages ?? [];
    const activePackageId = packageData?.activePackageId ?? null;
    const activePlan = activePkg?.package ?? null;
    const activeDuration = activePkg?.duration ?? "MONTH1";

    const [selectedDuration, setSelectedDuration] = useState<PackageDuration>("MONTH1");

    const hasYearly = packages.some((p: any) => p.price1y > 0);
    const durations = hasYearly
        ? [...DURATIONS, { key: "MONTH12" as PackageDuration, label: "۱۲ ماهه", priceField: "price1y" as const }]
        : DURATIONS;

    const durationLabel = (d: PackageDuration) => {
        const map: Record<PackageDuration, string> = {
            MONTH1: "۱ ماهه",
            MONTH3: "۳ ماهه",
            MONTH6: "۶ ماهه",
            MONTH12: "۱۲ ماهه",
        };
        return map[d];
    };

    if (status === "loading") {
        return (
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="h-48 bg-white rounded-[28px] animate-pulse" />
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="h-96 bg-white rounded-[28px] animate-pulse" />
                    <div className="h-96 bg-white rounded-[28px] animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* ===================== ACTIVE PLAN CARD ===================== */}
            {activePlan && (
                <div className="fn-fade-up">
                    <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(139,92,246,.08)]">
                        <div className="relative overflow-hidden px-6 py-6 bg-gradient-to-br from-purple-500 via-blue-600 to-purple-600">
                            <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                            <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/5" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <MdWorkspacePremium size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">پلن فعلی شما</p>
                                        <h3 className="text-white font-black text-xl">{activePlan.title}</h3>
                                    </div>
                                </div>
                                <Badge radius="xl" size="lg" className="bg-emerald-400/20 text-emerald-100 border border-emerald-300/30">
                                    <span className="flex items-center gap-1">
                                        <HiCheck size={12} /> فعال
                                    </span>
                                </Badge>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-500 text-sm leading-7">{activePlan.description}</p>
                            <div className="flex items-center gap-2 rounded-2xl bg-amber-50/50 border border-amber-50 px-5 py-3">
                                <MdTimer size={18} className="text-amber-500" />
                                <span className="text-amber-700 text-sm font-medium">
                                    مدت اعتبار: {durationLabel(activeDuration as PackageDuration)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== DURATION SELECTOR ===================== */}
            {!activePackageId && packages.length > 0 && (
                <div className="fn-fade-up fn-delay-1">
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                            <GiTrophy size={18} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-[#1a2151]">انتخاب مدت اشتراک</h3>
                            <p className="text-slate-400 text-xs">مدت مورد نظر خود را انتخاب کنید</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {durations.map((d) => (
                            <button
                                key={d.key}
                                onClick={() => setSelectedDuration(d.key)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition border-2 ${
                                    selectedDuration === d.key
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                                }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ===================== PACKAGE CARDS ===================== */}
            {!activePackageId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 fn-fade-up fn-delay-2">
                    {packages.map((pkg: any, idx: number) => {
                        const isOdd = packages.length % 2 === 1 && idx === packages.length - 1;
                        const priceField = durations.find((d) => d.key === selectedDuration)?.priceField ?? "price1m";
                        const price = pkg[priceField] ?? 0;
                        const tax = Math.round(price * 0.1);
                        const total = price + tax;
                        const isFeatured = idx === 0;

                        return (
                            <div
                                key={pkg.id}
                                className={`relative overflow-hidden rounded-[28px] border bg-white p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_16px_50px_rgba(59,130,246,.14)] ${
                                    isFeatured
                                        ? "border-blue-200 shadow-[0_8px_30px_rgba(59,130,246,.10)]"
                                        : "border-slate-100 shadow-[0_4px_24px_rgba(59,130,246,.06)]"
                                } ${isOdd ? "sm:col-span-2" : ""}`}
                            >
                                {isFeatured && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-blue-500 to-purple-500" />
                                )}

                                {/* Title + Featured badge */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                                    isFeatured ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"
                                                }`}
                                            >
                                                <MdWorkspacePremium size={24} />
                                            </div>
                                            {isFeatured && (
                                                <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">
                                                    <HiSparkles size={11} /> پیشنهاد ویژه
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-black text-lg text-[#1a2151]">{pkg.title}</h3>
                                        <p className="text-slate-400 text-xs mt-1 leading-6">{pkg.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-50/50 via-purple-50/30 to-transparent px-5 py-4 border border-blue-50">
                                    <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-blue-100/30" />
                                    <div className="relative flex items-baseline gap-2">
                                        <GiTrophy size={20} className="text-blue-400 mb-1" />
                                        <span className="text-3xl font-black text-[#1a2151]">
                                            {price?.toLocaleString("fa")}
                                        </span>
                                        <span className="text-slate-400 text-sm">تومان</span>
                                        <span className="text-blue-400 text-xs mr-2">({durationLabel(selectedDuration)})</span>
                                    </div>
                                    {tax > 0 && (
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            به‌علاوه ۱۰٪ مالیات ({tax.toLocaleString("fa")} تومان) = {total.toLocaleString("fa")} تومان
                                        </p>
                                    )}
                                </div>

                                {/* Features list */}
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-3">امکانات پکیج</p>
                                    <div className="space-y-2.5">
                                        {pkg.options.map((opt: string) => {
                                            const meta = OPTION_META[opt];
                                            return (
                                                <div key={opt} className="flex items-center gap-3 text-slate-600 group">
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                                                        <MdCheck size={15} />
                                                    </span>
                                                    <span className="text-sm flex items-center gap-1.5">
                                                        {meta?.icon}
                                                        {meta?.label ?? opt}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Buy button */}
                                <button
                                    onClick={() =>
                                        router.push(`/payment/${pkg.id}?duration=${durationLabel(selectedDuration)}`)
                                    }
                                    className={`w-full py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 fn-btn-press ${
                                        isFeatured
                                            ? "bg-gradient-to-l from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200/40 hover:shadow-xl hover:shadow-purple-200/50"
                                            : "bg-slate-800 hover:bg-slate-900 text-white"
                                    }`}
                                >
                                    خرید پکیج
                                    <HiArrowLeft size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===================== EMPTY STATE ===================== */}
            {!activePackageId && packages.length === 0 && (
                <div className="mx-auto max-w-3xl">
                    <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 text-center shadow-[0_8px_30px_rgba(139,92,246,.06)] fn-fade-up">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-400 shadow-md">
                            <MdLock size={32} />
                        </div>
                        <h3 className="text-[#1a2151] font-black text-lg">فعلاً پکیجی موجود نیست</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                            به‌زودی پکیج‌های جدید اضافه خواهد شد. لطفاً بعداً بررسی کنید.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
