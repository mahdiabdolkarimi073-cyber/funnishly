"use client";

import { useState, useRef, useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import { MdTimer, MdReplay } from "react-icons/md";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);
    const [input, setInput] = useState({ h: "", m: "", s: "" });
    const [countdown, setCountdown] = useState<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (countdown !== null && prev <= 0) {
                        setRunning(false);
                        return 0;
                    }
                    return countdown !== null ? prev - 1 : prev + 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, countdown]);

    const startCountdown = () => {
        const total = (parseInt(input.h || "0") * 3600) +
            (parseInt(input.m || "0") * 60) +
            (parseInt(input.s || "0"));
        if (total > 0) { setCountdown(total); setSeconds(total); setRunning(true); }
    };

    const reset = () => {
        setRunning(false);
        setSeconds(0);
        setCountdown(null);
        setInput({ h: "", m: "", s: "" });
    };

    const fmt = (n: number) => {
        const abs = Math.abs(n);
        const h = Math.floor(abs / 3600).toString().padStart(2, "0");
        const m = Math.floor((abs % 3600) / 60).toString().padStart(2, "0");
        const s = (abs % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const isCountdownDone = countdown !== null && seconds <= 0 && !running;
    const isSetup = !running && seconds === 0;

    const displayColor = isCountdownDone ? "#ef4444" : countdown !== null ? "#f59e0b" : "#3b82f6";

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-md shadow-blue-100/50">
                    <MdTimer size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">تایمر کلاس</h2>
                    <p className="text-slate-400 text-sm">مدیریت زمان فعالیت‌های کلاسی</p>
                </div>
            </div>

            {/* Main display card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(59,130,246,.08)] fn-fade-up fn-delay-1">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-50/50 blur-2xl"/>
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full" style={{ backgroundColor: `${displayColor}15`, filter: "blur(40px)" }}/>

                <div className="relative flex flex-col items-center gap-8 p-8 md:p-12">
                    {/* Badge */}
                    <span className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold" style={{ backgroundColor: `${displayColor}15`, color: displayColor }}>
                        <HiSparkles size={14}/>
                        {countdown !== null ? "شمارش معکوس" : "کرونومتر"}
                    </span>

                    {/* Large time display */}
                    <div
                        className="font-black tabular-nums tracking-wider transition-colors duration-300"
                        style={{
                            fontSize: "clamp(3rem, 14vw, 5.5rem)",
                            color: displayColor,
                            textShadow: `0 4px 30px ${displayColor}25`,
                        }}
                        dir="ltr"
                    >
                        {fmt(seconds)}
                    </div>

                    {isCountdownDone && (
                        <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-2.5">
                            <span className="text-red-500 font-bold text-lg">⏰ زمان به اتمام رسید!</span>
                        </div>
                    )}

                    {/* Setup inputs */}
                    {isSetup && (
                        <div className="flex flex-col items-center gap-4 fn-fade-up">
                            <p className="text-slate-400 text-sm">زمان شمارش معکوس را تنظیم کنید</p>
                            <div className="flex gap-3 items-end" dir="ltr">
                                {[["h", "ساعت"], ["m", "دقیقه"], ["s", "ثانیه"]].map(([key, label]) => (
                                    <div key={key} className="flex flex-col items-center gap-1.5">
                                        <input
                                            type="number" min={0} placeholder="0"
                                            value={input[key as "h" | "m" | "s"]}
                                            onChange={e => setInput(p => ({ ...p, [key]: e.target.value }))}
                                            className="w-20 h-16 text-center text-2xl font-black rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-[#1a2151] outline-none focus:border-blue-400 transition-colors"
                                        />
                                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={startCountdown}
                                className="fn-btn-press px-8 py-3 rounded-2xl bg-gradient-to-l from-blue-600 to-cyan-500 text-white font-bold text-base shadow-lg shadow-blue-200/50 transition-all"
                            >
                                شروع تایمر
                            </button>
                        </div>
                    )}

                    {/* Controls */}
                    {!isSetup && (
                        <div className="flex gap-4 items-center" dir="ltr">
                            <button
                                onClick={() => setRunning(r => !r)}
                                disabled={isCountdownDone}
                                className="flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-all fn-btn-press disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: running ? "rgba(59,130,246,.15)" : `linear-gradient(135deg, ${displayColor}, ${displayColor}dd)`,
                                    color: running ? displayColor : "#fff",
                                }}
                            >
                                {running ? <GiPauseButton size={28}/> : <GiPlayButton size={28}/>}
                            </button>
                            <button
                                onClick={reset}
                                className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-slate-100 fn-btn-press"
                            >
                                <MdReplay size={26}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick presets */}
            {isSetup && (
                <div className="mt-6 fn-fade-up fn-delay-2">
                    <p className="text-slate-400 text-xs font-bold mb-3 text-center">زمان‌های آماده</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: "۱ دقیقه", val: { h: "0", m: "1", s: "0" } },
                            { label: "۳ دقیقه", val: { h: "0", m: "3", s: "0" } },
                            { label: "۵ دقیقه", val: { h: "0", m: "5", s: "0" } },
                            { label: "۱۰ دقیقه", val: { h: "0", m: "10", s: "0" } },
                            { label: "۱۵ دقیقه", val: { h: "0", m: "15", s: "0" } },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => {
                                    setInput(preset.val);
                                    const total = (parseInt(preset.val.h) * 3600) + (parseInt(preset.val.m) * 60) + parseInt(preset.val.s);
                                    setCountdown(total);
                                    setSeconds(total);
                                    setRunning(true);
                                }}
                                className="px-5 py-2.5 rounded-2xl border border-blue-100 bg-white text-sm font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md fn-btn-press"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
