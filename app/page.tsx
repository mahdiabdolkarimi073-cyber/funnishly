import Header from "@/components/theme/Header";
import Link from "next/link";
import prisma from "@/backend/module/Prisma"
import { cookies } from "next/headers";

import Logo from "@/components/logo/Logo";

export default async function HomePage() {

    const token = (await cookies()).get("token")?.value

    const user = await prisma.user.findUnique({
        where: {
            token: token + "",
        }
    })


    return (
        <main className="min-h-screen bg-linear-to-b from-sky-50 via-white to-blue-50 text-slate-900 scroll-smooth"
            dir="rtl">
            {/* Header */}


            {/* Hero Section */}
            <section id="home" className="relative overflow-hidden">
                <div
                    className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
                    {/* Hero Content Placeholder */}
                    <div>
                        <div
                            className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                            <span className="h-2 w-2 rounded-full bg-sky-600" />
                            فانیشلی
                        </div>

                        <h1 className="mt-5 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                            فانیشلی؛ هوشمندسازی کلاس
                            <span className="block text-sky-700">خلقِ تجربه‌ای ماندگار برای دانش‌آموزان امروز</span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                            با فانیشلی، فاصله بین متد‌های آموزشی سنتی و انتظارات نسل امروز را به سادگی از میان بردارید. از تایمر و گردونه گرفته تا کوییز و تاس، به سادگی همه ابزارهای لازم برای درگیر کردن دانش‌آموزان نسل امروز را در اختیار خواهید داشت.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#packages"
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                مشاهده پکیج‌ها
                                <span className="mr-2">←</span>
                            </a>

                            <a
                                href="#about"
                                className="inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-bold text-sky-700 transition hover:bg-sky-50 hover:shadow-md"
                            >
                                بیشتر درباره ما
                            </a>
                        </div>
                    </div>

                    {/* Hero Side Card */}
                    <div className="relative">
                        <div
                            className="rounded-[2rem] border border-sky-100 bg-white/80 p-5 shadow-2xl shadow-sky-100 backdrop-blur">
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                            ✓
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">برای کلاس های حضوری و آنلاین</div>
                                            <div className="text-sm text-slate-500">
                                                مناسب همه محیط های آموزشی
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                            ⏱
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">بازی محور</div>
                                            <div className="text-sm text-slate-500">
                                                درگیر کردن دانش‌آموزها با بازی‌های آموزشی
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                            ★
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">مناسب همه دروس*</div>
                                            <div className="text-sm text-slate-500">
                                                از زبان انگلیسی گرفته تا ریاضی و ادبیات
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img
                            src="/images/home/Laptop.png"
                            alt="فانیشلی روی لپ‌تاپ"
                            className="absolute -bottom-10 -left-10 w-48 drop-shadow-2xl transition-transform duration-500 hover:scale-105 hidden lg:block"
                        />
                        <img
                            src="/images/home/Pre_-_Tablet.png"
                            alt="فانیشلی روی تبلت"
                            className="absolute -top-8 -right-8 w-32 drop-shadow-xl transition-transform duration-500 hover:scale-105 hidden lg:block"
                        />
                    </div>
                </div>
            </section>

            {/* معرفی */}
            <section id="about" className="border-t border-sky-100/70 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            معرفی
                        </h2>
                        <p className="max-w-2xl leading-8 text-slate-600">
                            فانیشلی؛ دستیارِ هوشمندِ شما برای خلقِ کلاس‌هایی که دانش‌آموزان برای رسیدن به آن لحظه‌شماری می‌کنند</p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {[
                            {
                                tag: "قابلیت ها",
                                title: "قابلیت های فانیشلی!",
                                desc: "تایمر، تاس، گردونه، مرتب کردن جملات، بازی مربع کلمات، وصل کردن کلمات مرتبط و کوییز",
                            },
                            {
                                tag: "حافظه",
                                title: "ذخیره سازی اطلاعات",
                                desc: "آماده و ذخیره کردن محتوای اختصاصی شما قبل از کلاس",
                            },
                            {
                                tag: "ساده",
                                title: "سادگی در اجرا",
                                desc: "بدون نیاز به دانش فنی، هوشمندسازی  کلاس تنها با یک کلیک",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[1.75rem] border border-sky-100 bg-sky-50/40 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <span
                                    className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-sky-700">
                                    {item.tag}
                                </span>
                                <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="mt-3 leading-8 text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section id="about-us" className="border-t border-sky-100/70 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-4">
                        <span className="inline-flex w-fit rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-sm font-bold text-sky-700">
                            معرفی
                        </span>

                        <h2 className="text-3xl font-black tracking-tight text-slate-900">
                            فانیشلی؛ دستیار هوشمند معلمان برای خلق کلاس‌هایی الهام‌بخش
                        </h2>

                        <p className="max-w-4xl leading-8 text-slate-600">
                            فانیشلی با هدف توانمند کردن معلمان و مدرس‌ها طراحی شده است؛
                            دستیار هوشمندی که به شما کمک می‌کند زمان کمتری صرف آماده‌سازی
                            کلاس‌ها کنید و در عوض، تجربه‌ای جذاب، خلاقانه و اثربخش برای
                            دانش‌آموزان خود بسازید. ما باور داریم یادگیری زمانی ماندگار
                            می‌شود که کلاس، فضایی الهام‌بخش و پویا باشد؛ جایی که
                            دانش‌آموزان نه از روی اجبار، بلکه با اشتیاق منتظر شروع آن
                            باشند.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50/40 p-6 shadow-sm">
                            <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-sky-700">
                                چرا فانیشلی؟
                            </span>

                            <h3 className="mt-4 text-xl font-black text-slate-900">
                                فناوری در خدمت آموزش مؤثر
                            </h3>

                            <p className="mt-3 leading-8 text-slate-600">
                                هدف ما این است که معلمان بتوانند با کمک هوش مصنوعی،
                                ایده‌های آموزشی خود را سریع‌تر به کلاس‌هایی خلاقانه،
                                تعاملی و ماندگار تبدیل کنند؛ بدون آنکه کیفیت آموزش
                                فدای سرعت شود.
                            </p>

                            <div className="mt-6 space-y-3">
                                {[
                                    [
                                        "🤖",
                                        "دستیار هوشمند",
                                        "کمک به طراحی و آماده‌سازی سریع‌تر کلاس‌ها",
                                    ],
                                    [
                                        "✨",
                                        "کلاس‌های جذاب",
                                        "خلق تجربه‌ای که دانش‌آموزان مشتاق حضور در آن باشند",
                                    ],
                                    [
                                        "🎯",
                                        "تمرکز بر یادگیری",
                                        "صرف زمان کمتر برای آماده‌سازی و زمان بیشتر برای آموزش",
                                    ],
                                ].map(([icon, title, desc]) => (
                                    <div
                                        key={title}
                                        className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                                            {icon}
                                        </div>

                                        <div>
                                            <div className="font-bold text-slate-900">
                                                {title}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-sky-100 bg-white p-8 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900">
                                مأموریت ما
                            </h3>

                            <p className="mt-4 leading-8 text-slate-600">
                                در فانیشلی تلاش می‌کنیم هوش مصنوعی را به ابزاری کاربردی برای
                                معلمان تبدیل کنیم؛ ابزاری که به جای پیچیده‌تر کردن فرآیند
                                آموزش، آن را ساده‌تر، سریع‌تر و خلاقانه‌تر کند.
                            </p>

                            <p className="mt-5 leading-8 text-slate-600">
                                چشم‌انداز ما این است که هر معلم بتواند بدون صرف ساعت‌ها
                                زمان برای آماده‌سازی محتوا، کلاس‌هایی برگزار کند که
                                دانش‌آموزان با انگیزه، کنجکاوی و اشتیاق در آن حضور پیدا
                                کنند و یادگیری را به تجربه‌ای لذت‌بخش تبدیل کنند.
                            </p>

                            <div className="mt-8 rounded-2xl bg-sky-50 p-5">
                                <p className="text-lg font-extrabold leading-9 text-sky-900">
                                    «کلاس‌هایی بسازید که دانش‌آموزان برای رسیدن به آن
                                    لحظه‌شماری کنند.»
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section id="packages" className="border-t border-sky-100/70 bg-gradient-to-b from-blue-50 to-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            پکیج‌ها
                        </h2>
                        <p className="text-slate-600">پکیج مناسب خود را انتخاب کنید</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {(await prisma.package.findMany()).map((item) => {
                            const { title, id, options, description, price1m, price3m, price6m } = item
                            const durations = [
                                { label: "۱ ماهه", price: price1m },
                                { label: "۳ ماهه", price: price3m },
                                { label: "۶ ماهه", price: price6m },
                            ]

                            return (
                                <div
                                    key={item.id}
                                    className="relative overflow-hidden rounded-[1.75rem] flex flex-col border border-sky-100 bg-white p-6 shadow-lg shadow-sky-100">

                                    <div className="mb-4">
                                        <div className="mb-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                                            {title}
                                        </div>
                                        <p className="text-sm text-slate-500 leading-7">{description}</p>
                                    </div>

                                    <ul className="mb-6 space-y-3">
                                        {options.map((benefit) => (
                                            <li key={benefit} className="flex items-start gap-3 text-slate-700">
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sm font-bold text-sky-700">
                                                    ✓
                                                </span>
                                                <span className="leading-7">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Duration options */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {durations.map((d) => (
                                            <a
                                                key={d.label}
                                                href={user ? `/payment/${item.id}?duration=${d.label}` : `/auth/login?redirect=/payment/${item.id}`}
                                                className="flex flex-col items-center gap-1 rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-4 transition hover:border-sky-400 hover:bg-sky-50 cursor-pointer"
                                            >
                                                <span className="text-xs font-medium text-slate-500">{d.label}</span>
                                                <span className="text-lg font-black text-blue-800">
                                                    {d.price.toLocaleString("fa")}
                                                </span>
                                                <span className="text-xs text-slate-400">تومان</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="border-t border-sky-100 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3">
                                <Logo />
                            </div>
                            <p className="mt-4 leading-8 text-slate-600">
                                فانیشلی با هدف توانمند کردن معلمان و مدرس‌ها طراحی شده است؛                             </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-3">
                                <a href="#home"
                                    className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50">
                                    خانه
                                </a>
                                <a href="#about"
                                    className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50">
                                    معرفی
                                </a>
                                <a href="#packages"
                                    className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50">
                                    پکیج‌ها
                                </a>
                                <a href="#about-us"
                                    className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50">
                                    درباره ما
                                </a>
                            </div>
                            <div>
                                <a
                                    referrerPolicy="origin"
                                    target="_blank"
                                    className="flex flex-col gap-2 items-center"
                                    rel="noopener noreferrer"
                                    href="https://trustseal.enamad.ir/?id=744719&Code=0AERkCoNRE5TDdc7bZr8CxUp5rg82SrJ"
                                >
                                    <img
                                        width={120}
                                        referrerPolicy="origin"
                                        src="/images/enamad/enamad.png"
                                        alt="نماد اعتماد الکترونیکی"
                                        style={{ cursor: "pointer" }}
                                    />
                                    <span>نماد اعتماد الکترونیک</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 border-t border-sky-100 pt-5 text-center text-sm text-slate-500">
                        <p>
                            تمامی حقوق محفوظ است - شرکت برنامه نویسی <a target="_blank" href="https://novinbin.com/">نوین بین</a>   © {new Date().toLocaleDateString("fa").slice(0, 4)}

                        </p>

                        <small>هرگونه کپی برداری بدون ذکر منبع پیگرد قانونی دارد</small>
                    </div>
                </div>
            </footer>
        </main>
    );
}
