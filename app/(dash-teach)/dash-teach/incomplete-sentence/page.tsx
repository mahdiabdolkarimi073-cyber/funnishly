"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { MdSortByAlpha } from "react-icons/md";
import { loadGameData, saveGameData } from "@/backend/actions/game/gameData.action";

interface SavedSet {
    id: string;
    title: string;
    sentences: string[];
    createdAt: number;
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function SentenceScramble() {
    const [activeSentences, setActiveSentences] = useState<string[]>([]);
    const [activeSetTitle, setActiveSetTitle] = useState<string>("");
    const [slots, setSlots] = useState<(string | null)[]>([]);
    const [pool, setPool] = useState<(string | null)[]>([]);
    const [target, setTarget] = useState<string[]>([]);
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState("");
    const [dragging, setDragging] = useState<
        { from: "pool"; idx: number } | { from: "slot"; idx: number } | null
    >(null);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalSentences, setModalSentences] = useState<string[]>([]);
    const [modalInput, setModalInput] = useState("");
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("SENTENCE_SCRAMBLE").then((data) => {
            if (data && data.sets) setSavedSets(data.sets);
        });
    }, []);

    const saveSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("SENTENCE_SCRAMBLE", { sets });
    };

    const openModal = () => {
        setModalTitle(""); setModalSentences([]); setModalInput("");
        setShowModal(true); setShowSavedSets(false);
    };

    const addModalSentence = () => {
        const v = modalInput.trim();
        if (v.split(" ").length < 2) { setMessage("Minimum 2 words required"); return; }
        if (v) { setModalSentences([...modalSentences, v]); setModalInput(""); setMessage(""); }
    };

    const removeModalSentence = (i: number) => setModalSentences(modalSentences.filter((_, idx) => idx !== i));

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalSentences.length === 0) return;
        saveSets([...savedSets, { id: Date.now().toString(), title: modalTitle.trim(), sentences: [...modalSentences], createdAt: Date.now() }]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setActiveSentences(set.sentences); setActiveSetTitle(set.title); setMessage("");
        setShowSavedSets(false); setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveSets(savedSets.filter(s => s.id !== id));
    };

    function startGame() {
        if (activeSentences.length === 0) { setMessage("Please load a set first"); return; }
        const picked = activeSentences[Math.floor(Math.random() * activeSentences.length)];
        const words = picked.split(" ");
        setTarget(words);
        setSlots(words.map(() => null));
        setPool(shuffle([...words]));
        setWon(false);
        setMessage("");
    }

    function dropOnSlot(idx: number) {
        if (!dragging || won) return;
        const newSlots = [...slots];
        const newPool = [...pool];
        let word: string | null = null;
        if (dragging.from === "pool") { word = newPool[dragging.idx]; if (!word) return; newPool[dragging.idx] = null; }
        else { word = newSlots[dragging.idx]; if (!word) return; newSlots[dragging.idx] = null; }
        const displaced = newSlots[idx];
        newSlots[idx] = word;
        if (displaced) { const ei = newPool.findIndex(x => x === null); if (ei !== -1) newPool[ei] = displaced; else newPool.push(displaced); }
        setSlots(newSlots); setPool(newPool);
        checkWin(newSlots); setDragging(null);
    }

    function dropOnPool() {
        if (!dragging || dragging.from !== "slot" || won) return;
        const word = slots[dragging.idx];
        if (!word) return;
        const newSlots = [...slots];
        newSlots[dragging.idx] = null;
        const newPool = [...pool];
        const ei = newPool.findIndex(x => x === null);
        if (ei !== -1) newPool[ei] = word; else newPool.push(word);
        setSlots(newSlots); setPool(newPool); setDragging(null);
    }

    function checkWin(s: (string | null)[]) {
        if (s.some(w => w === null)) return;
        const isCorrect = s.every((word, index) => word === target[index]);
        if (isCorrect) { setWon(true); setMessage("🎉 آفرین! جمله کامل شد!"); }
        else { setMessage("❌ ترتیب اشتباه است! دوباره امتحان کن."); setTimeout(() => setMessage(""), 2000); }
    }

    const inGame = target.length > 0;

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 shadow-md shadow-violet-100/50">
                    <MdSortByAlpha size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">مرتب‌سازی جمله</h2>
                    <p className="text-slate-400 text-sm">چیدمان کلمات و ساخت جمله</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(139,92,246,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-50/40 blur-2xl"/>

                <div className="relative flex flex-col items-center gap-5 p-6 md:p-10">
                    {activeSetTitle && (
                        <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold text-violet-600">
                            <HiSparkles size={14}/> مجموعه: {activeSetTitle}
                        </span>
                    )}

                    <div className="flex gap-3 flex-wrap justify-center" dir="ltr">
                        <button onClick={openModal} className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-purple-200/50">
                            <FiFolder size={16}/> مجموعه‌ها
                        </button>
                        <button onClick={startGame} className="px-5 py-3 rounded-2xl bg-gradient-to-l from-violet-500 to-purple-500 text-white text-sm font-bold transition-all shadow-md shadow-violet-200/50 fn-btn-press">
                            شروع بازی
                        </button>
                    </div>

                    {message && (
                        <div className={`rounded-2xl px-6 py-3 text-base font-bold fn-fade-up ${won ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                            {message}
                        </div>
                    )}

                    {!inGame && !message && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-400 fn-float-slow">
                                <MdSortByAlpha size={32}/>
                            </div>
                            <p className="text-slate-400 text-sm text-center max-w-xs">یک مجموعه جملات انتخاب کنید و روی «شروع بازی» کلیک کنید</p>
                        </div>
                    )}

                    {inGame && (
                        <>
                            <p className="text-slate-400 text-sm text-center">کلمات را از چپ به راست مرتب کنید تا جمله صحیح ساخته شود</p>

                            {/* Slots */}
                            <div className="flex flex-wrap gap-2 justify-center max-w-2xl w-full" dir="ltr">
                                {slots.map((word, i) => (
                                    <div
                                        key={i}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={() => dropOnSlot(i)}
                                        draggable={!!word && !won}
                                        onDragStart={() => word && !won && setDragging({ from: "slot", idx: i })}
                                        onDragEnd={() => setDragging(null)}
                                        className={`min-w-[5rem] h-14 px-4 flex items-center justify-center rounded-2xl border-2 text-base font-bold transition-all
                                            ${won ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-200/50" :
                                            word ? "bg-blue-100 border-blue-300 text-blue-700 cursor-grab shadow-sm" :
                                            "bg-violet-50/30 border-violet-200 border-dashed text-slate-300"}`}
                                    >
                                        {word || "___"}
                                    </div>
                                ))}
                            </div>

                            {/* Pool */}
                            <div
                                className="flex flex-wrap gap-2 justify-start max-w-2xl w-full p-4 bg-blue-50/30 rounded-2xl border border-blue-100 min-h-[4rem]"
                                style={{ direction: "ltr" }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={dropOnPool}
                            >
                                {pool.map((word, idx) =>
                                    word ? (
                                        <div
                                            key={idx}
                                            draggable={!won}
                                            onDragStart={() => !won && setDragging({ from: "pool", idx })}
                                            onDragEnd={() => setDragging(null)}
                                            className="min-w-[5rem] h-14 px-4 flex items-center justify-center bg-blue-500 text-white border border-blue-400 rounded-2xl text-base font-bold cursor-grab shadow-md shadow-blue-200/50"
                                        >
                                            {word}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh] shadow-2xl border border-violet-50"
                        onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مدیریت مجموعه‌ها</h2>
                                </div>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="عنوان مجموعه (مثلاً: زمان حال)"
                                    className="rounded-2xl border-2 border-violet-100 bg-violet-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-violet-400 transition-colors shrink-0"
                                />

                                <div className="flex gap-2 shrink-0">
                                    <input
                                        value={modalInput}
                                        onChange={e => setModalInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && addModalSentence()}
                                        placeholder="یک جمله بنویس..."
                                        className="flex-1 rounded-2xl border-2 border-blue-100 bg-blue-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-blue-400 transition-colors min-w-0"
                                    />
                                    <button onClick={addModalSentence} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-sm shrink-0 flex items-center transition-colors">
                                        <FiPlus size={18}/>
                                    </button>
                                </div>

                                {message && !inGame && (
                                    <div className="text-red-500 text-sm shrink-0">{message}</div>
                                )}

                                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                                    {modalSentences.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-4">هنوز جمله‌ای اضافه نشده</div>
                                    ) : (
                                        modalSentences.map((item, i) => (
                                            <div key={i} className="bg-slate-50 rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 border border-slate-100">
                                                <span className="text-slate-400 shrink-0">{i + 1}.</span>
                                                <span className="flex-1 truncate text-[#1a2151] text-left">{item}</span>
                                                <button onClick={() => removeModalSentence(i)} className="text-red-400 hover:text-red-500 shrink-0">
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
                                    <button
                                        onClick={saveCurrentSet}
                                        disabled={modalTitle.trim() === "" || modalSentences.length === 0}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${modalTitle.trim() === "" || modalSentences.length === 0 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
                                    >
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
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
                                                className="rounded-2xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-violet-50 transition-colors flex items-center justify-between group border border-slate-100 hover:border-violet-200">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate">{set.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">
                                                        {set.sentences.length} جمله • {new Date(set.createdAt).toLocaleDateString("fa-IR")}
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
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-xl text-sm font-bold text-white transition-colors">
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
