"use client"
import { registerUser } from "@/backend/actions/auth/signup.action";
import { TextInput, Button, Stack, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaMobileAlt, FaUser, FaUserTag } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthIllustration, { AuthIllustrationMobile } from "@/components/auth/AuthIllustration";

interface FormValues {
    name: string;
    last_name: string;
    phone: string;
    password: string;
}

export default function RegistrationForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        initialValues: {
            name: "",
            last_name: "",
            phone: "",
            password: "",
        },
        validate: {
            name: (v) => (v.trim().length < 2 ? "نام باید حداقل ۲ کاراکتر باشد" : null),
            last_name: (v) => (v.trim().length < 2 ? "نام خانوادگی باید حداقل ۲ کاراکتر باشد" : null),
            phone: (v) => (/^0\d{10}$/.test(v.trim()) ? null : "شماره موبایل باید ۱۱ رقم و با ۰ شروع شود"),
            password: (v) => (v.trim().length < 8 ? "رمز عبور باید حداقل ۸ کاراکتر باشد" : null),
        },
    });

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const res = await registerUser(values);
            if (!res.ok) {
                toast.error(res.message);
                return;
            }
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f0f7ff] to-[#fef3f8] p-4 sm:p-6">
            <AuthBackground />

            <div className="relative z-10 flex w-full max-w-5xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
                {/* Illustration section */}
                <AuthIllustration variant="register" />

                {/* Mobile mascot */}
                <AuthIllustrationMobile variant="register" />

                {/* Register card */}
                <div className="w-full lg:flex-1 lg:max-w-md fn-fade-up fn-delay-2">
                    <div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-50/80 bg-white/95 p-6 shadow-[0_16px_50px_rgba(16,185,129,.12)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_20px_60px_rgba(16,185,129,.16)] sm:p-8">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-200/50 fn-float">
                                <HiSparkles size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-[#1a2151]">
                                حساب خودت را بساز 🚀
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                به فانیشلی بپیوند و ابزارهای تعاملی کلاس را شروع کن.
                            </p>
                        </div>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    label="نام"
                                    placeholder="نام خود را وارد کنید"
                                    rightSection={<FaUser size={14} className="text-slate-400" />}
                                    rightSectionPointerEvents="none"
                                    radius="xl"
                                    size="md"
                                    styles={{
                                        input: { paddingTop: 10, paddingBottom: 10 },
                                    }}
                                    error={form.errors.name as string}
                                    {...form.getInputProps("name")}
                                />
                                <TextInput
                                    label="نام خانوادگی"
                                    placeholder="نام خانوادگی خود را وارد کنید"
                                    rightSection={<FaUserTag size={14} className="text-slate-400" />}
                                    rightSectionPointerEvents="none"
                                    radius="xl"
                                    size="md"
                                    styles={{
                                        input: { paddingTop: 10, paddingBottom: 10 },
                                    }}
                                    error={form.errors.last_name as string}
                                    {...form.getInputProps("last_name")}
                                />
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    radius="xl"
                                    loading={loading}
                                    loaderProps={{ size: 18 }}
                                    rightSection={!loading ? <HiArrowLeft size={18} /> : undefined}
                                    className="fn-btn-press bg-gradient-to-l from-emerald-500 to-blue-500 shadow-lg shadow-emerald-200/40 hover:shadow-xl hover:shadow-emerald-200/50"
                                >
                                    {loading ? "در حال ساخت حساب..." : "ساخت حساب"}
                                </Button>
                            </Stack>
                        </form>

                        {/* Login link */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            قبلاً حساب داری؟{" "}
                            <Link
                                className="font-bold text-blue-600 transition hover:text-blue-700"
                                href="/auth/login"
                            >
                                ورود
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
