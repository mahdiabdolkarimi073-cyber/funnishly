"use client";

import React, { useState, useRef } from "react";

const Dot = () => <div className="w-4 h-4 bg-white rounded-full shadow-inner" />;

export default function DiceGame() {
    const [isRolling, setIsRolling] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [diceValue, setDiceValue] = useState(1);

    // استفاده از useRef برای کنترل عنصر صدا
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const rollDice = () => {
        if (isRolling) return;

        setIsRolling(true);

        // پخش صدا با استفاده از ref
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // ریست کردن صدا به ابتدا
            audioRef.current.play().catch((error) => {
                console.log("خطا در پخش صدا:", error);
            });
        }

        const newValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(newValue);

        let targetX = 0;
        let targetY = 0;

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
        }, 2500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900 rounded-2xl p-8 shadow-2xl">

            {/* عنصر صدای مخفی */}
            <audio ref={audioRef} src="/sounds/dice.mp3" preload="auto" />

            <div
                className="relative w-32 h-32 mb-12"
                style={{ perspective: "1000px" }}
            >
                <div
                    className="w-full h-full relative"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        transition: "transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                >
                    {/* وجه 1 (جلو) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "translateZ(64px)" }}>
                        <Dot />
                    </div>

                    {/* وجه 6 (پشت) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "rotateY(180deg) translateZ(64px)" }}>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                    </div>

                    {/* وجه 3 (راست) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "rotateY(90deg) translateZ(64px)" }}>
                        <div className="self-end"><Dot /></div>
                        <div className="self-center"><Dot /></div>
                        <div className="self-start"><Dot /></div>
                    </div>

                    {/* وجه 4 (چپ) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "rotateY(-90deg) translateZ(64px)" }}>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                    </div>

                    {/* وجه 2 (بالا) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "rotateX(90deg) translateZ(64px)" }}>
                        <div className="self-end"><Dot /></div>
                        <div className="self-start"><Dot /></div>
                    </div>

                    {/* وجه 5 (پایین) */}
                    <div className="absolute w-full h-full bg-red-500 border-2 border-red-700 rounded-xl flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" style={{ transform: "rotateX(-90deg) translateZ(64px)" }}>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                        <div className="flex justify-center"><Dot /></div>
                        <div className="flex justify-between"><Dot /><Dot /></div>
                    </div>
                </div>
            </div>

            <button
                onClick={rollDice}
                disabled={isRolling}
                className={`px-8 py-3 text-lg font-bold text-white transition-all duration-200 rounded-full shadow-lg 
          ${isRolling
                    ? 'bg-slate-600 cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-emerald-400 to-emerald-600 hover:scale-105 hover:shadow-emerald-500/50 active:scale-95'
                }`}
            >
              {isRolling ? "Rolling the dice..." : "Roll the Dice!"}
            </button>

            {!isRolling && rotation.x !== 0 && (
                <p className="mt-6 text-xl text-slate-300 font-medium">
                    Result: <span className="text-emerald-400 font-bold text-2xl">{diceValue}</span>
                </p>
            )}
        </div>
    );
}
