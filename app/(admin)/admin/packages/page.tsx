"use client";
import { useState, useTransition } from "react";
import { useServerAction } from "@/hooks/useServerAction";
import {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage,
} from "@/backend/actions/admin/admin.action";
import {
    MdCardGiftcard,
    MdAdd,
    MdEdit,
    MdDelete,
    MdClose,
    MdCheck,
} from "react-icons/md";
import { toast } from "react-toastify";

interface PackageForm {
    title: string;
    description: string;
    price1m: number;
    price3m: number;
    price6m: number;
    options: string[];
}

const emptyForm: PackageForm = {
    title: "",
    description: "",
    price1m: 0,
    price3m: 0,
    price6m: 0,
    options: [],
};

export default function AdminPackages() {
    const { data: packages, status, refetch } = useServerAction(getAllPackages);
    const [pending, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<PackageForm>(emptyForm);
    const [optionInput, setOptionInput] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function openCreate() {
        setForm(emptyForm);
        setEditingId(null);
        setOptionInput("");
        setShowModal(true);
    }

    function openEdit(pkg: any) {
        setForm({
            title: pkg.title,
            description: pkg.description,
            price1m: pkg.price1m,
            price3m: pkg.price3m,
            price6m: pkg.price6m,
            options: [...pkg.options],
        });
        setEditingId(pkg.id);
        setOptionInput("");
        setShowModal(true);
    }

    function addOption() {
        const v = optionInput.trim();
        if (!v || form.options.includes(v)) return;
        setForm({ ...form, options: [...form.options, v] });
        setOptionInput("");
    }

    function removeOption(opt: string) {
        setForm({ ...form, options: form.options.filter((o) => o !== opt) });
    }

    function handleSubmit() {
        if (!form.title.trim()) {
            toast.error("عنوان پکیج الزامی است");
            return;
        }

        startTransition(async () => {
            const res = editingId
                ? await updatePackage(editingId, form)
                : await createPackage(form);

            if (res?.ok) {
                toast.success(res.message);
                setShowModal(false);
                refetch();
            } else {
                toast.error(res?.message ?? "خطا");
            }
        });
    }

    function handleDelete(id: string) {
        startTransition(async () => {
            const res = await deletePackage(id);
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
            <div className="grid gap-4 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-48 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!packages) {
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
                    <h2 className="text-xl font-bold text-slate-800">پکیج‌ها</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {packages.length.toLocaleString("fa")} پکیج تعریف‌شده
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shadow-sky-200"
                >
                    <MdAdd size={20} />
                    پکیج جدید
                </button>
            </div>

            {/* Package cards */}
            <div className="grid gap-4 lg:grid-cols-2">
                {packages.map((pkg: any) => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 text-base">{pkg.title}</h3>
                                <p className="text-slate-500 text-xs mt-1 leading-6">{pkg.description}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => openEdit(pkg)}
                                    className="text-sky-500 hover:text-sky-600 transition p-1.5 rounded-lg hover:bg-sky-50"
                                    title="ویرایش"
                                >
                                    <MdEdit size={18} />
                                </button>
                                {confirmDelete === pkg.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            disabled={pending}
                                            className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                        >
                                            تایید
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(null)}
                                            className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-200"
                                        >
                                            خیر
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(pkg.id)}
                                        className="text-red-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50"
                                        title="حذف"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "۱ ماهه", price: pkg.price1m },
                                { label: "۳ ماهه", price: pkg.price3m },
                                { label: "۶ ماهه", price: pkg.price6m },
                            ].map((d) => (
                                <div
                                    key={d.label}
                                    className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100"
                                >
                                    <p className="text-slate-400 text-[10px]">{d.label}</p>
                                    <p className="text-slate-800 font-bold text-sm mt-1">
                                        {d.price.toLocaleString("fa")}
                                    </p>
                                    <p className="text-slate-400 text-[9px]">تومان</p>
                                </div>
                            ))}
                        </div>

                        {/* Options */}
                        <div className="flex flex-wrap gap-1.5">
                            {pkg.options.map((opt: string, i: number) => (
                                <span
                                    key={i}
                                    className="bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-lg border border-sky-100"
                                >
                                    {opt}
                                </span>
                            ))}
                        </div>

                        {/* Purchases count */}
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-50">
                            <MdCardGiftcard size={14} />
                            {pkg._count?.purchases?.toLocaleString("fa") ?? "۰"} خرید
                        </div>
                    </div>
                ))}
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-bold text-slate-800">
                                {editingId ? "ویرایش پکیج" : "پکیج جدید"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <MdClose size={22} />
                            </button>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">عنوان پکیج</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="مثال: معلم خلاق"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">توضیحات</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="توضیحات پکیج..."
                                rows={2}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-400 resize-none"
                            />
                        </div>

                        {/* Prices */}
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">قیمت‌ها (تومان)</label>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <span className="text-[10px] text-slate-400">۱ ماهه</span>
                                    <input
                                        type="number"
                                        value={form.price1m || ""}
                                        onChange={(e) => setForm({ ...form, price1m: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-400 mt-1"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400">۳ ماهه</span>
                                    <input
                                        type="number"
                                        value={form.price3m || ""}
                                        onChange={(e) => setForm({ ...form, price3m: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-400 mt-1"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400">۶ ماهه</span>
                                    <input
                                        type="number"
                                        value={form.price6m || ""}
                                        onChange={(e) => setForm({ ...form, price6m: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-400 mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                                امکانات پکیج
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    value={optionInput}
                                    onChange={(e) => setOptionInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addOption();
                                        }
                                    }}
                                    placeholder="مثال: تایمر، گردونه..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-400 min-w-0"
                                />
                                <button
                                    onClick={addOption}
                                    type="button"
                                    className="bg-slate-700 text-white px-3 rounded-xl text-sm hover:bg-slate-800 shrink-0 flex items-center"
                                >
                                    <MdAdd size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {form.options.map((opt) => (
                                    <span
                                        key={opt}
                                        className="flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs px-2.5 py-1.5 rounded-lg border border-sky-100"
                                    >
                                        {opt}
                                        <button onClick={() => removeOption(opt)} className="text-sky-400 hover:text-red-500">
                                            <MdClose size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={pending}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <MdCheck size={18} />
                            {editingId ? "ذخیره تغییرات" : "ایجاد پکیج"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
