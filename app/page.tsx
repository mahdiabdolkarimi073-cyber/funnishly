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
    HiClock,
    HiLightBulb,
    HiSparkles,
    HiStar,
    HiTemplate,
} from "react-icons/hi";

const heroImage = "/images/home/ChatGPT_Image_Oct_3,_2026,_02_04_12_PM.png";

const benefits = [
    { icon: HiStar, title: "مناسب همه مقاطع", description: "از ابتدایی تا متوسطه و آموزشگاهی", color: "#fbbf24", glow: "rgba(251,191,36,.22)" },
    { icon: HiCheck, title: "محتوای استاندارد و معتبر", description: "تولید شده توسط متخصصان آموزش و زبان‌شناسی کودک", color: "#34d399", glow: "rgba(52,211,153,.22)" },
    { icon: HiLightBulb, title: "پیشرفت قابل مشاهده", description: "پیگیری عملکرد و رشد هر آموزش‌پذیر به صورت دقیق", color: "#d946ef", glow: "rgba(217,70,239,.22)" },
    { icon: HiSparkles, title: "یادگیری سرگرم‌کننده", description: "ترکیب آموزش با بازی و داستان برای ماندگاری بیشتر مطالب", color: "#38bdf8", glow: "rgba(56,189,248,.22)" },
];

const featureCards = [
    { tag: "قابلیت ها", title: "قابلیت های فانیشلی!", description: "تایمر، تاس، گردونه، مرتب کردن جملات، بازی مربع کلمات، وصل کردن کلمات مرتبط و کوییز", icon: HiStar, gradient: "from-[#ffedd5] via-[#fff7ed] to-[#fce7f3]", iconColor: "#f97316" },
    { tag: "حافظه", title: "ذخیره سازی اطلاعات", description: "آماده و ذخیره کردن محتوای اختصاصی شما قبل از کلاس", icon: HiTemplate, gradient: "from-[#dbeafe] via-[#eff6ff] to-[#e0e7ff]", iconColor: "#2563eb" },
    { tag: "ساده", title: "سادگی در اجرا", description: "بدون نیاز به دانش فنی، هوشمندسازی کلاس تنها با یک کلیک", icon: HiClock, gradient: "from-[#ccfbf1] via-[#ecfdf5] to-[#d1fae5]", iconColor: "#059669" },
];

const aboutFeatures = [
    [HiLightBulb, "دستیار هوشمند", "کمک به طراحی و آماده‌سازی سریع‌تر کلاس‌ها"],
    [HiSparkles, "کلاس‌های جذاب", "خلق تجربه‌ای که دانش‌آموزان مشتاق حضور در آن باشند"],
    [HiStar, "تمرکز بر یادگیری", "صرف زمان کمتر برای آماده‌سازی و زمان بیشتر برای آموزش"],
] as const;

