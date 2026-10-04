"use client"
import loginActions from "@/backend/actions/auth/login.action";
import { TextInput, Button, Stack, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaMobileAlt } from "react-icons/fa";
import { GiDiceSixFacesFive } from "react-icons/gi";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthIllustration, { AuthIllustrationMobile } from "@/components/auth/AuthIllustration";

interface FormValues {
    phone: string;
    password: string;
}

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        initialValues: {
            phone: "",
            password: "",
        },
        validate: {
            phone: (v) => (/^0\d{10}$/.test(v.trim()) ? null : "شماره موبایل باید ۱۱ رقم و با ۰ شروع شود"),
            password: (v) => (v.trim().length < 8 ? "رمز عبور باید حداقل ۸ کاراکتر باشد" : null),
        },
    });

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const res = await loginActions(values);
            if (!res.ok) {
                toast.error(res.message);
                return;
            }
            router.push(searchParams.get("redirect") ?? "/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f0f7ff] to-[#fef3f8] p-4 sm:p-6">
            <AuthBackground />

            <div className="relative z-10 flex w-full max-w-5xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
                {/* Illustration section */}
                <AuthIllustration variant="login" />

                {/* Mobile mascot */}
                <AuthIllustrationMobile variant="login" />

                {/* Login card */}
                <div className="w-full lg:flex-1 lg:max-w-md fn-fade-up fn-delay-2">
                    <div className="mx-auto w-full max-w-md rounded-3xl border border-blue-50/80 bg-white/95 p-6 shadow-[0_16px_50px_rgba(59,130,246,.12)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_60px_rgba(59,130,246,.16)] sm:p-8">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-200/50 fn-float-slow">
                                <GiDiceSixFacesFive size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-[#1a2151]">
                                خوش آمدی! 👋
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                برای ادامه وارد حساب کاربری خود شو.
                            </p>
                        </div>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    label="شماره موبایل"
                                    placeholder="09123456789"
                                    inputMode="tel"
                                    dir="ltr"
                                    leftSection={<FaMobileAlt size={16} className="text-slate-400" />}
                                    leftSectionPointerEvents="none"
                                    radius="xl"
                                    size="md"
                                    styles={{
                                        input: { paddingTop: 10, paddingBottom: 10 },
                                    }}
                                    error={form.errors.phone as string}
                                    {...form.getInputProps("phone")}
                                />
                                <PasswordInput
                                    label="رمز عبور"
                                    placeholder="رمز عبور را وارد کنید"
                                    radius="xl"
                                    size="md"
                                    styles={{
                                        input: { paddingTop: 10, paddingBottom: 10 },
                                    }}
                                    visibleIcon={<HiEye size={18} />}
                                    hiddenIcon={<HiEyeOff size={18} />}
                                    error={form.errors.password as string}
                                    {...form.getInputProps("password")}
                                />

                                {/* Forgot password link - preserved */}
                                <div className="text-left">
                                    <Link href="#" className="text-sm text-slate-400 transition hover:text-blue-600">
                                        رمز عبورت را فراموش کردی؟
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    radius="xl"
                                    loading={loading}
                                    loaderProps={{ size: 18 }}
                                    rightSection={!loading ? <HiArrowLeft size={18} /> : undefined}
                                    className="fn-btn-press bg-gradient-to-l from-blue-600 to-blue-600 shadow-lg shadow-blue-400/40 hover:shadow-xl hover:shadow-blue-400/50"
                                >
                                    {loading ? "در حال ورود..." : "ورود به حساب"}
                                </Button>
                            </Stack>
                        </form>

                        {/* Register link */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            حساب کاربری نداری؟{" "}
                            <Link
                                className="font-bold text-blue-600 transition hover:text-blue-700"
                                href="/auth/signup"
                            >
                                ثبت‌نام کن
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
