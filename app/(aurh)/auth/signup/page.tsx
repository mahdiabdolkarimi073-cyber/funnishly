"use client"
import { registerUser } from "@/backend/actions/auth/signup.action";
import { TextInput, Button, Paper, Title, Stack, NumberInput, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface FormValues {
    name: string;
    last_name: string;
    phone: string;
    password: string
}

export default function RegistrationForm() {

    const form = useForm<FormValues>({
        initialValues: {
            name: "",
            last_name: "",
            phone: "",
            password: ""
        },
        validate: {
            name: (v) => (v.trim().length < 2 ? "نام باید حداقل ۲ کاراکتر باشد" : null),
            last_name: (v) => (v.trim().length < 2 ? "نام خانوادگی باید حداقل ۲ کاراکتر باشد" : null),
            password: (v) => (v.trim().length < 8 ? "رمز عبور باید حداقل ۸ کاراکتر باشد" : null),

        },
    });

    const handleSubmit = async (values: FormValues) => {
        console.log("Values :"  ,values);
        
        const res = await registerUser(values)
        
        if (!res.ok) {
            toast.error(res.message)
            return
        }

        return redirect("/dashboard")

    };

    return (
        <div className="w-full  min-h-screen flex justify-center items-center">
            <div className="h-[550px] flex rounded-lg overflow-hidden">

                <Paper withBorder shadow="md" p="xl" radius="md" w={360}>
                    <Title order={3} mb="lg" ta="center">
                        ثبت‌نام
                    </Title>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="نام"
                                placeholder="نام خود را وارد کنید"
                                {...form.getInputProps("name")}
                            />
                            <TextInput
                                label="نام خانوادگی"
                                placeholder="نام خانوادگی خود را وارد کنید"
                                {...form.getInputProps("last_name")}
                            />
                            <NumberInput
                                label="شماره موبایل"
                                placeholder="09xxxxxxxxx"
                                {...form.getInputProps("phone")}
                            />
                            <PasswordInput
                                label="رمز عبور"
                                placeholder="رمز عبور را وارد کنید"
                                {...form.getInputProps("password")}
                            />

                            <Button type="submit" fullWidth mt="sm">
                                ثبت‌نام
                            </Button>
                        </Stack>
                    </form>

                    <p className="mt-6 text-sm">حساب کاربری دارید ؟ <Link className="text-sky-600  " href={"/auth/login"}>وارد شوید</Link></p>

                </Paper>
                <div>
                    <img className="h-full" src="/images/auth/banner.png" alt="" />
                </div>
            </div>

        </div>

    );
}
