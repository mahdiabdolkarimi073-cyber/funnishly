"use client";
import { useState, useTransition } from "react";
import { useServerAction } from "@/hooks/useServerAction";
import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    revokeUserPackage,
} from "@/backend/actions/admin/admin.action";
import { UserRole } from "@prisma/client";
import { MdPeople, MdSearch, MdDelete, MdBlock, MdStar } from "react-icons/md";
import { toast } from "react-toastify";

export default function AdminUsers() {
    const { data: users, status, refetch } = useServerAction(getAllUsers);
    const [search, setSearch] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const filtered = (users ?? []).filter((u) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            u.name.toLowerCase().includes(q) ||
            u.last_name.toLowerCase().includes(q) ||
            u.phone.includes(q)
        );
    });

    function handleRoleChange(userId: string, role: UserRole) {
        startTransition(async () => {
            const res = await updateUserRole(userId, role);
            if (res?.ok) {
                toast.success(res.message);
                refetch();
            } else {
                toast.error(res?.message ?? "خطا");
            }
        });
    }

    function handleDelete(userId: string) {
        startTransition(async () => {
            const res = await deleteUser(userId);
            if (res?.ok) {
                toast.success(res.message);
                setConfirmDelete(null);
                refetch();
            } else {
                toast.error(res?.message ?? "خطا");
            }
        });
    }

    function handleRevokePackage(userId: string) {
        startTransition(async () => {
            const res = await revokeUserPackage(userId);
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

    if (!users) {
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
                    <h2 className="text-xl font-bold text-slate-800">کاربران</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {users.length.toLocaleString("fa")} کاربر ثبت‌شده
                    </p>
                </div>

                <div className="relative">
                    <MdSearch size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو..."
                        className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-sky-400 w-64 max-w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs">
                                <th className="text-right px-4 py-3 font-medium">نام و نام خانوادگی</th>
                                <th className="text-right px-4 py-3 font-medium">شماره تماس</th>
                                <th className="text-right px-4 py-3 font-medium">نقش</th>
                                <th className="text-right px-4 py-3 font-medium">پکیج فعال</th>
                                <th className="text-right px-4 py-3 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-400">
                                        کاربری یافت نشد
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-slate-50 hover:bg-slate-50/30 transition"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                    {u.name?.at(0) ?? "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {u.name} {u.last_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600" dir="ltr">
                                            {u.phone}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                                disabled={pending}
                                                className={`text-xs font-medium rounded-lg px-3 py-1.5 border cursor-pointer outline-none ${
                                                    u.role === "ADMIN"
                                                        ? "bg-violet-50 border-violet-200 text-violet-700"
                                                        : "bg-slate-50 border-slate-200 text-slate-600"
                                                }`}
                                            >
                                                <option value="USER">کاربر عادی</option>
                                                <option value="ADMIN">ادمین</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            {u.activePackage ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                                                        {u.activePackage.package.title}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRevokePackage(u.id)}
                                                        disabled={pending}
                                                        title="لغو پکیج"
                                                        className="text-amber-500 hover:text-amber-600 transition"
                                                    >
                                                        <MdBlock size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {confirmDelete === u.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
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
                                                    onClick={() => setConfirmDelete(u.id)}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                    title="حذف کاربر"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            )}
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
