"use client";
import { useState, useTransition } from "react";
import { useServerAction } from "@/hooks/useServerAction";
import { getAllGameData, deleteGameData } from "@/backend/actions/admin/admin.action";
import { MdSportsEsports, MdDelete, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";

const GAME_LABELS: Record<string, string> = {
    WHEEL: "گردونه",
    QUIZ: "کوییز",
    SENTENCE_SCRAMBLE: "مرتب کردن جملات",
    WORD_MATCH: "وصل کردن کلمات",
    WORD_SQUARE: "مربع کلمات",
};

export default function AdminGameData() {
    const { data: gameData, status, refetch } = useServerAction(getAllGameData);
    const [search, setSearch] = useState("");
    const [pending, startTransition] = useTransition();
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const filtered = (gameData ?? []).filter((g) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            g.user.name.toLowerCase().includes(q) ||
            g.user.last_name.toLowerCase().includes(q) ||
            g.user.phone.includes(q) ||
            g.gameType.toLowerCase().includes(q)
        );
    });

    function handleDelete(id: string) {
        startTransition(async () => {
            const res = await deleteGameData(id);
            if (res?.ok) {
                toast.success(res.message);
                setConfirmDelete(null);
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

    if (!gameData) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-500 text-sm">دسترسی غیرمجاز</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">داده بازی‌ها</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {gameData.length.toLocaleString("fa")} رکورد داده بازی
                    </p>
                </div>

                <div className="relative">
                    <MdSearch size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو..."
                        className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-sky-400 w-56 max-w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs">
                                <th className="text-right px-4 py-3 font-medium">کاربر</th>
                                <th className="text-right px-4 py-3 font-medium">نوع بازی</th>
                                <th className="text-right px-4 py-3 font-medium">حجم داده</th>
                                <th className="text-right px-4 py-3 font-medium">آخرین آپدیت</th>
                                <th className="text-right px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-400">
                                        داده‌ای یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((g) => {
                                    const dataSize = JSON.stringify(g.data).length;
                                    return (
                                        <tr
                                            key={g.id}
                                            className="border-b border-slate-50 hover:bg-slate-50/30 transition"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-slate-800">
                                                    {g.user.name} {g.user.last_name}
                                                </p>
                                                <p className="text-xs text-slate-400" dir="ltr">
                                                    {g.user.phone}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-sky-100">
                                                    <MdSportsEsports size={14} />
                                                    {GAME_LABELS[g.gameType] ?? g.gameType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">
                                                {dataSize > 1024
                                                    ? `${(dataSize / 1024).toFixed(1)} KB`
                                                    : `${dataSize} B`}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">
                                                {new Date(g.updatedAt).toLocaleDateString("fa-IR")}
                                            </td>
                                            <td className="px-4 py-3">
                                                {confirmDelete === g.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDelete(g.id)}
                                                            disabled={pending}
                                                            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                                                        >
                                                            تایید حذف
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDelete(null)}
                                                            className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                                                        >
                                                            انصراف
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDelete(g.id)}
                                                        className="text-red-400 hover:text-red-600 transition"
                                                        title="حذف داده"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
