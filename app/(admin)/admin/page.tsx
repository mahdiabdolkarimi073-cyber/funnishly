"use client";
import { useServerAction } from "@/hooks/useServerAction";
import { getAdminStats } from "@/backend/actions/admin/admin.action";
import { MdPeople, MdCardGiftcard, MdReceipt, MdTrendingUp, MdCheckCircle } from "react-icons/md";

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-xs font-medium">{label}</p>
                <p className="text-slate-800 text-2xl font-bold mt-1">{value}</p>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { data: stats, status } = useServerAction(getAdminStats);

    if (status === "loading") {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-32 animate-pulse">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 mb-3" />
                        <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                        <div className="h-6 w-16 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm">دسترسی غیرمجاز. لطفاً وارد شوید.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800">نمای کلی</h2>
                <p className="text-slate-500 text-sm mt-1">آمار کلی سیستم</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard
                    icon={<MdPeople size={24} className="text-white" />}
                    label="کل کاربران"
                    value={stats.userCount.toLocaleString("fa")}
                    color="bg-gradient-to-br from-sky-500 to-blue-600"
                />
                <StatCard
                    icon={<MdCardGiftcard size={24} className="text-white" />}
                    label="پکیج‌ها"
                    value={stats.packageCount.toLocaleString("fa")}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                />
                <StatCard
                    icon={<MdReceipt size={24} className="text-white" />}
                    label="تراکنش‌ها"
                    value={stats.transactionCount.toLocaleString("fa")}
                    color="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <StatCard
                    icon={<MdCheckCircle size={24} className="text-white" />}
                    label="پکیج‌های فعال"
                    value={stats.activePackageCount.toLocaleString("fa")}
                    color="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
                <StatCard
                    icon={<MdTrendingUp size={24} className="text-white" />}
                    label="درآمد کل (تومان)"
                    value={stats.totalRevenue.toLocaleString("fa")}
                    color="bg-gradient-to-br from-rose-500 to-pink-600"
                />
            </div>

            {/* Quick links */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-2">
                <a
                    href="/admin/users"
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <MdPeople size={20} className="text-sky-600" />
                        <h3 className="font-bold text-slate-800 text-sm">مدیریت کاربران</h3>
                    </div>
                    <p className="text-slate-500 text-xs">مشاهده، ویرایش نقش و حذف کاربران</p>
                </a>
                <a
                    href="/admin/packages"
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <MdCardGiftcard size={20} className="text-violet-600" />
                        <h3 className="font-bold text-slate-800 text-sm">مدیریت پکیج‌ها</h3>
                    </div>
                    <p className="text-slate-500 text-xs">ایجاد، ویرایش و حذف پکیج‌ها و قیمت‌ها</p>
                </a>
                <a
                    href="/admin/transactions"
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <MdReceipt size={20} className="text-amber-600" />
                        <h3 className="font-bold text-slate-800 text-sm">تراکنش‌ها</h3>
                    </div>
                    <p className="text-slate-500 text-xs">مشاهده و تغییر وضعیت تراکنش‌ها</p>
                </a>
            </div>
        </div>
    );
}
