"use client";
import { useState, useTransition } from "react";
import { useServerAction } from "@/hooks/useServerAction";
import { getAllTransactions, updateTransactionStatus } from "@/backend/actions/admin/admin.action";
import { TransactionStatus } from "@prisma/client";
import { MdReceipt, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";

const STATUS_LABELS: Record<TransactionStatus, string> = {
    PENDING: "در انتظار",
    SUCCESS: "موفق",
    FAILED: "ناموفق",
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminTransactions() {
    const { data: transactions, status, refetch } = useServerAction(getAllTransactions);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [pending, startTransition] = useTransition();

    const filtered = (transactions ?? []).filter((t) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
            !q ||
            t.user.name.toLowerCase().includes(q) ||
            t.user.last_name.toLowerCase().includes(q) ||
            t.user.phone.includes(q);
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    function handleStatusChange(txId: string, newStatus: TransactionStatus) {
        startTransition(async () => {
            const res = await updateTransactionStatus(txId, newStatus);
            if (res?.ok) {
                toast.success(res.message);
                refetch();
            } else {
                toast.error(res?.message ?? "خطا");
            }
        });
    }

    if (status === "loading") {
        return (
            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-20 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!transactions) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm">دسترسی غیرمجاز</p>
            </div>
        );
    }

    const totalRevenue = transactions
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">تراکنش‌ها</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {transactions.length.toLocaleString("fa")} تراکنش • درآمد:{" "}
                        {totalRevenue.toLocaleString("fa")} تومان
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <MdSearch
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجو..."
                            className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-sky-400 w-56 max-w-full"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 cursor-pointer"
                    >
                        <option value="ALL">همه وضعیت‌ها</option>
                        <option value="SUCCESS">موفق</option>
                        <option value="PENDING">در انتظار</option>
                        <option value="FAILED">ناموفق</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs">
                                <th className="text-right px-4 py-3 font-medium">کاربر</th>
                                <th className="text-right px-4 py-3 font-medium">پکیج</th>
                                <th className="text-right px-4 py-3 font-medium">مبلغ</th>
                                <th className="text-right px-4 py-3 font-medium">تاریخ</th>
                                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-400">
                                        تراکنشی یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b border-slate-50 hover:bg-slate-50/30 transition"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-800">
                                                {t.user.name} {t.user.last_name}
                                            </p>
                                            <p className="text-xs text-slate-400" dir="ltr">
                                                {t.user.phone}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{t.package.title}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {t.amount.toLocaleString("fa")}{" "}
                                            <span className="text-xs text-slate-400">تومان</span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={t.status}
                                                onChange={(e) =>
                                                    handleStatusChange(t.id, e.target.value as TransactionStatus)
                                                }
                                                disabled={pending}
                                                className={`text-xs font-medium rounded-lg px-3 py-1.5 border cursor-pointer outline-none ${STATUS_COLORS[t.status]}`}
                                            >
                                                <option value="PENDING">در انتظار</option>
                                                <option value="SUCCESS">موفق</option>
                                                <option value="FAILED">ناموفق</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
