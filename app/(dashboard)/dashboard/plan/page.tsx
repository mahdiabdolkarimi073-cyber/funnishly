import React from 'react';
import {Button, Badge} from "@mantine/core";
import {HiCheck, HiSparkles} from "react-icons/hi";
import {MdWorkspacePremium, MdTimer} from "react-icons/md";
import {GiTrophy} from "react-icons/gi";

import getUserPackages from "@/backend/actions/user/getPackage.action";
import {PackageDuration} from "@/app/generated/prisma";

const DURATION_PRICES: Record<PackageDuration, "price1m" | "price3m" | "price6m"> = {
    MONTH1: "price1m",
    MONTH3: "price3m",
    MONTH6: "price6m",
};

const DURATION_LABELS: Record<PackageDuration, string> = {
    MONTH1: "۱ ماهه",
    MONTH3: "۳ ماهه",
    MONTH6: "۶ ماهه",
};

const ActivePlanCard = async () => {

    const pkg = await getUserPackages()
    const plan = pkg?.package

    if (!plan) return (
        <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 text-center shadow-[0_8px_30px_rgba(139,92,246,.06)] fn-fade-up">
                <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-purple-100/40 blur-2xl"/>
                <div className="relative">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-400 shadow-md shadow-purple-100/50">
                        <MdWorkspacePremium size={32}/>
                    </div>
                    <h3 className="text-[#1a2151] font-black text-lg">پلن فعالی ندارید</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">برای استفاده از ابزارهای فانیشلی، یکی از پکیج‌ها را انتخاب کنید و کلاس خود را جذاب‌تر کنید.</p>
                </div>
            </div>
        </div>
    )

    const duration = pkg?.duration ?? "MONTH1";
    const priceField = DURATION_PRICES[duration as PackageDuration];
    const price = plan[priceField];

    return (
        <div className="mx-auto max-w-3xl fn-fade-up">
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(139,92,246,.08)]">

                {/* Decorative gradient header */}
                <div className="relative overflow-hidden px-6 py-6 bg-gradient-to-br from-purple-500 via-blue-600 to-purple-600">
                    <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10"/>
                    <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/5"/>
                    <div className="pointer-events-none absolute right-[20%] top-[20%] fn-float-slow">
                        <HiSparkles size={16} className="text-white/40"/>
                    </div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <MdWorkspacePremium size={28} className="text-white"/>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">پلن فعلی شما</p>
                                <h3 className="text-white font-black text-xl">{plan.title}</h3>
                            </div>
                        </div>
                        <Badge radius="xl" size="lg" className="bg-emerald-400/20 text-emerald-100 border border-emerald-300/30">
                            <span className="flex items-center gap-1">
                                <HiCheck size={12}/> فعال
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-7">{plan.description}</p>

                    {/* Price - prominent */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-purple-50/50 via-blue-50/30 to-transparent px-5 py-5 border border-purple-50">
                        <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-purple-100/30"/>
                        <div className="relative flex items-baseline gap-2">
                            <GiTrophy size={22} className="text-purple-400 mb-1"/>
                            <span className="text-4xl font-black text-[#1a2151]">{price?.toLocaleString("fa")}</span>
                            <span className="text-slate-400 text-sm">تومان</span>
                            <span className="text-purple-400 text-xs mr-2">({DURATION_LABELS[duration as PackageDuration]})</span>
                        </div>
                    </div>

                    {/* Features list */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-3">امکانات پلن</p>
                        <div className="space-y-3">
                            {plan.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-3 text-slate-600 group">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                                        <HiCheck size={15}/>
                                    </span>
                                    <span className="text-sm">{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Duration info */}
                    <div className="flex items-center gap-2 rounded-2xl bg-amber-50/50 border border-amber-50 px-5 py-3">
                        <MdTimer size={18} className="text-amber-500"/>
                        <span className="text-amber-700 text-sm font-medium">
                            مدت اعتبار: {DURATION_LABELS[duration as PackageDuration]}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivePlanCard;
