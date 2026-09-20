import prisma from "@/backend/module/Prisma";
import {Badge, Button, Divider, Paper, Text, Title} from "@mantine/core";
import {redirect} from "next/navigation";
import {getUserFromCookie} from "@/backend/actions/user/getUser.action";
import packagePayment from "@/backend/actions/package/packagePayment.action";
import {toast} from "react-toastify";
import PayButton from "@/app/payment/[id]/PayButton";


interface User {
    name: string;
    last_name: string;
    phone: string;
}

interface Package {
    title: string;
    price: number;
    options: string[];
}


export default async function ProformaPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getUserFromCookie()
    const { id } = await params
    const pkg = await prisma.package.findUnique({
        where : {
            id
        }
    })

    if(!pkg) return redirect("/")

    const tax = Math.round(pkg.price * 0.1);
    const total = pkg.price + tax;


    return (
        <div className="min-h-screen bg-gray-100 flex w-full items-center justify-center p-6" dir="rtl">
            <div className="w-full flex  gap-4">

                {/* Right Side — اطلاعات — ۳/۴ */}
                <div className="w-3/4 bg-white rounded-lg p-4">
                    <Title order={3} mb="xs">پیش‌فاکتور</Title>
                    <Text size="sm" c="dimmed" mb="lg">لطفاً اطلاعات زیر را پیش از پرداخت بررسی کنید</Text>

                    <Divider mb="lg" />

                    {/* User Info */}
                    <div className="mb-6">
                        <Text fw={600} size="sm" c="dimmed" mb="sm">اطلاعات خریدار</Text>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <Text size="xs" c="dimmed" mb={2}>نام و نام خانوادگی</Text>
                                <Text fw={500}>{user?.name} {user?.last_name}</Text>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <Text size="xs" c="dimmed" mb={2}>شماره تماس</Text>
                                <Text fw={500} dir="ltr">0{user?.phone}</Text>
                            </div>
                        </div>
                    </div>

                    {/* Package Info */}
                    <div className="mb-6">
                        <Text fw={600} size="sm" c="dimmed" mb="sm">جزئیات پکیج</Text>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <Title order={5}>{pkg.title}</Title>
                                <Badge color="blue" variant="light" size="lg">
                                    {pkg.price.toLocaleString("fa-IR")} تومان
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {pkg.options.map((opt, i) => (
                                    <Badge key={i} variant="dot" color="blue" size="sm">{opt}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <Text size="sm" c="dimmed">قیمت پکیج</Text>
                            <Text size="sm">{pkg.price.toLocaleString("fa-IR")} تومان</Text>
                        </div>
                        <div className="flex justify-between">
                            <Text size="sm" c="dimmed">مالیات (۱۰٪)</Text>
                            <Text size="sm">{tax.toLocaleString("fa-IR")} تومان</Text>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                            <Text fw={700}>مبلغ قابل پرداخت</Text>
                            <Text fw={700} c="blue" size="xl">{total.toLocaleString("fa-IR")} تومان</Text>
                        </div>
                    </div>
                </div>

                {/* Left Side — پرداخت — ۱/۴ */}
                <div className="w-[300px] p-4 bg-white rounded-lg flex flex-col justify-between">
                    <div>
                        <Title order={5} mb="xs">خلاصه پرداخت</Title>
                        <Divider mb="md" />

                        <div className="space-y-3">
                            <div>
                                <Text size="xs" c="dimmed">پکیج انتخابی</Text>
                                <Text fw={500} size="sm">{pkg.title}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">مالیات</Text>
                                <Text fw={500} size="sm">{tax.toLocaleString("fa-IR")} تومان</Text>
                            </div>
                            <Divider />
                            <div>
                                <Text size="xs" c="dimmed">مبلغ نهایی</Text>
                                <Text fw={700} c="blue" size="lg">{total.toLocaleString("fa-IR")}</Text>
                                <Text size="xs" c="dimmed">تومان</Text>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <PayButton packageId={id} />


                        <Text size="xs" c="dimmed" ta="center" mt="sm">
                            پرداخت امن و رمزگذاری‌شده
                        </Text>
                    </div>
                </div>

            </div>
        </div>
    );
}
