import { GiDiceSixFacesFive } from "react-icons/gi";
import { HiStar, HiSparkles } from "react-icons/hi";
import { MdTimer, MdQuiz } from "react-icons/md";
import { FaPuzzlePiece } from "react-icons/fa";
import { TbTarget } from "react-icons/tb";

interface AuthIllustrationProps {
    variant: "login" | "register";
}

const floatingElements = [
    { icon: GiDiceSixFacesFive, className: "left-[8%] top-[14%] text-blue-500 bg-white shadow-blue-200/50 ring-blue-100", size: 32, box: "h-16 w-16", anim: "fn-float" },
    { icon: HiStar, className: "right-[6%] top-[10%] text-amber-500 bg-white shadow-amber-200/50 ring-amber-100", size: 26, box: "h-14 w-14", anim: "fn-float-rev" },
    { icon: MdTimer, className: "left-[14%] top-[48%] text-blue-500 bg-white shadow-blue-200/40 ring-blue-50", size: 24, box: "h-12 w-12", anim: "fn-float-slow" },
    { icon: FaPuzzlePiece, className: "left-[10%] bottom-[16%] text-emerald-500 bg-white shadow-emerald-200/50 ring-emerald-100", size: 22, box: "h-14 w-14", anim: "fn-float" },
    { icon: TbTarget, className: "right-[8%] bottom-[14%] text-pink-500 bg-white shadow-pink-200/50 ring-pink-100", size: 30, box: "h-16 w-16", anim: "fn-float" },
    { icon: MdQuiz, className: "right-[14%] top-[40%] text-pink-500 bg-white shadow-pink-200/40 ring-pink-50", size: 22, box: "h-12 w-12", anim: "fn-float-rev" },
];

export default function AuthIllustration({ variant }: AuthIllustrationProps) {
    return (
        <div className="relative hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            {/* glow backdrop */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-300/20 via-cyan-200/15 to-pink-200/20 blur-2xl" />

            {/* main illustration card */}
            <div className="relative fn-fade-up">
                {/* mascot / hero image card */}
                <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_24px_70px_rgba(59,130,246,.15)] transition-transform duration-500 hover:scale-[1.02]">
                    <img
                        src="/images/auth/Fig_01.png"
                        alt={variant === "login" ? "خوش آمدی به فانیشلی" : "به فانیشلی بپیوند"}
                        className="h-[460px] w-[420px] object-cover"
                    />
                </div>

                {/* floating decorative game elements */}
                {floatingElements.map((el, i) => {
                    const Icon = el.icon;
                    return (
                        <div key={i} className={`pointer-events-none absolute ${el.className}`}>
                            <div className={`${el.anim} flex ${el.box} items-center justify-center rounded-2xl shadow-xl ring-1`}>
                                <Icon size={el.size} />
                            </div>
                        </div>
                    );
                })}

                {/* sparkle accents */}
                <div className="pointer-events-none absolute -right-3 -top-3 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-lg shadow-amber-200/60 fn-float">
                    <HiSparkles size={24} />
                </div>

                {/* mini status card */}
                {variant === "login" ? (
                    <div className="absolute -left-4 bottom-16 flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float-slow">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                            <HiSparkles size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-blue-600 leading-none">خوش آمدی!</div>
                            <div className="text-[9px] text-slate-400 leading-none mt-0.5">به فانیشلی</div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute -left-4 bottom-16 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm fn-float">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                            <HiStar size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-600 leading-none">شروع کن!</div>
                            <div className="text-[9px] text-slate-400 leading-none mt-0.5">ابزارهای تعاملی</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function AuthIllustrationMobile({ variant }: AuthIllustrationProps) {
    return (
        <div className="relative mx-auto mb-6 flex justify-center lg:hidden">
            <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-200/30 to-pink-200/25 blur-xl" />
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-white bg-white shadow-lg fn-float-slow">
                    <img
                        src="/images/auth/Fig_01.png"
                        alt={variant === "login" ? "فانیشلی" : "فانیشلی"}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-md fn-float">
                    <HiSparkles size={16} />
                </div>
            </div>
        </div>
    );
}
