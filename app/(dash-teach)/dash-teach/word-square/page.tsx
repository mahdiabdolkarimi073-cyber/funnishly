"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { MdGridOn } from "react-icons/md";
import { loadGameData, saveGameData } from "@/backend/actions/game/gameData.action";

interface Word { id: string; text: string }
interface SavedSet {
    id: string;
    title: string;
    words: Word[];
    gridSize: number;
    createdAt: number;
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function WordSquare() {
    const [words, setWords] = useState<Word[]>([]);
    const [activeSetTitle, setActiveSetTitle] = useState<string>("");
    const [gameWords, setGameWords] = useState<string[]>([]);
    const [grid, setGrid] = useState<(string | null)[][]>([]);
    const [hints, setHints] = useState<boolean[][]>([]);
    const [pool, setPool] = useState<(string | null)[]>([]);
    const [completed, setCompleted] = useState<boolean[]>([]);
    const [won, setWon] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [input, setInput] = useState("");
    const [gridSize, setGridSize] = useState(3);
    const [dragging, setDragging] = useState<
        { from: "pool"; idx: number } | { from: "grid"; row: number; col: number } | null
    >(null);
    const [showSizeModal, setShowSizeModal] = useState(false);

    const [modalTitle, setModalTitle] = useState("");
    const [modalWords, setModalWords] = useState<Word[]>([]);
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("WORD_SQUARE").then((data) => {
            if (data && data.sets) setSavedSets(data.sets);
        });
    }, []);

    const persistSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("WORD_SQUARE", { sets });
    };

    const openModal = () => {
        setModalTitle(""); setModalWords([]); setInput("");
        setShowModal(true); setShowSavedSets(false);
    };

    const addModalWord = () => {
        const t = input.trim();
        if (t.length !== gridSize) return alert(`Word must be exactly ${gridSize} letters`);
        if (modalWords.some(w => w.text === t)) return alert("This word already exists");
        setModalWords([...modalWords, { id: crypto.randomUUID(), text: t }]);
        setInput("");
    };

    const removeModalWord = (id: string) => setModalWords(modalWords.filter(w => w.id !== id));

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalWords.length < 3) return alert("Minimum 3 words required");
        persistSets([...savedSets, { id: Date.now().toString(), title: modalTitle.trim(), words: [...modalWords], gridSize, createdAt: Date.now() }]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setWords(set.words); setGridSize(set.gridSize); setActiveSetTitle(set.title);
        setShowSavedSets(false); setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        persistSets(savedSets.filter(s => s.id !== id));
    };

    function startGame() {
        const filteredWords = words.filter(w => w.text.length === gridSize);
        if (filteredWords.length < 3) return alert(`Minimum 3 words required with ${gridSize} letters`);
        const selected = shuffle(filteredWords).slice(0, 3).map(w => w.text);
        setGameWords(selected);

        const newGrid: (string | null)[][] = [];
        const newHints: boolean[][] = [];
        const poolLetters: string[] = [];

        selected.forEach(word => {
            const hintCount = Math.floor(gridSize / 2);
            const hintPositions = new Set(shuffle([...Array(gridSize).keys()]).slice(0, hintCount));
            const row: (string | null)[] = [];
            const hintRow: boolean[] = [];
            word.split("").forEach((ch, i) => {
                if (hintPositions.has(i)) { row.push(ch); hintRow.push(true); }
                else { row.push(null); hintRow.push(false); poolLetters.push(ch); }
            });
            newGrid.push(row);
            newHints.push(hintRow);
        });

        setGrid(newGrid); setHints(newHints);
        setPool(shuffle(poolLetters));
        setCompleted([false, false, false]);
        setWon(false);
    }

    function dropOnCell(row: number, col: number) {
        if (!dragging || hints[row]?.[col]) return;
        const newGrid = grid.map(r => [...r]);
        const newPool = [...pool];
        let letter: string | null = null;
        if (dragging.from === "pool") letter = newPool[dragging.idx];
        else letter = newGrid[dragging.row][dragging.col];
        if (!letter) return;

        const displaced = newGrid[row][col];
        newGrid[row][col] = letter;
        if (dragging.from === "pool") { newPool[dragging.idx] = null; }
        else { newGrid[dragging.row][dragging.col] = null; }
        if (displaced) { const ei = newPool.findIndex(x => x === null); if (ei !== -1) newPool[ei] = displaced; else newPool.push(displaced); }

        setGrid(newGrid); setPool(newPool);
        checkWin(newGrid); setDragging(null);
    }

    function dropOnPool() {
        if (!dragging || dragging.from !== "grid") return;
        if (hints[dragging.row]?.[dragging.col]) return;
        const letter = grid[dragging.row][dragging.col];
        if (!letter) return;
        const newGrid = grid.map(r => [...r]);
        newGrid[dragging.row][dragging.col] = null;
        const newPool = [...pool];
        const ei = newPool.findIndex(x => x === null);
        if (ei !== -1) newPool[ei] = letter; else newPool.push(letter);
        setGrid(newGrid); setPool(newPool);
        checkWin(newGrid); setDragging(null);
    }

    function checkWin(g: (string | null)[][]) {
        const nc = gameWords.map((word, r) => word.split("").every((ch, c) => g[r][c] === ch));
        setCompleted(nc);
        if (nc.every(Boolean)) setWon(true);
    }

    const inGame = gameWords.length > 0;

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-md shadow-emerald-100/50">
                    <MdGridOn size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">مربع کلمات</h2>
                    <p className="text-slate-400 text-sm">پیدا کردن کلمات در شبکه حروف</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(16,185,129,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-50/40 blur-2xl"/>

                <div className="relative flex flex-col items-center gap-5 p-6 md:p-10">
                    {activeSetTitle && (
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-600">
                            <HiSparkles size={14}/> مجموعه: {activeSetTitle}
                        </span>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 flex-wrap justify-center" dir="ltr">
                        <button onClick={openModal} className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-purple-200/50">
                            <FiFolder size={16}/> مجموعه‌ها ({savedSets.length})
                        </button>
                        <button onClick={startGame} className="px-5 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-blue-500 text-white text-sm font-bold transition-all shadow-md shadow-emerald-200/50 fn-btn-press">
                            شروع بازی
                        </button>
                        <button onClick={() => setShowSizeModal(true)} className="px-5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors border border-slate-200">
                            اندازه: {gridSize}×{gridSize}
                        </button>
                    </div>

                    {won && (
                        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-6 py-3 fn-fade-up">
                            <span className="text-emerald-600 font-black text-xl">🎉 آفرین! همه کلمات کامل شدند!</span>
                        </div>
                    )}

                    {!inGame && !won && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-400 fn-float-slow">
                                <MdGridOn size={32}/>
                            </div>
                            <p className="text-slate-400 text-sm text-center max-w-xs">یک مجموعه کلمات انتخاب کنید و روی «شروع بازی» کلیک کنید</p>
                        </div>
                    )}

                    {inGame && (
                        <>
                            <p className="text-slate-400 text-sm text-center">هر ردیف را از چپ به راست مرتب کنید تا کلمه صحیح ساخته شود</p>

                            {/* Grid */}
                            <div
                                className="grid gap-1.5 p-3 bg-emerald-50/30 rounded-2xl border-2 border-emerald-100 w-full max-w-[90vw] sm:max-w-xs"
                                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, direction: "ltr" }}
                            >
                                {grid.map((row, r) =>
                                    row.map((cell, c) => (
                                        <div
                                            key={`${r}-${c}`}
                                            onDragOver={e => e.preventDefault()}
                                            onDrop={() => dropOnCell(r, c)}
                                            draggable={!!cell && !hints[r][c]}
                                            onDragStart={() => cell && !hints[r][c] && setDragging({ from: "grid", row: r, col: c })}
                                            onDragEnd={() => setDragging(null)}
                                            className={`aspect-square w-full flex items-center justify-center text-lg sm:text-xl font-black rounded-xl border-2 transition-all
                                                ${completed[r] ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-200/50" :
                                                hints[r][c] ? "bg-amber-100 border-amber-300 text-amber-700 cursor-default" :
                                                cell ? "bg-blue-100 border-blue-300 text-blue-700 cursor-grab shadow-sm" :
                                                "bg-white border-emerald-200 border-dashed text-slate-300"}`}
                                            style={{ direction: "ltr" }}
                                        >
                                            {cell || "·"}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pool */}
                            <div
                                className="flex flex-wrap gap-2 justify-start max-w-xs p-3 bg-blue-50/30 rounded-2xl border border-blue-100 min-h-[4rem]"
                                style={{ direction: "ltr" }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={dropOnPool}
                            >
                                {pool.map((letter, idx) =>
                                    letter ? (
                                        <div
                                            key={idx}
                                            draggable
                                            onDragStart={() => setDragging({ from: "pool", idx })}
                                            onDragEnd={() => setDragging(null)}
                                            className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white border border-blue-400 rounded-xl text-lg font-black cursor-grab shadow-md shadow-blue-200/50"
                                        >
                                            {letter}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Size Selection Modal */}
            {showSizeModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowSizeModal(false)}>
                    <div className="bg-white rounded-[24px] p-6 w-80 flex flex-col gap-4 shadow-2xl border border-emerald-50" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-black text-[#1a2151]">انتخاب اندازه شبکه</h2>
                        <div className="flex flex-col gap-2">
                            {[3, 4, 5, 6, 7, 8].map(size => {
                                const count = words.filter(w => w.text.length === size).length;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => { setGridSize(size); setShowSizeModal(false); }}
                                        className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all flex justify-between items-center
                                            ${gridSize === size ? 'bg-emerald-500 text-white border-2 border-emerald-400' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'}`}
                                    >
                                        <span>{size}×{size}</span>
                                        <span className={`text-xs ${gridSize === size ? 'text-emerald-100' : 'text-slate-400'}`}>{count} کلمه</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowSizeModal(false)} className="py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-500 transition-colors border border-slate-100">
                            بستن
                        </button>
                    </div>
                </div>
            )}

            {/* Set Management Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh] shadow-2xl border border-emerald-50"
                        onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مدیریت مجموعه‌ها</h2>
                                </div>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="عنوان مجموعه (مثلاً: حیوانات ۳ حرفی)"
                                    className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-emerald-400 transition-colors shrink-0"
                                />

                                <div className="text-sm text-slate-400 shrink-0">
                                    اندازه شبکه: {gridSize}×{gridSize} • {modalWords.filter(w => w.text.length === gridSize).length} کلمه
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && addModalWord()}
                                        placeholder={`کلمه ${gridSize} حرفی...`}
                                        className="flex-1 rounded-2xl border-2 border-blue-100 bg-blue-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-blue-400 transition-colors"
                                    />
                                    <button onClick={addModalWord} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-sm flex items-center transition-colors">
                                        <FiPlus size={16}/>
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                                    {modalWords.filter(w => w.text.length === gridSize).length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-4">هنوز کلمه‌ای اضافه نشده</div>
                                    ) : (
                                        modalWords.filter(w => w.text.length === gridSize).map(w => (
                                            <div key={w.id} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5 text-sm border border-slate-100">
                                                <span className="text-[#1a2151] font-bold">{w.text}</span>
                                                <button onClick={() => removeModalWord(w.id)} className="text-red-400 hover:text-red-500">
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
                                        disabled={modalTitle.trim() === "" || modalWords.length < 3}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${modalTitle.trim() === "" || modalWords.length < 3 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
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
                                            <div key={set.id} onClick={() => loadSet(set)}
                                                className="rounded-2xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors flex items-center justify-between group border border-slate-100 hover:border-emerald-200">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate">{set.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">
                                                        {set.words.length} کلمه • {set.gridSize}×{set.gridSize} • {new Date(set.createdAt).toLocaleDateString("fa-IR")}
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
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-bold text-white transition-colors">
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
