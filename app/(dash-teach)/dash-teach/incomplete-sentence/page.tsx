"use client";
import { useState, useEffect } from "react";

interface Sentence { id: string; text: string }
const KEY = "sentence_scramble";
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function SentenceScramble() {
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [slots, setSlots] = useState<(string | null)[]>([]);
    const [pool, setPool] = useState<(string | null)[]>([]);
    const [target, setTarget] = useState<string[]>([]);
    const [won, setWon] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [input, setInput] = useState("");
    const [dragging, setDragging] = useState<
        { from: "pool"; idx: number } | { from: "slot"; idx: number } | null
    >(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const s = localStorage.getItem(KEY);
        if (s) setSentences(JSON.parse(s));
    }, []);

    function save(s: Sentence[]) { setSentences(s); localStorage.setItem(KEY, JSON.stringify(s)); }

    function addSentence() {
        const t = input.trim();
        if (t.split(" ").length < 2) return setMessage("Minimum 2 words required");
        save([...sentences, { id: crypto.randomUUID(), text: t }]);
        setInput("");
        setMessage("");
    }

    function startGame() {
        if (sentences.length === 0) return setMessage("No sentences saved");
        const picked = sentences[Math.floor(Math.random() * sentences.length)];
        const words = picked.text.split(" ");
        
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
            <h1 className="text-3xl font-bold">Sentence Scramble</h1>

            <div className="flex gap-3">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                    Manage Sentences ({sentences.length})
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
            </div>

            {message && (
                <div className={`text-xl font-bold ${won ? "text-emerald-400" : "text-red-400"}`}>
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

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-96 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold">Manage Sentences</h2>
                        <div className="flex gap-2">
                            <input 
                                value={input} 
                                onChange={e => setInput(e.target.value)} 
                                onKeyDown={e => e.key === "Enter" && addSentence()}
                                placeholder="Write a sentence..." 
                                className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none" 
                            />
                            <button onClick={addSentence} className="px-3 py-2 bg-indigo-600 rounded-lg text-sm">+</button>
                        </div>
                        {message && !inGame && (
                            <div className="text-red-400 text-sm">{message}</div>
                        )}
                        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                            {sentences.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2 text-sm gap-2">
                                    <span className="flex-1 text-left">{s.text}</span>
                                    <button onClick={() => save(sentences.filter(x => x.id !== s.id))} className="text-red-400 shrink-0">✕</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowModal(false)} className="py-2 bg-gray-700 rounded-lg text-sm">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}