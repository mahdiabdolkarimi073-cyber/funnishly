"use client";

import React, { useState, useRef } from "react";
import { HiSparkles } from "react-icons/hi";
import { MdCasino, MdReplay } from "react-icons/md";

const Dot = () => <div className="w-3.5 h-3.5 bg-white rounded-full shadow-inner"/>;

export default function DiceGame() {
    const [isRolling, setIsRolling] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [diceValue, setDiceValue] = useState(1);
    const [hasRolled, setHasRolled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }

        const newValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(newValue);

        let targetX = 0, targetY = 0;
        switch (newValue) {
            case 1: targetX = 0; targetY = 0; break;
            case 2: targetX = -90; targetY = 0; break;
            case 3: targetX = 0; targetY = -90; break;
            case 4: targetX = 0; targetY = 90; break;
            case 5: targetX = 90; targetY = 0; break;
            case 6: targetX = 0; targetY = 180; break;
        }

        const baseX = rotation.x - (rotation.x % 360);
        const baseY = rotation.y - (rotation.y % 360);
        setRotation({
            x: baseX + 1080 + targetX,
            y: baseY + 1080 + targetY,
        });

        setTimeout(() => {
            setIsRolling(false);
            setHasRolled(true);
        }, 2500);
    };

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-md shadow-amber-100/50">
                    <MdCasino size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">تاس</h2>
                    <p className="text-slate-400 text-sm">اجرای فعالیت‌های تصادفی در کلاس</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 shadow-[0_8px_40px_rgba(245,158,11,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-amber-100/30 blur-2xl"/>
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-orange-100/20 blur-2xl"/>

                <audio ref={audioRef} src="/sounds/dice.mp3" preload="auto"/>

                <div className="relative flex flex-col items-center gap-8 p-8 md:p-12">
                    {/* Badge */}
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-600">
                        <HiSparkles size={14}/> تاس کلاسی
                    </span>

                    {/* 3D Dice */}
                    <div className="relative" style={{ perspective: "1000px", width: "128px", height: "128px" }}>
                        <div
                            className="w-full h-full relative"
                            style={{
                                transformStyle: "preserve-3d",
                                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                transition: "transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            }}
                        >
                            {/* Face 1 (front) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "translateZ(64px)" }}>
                                <Dot/>
                            </div>
                            {/* Face 6 (back) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "rotateY(180deg) translateZ(64px)" }}>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                            </div>
                            {/* Face 3 (right) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "rotateY(90deg) translateZ(64px)" }}>
                                <div className="self-end"><Dot/></div>
                                <div className="self-center"><Dot/></div>
                                <div className="self-start"><Dot/></div>
                            </div>
                            {/* Face 4 (left) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "rotateY(-90deg) translateZ(64px)" }}>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                            </div>
                            {/* Face 2 (top) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "rotateX(90deg) translateZ(64px)" }}>
                                <div className="self-end"><Dot/></div>
                                <div className="self-start"><Dot/></div>
                            </div>
                            {/* Face 5 (bottom) */}
                            <div className="absolute w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-300 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]" style={{ transform: "rotateX(-90deg) translateZ(64px)" }}>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                                <div className="flex justify-center"><Dot/></div>
                                <div className="flex justify-between"><Dot/><Dot/></div>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    {hasRolled && !isRolling && (
                        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-6 py-3 fn-fade-up">
                            <span className="text-slate-500 text-sm font-medium">نتیجه:</span>
                            <span className="text-amber-600 font-black text-3xl">{diceValue}</span>
                        </div>
                    )}

                    {/* Roll button */}
                    <button
                        onClick={rollDice}
                        disabled={isRolling}
                        className={`fn-btn-press px-10 py-4 text-lg font-bold text-white rounded-2xl shadow-lg transition-all flex items-center gap-3
                            ${isRolling
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-gradient-to-l from-amber-500 to-orange-500 hover:shadow-xl hover:shadow-amber-300/50"
                            }`}
                    >
                        <MdCasino size={24}/>
                        {isRolling ? "در حال پرتاب..." : "پرتاب تاس!"}
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 fn-fade-up fn-delay-2">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-amber-500 shrink-0 shadow-sm">
                        <HiSparkles size={18}/>
                    </div>
                    <div>
                        <p className="text-[#1a2151] font-bold text-sm">راهنما</p>
                        <p className="text-slate-500 text-sm mt-1 leading-7">
                            روی دکمه پرتاب کلیک کنید تا تاس چرخانده شود. می‌توانید از نتیجه برای انتخاب تصادفی دانش‌آموزان یا فعالیت‌ها استفاده کنید.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
