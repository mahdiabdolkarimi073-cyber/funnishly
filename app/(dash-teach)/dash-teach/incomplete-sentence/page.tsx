"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
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

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalSentences, setModalSentences] = useState<string[]>([]);
    const [modalInput, setModalInput] = useState("");
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    useEffect(() => {
        loadGameData("SENTENCE_SCRAMBLE").then((data) => {
            if (data && data.sets) {
                setSavedSets(data.sets);
            }
        });
    }, []);

    const saveSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("SENTENCE_SCRAMBLE", { sets });
    };

    const openModal = () => {
        setModalTitle("");
        setModalSentences([]);
        setModalInput("");
        setShowModal(true);
        setShowSavedSets(false);
    };

    const addModalSentence = () => {
        const v = modalInput.trim();
        if (v.split(" ").length < 2) {
            setMessage("Minimum 2 words required");
            return;
        }
        if (v) {
            setModalSentences([...modalSentences, v]);
            setModalInput("");
            setMessage("");
        }
    };

    const removeModalSentence = (i: number) => {
        setModalSentences(modalSentences.filter((_, idx) => idx !== i));
    };

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalSentences.length === 0) return;
        const newSet: SavedSet = {
            id: Date.now().toString(),
            title: modalTitle.trim(),
            sentences: [...modalSentences],
            createdAt: Date.now(),
        };
        saveSets([...savedSets, newSet]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setActiveSentences(set.sentences);
        setActiveSetTitle(set.title);
        setMessage("");
        setShowSavedSets(false);
        setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveSets(savedSets.filter(s => s.id !== id));
    };

    function startGame() {
        if (activeSentences.length === 0) {
            setMessage("Please load a set first");
            return;
        }
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

        if (dragging.from === "pool") {
            word = newPool[dragging.idx];
            if (!word) return;
            newPool[dragging.idx] = null;
        } else {
            word = newSlots[dragging.idx];
            if (!word) return;
            newSlots[dragging.idx] = null;
        }

        const displaced = newSlots[idx];
        newSlots[idx] = word;

        if (displaced) {
            const emptyIndex = newPool.findIndex(x => x === null);
            if (emptyIndex !== -1) {
                newPool[emptyIndex] = displaced;
            } else {
                newPool.push(displaced);
            }
        }

        setSlots(newSlots);
        setPool(newPool);
        checkWin(newSlots);
        setDragging(null);
    }

    function dropOnPool() {
        if (!dragging || dragging.from !== "slot" || won) return;
        const word = slots[dragging.idx];
        if (!word) return;

        const newSlots = [...slots];
        newSlots[dragging.idx] = null;

        const newPool = [...pool];
        const emptyIndex = newPool.findIndex(x => x === null);
        if (emptyIndex !== -1) {
            newPool[emptyIndex] = word;
        } else {
            newPool.push(word);
        }

        setSlots(newSlots);
        setPool(newPool);
        setDragging(null);
    }

    function checkWin(s: (string | null)[]) {
        if (s.some(w => w === null)) return;

        const isCorrect = s.every((word, index) => word === target[index]);
        if (isCorrect) {
            setWon(true);
            setMessage("🎉 Congratulations! Sentence complete!");
        } else {
            setMessage("❌ Wrong order! Try again.");
            setTimeout(() => setMessage(""), 2000);
        }
    }

    const inGame = target.length > 0;

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-4" dir="ltr">
            <h1 className="text-2xl sm:text-3xl font-bold">Sentence Scramble</h1>

            {activeSetTitle && (
                <div className="text-sm text-sky-400 font-medium">
                    Active set: {activeSetTitle} ({activeSentences.length} sentences)
                </div>
            )}

            <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={openModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm flex items-center gap-2">
                    <FiFolder size={16} />
                    Manage Sets
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
            </div>

            {message && (
                <div className={`text-base sm:text-xl font-bold ${won ? "text-emerald-400" : "text-red-400"}`}>
                    {message}
                </div>
            )}

            {inGame && (
                <>
                    <div className="text-sm text-gray-400">
                        Arrange the words from LEFT to RIGHT to form the correct sentence
                    </div>

                    {/* Slots - Left to Right */}
                    <div className="flex flex-wrap gap-2 justify-center max-w-2xl w-full">
                        {slots.map((word, i) => (
                            <div
                                key={i}
                                onDragOver={e => e.preventDefault()}
                                onDrop={() => dropOnSlot(i)}
                                draggable={!!word && !won}
                                onDragStart={() => word && !won && setDragging({ from: "slot", idx: i })}
                                onDragEnd={() => setDragging(null)}
                                className={`min-w-[4rem] h-12 px-3 flex items-center justify-center rounded-xl border-2 text-sm font-bold transition-all
                                    ${won ? "bg-emerald-600 border-emerald-400" :
                                    word ? "bg-gray-700 border-gray-500 cursor-grab" :
                                    "bg-gray-900 border-gray-700 border-dashed"}`}
                            >
                                {word || `___`}
                            </div>
                        ))}
                    </div>

                    {/* Pool */}
                    <div
                        className="flex flex-wrap gap-2 justify-start max-w-2xl w-full p-4 bg-gray-800 rounded-xl border border-gray-600 min-h-[4rem]"
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
                                    className="min-w-[4rem] h-12 px-3 flex items-center justify-center bg-indigo-700 border border-indigo-500 rounded-xl text-sm font-bold cursor-grab"
                                >
                                    {word}
                                </div>
                            ) : null
                        )}
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh]"
                        onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <h2 className="text-xl font-bold shrink-0">Manage Sets</h2>

                                {/* Title input */}
                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="Set title (e.g., Present Tense)"
                                    className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none shrink-0"
                                />

                                {/* Add sentences */}
                                <div className="flex gap-2 shrink-0">
                                    <input
                                        value={modalInput}
                                        onChange={e => setModalInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && addModalSentence()}
                                        placeholder="Write a sentence..."
                                        className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none flex-1 min-w-0"
                                    />
                                    <button
                                        onClick={addModalSentence}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm shrink-0"
                                    >
                                        <FiPlus size={18} />
                                    </button>
                                </div>

                                {message && !inGame && (
                                    <div className="text-red-400 text-sm shrink-0">{message}</div>
                                )}

                                {/* Modal sentences list */}
                                <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
                                    {modalSentences.length === 0 ? (
                                        <div className="text-gray-500 text-sm text-center py-4">
                                            No sentences added yet
                                        </div>
                                    ) : (
                                        modalSentences.map((item, i) => (
                                            <div key={i} className="bg-gray-800 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                                                <span className="text-gray-400 shrink-0">{i + 1}.</span>
                                                <span className="flex-1 truncate text-left">{item}</span>
                                                <button
                                                    onClick={() => removeModalSentence(i)}
                                                    className="text-red-400 hover:text-red-300 shrink-0"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setShowSavedSets(true)}
                                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                                    >
                                        Saved Sets
                                    </button>
                                    <button
                                        onClick={saveCurrentSet}
                                        disabled={modalTitle.trim() === "" || modalSentences.length === 0}
                                        className={`flex-1 py-2 rounded-lg text-sm ${modalTitle.trim() === "" || modalSentences.length === 0
                                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                                : "bg-emerald-600 hover:bg-emerald-500"
                                            }`}
                                    >
                                        Save Set
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm shrink-0"
                                >
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
                                            <div
                                                key={set.id}
                                                onClick={() => loadSet(set)}
                                                className="bg-gray-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors flex items-center justify-between group"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{set.title}</div>
                                                    <div className="text-gray-400 text-xs">
                                                        {set.sentences.length} sentences • {new Date(set.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => deleteSet(set.id, e)}
                                                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setShowSavedSets(false)}
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                                    >
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
