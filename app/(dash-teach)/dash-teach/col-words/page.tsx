"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
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

    // modal state
    const [modalTitle, setModalTitle] = useState("");
    const [modalPairs, setModalPairs] = useState<Pair[]>([]);
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("WORD_MATCH").then((data) => {
            if (data && data.sets) {
                setSavedSets(data.sets);
            }
        });
    }, []);

    const persistSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("WORD_MATCH", { sets });
    };

    const openModal = () => {
        setModalTitle("");
        setModalPairs([]);
        setLeftA("");
        setRightA("");
        setShowModal(true);
        setShowSavedSets(false);
    };

    const addModalPair = () => {
        if (!leftA.trim() || !rightA.trim()) return;
        if (modalPairs.length >= 6) return alert("Maximum 6 pairs per set");
        setModalPairs([...modalPairs, { id: crypto.randomUUID(), left: leftA.trim(), right: rightA.trim() }]);
        setLeftA("");
        setRightA("");
    };

    const removeModalPair = (id: string) => {
        setModalPairs(modalPairs.filter(p => p.id !== id));
    };

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalPairs.length < 5) return alert("Minimum 5 pairs required");
        const newSet: SavedSet = {
            id: Date.now().toString(),
            title: modalTitle.trim(),
            pairs: [...modalPairs],
            createdAt: Date.now(),
        };
        persistSets([...savedSets, newSet]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setActivePairs(set.pairs);
        setActiveSetTitle(set.title);
        setShowSavedSets(false);
        setShowModal(false);
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
        if (matched.has(id)) return "bg-emerald-600 border-emerald-400 text-white cursor-default";
        if (wrong?.includes(word)) return "bg-red-600 border-red-400 text-white";
        if (selected?.word === word) return "bg-indigo-500 border-indigo-300 text-white scale-105";
        return "bg-gray-700 border-gray-500 hover:bg-gray-600 cursor-pointer";
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-3xl font-bold">Word Match</h1>

            {activeSetTitle && (
                <div className="text-sm text-sky-400 font-medium">
                    Active set: {activeSetTitle} ({activePairs.length} pairs)
                </div>
            )}

            <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={openModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm flex items-center gap-2">
                    <FiFolder size={16} />
                    Manage Sets ({savedSets.length})
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
            </div>

            {won && <div className="text-2xl font-bold text-emerald-400 animate-bounce">🎉 Congratulations! All pairs matched!</div>}

            {leftCol.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center sm:items-start">
                    <div className="flex flex-col gap-3">
                        {leftCol.map(word => (
                            <div key={word} onClick={() => handleSelect("left", word)}
                                 className={`px-6 py-3 rounded-xl border-2 text-center font-bold transition-all select-none min-w-[100px] ${wordStyle(word)}`}>
                                {word}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        {rightCol.map(word => (
                            <div key={word} onClick={() => handleSelect("right", word)}
                                 className={`px-6 py-3 rounded-xl border-2 text-center font-bold transition-all select-none min-w-[100px] ${wordStyle(word)}`}>
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                     onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 max-h-[80vh]"
                         onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <h2 className="text-xl font-bold shrink-0">Manage Sets</h2>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="Set title (e.g., Animals)"
                                    className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none shrink-0"
                                />

                                <div className="flex gap-2 shrink-0">
                                    <input value={leftA} onChange={e => setLeftA(e.target.value)}
                                           placeholder="Left word" className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none min-w-0" />
                                    <input value={rightA} onChange={e => setRightA(e.target.value)}
                                           placeholder="Right word" onKeyDown={e => e.key === "Enter" && addModalPair()}
                                           className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none min-w-0" />
                                    <button onClick={addModalPair} disabled={modalPairs.length >= 6}
                                            className="px-3 py-2 bg-indigo-600 rounded-lg text-sm disabled:opacity-40 shrink-0 flex items-center">
                                        <FiPlus size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
                                    {modalPairs.length === 0 ? (
                                        <div className="text-gray-500 text-sm text-center py-4">
                                            No pairs added yet (min 5 needed)
                                        </div>
                                    ) : (
                                        modalPairs.map(p => (
                                            <div key={p.id} className="flex items-center bg-gray-800 rounded-lg px-3 py-2 text-sm gap-2">
                                                <span className="text-indigo-300 flex-1 truncate text-left">{p.left}</span>
                                                <span className="text-gray-500 shrink-0">↔</span>
                                                <span className="text-emerald-300 flex-1 truncate text-left">{p.right}</span>
                                                <button onClick={() => removeModalPair(p.id)} className="text-red-400 shrink-0 ml-1">
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setShowSavedSets(true)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                                        Saved Sets
                                    </button>
                                    <button onClick={saveCurrentSet}
                                            disabled={modalTitle.trim() === "" || modalPairs.length < 5}
                                            className={`flex-1 py-2 rounded-lg text-sm ${modalTitle.trim() === "" || modalPairs.length < 5 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"}`}>
                                        Save Set
                                    </button>
                                </div>
                                <button onClick={() => setShowModal(false)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm shrink-0">
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold shrink-0">Saved Sets</h2>

                                <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                    {savedSets.length === 0 ? (
                                        <div className="text-gray-500 text-sm text-center py-8">
                                            No sets saved yet
                                        </div>
                                    ) : (
                                        savedSets.map((set) => (
                                            <div key={set.id} onClick={() => loadSet(set)}
                                                className="bg-gray-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-between group">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{set.title}</div>
                                                    <div className="text-gray-400 text-xs">
                                                        {set.pairs.length} pairs • {new Date(set.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <button onClick={(e) => deleteSet(set.id, e)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                                        Back
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                                        Close
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
