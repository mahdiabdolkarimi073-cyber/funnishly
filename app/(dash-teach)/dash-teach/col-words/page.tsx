"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { MdViewColumn } from "react-icons/md";
import { loadGameData, saveGameData } from "@/backend/actions/game/gameData.action";

interface Pair { id: string; left: string; right: string }
interface SavedSet {
    id: string;
    title: string;
    pairs: Pair[];
    createdAt: number;
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

const DECOYS = ["water","air","book","table","door","window","flower","moon","star","wind","fire","snow","cloud","sun","tree","fish"];

export default function WordMatch() {
    const [activePairs, setActivePairs] = useState<Pair[]>([]);
    const [activeSetTitle, setActiveSetTitle] = useState<string>("");
    const [leftA, setLeftA] = useState("");
    const [rightA, setRightA] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [leftCol, setLeftCol] = useState<string[]>([]);
    const [rightCol, setRightCol] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ col: "left" | "right"; word: string } | null>(null);
    const [matched, setMatched] = useState<Set<string>>(new Set());
    const [wrong, setWrong] = useState<string | null>(null);
    const [won, setWon] = useState(false);
    const [answerMap, setAnswerMap] = useState<Record<string, string>>({});

    const [modalTitle, setModalTitle] = useState("");
    const [modalPairs, setModalPairs] = useState<Pair[]>([]);
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("WORD_MATCH").then((data) => {
            if (data && data.sets) setSavedSets(data.sets);
        });
    }, []);

    const persistSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("WORD_MATCH", { sets });
    };

    const openModal = () => {
        setModalTitle(""); setModalPairs([]); setLeftA(""); setRightA("");
        setShowModal(true); setShowSavedSets(false);
    };

    const addModalPair = () => {
        if (!leftA.trim() || !rightA.trim()) return;
        if (modalPairs.length >= 6) return alert("Maximum 6 pairs per set");
        setModalPairs([...modalPairs, { id: crypto.randomUUID(), left: leftA.trim(), right: rightA.trim() }]);
        setLeftA(""); setRightA("");
    };

    const removeModalPair = (id: string) => setModalPairs(modalPairs.filter(p => p.id !== id));

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalPairs.length < 5) return alert("Minimum 5 pairs required");
        persistSets([...savedSets, { id: Date.now().toString(), title: modalTitle.trim(), pairs: [...modalPairs], createdAt: Date.now() }]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setActivePairs(set.pairs); setActiveSetTitle(set.title);
        setShowSavedSets(false); setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        persistSets(savedSets.filter(s => s.id !== id));
    };

    function startGame() {
        if (activePairs.length < 5) return alert("Load a set with at least 5 pairs first");
        const picked = shuffle(activePairs).slice(0, 5);
        const map: Record<string, string> = {};
        picked.forEach(p => { map[p.left] = p.id; map[p.right] = p.id; });
        const usedWords = new Set([...picked.map(p => p.left), ...picked.map(p => p.right)]);
        const decoy = DECOYS.find(d => !usedWords.has(d)) ?? "cloud";
        map[decoy] = "decoy_" + decoy;

        setAnswerMap(map);
        setLeftCol(shuffle(picked.map(p => p.left)));
        setRightCol(shuffle([...picked.map(p => p.right), decoy]));
        setMatched(new Set());
        setSelected(null);
        setWrong(null);
        setWon(false);
    }

    function handleSelect(col: "left" | "right", word: string) {
        if (matched.has(answerMap[word])) return;
        if (!selected) { setSelected({ col, word }); return; }
        if (selected.col === col) { setSelected({ col, word }); return; }

        if (answerMap[selected.word] === answerMap[word]) {
            const newMatched = new Set(matched);
            newMatched.add(answerMap[word]);
            setMatched(newMatched);
            setSelected(null);
            if (newMatched.size === leftCol.length) setWon(true);
        } else {
            setWrong(`${selected.word}|${word}`);
            setTimeout(() => { setWrong(null); setSelected(null); }, 700);
        }
    }

    function wordStyle(word: string) {
        const id = answerMap[word];
        if (matched.has(id)) return "bg-emerald-500 border-emerald-400 text-white cursor-default shadow-md shadow-emerald-200/50";
        if (wrong?.includes(word)) return "bg-red-500 border-red-400 text-white";
        if (selected?.word === word) return "bg-blue-500 border-blue-400 text-white scale-105 shadow-md shadow-blue-200/50";
        return "bg-white border-cyan-200 text-[#1a2151] hover:bg-cyan-50 cursor-pointer";
    }

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 shadow-md shadow-cyan-100/50">
                    <MdViewColumn size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">تطبیق کلمات</h2>
                    <p className="text-slate-400 text-sm">اتصال کلمات مرتبط در ستون‌ها</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(6,182,212,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-50/40 blur-2xl"/>

                <div className="relative flex flex-col items-center gap-5 p-6 md:p-10">
                    {activeSetTitle && (
                        <span className="flex items-center gap-1.5 rounded-full bg-cyan-100 px-4 py-1.5 text-xs font-bold text-cyan-600">
                            <HiSparkles size={14}/> مجموعه: {activeSetTitle}
                        </span>
                    )}

                    <div className="flex gap-3 flex-wrap justify-center" dir="ltr">
                        <button onClick={openModal} className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-purple-200/50">
                            <FiFolder size={16}/> مجموعه‌ها ({savedSets.length})
                        </button>
                        <button onClick={startGame} className="px-5 py-3 rounded-2xl bg-gradient-to-l from-cyan-500 to-blue-500 text-white text-sm font-bold transition-all shadow-md shadow-cyan-200/50 fn-btn-press">
                            شروع بازی
                        </button>
                    </div>

                    {won && (
                        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-6 py-3 fn-fade-up">
                            <span className="text-emerald-600 font-black text-xl">🎉 آفرین! همه جفت‌ها پیدا شدند!</span>
                        </div>
                    )}

                    {!won && leftCol.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-400 fn-float-slow">
                                <MdViewColumn size={32}/>
                            </div>
                            <p className="text-slate-400 text-sm text-center max-w-xs">یک مجموعه انتخاب کنید و روی «شروع بازی» کلیک کنید</p>
                        </div>
                    )}

                    {leftCol.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center sm:items-start">
                            <div className="flex flex-col gap-3">
                                {leftCol.map(word => (
                                    <div key={word} onClick={() => handleSelect("left", word)}
                                         className={`px-6 py-3.5 rounded-2xl border-2 text-center font-bold transition-all select-none min-w-[120px] text-base ${wordStyle(word)}`}>
                                        {word}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                {rightCol.map(word => (
                                    <div key={word} onClick={() => handleSelect("right", word)}
                                         className={`px-6 py-3.5 rounded-2xl border-2 text-center font-bold transition-all select-none min-w-[120px] text-base ${wordStyle(word)}`}>
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                     onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-md flex flex-col gap-4 max-h-[80vh] shadow-2xl border border-cyan-50"
                         onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مدیریت مجموعه‌ها</h2>
                                </div>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="عنوان مجموعه (مثلاً: حیوانات)"
                                    className="rounded-2xl border-2 border-cyan-100 bg-cyan-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-cyan-400 transition-colors shrink-0"
                                />

                                <div className="flex gap-2 shrink-0">
                                    <input value={leftA} onChange={e => setLeftA(e.target.value)}
                                           placeholder="کلمه چپ" className="flex-1 rounded-2xl border-2 border-blue-100 bg-blue-50/20 px-3 py-3 text-sm text-[#1a2151] outline-none focus:border-blue-400 transition-colors min-w-0" />
                                    <input value={rightA} onChange={e => setRightA(e.target.value)}
                                           placeholder="کلمه راست" onKeyDown={e => e.key === "Enter" && addModalPair()}
                                           className="flex-1 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 px-3 py-3 text-sm text-[#1a2151] outline-none focus:border-emerald-400 transition-colors min-w-0" />
                                    <button onClick={addModalPair} disabled={modalPairs.length >= 6}
                                            className="px-4 py-3 bg-blue-500 rounded-2xl text-white text-sm disabled:opacity-40 shrink-0 flex items-center transition-colors hover:bg-blue-600">
                                        <FiPlus size={16}/>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                                    {modalPairs.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-4">هنوز جفتی اضافه نشده (حداقل ۵ جفت)</div>
                                    ) : (
                                        modalPairs.map(p => (
                                            <div key={p.id} className="flex items-center bg-slate-50 rounded-xl px-4 py-2.5 text-sm gap-2 border border-slate-100">
                                                <span className="text-blue-600 flex-1 truncate text-left font-bold">{p.left}</span>
                                                <span className="text-slate-300 shrink-0">↔</span>
                                                <span className="text-emerald-600 flex-1 truncate text-left font-bold">{p.right}</span>
                                                <button onClick={() => removeModalPair(p.id)} className="text-red-400 hover:text-red-500 shrink-0 ml-1">
                                                    <FiX size={14}/>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setShowSavedSets(true)} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-600 transition-colors border border-slate-100">
                                        مجموعه‌ها
                                    </button>
                                    <button onClick={saveCurrentSet}
                                            disabled={modalTitle.trim() === "" || modalPairs.length < 5}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${modalTitle.trim() === "" || modalPairs.length < 5 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}>
                                        ذخیره
                                    </button>
                                </div>
                                <button onClick={() => setShowModal(false)} className="py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-500 transition-colors border border-slate-100 shrink-0">
                                    بستن
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مجموعه‌های ذخیره شده</h2>
                                </div>

                                <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                    {savedSets.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-8">هنوز مجموعه‌ای ذخیره نشده</div>
                                    ) : (
                                        savedSets.map((set) => (
                                            <div key={set.id} onClick={() => loadSet(set)}
                                                className="rounded-2xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-cyan-50 transition-colors flex items-center justify-between group border border-slate-100 hover:border-cyan-200">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate">{set.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">
                                                        {set.pairs.length} جفت • {new Date(set.createdAt).toLocaleDateString("fa-IR")}
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
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-sm font-bold text-white transition-colors">
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
