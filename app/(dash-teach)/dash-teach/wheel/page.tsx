"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { MdDonutLarge, MdReplay } from "react-icons/md";
import { loadGameData, saveGameData } from "@/backend/actions/game/gameData.action";

const COLORS = [
    "#3b82f6", "#a855f7", "#ec4899", "#f59e0b",
    "#10b981", "#06b6d4", "#8b5cf6", "#ef4444",
    "#14b8a6", "#f97316", "#6366f1", "#84cc16",
    "#e11d48", "#0ea5e9", "#d946ef", "#facc15",
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface SavedSet {
    id: string;
    title: string;
    items: string[];
    createdAt: number;
}

export default function SpinWheel() {
    const [items, setItems] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const currentRotation = useRef(0);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalItems, setModalItems] = useState<string[]>([]);
    const [modalInput, setModalInput] = useState("");
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("WHEEL").then((data) => {
            if (data && data.sets) setSavedSets(data.sets);
        });
    }, []);

    const saveSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("WHEEL", { sets });
    };

    const addItem = () => {
        const v = input.trim();
        if (v) { setItems([...items, v]); setInput(""); }
    };
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const reset = () => {
        setItems([]); setWinner(null); setRotation(0); currentRotation.current = 0;
    };

    const spin = () => {
        if (spinning || items.length < 2) return;
        setSpinning(true); setWinner(null);
        const extra = 360 * (5 + Math.random() * 5) + Math.random() * 360;
        const next = currentRotation.current + extra;
        currentRotation.current = next;
        setRotation(next);
        setTimeout(() => {
            const seg = 360 / items.length;
            const pointerAngle = (90 - (next % 360) + 360) % 360;
            const idx = Math.floor(pointerAngle / seg) % items.length;
            setWinner(items[idx]);
            setSpinning(false);
        }, 4000);
    };

    const openModal = () => {
        setModalTitle(""); setModalItems([]); setModalInput("");
        setShowModal(true); setShowSavedSets(false);
    };
    const addModalItem = () => {
        const v = modalInput.trim();
        if (v) { setModalItems([...modalItems, v]); setModalInput(""); }
    };
    const removeModalItem = (i: number) => setModalItems(modalItems.filter((_, idx) => idx !== i));
    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalItems.length === 0) return;
        saveSets([...savedSets, { id: Date.now().toString(), title: modalTitle.trim(), items: [...modalItems], createdAt: Date.now() }]);
        setShowModal(false);
    };
    const loadSet = (set: SavedSet) => {
        setItems(set.items); setWinner(null); setRotation(0); currentRotation.current = 0;
        setShowSavedSets(false); setShowModal(false);
    };
    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveSets(savedSets.filter(s => s.id !== id));
    };

    const cx = 200, cy = 200, r = 180;
    const seg = items.length > 0 ? 360 / items.length : 360;

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 shadow-md shadow-purple-100/50">
                    <MdDonutLarge size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">گردونه شانس</h2>
                    <p className="text-slate-400 text-sm">انتخاب تصادفی دانش‌آموز یا فعالیت</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(168,85,247,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-purple-50/40 blur-2xl"/>
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-pink-50/30 blur-2xl"/>

                <div className="relative flex flex-col items-center gap-6 p-6 md:p-10">
                    {/* Badge */}
                    <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-600">
                        <HiSparkles size={14}/> {items.length} گزینه
                    </span>

                    {/* Input bar */}
                    <div className="flex gap-2 flex-wrap justify-center w-full max-w-md" dir="ltr">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addItem()}
                            placeholder="گزینه جدید..."
                            className="flex-1 min-w-[180px] px-4 py-3 rounded-2xl border-2 border-purple-100 bg-purple-50/30 text-[#1a2151] outline-none focus:border-purple-400 transition-colors text-sm"
                        />
                        <button onClick={addItem} className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-200/50 transition-all hover:scale-105 fn-btn-press">
                            <FiPlus size={18}/>
                        </button>
                        <button onClick={openModal} className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500 text-white shadow-md shadow-purple-200/50 transition-all hover:scale-105 fn-btn-press">
                            <FiFolder size={18}/>
                        </button>
                    </div>

                    {/* Tags */}
                    {items.length > 0 && (
                        <div className="flex flex-wrap gap-2 max-w-lg justify-center" dir="ltr">
                            {items.map((item, i) => (
                                <span key={i} className="rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                                    style={{ background: COLORS[i % COLORS.length] + "15", border: `1.5px solid ${COLORS[i % COLORS.length]}`, color: COLORS[i % COLORS.length] }}>
                                    {item}
                                    <FiX size={12} onClick={() => removeItem(i)} style={{ cursor: "pointer" }}/>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Wheel */}
                    <div className="relative" style={{ width: "min(400px, 80vw)", height: "min(400px, 80vw)" }}>
                        {/* Pointer */}
                        <div style={{
                            position: "absolute", top: "50%", right: -18, transform: "translateY(-50%)",
                            width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent",
                            borderRight: "24px solid #f59e0b", zIndex: 10,
                        }}/>
                        <svg
                            viewBox="0 0 400 400"
                            style={{
                                width: "100%", height: "100%",
                                transform: `rotate(${rotation}deg)`,
                                transition: spinning ? "transform 4s cubic-bezier(0.17,0.67,0.12,1)" : "none",
                                borderRadius: "50%", boxShadow: "0 8px 40px rgba(168,85,247,.15)",
                            }}
                        >
                            {items.length === 0 ? (
                                <circle cx={cx} cy={cy} r={r} fill="#f5f3ff" stroke="#e9d5ff" strokeWidth={2}/>
                            ) : items.map((item, i) => {
                                const start = i * seg;
                                const end = start + seg;
                                const s = polarToCartesian(cx, cy, r, start);
                                const e = polarToCartesian(cx, cy, r, end);
                                const large = seg > 180 ? 1 : 0;
                                const mid = polarToCartesian(cx, cy, r * 0.6, start + seg / 2);
                                return (
                                    <g key={i}>
                                        <path
                                            d={`M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} Z`}
                                            fill={COLORS[i % COLORS.length]}
                                            stroke="#fff" strokeWidth={2}
                                        />
                                        <text
                                            x={mid.x} y={mid.y}
                                            textAnchor="middle" dominantBaseline="middle"
                                            fill="#fff" fontSize={13} fontWeight="bold"
                                            transform={`rotate(${start + seg / 2}, ${mid.x}, ${mid.y})`}
                                            style={{ pointerEvents: "none" }}
                                        >
                                            {item.length > 8 ? item.slice(0, 8) + "…" : item}
                                        </text>
                                    </g>
                                );
                            })}
                            <circle cx={cx} cy={cy} r={18} fill="#fff" stroke="#a855f7" strokeWidth={3}/>
                        </svg>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 items-center" dir="ltr">
                        <button
                            onClick={spin}
                            disabled={spinning || items.length < 2}
                            className="fn-btn-press px-10 py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                background: spinning || items.length < 2 ? "#cbd5e1" : "linear-gradient(135deg, #a855f7, #ec4899)",
                                boxShadow: spinning ? "none" : "0 8px 24px rgba(168,85,247,.25)",
                            }}
                        >
                            {spinning ? "در حال چرخش..." : "بچرخان!"}
                        </button>
                        <button onClick={reset} disabled={spinning} className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-slate-100 fn-btn-press disabled:opacity-40">
                            <MdReplay size={24}/>
                        </button>
                    </div>

                    {/* Winner */}
                    {winner && (
                        <div className="flex items-center gap-3 rounded-2xl px-8 py-4 fn-fade-up"
                            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 8px 32px rgba(168,85,247,.3)" }}>
                            <span className="text-white font-black text-xl">{winner}</span>
                        </div>
                    )}

                    {items.length === 0 && (
                        <p className="text-slate-400 text-sm text-center">حداقل ۲ گزینه اضافه کنید تا گردونه بچرخد</p>
                    )}
                </div>
            </div>

            {/* Saved Sets Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh] shadow-2xl border border-purple-50"
                        onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مدیریت مجموعه‌ها</h2>
                                </div>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="عنوان مجموعه (مثلاً: سؤالات عمومی)"
                                    className="rounded-2xl border-2 border-purple-100 bg-purple-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-purple-400 transition-colors shrink-0"
                                />

                                <div className="flex gap-2 shrink-0">
                                    <input
                                        value={modalInput}
                                        onChange={e => setModalInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && addModalItem()}
                                        placeholder="گزینه جدید..."
                                        className="flex-1 rounded-2xl border-2 border-blue-100 bg-blue-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-blue-400 transition-colors"
                                    />
                                    <button onClick={addModalItem} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-sm font-bold transition-colors flex items-center gap-1">
                                        <FiPlus size={16}/> افزودن
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                                    {modalItems.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-8">هنوز گزینه‌ای اضافه نشده</div>
                                    ) : (
                                        modalItems.map((item, i) => (
                                            <div key={i} className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm flex items-center gap-2 border border-slate-100">
                                                <span className="text-slate-400 shrink-0">{i + 1}.</span>
                                                <span className="flex-1 truncate text-[#1a2151]">{item}</span>
                                                <button onClick={() => removeModalItem(i)} className="text-red-400 hover:text-red-500 shrink-0">
                                                    <FiX size={14}/>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setShowSavedSets(true)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-600 transition-colors border border-slate-100">
                                        مجموعه‌های ذخیره شده
                                    </button>
                                    <button
                                        onClick={saveCurrentSet}
                                        disabled={modalTitle.trim() === "" || modalItems.length === 0}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${modalTitle.trim() === "" || modalItems.length === 0 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
                                    >
                                        ذخیره مجموعه
                                    </button>
                                </div>
                                <button onClick={() => setShowModal(false)} className="py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-500 transition-colors border border-slate-100 shrink-0">
                                    بستن
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مجموعه‌های ذخیره شده</h2>
                                </div>

                                <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                    {savedSets.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-8">هنوز مجموعه‌ای ذخیره نشده</div>
                                    ) : (
                                        savedSets.map((set) => (
                                            <div
                                                key={set.id}
                                                onClick={() => loadSet(set)}
                                                className="rounded-2xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between group border border-slate-100 hover:border-purple-200"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate">{set.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">
                                                        {set.items.length} گزینه • {new Date(set.createdAt).toLocaleDateString("fa-IR")}
                                                    </div>
                                                </div>
                                                <button onClick={(e) => deleteSet(set.id, e)} className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                                    <FiTrash2 size={16}/>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 rounded-xl text-sm font-bold text-white transition-colors">
                                        بازگشت
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-500 transition-colors border border-slate-100">
                                        بستن
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
