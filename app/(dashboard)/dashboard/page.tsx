"use client";

import { useState, useEffect } from "react";
import { TextInput, Skeleton, Button } from "@mantine/core";
import { MdPhone, MdPerson, MdSave, MdWorkspacePremium, MdSecurity } from "react-icons/md";
import { HiCheck, HiSparkles, HiArrowLeft } from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiDiceSixFacesFive } from "react-icons/gi";
import { getUserFromCookie } from "@/backend/actions/user/getUser.action";
import { useServerAction } from "@/hooks/useServerAction";
import { User } from "@/types/Types";
import updateUserAction from "@/backend/actions/user/updateUser.action";
import { useRouter } from "next/navigation";

export default function UserProfile() {
    const router = useRouter();
    const { data, status, error } = useServerAction<User | null>(getUserFromCookie);
    const [form, setForm] = useState({ firstName: "", lastName: "" });
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (data) setForm({ firstName: data.name, lastName: data.last_name });
    }, [data]);

    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        await updateUserAction(form.firstName, form.lastName);
        setSaving(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window._refetch_dashboard_user()
    }

    const isLoading = status === "loading";
    const fullName = `${data?.name ?? ""} ${data?.last_name ?? ""}`.trim();

    return (
        <div className="mx-auto max-w-[1280px] space-y-6">

            {/* ===================== WELCOME HERO CARD ===================== */}
            <div className="fn-fade-up">
                <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#eef2ff] via-[#f0f7ff] to-[#f5f0ff] shadow-[0_8px_40px_rgba(59,130,246,.08)]">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl"/>
                    <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-purple-200/25 blur-2xl"/>
                    {/* Dot pattern */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:28px_28px]"/>

                    <div className="relative flex flex-col gap-6 p-6 md:p-8 sm:flex-row sm:items-center sm:justify-between">
                        {/* Greeting text */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                                    <HiSparkles size={13}/> فانیشلی
                                </span>
                                <span className="w-2 h-2 rounded-full bg-amber-400 fn-pulse-ring"/>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#1a2151] leading-tight">
                                سلام، {isLoading ? "..." : (data?.name || "کاربر")}! 👋
                            </h1>
                            <p className="mt-2 text-slate-500 text-sm md:text-base leading-7 max-w-lg">
                                به پنل کاربری فانی‌شلی خوش آمدید. اطلاعات حساب خود را مدیریت کنید و از ابزارهای تعاملی کلاس استفاده کنید.
                            </p>
                        </div>

                        {/* Mascot visual */}
                        <div className="relative shrink-0 hidden sm:block">
                            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-300/20 to-pink-200/20 blur-xl"/>
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white bg-white shadow-xl shadow-blue-200/50 fn-float-slow">
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

            {/* ===================== BENTO SUMMARY CARDS ===================== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fn-fade-up fn-delay-1">
                {/* User name card - Blue */}
                <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_4px_24px_rgba(59,130,246,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,.12)] fn-card-hover">
                    <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-blue-50/60"/>
                    <div className="relative flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <MdPerson size={24}/>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-400">نام کاربری</p>
                            <p className="text-sm font-bold text-[#1a2151] truncate">{fullName || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Account status - Green */}
                <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_4px_24px_rgba(16,185,129,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,.12)] fn-card-hover">
                    <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-50/50"/>
                    <div className="relative flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <HiCheck size={24}/>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-400">وضعیت حساب</p>
                            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                فعال <HiCheck size={14}/>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phone - Amber */}
                <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_4px_24px_rgba(245,158,11,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(245,158,11,.12)] fn-card-hover">
                    <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-amber-50/50"/>
                    <div className="relative flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <MdPhone size={22}/>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-400">شماره تلفن</p>
                            <p className="text-sm font-bold text-[#1a2151] truncate" dir="ltr">{data?.phone ?? "—"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== PROFILE + QUICK ACTIONS GRID ===================== */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 fn-fade-up fn-delay-2">

                {/* Profile Card */}
                <div className="bg-white rounded-[28px] border border-blue-50 shadow-[0_8px_30px_rgba(59,130,246,.06)] overflow-hidden">
                    {/* Card Header */}
                    <div className="px-6 py-5 border-b border-blue-50 flex items-center gap-4 bg-gradient-to-l from-blue-50/30 via-purple-50/20 to-transparent">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
                            <MdPerson size={28} className="text-white"/>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#1a2151] font-bold text-base">اطلاعات حساب کاربری</h3>
                            <p className="text-slate-400 text-sm mt-0.5">مشخصات شخصی خود را مدیریت کنید</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="p-6 flex flex-col gap-6">
                        {status === "error" && (
                            <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Name + Last Name */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoading ? (
                                <>
                                    <Skeleton height={54} radius="xl" className="w-full"/>
                                    <Skeleton height={54} radius="xl" className="w-full"/>
                                </>
                            ) : (
                                <>
                                    <TextInput
                                        label="نام"
                                        radius="xl"
                                        size="md"
                                        value={form.firstName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                                        placeholder="نام"
                                        classNames={{
                                            input: "border-blue-100 bg-white focus:border-blue-400 transition-colors h-[52px]",
                                            label: "text-slate-600 text-sm font-medium mb-1.5",
                                        }}
                                    />
                                    <TextInput
                                        label="نام خانوادگی"
                                        radius="xl"
                                        size="md"
                                        value={form.lastName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                                        placeholder="نام خانوادگی"
                                        classNames={{
                                            input: "border-blue-100 bg-white focus:border-blue-400 transition-colors h-[52px]",
                                            label: "text-slate-600 text-sm font-medium mb-1.5",
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Phone (non-editable) */}
                        {isLoading ? (
                            <Skeleton height={54} radius="xl"/>
                        ) : (
                            <TextInput
                                label={
                                    <span className="flex items-center gap-2">
                                        <MdPhone size={14} className="text-slate-400"/>
                                        شماره تلفن
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">غیرقابل تغییر</span>
                                    </span>
                                }
                                radius="xl"
                                size="md"
                                value={data?.phone ?? ""}
                                readOnly
                                dir="ltr"
                                classNames={{
                                    input: "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed select-none h-[52px]",
                                    label: "text-slate-600 text-sm font-medium mb-1.5",
                                }}
                            />
                        )}

                        {/* Save Button */}
                        <div className="flex justify-start pt-2">
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                loading={saving}
                                radius="xl"
                                size="lg"
                                leftSection={!saving ? <MdSave size={18}/> : undefined}
                                className="fn-btn-press bg-gradient-to-l from-blue-600 to-purple-600 shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-purple-300/50">
                                ذخیره تغییرات
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest px-1">دسترسی سریع</p>

                    {/* Plan action */}
                    <button
                        onClick={() => router.push("/dashboard/plan")}
                        className="group relative w-full overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 text-right shadow-[0_4px_24px_rgba(139,92,246,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,.12)] fn-card-hover">
                        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-purple-50/50"/>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <MdWorkspacePremium size={24}/>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#1a2151]">پلن و اشتراک</p>
                                <p className="text-xs text-slate-400 mt-0.5">پلن فعلی خود را مشاهده کنید</p>
                            </div>
                            <HiArrowLeft size={18} className="text-purple-300 transition-transform duration-300 group-hover:-translate-x-1"/>
                        </div>
                    </button>

                    {/* Security action */}
                    <button
                        onClick={() => router.push("/dashboard/security")}
                        className="group relative w-full overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 text-right shadow-[0_4px_24px_rgba(236,72,153,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,.12)] fn-card-hover">
                        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-pink-50/50"/>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <MdSecurity size={22}/>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#1a2151]">تنظیمات امنیتی</p>
                                <p className="text-xs text-slate-400 mt-0.5">رمز عبور خود را تغییر دهید</p>
                            </div>
                            <HiArrowLeft size={18} className="text-pink-300 transition-transform duration-300 group-hover:-translate-x-1"/>
                        </div>
                    </button>

                    {/* Teaching panel action */}
                    <button
                        onClick={() => router.push("/dash-teach")}
                        className="group relative w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 text-right shadow-[0_4px_24px_rgba(16,185,129,.06)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,.12)] fn-card-hover">
                        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-50/50"/>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <FaChalkboardTeacher size={22}/>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#1a2151]">ابزارهای تدریس</p>
                                <p className="text-xs text-slate-400 mt-0.5">ابزارهای تعاملی کلاس</p>
                            </div>
                            <HiArrowLeft size={18} className="text-emerald-300 transition-transform duration-300 group-hover:-translate-x-1"/>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
