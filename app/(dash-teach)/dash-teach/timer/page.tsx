"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";

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

    return (
        <div style={{
            minHeight: "100vh", background: "#1a1a2e", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            fontFamily: "sans-serif", color: "#fff", gap: 32,
        }}>
            {/* Display */}
            <div style={{
                fontSize: 72, fontWeight: "bold", letterSpacing: 8,
                color: isCountdownDone ? "#e74c3c" : countdown !== null ? "#f1c40f" : "#3498db",
                textShadow: `0 0 30px ${isCountdownDone ? "#e74c3c" : countdown !== null ? "#f1c40f" : "#3498db"}55`,
                transition: "color 0.3s",
            }}>
                {fmt(seconds)}
            </div>

            {isCountdownDone && <div style={{ color: "#e74c3c", fontSize: 20 }}>⏰ Time's up!</div>}

            {/* Countdown input */}
            {!running && seconds === 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {[["h", "Hours"], ["m", "Minutes"], ["s", "Seconds"]].map(([key, label]) => (
                        <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <input
                                type="number" min={0} placeholder="0"
                                value={input[key as "h" | "m" | "s"]}
                                onChange={e => setInput(p => ({ ...p, [key]: e.target.value }))}
                                style={{
                                    width: 64, padding: "8px", textAlign: "center",
                                    borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)",
                                    background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 18, outline: "none",
                                }}
                            />
                            <span style={{ fontSize: 11, opacity: 0.5 }}>{label}</span>
                        </div>
                    ))}
                    <button onClick={startCountdown} style={{
                        padding: "10px 20px", borderRadius: 12, border: "none",
                        background: "linear-gradient(135deg,#667eea,#764ba2)",
                        color: "#fff", cursor: "pointer", fontSize: 14, marginTop: -16,
                    }}>
                        Start Timer
                    </button>
                </div>
            )}

            {/* Controls */}
            <div style={{ display: "flex", gap: 16 }}>
                <button
                    onClick={() => setRunning(r => !r)}
                    disabled={isCountdownDone}
                    style={{
                        padding: "16px 40px", borderRadius: 50, border: "none",
                        background: running
                            ? "rgba(255,255,255,0.12)"
                            : "linear-gradient(135deg,#667eea,#764ba2)",
                        color: "#fff", cursor: isCountdownDone ? "not-allowed" : "pointer",
                        fontSize: 22, display: "flex", alignItems: "center", gap: 10,
                    }}
                >
                    {running ? <FiPause /> : <FiPlay />}</button>
                <button onClick={reset} style={{
                    padding: "16px 20px", borderRadius: 50, border: "none",
                    background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                    cursor: "pointer", fontSize: 22,
                }}>
                    <FiRotateCcw />
                </button>
            </div>
        </div>
    );
}