export default async function HomePage() {
    const token = (await cookies()).get("token")?.value;
    const user = await prisma.user.findUnique({ where: { token: token + "" } });
    const packages = await prisma.package.findMany();

    return (
        <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f8f9ff] text-[#101947]">
            <section id="home" className="relative isolate overflow-hidden bg-[#0b1240]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,.28),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(217,70,239,.3),transparent_32%),linear-gradient(135deg,#111653_0%,#17247d_48%,#30115e_100%)]" />
                <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#22d3ee]/20 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#f0abfc]/20 blur-3xl" />
                <div className="absolute right-[42%] top-20 hidden h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_28px_8px_rgba(34,211,238,.55)] lg:block" />
                <Container size="xl" className="relative">
                    <div className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[.95fr_1.05fr] lg:gap-16 lg:py-24">
                        <Stack gap="xl" className="order-1 lg:order-2">
                            <Group gap="sm">
                                <Badge size="lg" radius="xl" className="border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-cyan-200">فانیشلی</Badge>
                                <span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_16px_5px_rgba(232,121,249,.5)]" />
                            </Group>
                            <Title order={1} className="max-w-3xl text-4xl font-black leading-[1.32] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]">
                                فانیشلی؛ هوشمندسازی کلاس
                                <span className="mt-2 block bg-gradient-to-l from-cyan-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">خلقِ تجربه‌ای ماندگار برای دانش‌آموزان امروز</span>
                            </Title>
                            <Text size="lg" className="max-w-2xl leading-9 text-indigo-100/80">با فانیشلی، فاصله بین متد‌های آموزشی سنتی و انتظارات نسل امروز را به سادگی از میان بردارید. از تایمر و گردونه گرفته تا کوییز و تاس، به سادگی همه ابزارهای لازم برای درگیر کردن دانش‌آموزان نسل امروز را در اختیار خواهید داشت.</Text>
                            <Group gap="sm" className="pt-1">
                                <Button component="a" href="/auth/signup" size="lg" radius="xl" rightSection={<HiArrowLeft size={18} />} className="bg-gradient-to-l from-[#ec4899] to-[#7c3aed] px-7 shadow-xl shadow-fuchsia-900/30 transition-all duration-300 hover:scale-105 hover:brightness-110">ثبت نام</Button>
                                <Button component="a" href="/auth/login" size="lg" radius="xl" variant="outline" className="border-cyan-300/70 px-8 text-cyan-100 transition-all duration-300 hover:scale-105 hover:bg-white/10">ورود</Button>
                            </Group>
                            <Group gap="xs" className="pt-1 text-sm text-indigo-200/70"><HiCheck className="text-emerald-300" /><span>کلاس‌های جذاب، خلاقانه و ماندگار</span></Group>
                        </Stack>

                        <div className="relative order-2 lg:order-1">
                            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/20 to-indigo-500/30 blur-2xl" />
                            <Card radius={34} padding={8} className="relative rotate-1 overflow-hidden border border-white/20 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-sm transition-transform duration-500 hover:rotate-0">
                                <Image src={heroImage} alt="فانیشلی؛ هوشمندسازی کلاس" className="rounded-[1.8rem] object-cover" />
                            </Card>
                            <div className="absolute -bottom-6 -right-5 rounded-2xl border border-white/20 bg-[#171d5b]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:-right-8"><Text size="xs" className="text-cyan-200">یادگیری</Text><Text fw={900} className="text-white">بدون مرز</Text></div>
                            <div className="absolute -left-4 top-8 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-white shadow-lg shadow-cyan-500/30 sm:-left-7"><HiSparkles size={28} /></div>
                        </div>
                    </div>
                </Container>
                <svg className="relative -mb-1 block h-16 w-full text-[#f8f9ff]" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 64c180 44 310-38 520-7 200 30 314 43 497 4 196-42 284-26 423 8v31H0z" /></svg>
            </section>

            <Container size="xl" className="relative z-10 -mt-2 sm:-mt-5">
                <Card radius={30} padding={0} className="overflow-hidden border border-[#e0e6ff] bg-white shadow-[0_24px_70px_rgba(48,61,145,.14)]">
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={0}>
                        {benefits.map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`group relative flex items-center gap-4 p-5 sm:p-7 ${index < benefits.length - 1 ? "lg:border-l lg:border-[#e9ecfa]" : ""}`}><div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 75% 50%,${item.glow},transparent 55%)` }} /><div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}18`, color: item.color }}><Icon size={28} /></div><div className="relative"><Text fw={900} className="text-[#101947]">{item.title}</Text><Text size="sm" className="mt-1 leading-7 text-[#7380a8]">{item.description}</Text></div></div>; })}
                    </SimpleGrid>
                </Card>
            </Container>

            <section id="about" className="relative py-24 sm:py-32">
                <div className="pointer-events-none absolute left-0 top-36 h-96 w-96 rounded-full bg-fuchsia-100/60 blur-3xl" />
                <Container size="xl" className="relative">
                    <Stack gap="sm" className="mx-auto mb-14 max-w-2xl text-center"><Badge size="lg" radius="xl" className="mx-auto bg-[#ede9fe] px-4 text-[#6d28d9]">معرفی</Badge><Title order={2} className="text-3xl font-black text-[#101947] sm:text-5xl">دسته‌بندی دوره‌ها و محصولات</Title><div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-l from-cyan-400 to-fuchsia-500" /><Text className="leading-8 text-[#68769f]">فانیشلی مجموعه‌ای کامل از دوره‌ها و محتوای آموزش را برای تمام مقاطع تحصیلی فراهم کرده است. با توجه به نیاز آموزشی خود، بهترین دوره را انتخاب کنید.</Text></Stack>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                        {featureCards.map((item) => { const Icon = item.icon; return <Card key={item.title} radius={28} padding="xl" className={`group relative overflow-hidden border border-white bg-gradient-to-br ${item.gradient} shadow-[0_15px_45px_rgba(54,65,140,.1)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_24px_55px_rgba(54,65,140,.2)]`}><div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/50 transition-transform duration-500 group-hover:scale-150" /><Stack align="center" gap="sm" className="relative text-center"><div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ color: item.iconColor }}><Icon size={38} /></div><Badge size="sm" radius="xl" className="bg-white/80" style={{ color: item.iconColor }}>{item.tag}</Badge><Title order={3} className="text-xl font-black text-[#101947]">{item.title}</Title><Text className="leading-8 text-[#68769f]">{item.description}</Text><span className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4f46e5] shadow-sm transition-all duration-300 group-hover:-translate-x-2"><HiArrowLeft /></span></Stack></Card>; })}
                    </SimpleGrid>
                </Container>
            </section>

            <section id="about-us" className="relative overflow-hidden bg-[#111748] py-24 text-white sm:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(99,102,241,.35),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(217,70,239,.2),transparent_32%)]" />
                <div className="absolute left-0 top-0 h-full w-full opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
                <Container size="xl" className="relative">
                    <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
                        <div className="relative"><div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 blur-2xl" /><Card radius={32} padding={8} className="relative overflow-hidden border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm"><Image src={heroImage} alt="کلاس خلاق فانیشلی" className="aspect-[4/3] rounded-[1.7rem] object-cover" /></Card></div>
                        <Stack gap="md"><Badge size="lg" radius="xl" className="w-fit border border-cyan-300/30 bg-cyan-300/10 px-4 text-cyan-200">معرفی فانیشلی</Badge><Title order={2} className="text-3xl font-black leading-[1.5] text-white sm:text-5xl">فانیشلی؛ دستیار هوشمند معلمان برای خلق کلاس‌هایی الهام‌بخش</Title><Text size="lg" className="leading-9 text-indigo-100/75">فانیشلی با هدف توانمند کردن معلمان و مدرس‌ها طراحی شده است؛ دستیار هوشمندی که به شما کمک می‌کند زمان کمتری صرف آماده‌سازی کلاس‌ها کنید و در عوض، تجربه‌ای جذاب، خلاقانه و اثربخش برای دانش‌آموزان خود بسازید. ما باور داریم یادگیری زمانی ماندگار می‌شود که کلاس، فضایی الهام‌بخش و پویا باشد؛ جایی که دانش‌آموزان نه از روی اجبار، بلکه با اشتیاق منتظر شروع آن باشند.</Text><SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" className="pt-2">{aboutFeatures.map(([Icon, title, description]) => <Card key={title} radius="xl" padding="md" className="border border-white/10 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"><Icon className="mb-3 text-cyan-300" size={25} /><Text size="sm" fw={900} className="text-white">{title}</Text><Text size="xs" className="mt-1 leading-6 text-indigo-100/65">{description}</Text></Card>)}</SimpleGrid></Stack>
                    </div>
                    <div className="mt-10 grid gap-6 lg:grid-cols-2"><Card radius={28} padding="xl" className="border border-white/10 bg-white/[.07] shadow-xl backdrop-blur-sm"><Badge size="sm" radius="xl" className="bg-fuchsia-400/15 text-fuchsia-200">چرا فانیشلی؟</Badge><Title order={3} className="mt-4 text-2xl font-black text-white">فناوری در خدمت آموزش مؤثر</Title><Text className="mt-3 leading-8 text-indigo-100/70">هدف ما این است که معلمان بتوانند با کمک هوش مصنوعی، ایده‌های آموزشی خود را سریع‌تر به کلاس‌هایی خلاقانه، تعاملی و ماندگار تبدیل کنند؛ بدون آنکه کیفیت آموزش فدای سرعت شود.</Text></Card><Card radius={28} padding="xl" className="border border-white/10 bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/15 shadow-xl backdrop-blur-sm"><Title order={3} className="text-2xl font-black text-white">مأموریت ما</Title><Text className="mt-3 leading-8 text-indigo-100/70">در فانیشلی تلاش می‌کنیم هوش مصنوعی را به ابزاری کاربردی برای معلمان تبدیل کنیم؛ ابزاری که به جای پیچیده‌تر کردن فرآیند آموزش، آن را ساده‌تر، سریع‌تر و خلاقانه‌تر کند.</Text><div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4"><Text fw={800} className="leading-8 text-cyan-200">«کلاس‌هایی بسازید که دانش‌آموزان برای رسیدن به آن لحظه‌شماری کنند.»</Text></div></Card></div>
                </Container>
            </section>

            <section id="packages" className="relative bg-[#f4f6ff] py-24 sm:py-32"><div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" /><Container size="xl" className="relative"><Stack gap="sm" className="mx-auto mb-14 max-w-2xl text-center"><Badge size="lg" radius="xl" className="mx-auto bg-[#e0e7ff] px-4 text-[#4338ca]">پکیج‌ها</Badge><Title order={2} className="text-3xl font-black text-[#101947] sm:text-5xl">پکیج مناسب خود را انتخاب کنید</Title><div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-l from-cyan-400 to-fuchsia-500" /><Text className="leading-8 text-[#68769f]">ابزارهای لازم برای ایجاد پویایی و خلاقیت در هر کلاس درسی</Text></Stack><SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">{packages.map((item, index) => { const durations = [{ label: "۱ ماهه", price: item.price1m }, { label: "۳ ماهه", price: item.price3m }, { label: "۶ ماهه", price: item.price6m }]; return <Card key={item.id} radius={30} padding={8} className="group border-0 bg-gradient-to-br from-indigo-500 via-[#4f46e5] to-fuchsia-600 shadow-[0_20px_50px_rgba(79,70,229,.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(79,70,229,.35)]"><div className="h-full rounded-[1.55rem] bg-white p-6 sm:p-8"><Group justify="space-between" align="start"><div><Badge radius="xl" className={index === 0 ? "bg-fuchsia-100 text-fuchsia-700" : "bg-cyan-100 text-cyan-700"}>{item.title}</Badge><Text className="mt-3 leading-8 text-[#68769f]">{item.description}</Text></div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 transition-transform duration-300 group-hover:rotate-12"><HiSparkles size={29} /></div></Group><Stack gap="xs" className="my-6">{item.options.map((benefit) => <Group key={benefit} gap="xs" wrap="nowrap"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><HiCheck size={15} /></span><Text size="sm" className="text-[#4e608e]">{benefit}</Text></Group>)}</Stack><Divider color="#e7eaf7" /><SimpleGrid cols={3} spacing="sm" className="mt-6">{durations.map((duration) => <Button key={duration.label} component="a" href={user ? `/payment/${item.id}?duration=${duration.label}` : `/auth/login?redirect=/payment/${item.id}`} variant="light" radius="lg" className="h-auto bg-indigo-50 px-2 py-3 text-indigo-700 transition-all duration-300 hover:scale-105 hover:bg-indigo-100"><Stack gap={2} align="center"><Text size="xs" c="dimmed">{duration.label}</Text><Text fw={900}>{duration.price.toLocaleString("fa")}</Text><Text size="xs" c="dimmed">تومان</Text></Stack></Button>)}</SimpleGrid></div></Card>; })}</SimpleGrid></Container></section>

            <footer className="relative overflow-hidden border-t border-indigo-100 bg-[#0d143f] text-white"><div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" /><Container size="xl" className="relative py-14"><div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]"><div><Logo /><Text className="mt-4 max-w-md leading-8 text-indigo-100/65">فانیشلی با هدف توانمند کردن معلمان و مدرس‌ها طراحی شده است؛</Text></div><div><Text fw={900} className="text-white">دسترسی سریع</Text><Stack gap="xs" className="mt-4 text-sm text-indigo-100/65"><Link className="transition hover:text-cyan-300" href="#home">خانه</Link><Link className="transition hover:text-cyan-300" href="#about">معرفی</Link><Link className="transition hover:text-cyan-300" href="#packages">پکیج‌ها</Link><Link className="transition hover:text-cyan-300" href="#about-us">درباره ما</Link></Stack></div><div><Text fw={900} className="text-white">فانیشلی</Text><Text size="sm" className="mt-4 leading-8 text-indigo-100/65">دستیار هوشمند شما برای خلق کلاس‌هایی الهام‌بخش و ماندگار.</Text><a referrerPolicy="origin" target="_blank" rel="noopener noreferrer" href="https://trustseal.enamad.ir/?id=744719&Code=0AERkCoNRE5TDdc7bZr8CxUp5rg82SrJ" className="mt-4 inline-flex flex-col items-center gap-1 text-sm text-indigo-100/70"><Image src="/images/enamad/enamad.png" alt="نماد اعتماد الکترونیکی" width={90} height={90} /></a></div></div><Divider color="rgba(255,255,255,.12)" className="my-8" /><Text ta="center" size="sm" className="text-indigo-100/50">تمامی حقوق محفوظ است - شرکت برنامه نویسی <a target="_blank" href="https://novinbin.com/" className="text-cyan-300">نوین بین</a> © {new Date().toLocaleDateString("fa").slice(0, 4)}</Text></Container></footer>
        </main>
    );
}
