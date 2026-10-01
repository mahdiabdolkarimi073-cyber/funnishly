"use client"
import loginActions from "@/backend/actions/auth/login.action";
import {TextInput, Button, Paper, Title, Stack, PasswordInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "react-toastify";

interface FormValues {
    phone: string;
    password: string;
}

export default function LoginForm() {

    const router = useRouter();

    const searchParams = useSearchParams();


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
        const res = await loginActions(values);

        if (!res.ok) {
            toast.error(res.message);
            return;
        }

        router.push(searchParams.get("redirect") ?? "/dashboard");
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center p-4">
            <div className="w-full max-w-[820px] flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">

                <Paper withBorder shadow="md" p="xl" radius="md" className="w-full md:w-[360px] mx-auto">
                    <Title order={3} mb="lg" ta="center">
                        ورود
                    </Title>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="شماره موبایل"
                                placeholder="09xxxxxxxxx"
                                inputMode="tel"
                                dir="ltr"
                                {...form.getInputProps("phone")}
                            />
                            <PasswordInput
                                label="رمز عبور"
                                placeholder="رمز عبور را وارد کنید"
                                {...form.getInputProps("password")}
                            />

                            <Button type="submit" fullWidth mt="sm">
                                ورود
                            </Button>
                        </Stack>
                    </form>

                    <p className="mt-6 text-sm">حساب کاربری ندارید؟ <Link className="text-sky-600" href="/auth/signup">ثبت‌نام
                        کنید</Link></p>

                </Paper>
                <div className="hidden md:block md:w-[460px]">
                    <img className="h-full w-full object-cover" src="/images/auth/Fig_01.png" alt=""/>
                </div>
            </div>
        </div>
    );
}
