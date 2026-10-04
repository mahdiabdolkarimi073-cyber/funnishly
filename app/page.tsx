import Logo from "@/components/logo/Logo";
import prisma from "@/backend/module/Prisma";
import { cookies } from "next/headers";
import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Image,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import Link from "next/link";
import {
    HiArrowLeft,
    HiCheck,
    HiSparkles,
    HiStar,
} from "react-icons/hi";
import {
    MdTimer,
    MdDonutLarge,
    MdGridOn,
    MdSortByAlpha,
    MdViewColumn,
    MdQuiz,
    MdSchool,
    MdDevices,
    MdSpeed,
    MdPersonOutline,
    MdEmojiEvents,
    MdLightbulb,
} from "react-icons/md";
import { FaChalkboardTeacher, FaPuzzlePiece } from "react-icons/fa";
import { GiDiceSixFacesFive, GiTrophy } from "react-icons/gi";
import { TbTarget } from "react-icons/tb";

const heroImage = "/images/home/ChatGPT_Image_Oct_3,_2026,_02_04_12_PM.png";

export default async function HomePage() {
    const token = (await cookies()).get("token")?.value;
    const user = await prisma.user.findUnique({ where: { token: token + "" } });
    const packages = await prisma.package.findMany();

    return (
        <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f5f7fe] text-[#1a2151]">
            {/* ===================== HERO ===================== */}
            <section id="home" className="relative isolate overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f0f7ff] to-[#fef3f8] pt-10 pb-24 sm:pt-14 sm:pb-32">
                {/* soft background blobs */}
                <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl" />
                <div className="pointer-events-none absolute left-[40%] top-[5%] h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl" />

                {/* dot pattern overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

                {/* ===== Floating game elements (decorative) ===== */}
                {/* Dice - top left */}
                <div className="pointer-events-none absolute left-[6%] top-[18%] hidden lg:block">
                    <div className="fn-float flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-blue-200/50 ring-1 ring-blue-100">
                        <GiDiceSixFacesFive size={32} className="text-blue-500" />
                    </div>
                </div>
                {/* Star - top right */}
                <div className="pointer-events-none absolute right-[5%] top-[12%] hidden lg:block">
                    <div className="fn-float-rev flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl shadow-amber-200/50 ring-1 ring-amber-100">
                        <HiStar size={26} className="text-amber-500" />
                    </div>
                </div>
                {/* Timer - mid left */}
                <div className="pointer-events-none absolute left-[14%] top-[48%] hidden lg:block">
                    <div className="fn-float-slow flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg shadow-blue-200/40 ring-1 ring-blue-50">
                        <MdTimer size={24} className="text-blue-500" />
                    </div>
                </div>
                {/* Puzzle - bottom left */}
                <div className="pointer-events-none absolute left-[10%] bottom-[16%] hidden lg:block">
                    <div className="fn-float flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl shadow-emerald-200/50 ring-1 ring-emerald-100">
                        <FaPuzzlePiece size={22} className="text-emerald-500" />
                    </div>
                </div>
                {/* Target - bottom right */}
                <div className="pointer-events-none absolute right-[8%] bottom-[14%] hidden lg:block">
                    <div className="fn-float flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-pink-200/50 ring-1 ring-pink-100">
                        <TbTarget size={30} className="text-pink-500" />
                    </div>
                </div>
                {/* Trophy - mid right */}
                <div className="pointer-events-none absolute right-[14%] top-[42%] hidden xl:block">
                    <div className="fn-float-rev flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg shadow-amber-200/40 ring-1 ring-amber-50">
                        <GiTrophy size={24} className="text-amber-500" />
                    </div>
                </div>
                {/* Sparkles - scattered */}
                <div className="pointer-events-none absolute left-[24%] top-[14%] hidden lg:block fn-float-slow">
                    <HiSparkles size={20} className="text-blue-400" />
                </div>
                <div className="pointer-events-none absolute right-[24%] bottom-[22%] hidden lg:block fn-float">
                    <HiSparkles size={16} className="text-pink-400" />
                </div>
                <div className="pointer-events-none absolute left-[30%] bottom-[10%] hidden lg:block fn-float-rev">
                    <HiSparkles size={18} className="text-emerald-400" />
                </div>

                <Container size="xl" className="relative">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
                        {/* Text content */}
                        <Stack gap="lg" className="fn-fade-up">
                            <Group gap="sm">
                                <Badge size="lg" radius="xl" className="border border-blue-200 bg-blue-100 px-5 py-1.5 text-blue-700">
                                    فانیشلی
                                </Badge>
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 fn-pulse-ring" />
                                <span className="text-sm font-medium text-slate-400">زمین بازی آموزشی</span>
                            </Group>

                            <Title order={1} className="text-4xl font-black leading-[1.25] tracking-tight text-[#1a2151] sm:text-5xl lg:text-[4rem]">
                                کلاس درس را به یک
                                <span className="relative mx-2 inline-block">
                                    <span className="relative z-10 bg-gradient-to-l from-blue-600 to-cyan-500 bg-clip-text text-transparent">بازی</span>
                                    <span className="absolute bottom-1 left-0 right-0 h-3.5 -skew-x-6 bg-amber-300/70 -z-0" />
                                </span>
                                تبدیل کن
                            </Title>

                            <Text size="xl" className="max-w-xl leading-9 text-slate-600">
                                فانیشلی هفت ابزار تعاملی برای معلمان و دانش‌آموزان فراهم می‌کند — تایمر، گردونه، تاس، کوییز، مربع کلمات و بیشتر. فقط انتخاب کن، روی پروژکتور اجرا کن و کلاس را زنده کن.
                            </Text>

                            <Group gap="sm" className="pt-2">
                                <Button
                                    component="a"
                                    href={user ? "/dash-teach" : "/auth/signup"}
                                    size="lg"
                                    radius="xl"
                                    rightSection={<HiArrowLeft size={18} />}
                                    className="fn-btn-press bg-gradient-to-l from-blue-600 to-blue-600 px-8 shadow-lg shadow-blue-400/50 hover:shadow-xl hover:shadow-blue-400/60"
                                >
                                    شروع استفاده از ابزارها
                                </Button>
                                <Button
                                    component="a"
                                    href="#tools"
                                    size="lg"
                                    radius="xl"
                                    variant="outline"
                                    className="fn-btn-press border-2 border-blue-300 px-8 font-bold text-blue-700 hover:bg-blue-50"
                                >
                                    مشاهده ابزارها
                                </Button>
                            </Group>

                            <Group gap="lg" className="pt-3">
                                {[
                                    { icon: HiCheck, text: "بدون دانش فنی" },
                                    { icon: MdSpeed, text: "یک کلیک تا شروع" },
                                    { icon: MdSchool, text: "حضوری و آنلاین" },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Group key={item.text} gap="xs" wrap="nowrap" className="text-sm font-medium text-slate-500">
                                            <Icon className="text-emerald-500" size={18} />
                                            <span>{item.text}</span>
                                        </Group>
                                    );
                                })}
                            </Group>
                        </Stack>

                        {/* Hero illustration with floating mini-cards */}
                        <div className="relative fn-fade-up fn-delay-2">
                            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-300/25 via-cyan-200/20 to-pink-200/25 blur-2xl" />
                            <Card radius={28} padding={6} className="relative overflow-hidden border border-white bg-white shadow-[0_24px_70px_rgba(59,130,246,.18)] transition-transform duration-500 hover:scale-[1.02]">
                                <Image
                                    src={heroImage}
                                    alt="فانیشلی — زمین بازی آموزشی کلاس"
                                    className="rounded-[1.6rem] object-cover"
                                />
                            </Card>

                            {/* floating mini UI cards around hero image */}
                            {/* Timer mini card */}
                            <div className="absolute -left-5 top-12 flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float-slow">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                                    <MdTimer size={20} />
                                </div>
                                <div className="text-center">
                                    <Text size="xs" className="text-slate-400 leading-none">۰۲:۴۵</Text>
                                    <Text size="9px" fw={700} className="text-blue-500 leading-none mt-0.5">تایمر</Text>
                                </div>
                            </div>

                            {/* Quiz mini card */}
                            <div className="absolute -right-4 top-24 flex items-center gap-2 rounded-2xl border border-pink-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                                    <MdQuiz size={20} />
                                </div>
                                <div>
                                    <Text size="xs" fw={700} className="text-pink-500 leading-none">کوییز</Text>
                                    <Text size="9px" className="text-slate-400 leading-none mt-0.5">۵ سؤال</Text>
                                </div>
                            </div>

                            {/* Dice mini card */}
                            <div className="absolute -left-4 -bottom-4 flex items-center gap-2 rounded-2xl border border-amber-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float-rev">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                                    <GiDiceSixFacesFive size={20} />
                                </div>
                                <div>
                                    <Text size="xs" fw={700} className="text-amber-500 leading-none">۶</Text>
                                    <Text size="9px" className="text-slate-400 leading-none mt-0.5">تاس</Text>
                                </div>
                            </div>

                            {/* Sparkle accent */}
                            <div className="absolute -right-2 -top-3 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-amber-200/60 fn-float">
                                <HiSparkles size={24} />
                            </div>
                        </div>
                    </div>
                </Container>

                {/* wave transition */}
                <svg className="absolute -bottom-1 block h-12 w-full text-[#f5f7fe]" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
                    <path fill="currentColor" d="M0 40c200 30 360-18 560-10 220 8 320 38 520 18 180-18 260-28 360-12v44H0z" />
                </svg>
            </section>

            {/* ===================== TOOLS BENTO ===================== */}
            <section id="tools" className="relative bg-gradient-to-b from-[#f5f7fe] to-white py-20 sm:py-28">
                {/* decorative shapes */}
                <div className="pointer-events-none absolute right-[5%] top-[10%] h-3 w-3 rounded-full bg-blue-300 fn-float-slow" />
                <div className="pointer-events-none absolute left-[8%] top-[30%] h-2 w-2 rounded-full bg-amber-300 fn-float" />
                <div className="pointer-events-none absolute right-[15%] bottom-[10%] h-4 w-4 rounded-full bg-emerald-200 fn-float-rev" />

                <Container size="xl">
                    <Stack gap="sm" className="mx-auto mb-14 max-w-2xl text-center">
                        <Badge size="lg" radius="xl" className="mx-auto bg-blue-100 px-5 py-1 text-blue-700">ابزارهای تعاملی کلاس</Badge>
                        <Title order={2} className="text-3xl font-black text-[#1a2151] sm:text-[2.6rem]">
                            هفت ابزار — یک کلاس شاد
                        </Title>
                        <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-l from-blue-500 to-cyan-400" />
                        <Text className="leading-8 text-slate-600">
                            هر ابزار برای یک فعالیت خاص طراحی شده — انتخاب کن، تنظیم کن و روی صفحه کلاس اجرا کن.
                        </Text>
                    </Stack>

                    {/* ===== Bento grid ===== */}
                    <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

                        {/* LARGE: Spinner Wheel */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(168,85,247,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(168,85,247,.18)] lg:col-span-2 lg:row-span-2 fn-fade-up fn-delay-1" style={{ minHeight: "100%" }}>
                            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-purple-50/80" />
                            <div className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-pink-50/60" />

                            {/* visual preview: spinner wheel */}
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <MdDonutLarge size={36} />
                                </div>
                                <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-500">تعاملی</span>
                            </div>

                            {/* mini spinner preview */}
                            <div className="relative my-2 flex items-center gap-4">
                                <div className="fn-spin-slow h-24 w-24 rounded-full border-[10px] border-purple-200 border-t-purple-500 border-r-pink-400 border-b-amber-300 border-l-emerald-400" style={{ minHeight: 96 }} />
                                <div className="flex-1">
                                    <Title order={3} className="font-black text-2xl text-[#1a2151]">گردونه</Title>
                                    <Text size="md" className="mt-1 leading-7 text-slate-500">گردونه تصادفی برای انتخاب دانش‌آموز یا سؤال — همه را درگیر کن</Text>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between">
                                <Text size="sm" className="text-purple-500">۸ بخش قابل تنظیم</Text>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition-all duration-300 group-hover:-translate-x-1"><HiArrowLeft size={16} /></span>
                            </div>
                        </div>

                        {/* SMALL: Timer */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(59,130,246,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(59,130,246,.16)] fn-fade-up fn-delay-2">
                            <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blue-50/80" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MdTimer size={28} />
                                </div>
                            </div>
                            {/* mini timer preview */}
                            <div className="relative flex items-center gap-3">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-500">
                                    <span className="text-xs font-bold text-blue-600">۰۲:۳۵</span>
                                </div>
                                <div>
                                    <Title order={5} className="font-black text-lg text-[#1a2151]">تایمر</Title>
                                    <Text size="sm" className="text-slate-500 line-clamp-1">مدیریت زمان فعالیت‌ها</Text>
                                </div>
                            </div>
                        </div>

                        {/* SMALL: Dice */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(245,158,11,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(245,158,11,.16)] fn-fade-up fn-delay-3">
                            <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-amber-50/80" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <GiDiceSixFacesFive size={28} />
                                </div>
                            </div>
                            {/* mini dice preview */}
                            <div className="relative flex items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl font-black text-amber-600 shadow-inner ring-2 ring-amber-200">۵</div>
                                <div>
                                    <Title order={5} className="font-black text-lg text-[#1a2151]">تاس</Title>
                                    <Text size="sm" className="text-slate-500 line-clamp-1">پرتاب تصادفی در کلاس</Text>
                                </div>
                            </div>
                        </div>

                        {/* WIDE: Word Square */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(16,185,129,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(16,185,129,.16)] lg:col-span-2 fn-fade-up fn-delay-2">
                            <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-emerald-50/80" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MdGridOn size={28} />
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-500">بازی کلمات</span>
                            </div>
                            {/* mini word grid preview */}
                            <div className="relative flex items-center gap-4">
                                <div className="grid grid-cols-3 gap-1">
                                    {["س", "ا", "ب", "ر", "ف", "ا", "ت", "ل", "ب"].map((letter, i) => (
                                        <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${i === 2 || i === 4 || i === 6 ? "bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200" : "bg-slate-50 text-slate-300"}`}>
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Title order={5} className="font-black text-lg text-[#1a2151]">مربع کلمات</Title>
                                    <Text size="sm" className="text-slate-500">پیدا کردن کلمات در شبکه حروف</Text>
                                </div>
                            </div>
                        </div>

                        {/* SMALL: Sentence Ordering */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(139,92,246,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(139,92,246,.16)] fn-fade-up fn-delay-3">
                            <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-violet-50/80" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MdSortByAlpha size={28} />
                                </div>
                            </div>
                            {/* mini sentence preview */}
                            <div className="relative flex flex-wrap gap-1">
                                {["رفت", "به", "مدرسه", "علی"].map((word, i) => (
                                    <span key={i} className={`rounded-lg px-2 py-1 text-[10px] font-bold ${i === 3 ? "bg-violet-100 text-violet-600" : i === 0 ? "bg-violet-100 text-violet-600" : "bg-slate-50 text-slate-400"}`}>{word}</span>
                                ))}
                            </div>
                            <Title order={5} className="font-black text-base text-[#1a2151]">مرتب‌سازی جملات</Title>
                            <Text size="xs" className="text-slate-500 line-clamp-1">چیدمان کلمات و ساخت جمله</Text>
                        </div>

                        {/* SMALL: Columns Matching */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(6,182,212,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(6,182,212,.16)] fn-fade-up fn-delay-4">
                            <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-cyan-50/80" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MdViewColumn size={28} />
                                </div>
                            </div>
                            {/* mini columns preview */}
                            <div className="relative flex items-center gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <span className="rounded-lg bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-600">کتاب</span>
                                    <span className="rounded-lg bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-600">مداد</span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-cyan-400">
                                    <span>←</span>
                                    <span>←</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-400">قرطاسیه</span>
                                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-400">نوشتنی</span>
                                </div>
                            </div>
                            <Title order={5} className="font-black text-base text-[#1a2151]">وصل کردن کلمات</Title>
                            <Text size="xs" className="text-slate-500 line-clamp-1">اتصال کلمات مرتبط در ستون‌ها</Text>
                        </div>

                        {/* WIDE: Quiz Builder */}
                        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_8px_30px_rgba(236,72,153,.1)] fn-card-hover hover:shadow-[0_16px_50px_rgba(236,72,153,.16)] lg:col-span-2 fn-fade-up fn-delay-4">
                            <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-pink-50/80" />
                            <div className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-purple-50/60" />
                            <div className="relative flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                    <MdQuiz size={28} />
                                </div>
                                <span className="rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold text-pink-500">سازنده</span>
                            </div>
                            {/* mini quiz preview */}
                            <div className="relative flex items-center gap-4">
                                <div className="flex-1 rounded-xl border-2 border-pink-100 bg-pink-50/50 p-3">
                                    <Text size="xs" fw={700} className="text-pink-600">؟ سؤال نمونه</Text>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] text-slate-400">گزینه ۱</div>
                                        <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">گزینه ۲ ✓</div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Title order={5} className="font-black text-lg text-[#1a2151]">کوییز ساز</Title>
                                    <Text size="sm" className="text-slate-500 mt-1">ساخت و اجرای کوییز تعاملی</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ===================== HOW IT WORKS ===================== */}
            <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-20 sm:py-28 overflow-hidden">
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />
                {/* decorative dots */}
                <div className="pointer-events-none absolute left-[12%] top-[20%] h-2 w-2 rounded-full bg-blue-300 fn-float-slow" />
                <div className="pointer-events-none absolute right-[18%] bottom-[25%] h-3 w-3 rounded-full bg-amber-300 fn-float" />

                <Container size="xl" className="relative">
                    <Stack gap="sm" className="mx-auto mb-14 max-w-2xl text-center">
                        <Badge size="lg" radius="xl" className="mx-auto bg-amber-100 px-5 py-1 text-amber-700">چطور کار می‌کند</Badge>
                        <Title order={2} className="text-3xl font-black text-[#1a2151] sm:text-4xl">
                            از انتخاب تا اجرا — فقط چهار قدم
                        </Title>
                        <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-l from-amber-400 to-orange-400" />
                        <Text className="leading-8 text-slate-600">پیچیده نیست. فقط چهار قدم ساده تا یک کلاس شاد</Text>
                    </Stack>

                    <div className="relative">
                        {/* connecting line */}
                        <div className="pointer-events-none absolute left-8 right-8 top-9 hidden h-1 rounded-full bg-gradient-to-l from-blue-200 via-amber-200 to-pink-200 lg:block" />
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                            {[
                                { icon: FaPuzzlePiece, title: "انتخاب ابزار", description: "ابزار مورد نظر را از بین هفت ابزار انتخاب کن", color: "#3b82f6", bg: "#eff6ff" },
                                { icon: MdLightbulb, title: "تنظیم فعالیت", description: "محتوای خود را آماده و بازی را تنظیم کن", color: "#f59e0b", bg: "#fffbeb" },
                                { icon: MdDevices, title: "نمایش روی کلاس", description: "ابزار را روی پروژکتور یا نمایشگر اجرا کن", color: "#10b981", bg: "#ecfdf5" },
                                { icon: HiSparkles, title: "مشارکت دانش‌آموزان", description: "دانش‌آموزان با اشتیاق در فعالیت شرکت می‌کنند", color: "#ec4899", bg: "#fdf2f8" },
                            ].map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.title} className="relative text-center fn-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="relative mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-3xl border-4 border-white shadow-lg" style={{ backgroundColor: step.bg, color: step.color, width: 72, height: 72 }}>
                                            <Icon size={32} />
                                            <span
                                                className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white shadow-md"
                                                style={{ backgroundColor: step.color }}
                                            >
                                                {["۱", "۲", "۳", "۴"][idx]}
                                            </span>
                                        </div>
                                        <Title order={4} className="font-black text-[#1a2151]">{step.title}</Title>
                                        <Text size="sm" className="mt-2 leading-7 text-slate-500">{step.description}</Text>
                                    </div>
                                );
                            })}
                        </SimpleGrid>
                    </div>
                </Container>
            </section>

            {/* ===================== FOR TEACHERS ===================== */}
            <section className="relative bg-gradient-to-b from-white to-[#f5f7fe] overflow-hidden py-20 sm:py-28">
                <div className="pointer-events-none absolute left-0 top-20 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
                <div className="pointer-events-none absolute right-10 bottom-10 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
                {/* decorative sparkles */}
                <div className="pointer-events-none absolute right-[20%] top-[15%] fn-float-slow"><HiSparkles size={18} className="text-emerald-400" /></div>
                <div className="pointer-events-none absolute left-[15%] bottom-[20%] fn-float"><HiStar size={16} className="text-blue-400" /></div>

                <Container size="xl" className="relative">
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
                        {/* illustration with floating UI cards */}
                        <div className="relative fn-fade-up">
                            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/25 to-blue-200/25 blur-2xl" />
                            <Card radius={28} padding={6} className="relative overflow-hidden border border-white bg-white shadow-[0_16px_50px_rgba(59,130,246,.12)]">
                                <Image
                                    src={heroImage}
                                    alt="معلمان و کلاس درس با فانیشلی"
                                    className="aspect-[4/3] rounded-[1.6rem] object-cover"
                                />
                            </Card>

                            {/* floating teacher icon badge */}
                            <div className="absolute -right-4 top-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 text-white shadow-xl shadow-emerald-200/60 fn-float">
                                <FaChalkboardTeacher size={28} />
                            </div>

                            {/* floating activity card */}
                            <div className="absolute -left-4 bottom-12 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float-slow">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                                    <MdEmojiEvents size={20} />
                                </div>
                                <div>
                                    <Text size="xs" fw={700} className="text-emerald-600 leading-none">فعالیت زنده</Text>
                                    <Text size="9px" className="text-slate-400 leading-none mt-0.5">۲۴ دانش‌آموز</Text>
                                </div>
                            </div>

                            {/* floating star badge */}
                            <div className="absolute right-8 -bottom-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white shadow-lg shadow-amber-200/60 fn-float-rev fn-wiggle">
                                <HiStar size={20} />
                            </div>
                        </div>

                        {/* text + features */}
                        <Stack gap="lg" className="fn-fade-up fn-delay-2">
                            <Badge size="lg" radius="xl" className="w-fit bg-emerald-100 px-5 py-1 text-emerald-700">
                                ویژه معلمان
                            </Badge>
                            <Title order={2} className="text-3xl font-black leading-[1.35] text-[#1a2151] sm:text-4xl">
                                کلاس‌هایی که دانش‌آموزان برایشان
                                <span className="bg-gradient-to-l from-emerald-600 to-blue-500 bg-clip-text text-transparent"> لحظه‌شماری </span>
                                می‌کنند
                            </Title>
                            <Text size="xl" className="leading-9 text-slate-600">
                                فانیشلی برای معلم‌ها طراحی شده — بدون پیچیدگی، بدون اتلاف وقت. فقط ابزار را انتخاب کن و کلاس را به یک تجربه شاد تبدیل کن.
                            </Text>

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="pt-2">
                                {[
                                    { icon: MdPersonOutline, title: "بدون ثبت‌نام", description: "بدون نیاز به حساب کاربری شروع کن", color: "#3b82f6" },
                                    { icon: MdSpeed, title: "سریع و ساده", description: "فقط یک کلیک تا شروع بازی", color: "#f59e0b" },
                                    { icon: MdSchool, title: "حضوری و آنلاین", description: "مناسب هر نوع کلاسی", color: "#10b981" },
                                    { icon: MdDevices, title: "پروژکتور و صفحه", description: "قابل استفاده روی هر نمایشگری", color: "#ec4899" },
                                ].map((feat) => {
                                    const Icon = feat.icon;
                                    return (
                                        <div
                                            key={feat.title}
                                            className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                            style={{ borderLeft: `3px solid ${feat.color}` }}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${feat.color}15`, color: feat.color }}>
                                                <Icon size={22} />
                                            </div>
                                            <div>
                                                <Text fw={800} className="text-[#1a2151]">{feat.title}</Text>
                                                <Text size="sm" className="mt-1 leading-6 text-slate-500">{feat.description}</Text>
                                            </div>
                                        </div>
                                    );
                                })}
                            </SimpleGrid>

                            <Button
                                component="a"
                                href={user ? "/dash-teach" : "/auth/signup"}
                                size="lg"
                                radius="xl"
                                rightSection={<HiArrowLeft size={18} />}
                                className="fn-btn-press w-fit bg-gradient-to-l from-emerald-500 to-blue-500 px-7 shadow-lg shadow-emerald-200/50"
                            >
                                شروع تدریس با فانیشلی
                            </Button>
                        </Stack>
                    </div>
                </Container>
            </section>

            {/* ===================== QUIZ BUILDER PREVIEW ===================== */}
            <section className="relative bg-gradient-to-br from-pink-50 via-white to-blue-50 py-20 sm:py-28 overflow-hidden">
                <div className="pointer-events-none absolute left-10 bottom-0 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />
                <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl" />
                {/* decorative elements */}
                <div className="pointer-events-none absolute left-[15%] top-[20%] fn-float-slow"><HiSparkles size={18} className="text-pink-400" /></div>
                <div className="pointer-events-none absolute right-[12%] bottom-[20%] fn-float"><FaPuzzlePiece size={20} className="text-purple-400" /></div>

                <Container size="xl" className="relative">
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
                        {/* text */}
                        <Stack gap="lg" className="fn-fade-up">
                            <Badge size="lg" radius="xl" className="w-fit bg-pink-100 px-5 py-1 text-pink-700">
                                کوییز ساز
                            </Badge>
                            <Title order={2} className="text-3xl font-black leading-[1.35] text-[#1a2151] sm:text-4xl">
                                کوییز بساز،
                                <span className="bg-gradient-to-l from-pink-500 to-purple-500 bg-clip-text text-transparent"> در کلاس اجرا کن</span>
                            </Title>
                            <Text size="xl" className="leading-9 text-slate-600">
                                با کوییز ساز فانیشلی، سؤالات خود را بساز و در لحظه در کلاس اجرا کن. دانش‌آموزان با اشتیاق پاسخ می‌دهند و نتیجه را زنده می‌بینی.
                            </Text>
                            <Group gap="sm">
                                {["ساخت سریع سؤال", "اجرای زنده", "نتیجه‌گیری فوری"].map((item) => (
                                    <Group key={item} gap="xs" wrap="nowrap">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                                            <HiCheck size={14} />
                                        </span>
                                        <Text size="sm" className="text-slate-600">{item}</Text>
                                    </Group>
                                ))}
                            </Group>
                            <Button
                                component="a"
                                href={user ? "/dash-teach/quiz" : "/auth/signup"}
                                size="lg"
                                radius="xl"
                                rightSection={<MdQuiz size={20} />}
                                className="fn-btn-press w-fit bg-gradient-to-l from-pink-500 to-purple-500 px-7 shadow-lg shadow-pink-200/50"
                            >
                                ساخت کوییز
                            </Button>
                        </Stack>

                        {/* quiz preview mockup */}
                        <div className="relative fn-fade-up fn-delay-2">
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-pink-200/25 to-purple-200/25 blur-2xl" />
                            <Card radius={24} padding="xl" className="relative overflow-hidden border border-white bg-white shadow-[0_16px_50px_rgba(236,72,153,.12)]">
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Badge radius="xl" className="bg-pink-50 text-pink-600">کوییز نمونه</Badge>
                                        <Text size="sm" className="text-slate-300">سؤال ۱ از ۵</Text>
                                    </Group>
                                    <Title order={4} className="font-black text-[#1a2151]">
                                        پایتخت ایران کدام شهر است؟
                                    </Title>
                                    <Stack gap="xs">
                                        {[
                                            { label: "تهران", correct: true },
                                            { label: "اصفهان", correct: false },
                                            { label: "شیراز", correct: false },
                                            { label: "تبریز", correct: false },
                                        ].map((opt) => (
                                            <div
                                                key={opt.label}
                                                className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 transition-all duration-300 ${
                                                    opt.correct
                                                        ? "border-emerald-300 bg-emerald-50"
                                                        : "border-slate-100 bg-slate-50"
                                                }`}
                                            >
                                                <Text size="sm" fw={600} className={opt.correct ? "text-emerald-700" : "text-slate-500"}>
                                                    {opt.label}
                                                </Text>
                                                {opt.correct && (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-white fn-bounce-soft">
                                                        <HiCheck size={14} />
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </Stack>
                                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full w-1/5 rounded-full bg-gradient-to-l from-pink-500 to-purple-500" />
                                        </div>
                                        <Text size="xs" className="text-slate-400">۲۰٪</Text>
                                    </div>
                                </Stack>
                            </Card>
                            {/* floating badge */}
                            <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-xl shadow-pink-200/60 fn-float fn-wiggle">
                                <MdQuiz size={24} />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ===================== PACKAGES / VALUE ===================== */}
            <section id="packages" className="relative bg-[#f0f4ff] py-20 sm:py-28 overflow-hidden">
                <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

                <Container size="xl" className="relative">
                    <Stack gap="sm" className="mx-auto mb-14 max-w-2xl text-center">
                        <Badge size="lg" radius="xl" className="mx-auto bg-blue-100 px-5 py-1 text-blue-700">پکیج‌ها</Badge>
                        <Title order={2} className="text-3xl font-black text-[#1a2151] sm:text-4xl">پکیج مناسب خود را انتخاب کنید</Title>
                        <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-l from-blue-500 to-cyan-400" />
                        <Text className="leading-8 text-slate-600">ابزارهای لازم برای ایجاد پویایی و خلاقیت در هر کلاس درسی</Text>
                    </Stack>

                    {packages.length > 0 ? (
                        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                            {packages.map((item, index) => {
                                const durations = [
                                    { label: "۱ ماهه", price: item.price1m },
                                    { label: "۳ ماهه", price: item.price3m },
                                    { label: "۶ ماهه", price: item.price6m },
                                ];
                                return (
                                    <Card key={item.id} radius={24} padding={8} className="group border-0 bg-gradient-to-br from-blue-500 via-[#4f46e5] to-cyan-500 shadow-[0_16px_40px_rgba(59,130,246,.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(59,130,246,.28)]">
                                        <div className="h-full rounded-[1.4rem] bg-white p-6 sm:p-8">
                                            <Group justify="space-between" align="start">
                                                <div>
                                                    <Badge radius="xl" className={index === 0 ? "bg-blue-50 text-blue-600" : "bg-cyan-50 text-cyan-600"}>{item.title}</Badge>
                                                    <Text className="mt-3 leading-8 text-slate-500">{item.description}</Text>
                                                </div>
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 transition-transform duration-300 group-hover:rotate-12">
                                                    <HiSparkles size={28} />
                                                </div>
                                            </Group>
                                            <Stack gap="xs" className="my-6">
                                                {item.options.map((benefit) => (
                                                    <Group key={benefit} gap="xs" wrap="nowrap">
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                            <HiCheck size={15} />
                                                        </span>
                                                        <Text size="sm" className="text-slate-500">{benefit}</Text>
                                                    </Group>
                                                ))}
                                            </Stack>
                                            <Divider color="#e7eaf7" />
                                            <SimpleGrid cols={3} spacing="sm" className="mt-6">
                                                {durations.map((duration) => (
                                                    <Button
                                                        key={duration.label}
                                                        component="a"
                                                        href={user ? `/payment/${item.id}?duration=${duration.label}` : `/auth/login?redirect=/payment/${item.id}`}
                                                        variant="light"
                                                        radius="lg"
                                                        className="h-auto bg-blue-50 px-2 py-3 text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-100"
                                                    >
                                                        <Stack gap={2} align="center">
                                                            <Text size="xs" c="dimmed">{duration.label}</Text>
                                                            <Text fw={900}>{duration.price.toLocaleString("fa")}</Text>
                                                            <Text size="xs" c="dimmed">تومان</Text>
                                                        </Stack>
                                                    </Button>
                                                ))}
                                            </SimpleGrid>
                                        </div>
                                    </Card>
                                );
                            })}
                        </SimpleGrid>
                    ) : (
                        /* Fallback value section when no packages exist */
                        <div className="grid gap-5 sm:grid-cols-3">
                            {[
                                { icon: FaPuzzlePiece, title: "هفت ابزار تعاملی", description: "تایمر، گردونه، تاس، مربع کلمات، مرتب‌سازی جملات، وصل کردن کلمات و کوییز ساز", color: "#3b82f6", bg: "#eff6ff" },
                                { icon: MdSpeed, title: "شروع فوری", description: "بدون نصب، بدون ثبت‌نام طولانی — فقط یک کلیک و کلاس شروع می‌شود", color: "#f59e0b", bg: "#fffbeb" },
                                { icon: MdEmojiEvents, title: "مشارکت بیشتر", description: "دانش‌آموزان به‌جای تماشا، فعال و درگیر می‌شوند و یادگیری ماندگارتر می‌شود", color: "#10b981", bg: "#ecfdf5" },
                            ].map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div key={card.title} className="group relative overflow-hidden rounded-[24px] border border-white bg-white p-7 shadow-[0_8px_30px_rgba(59,130,246,.08)] fn-card-hover hover:shadow-[0_16px_50px_rgba(59,130,246,.14)]">
                                        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full opacity-60" style={{ backgroundColor: card.bg }} />
                                        <div className="relative">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: card.bg, color: card.color }}>
                                                <Icon size={32} />
                                            </div>
                                            <Title order={4} className="mt-5 font-black text-xl text-[#1a2151]">{card.title}</Title>
                                            <Text className="mt-2 leading-8 text-slate-500">{card.description}</Text>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Container>
            </section>

            {/* ===================== FOOTER ===================== */}
            <footer className="relative overflow-hidden border-t border-blue-100 bg-white">
                <div className="pointer-events-none absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-blue-100/40 blur-3xl" />
                <div className="pointer-events-none absolute -top-10 right-20 h-40 w-40 rounded-full bg-pink-50/30 blur-3xl" />

                <Container size="xl" className="relative py-14">
                    <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                        <div>
                            <Logo />
                            <Text className="mt-4 max-w-md leading-8 text-slate-500">
                                فانیشلی با هدف توانمند کردن معلمان و مدرس‌ها طراحی شده است؛ دستیار شما برای خلق کلاس‌هایی الهام‌بخش و ماندگار.
                            </Text>
                        </div>
                        <div>
                            <Text fw={900} className="text-[#1a2151]">دسترسی سریع</Text>
                            <Stack gap="xs" className="mt-4 text-sm text-slate-400">
                                <Link className="transition hover:text-blue-600" href="#home">خانه</Link>
                                <Link className="transition hover:text-blue-600" href="#tools">ابزارها</Link>
                                <Link className="transition hover:text-blue-600" href="#packages">پکیج‌ها</Link>
                            </Stack>
                        </div>
                        <div>
                            <Text fw={900} className="text-[#1a2151]">فانیشلی</Text>
                            <Text size="sm" className="mt-4 leading-8 text-slate-400">
                                زمین بازی آموزشی برای کلاس درس.
                            </Text>
                            <a
                                referrerPolicy="origin"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://trustseal.enamad.ir/?id=744719&Code=0AERkCoNRE5TDdc7bZr8CxUp5rg82SrJ"
                                className="mt-4 inline-flex flex-col items-center gap-1 text-sm text-slate-400"
                            >
                                <Image src="/images/enamad/enamad.png" alt="نماد اعتماد الکترونیکی" width={50} height={50} className="!h-9 !w-9" />
                            </a>
                        </div>
                    </div>
                    <Divider color="#e0e6ff" className="my-8" />
                    <Text ta="center" size="sm" className="text-slate-300">
                        تمامی حقوق محفوظ است - شرکت برنامه نویسی <a target="_blank" href="https://novinbin.com/" className="text-blue-600">نوین بین</a> © {new Date().toLocaleDateString("fa").slice(0, 4)}
                    </Text>
                </Container>
            </footer>
        </main>
    );
}
