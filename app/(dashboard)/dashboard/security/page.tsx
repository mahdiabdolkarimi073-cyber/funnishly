'use client';

import {
    Container,
    Title,
    Text,
    Paper,
    PasswordInput,
    Button,
    Stack,
    Group,
    Alert,
    Divider,
    Box
} from '@mantine/core';

import {useForm} from '@mantine/form';
import {BiLock} from "react-icons/bi";
import {GrAlert} from "react-icons/gr";
import {changePassword} from "@/backend/actions/user/updateUser.action";
import {toast} from "react-toastify";
import {useState} from "react";

export default function ChangePasswordPage() {
    // استفاده از Mantine Form برای مدیریت وضعیت و ولیدیشن

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
        <div className={"w-full"}>


            <Paper withBorder shadow="md" p={40} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">

                        <PasswordInput
                            label="رمز عبور فعلی"
                            placeholder="••••••••"
                            required
                            {...form.getInputProps('currentPassword')}
                        />

                        <Divider my="xs" label="تغییر رمز" labelPosition="center"/>

                        <PasswordInput
                            label="رمز عبور جدید"
                            placeholder="رمز جدید را وارد کنید"
                            required
                            {...form.getInputProps('newPassword')}
                        />

                        <PasswordInput
                            label="تکرار رمز عبور جدید"
                            placeholder="تکرار رمز جدید"
                            required
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button variant="subtle" color="gray">انصراف</Button>
                            <Button type="submit" loading={loading} leftSection={<BiLock size={16}/>}>
                                ذخیره رمز عبور
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>

        </div>
    );
}
