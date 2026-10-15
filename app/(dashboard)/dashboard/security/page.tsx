'use client';

import {
    PasswordInput,
    Button,
    Stack,
    Group,
    Divider,
} from '@mantine/core';
import {MdSecurity, MdLock} from "react-icons/md";
import {BiLock} from "react-icons/bi";
import {HiSparkles} from "react-icons/hi";
import {useForm} from '@mantine/form';
import {changePassword} from "@/backend/actions/user/updateUser.action";
import {toast} from "react-toastify";
import {useState} from "react";

export default function ChangePasswordPage() {

    const [loading, setLoading] = useState(false)
    const form = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            newPassword: (value) => (value.length < 8 ? 'رمز عبور باید حداقل ۸ کاراکتر باشد' : null),
            confirmPassword: (value, values) =>
                value !== values.newPassword ? 'رمزهای عبور مطابقت ندارند' : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true)
        const res = await changePassword(values)
        toast(res.message, {type: res.ok ? 'success' : 'error'})
        form.reset()
        setLoading(false)
    };

    return (
        <div className="mx-auto max-w-3xl fn-fade-up">
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(236,72,153,.08)]">

                {/* Decorative gradient header */}
                <div className="relative overflow-hidden px-6 py-6 bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600">
                    <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10"/>
                    <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/5"/>
                    <div className="pointer-events-none absolute right-[20%] top-[20%] fn-float-slow">
                        <HiSparkles size={16} className="text-white/40"/>
                    </div>

                    <div className="relative flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <MdSecurity size={28} className="text-white"/>
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg">تنظیمات امنیتی</h3>
                            <p className="text-white/60 text-sm mt-0.5">رمز عبور خود را تغییر دهید</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <PasswordInput
                                label="رمز عبور فعلی"
                                placeholder="••••••••"
                                radius="xl"
                                size="md"
                                required
                                leftSection={<MdLock size={16} className="text-slate-400"/>}
                                classNames={{
                                    input: "border-pink-100 bg-white focus:border-pink-400 transition-colors h-[52px]",
                                    label: "text-slate-600 text-sm font-medium mb-1.5",
                                }}
                                {...form.getInputProps('currentPassword')}
                            />

                            <Divider my="xs" label="رمز عبور جدید" labelPosition="center"
                                className="!text-slate-300 !text-xs"
                            />

                            <PasswordInput
                                label="رمز عبور جدید"
                                placeholder="رمز جدید را وارد کنید"
                                radius="xl"
                                size="md"
                                required
                                leftSection={<BiLock size={16} className="text-slate-400"/>}
                                classNames={{
                                    input: "border-pink-100 bg-white focus:border-pink-400 transition-colors h-[52px]",
                                    label: "text-slate-600 text-sm font-medium mb-1.5",
                                }}
                                {...form.getInputProps('newPassword')}
                            />

                            <PasswordInput
                                label="تکرار رمز عبور جدید"
                                placeholder="تکرار رمز جدید"
                                radius="xl"
                                size="md"
                                required
                                leftSection={<BiLock size={16} className="text-slate-400"/>}
                                classNames={{
                                    input: "border-pink-100 bg-white focus:border-pink-400 transition-colors h-[52px]",
                                    label: "text-slate-600 text-sm font-medium mb-1.5",
                                }}
                                {...form.getInputProps('confirmPassword')}
                            />

                            <Group justify="flex-start" mt="md">
                                <Button
                                    type="submit"
                                    radius="xl"
                                    size="lg"
                                    loading={loading}
                                    leftSection={!loading ? <BiLock size={18}/> : undefined}
                                    className="fn-btn-press bg-gradient-to-l from-pink-500 to-purple-600 shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-purple-300/50"
                                >
                                    ذخیره رمز عبور
                                </Button>
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    radius="xl"
                                    size="lg"
                                    onClick={() => form.reset()}
                                >
                                    انصراف
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </div>
            </div>
        </div>
    );
}
