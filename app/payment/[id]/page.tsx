import prisma from "@/backend/module/Prisma";
import {Badge, Divider, Text, Title} from "@mantine/core";
import {redirect} from "next/navigation";
import {getUserFromCookie} from "@/backend/actions/user/getUser.action";
import PayButton from "@/app/payment/[id]/PayButton";
import {PackageDuration} from "@prisma/client";

const DURATION_MAP: Record<string, PackageDuration> = {
    "۱ ماهه": "MONTH1",
    "۳ ماهه": "MONTH3",
    "۶ ماهه": "MONTH6",
};

const DURATION_PRICES: Record<PackageDuration, "price1m" | "price3m" | "price6m"> = {
    MONTH1: "price1m",
    MONTH3: "price3m",
    MONTH6: "price6m",
};

export default async function ProformaPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ duration?: string }>;
}) {
    const user = await getUserFromCookie()
    const { id } = await params
    const { duration: durationLabel } = await searchParams

    const duration: PackageDuration = DURATION_MAP[durationLabel ?? ""] ?? "MONTH1";

    const pkg = await prisma.package.findUnique({
        where: { id }
    })

    if (!pkg) return redirect("/")

    const price = pkg[DURATION_PRICES[duration]];
    const tax = Math.round(price * 0.1);
    const total = price + tax;

    const durationLabels: Record<PackageDuration, string> = {
        MONTH1: "۱ ماهه",
        MONTH3: "۳ ماهه",
        MONTH6: "۶ ماهه",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex w-full items-center justify-center p-4 md:p-6" dir="rtl">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4">

                {/* Right Side — اطلاعات — ۳/۴ */}
                <div className="w-full lg:w-3/4 bg-white rounded-lg p-4">
                    <Title order={3} mb="xs">پیش‌فاکتور</Title>
                    <Text size="sm" c="dimmed" mb="lg">لطفاً اطلاعات زیر را پیش از پرداخت بررسی کنید</Text>

                    <Divider mb="lg" />

                    {/* User Info */}
                    <div className="mb-6">
                        <Text fw={600} size="sm" c="dimmed" mb="sm">اطلاعات خریدار</Text>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                <div>
                                    <Title order={5}>{pkg.title}</Title>
                                    <Text size="xs" c="dimmed">{pkg.description}</Text>
                                </div>
                                <Badge color="blue" variant="light" size="lg">
                                    {durationLabels[duration]}
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
                            <Text size="sm" c="dimmed">قیمت پکیج ({durationLabels[duration]})</Text>
                            <Text size="sm">{price.toLocaleString("fa-IR")} تومان</Text>
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
                <div className="w-full lg:w-[300px] p-4 bg-white rounded-lg flex flex-col justify-between">
                    <div>
                        <Title order={5} mb="xs">خلاصه پرداخت</Title>
                        <Divider mb="md" />

                        <div className="space-y-3">
                            <div>
                                <Text size="xs" c="dimmed">پکیج انتخابی</Text>
                                <Text fw={500} size="sm">{pkg.title}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">مدت</Text>
                                <Text fw={500} size="sm">{durationLabels[duration]}</Text>
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
                        <PayButton packageId={id} duration={duration} />

                        <Text size="xs" c="dimmed" ta="center" mt="sm">
                            پرداخت امن و رمزگذاری‌شده
                        </Text>
                    </div>
                </div>

            </div>
        </div>
    );
}
