"use client";

import { useState, useEffect } from "react";
import { TextInput, Skeleton, Button } from "@mantine/core";
import { MdEdit, MdPhone, MdPerson, MdSave } from "react-icons/md";
import { getUserFromCookie } from "@/backend/actions/user/getUser.action";
import { useServerAction } from "@/hooks/useServerAction";
import { User } from "@/types/Types";
import updateUserAction from "@/backend/actions/user/updateUser.action";
import { useRouter } from "next/navigation";

export default function UserProfile() {
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

    return (
        <div className="mx-auto p-6">
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-md shadow-sky-200">
                        <MdPerson size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-slate-800 font-semibold text-sm">اطلاعات حساب کاربری</h2>
                        <p className="text-sky-400 text-xs">مشخصات شخصی خود را ویرایش کنید</p>
                    </div>
                </div>

                {/* Fields */}
                <div className="p-6 flex flex-col gap-5">

                    {status === "error" && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {/* Name Row */}
                    <div className="w-full flex gap-3">
                        {isLoading ? (
                            <>
                                <Skeleton height={60} radius="md" className="w-full" />
                                <Skeleton height={60} radius="md" className="w-full" />
                            </>
                        ) : (
                            <>
                                <TextInput
                                    label="نام"
                                    leftSection={<MdEdit size={13} className="text-sky-500" />}
                                    value={form.firstName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="نام"
                                    className="w-full" classNames={{
                                        input: "border-sky-100 bg-sky-50 focus:border-sky-400",
                                        label: "text-slate-600 text-xs font-medium mb-1",
                                    }}
                                />
                                <TextInput
                                    label="نام خانوادگی"
                                    leftSection={<MdEdit size={13} className="text-sky-500" />}
                                    value={form.lastName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="نام خانوادگی"
                                    className="w-full"
                                    classNames={{
                                        input: "border-sky-100 bg-sky-50 focus:border-sky-400",
                                        label: "text-slate-600 text-xs font-medium mb-1",
                                    }}
                                />
                            </>
                        )}
                    </div>

                    {/* Phone */}
                    {isLoading ? (
                        <Skeleton height={60} radius="md" />
                    ) : (
                        <TextInput
                            label={
                                <span className="flex items-center gap-1.5">
                                    <MdPhone size={13} className="text-slate-400" />
                                    شماره تلفن
                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">غیرقابل تغییر</span>
                                </span>
                            }
                            value={data?.phone ?? ""}
                            readOnly
                            dir="ltr"
                            classNames={{
                                input: "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed select-none", label: "text-slate-600 text-xs font-medium mb-1",
                            }}
                        />
                    )}

                    {/* Save Button */}
                    <div className="pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            loading={saving}
                            leftSection={<MdSave size={16} />}
                            className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 shadow-sm shadow-emerald-200">
                            ذخیره تغییرات
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
