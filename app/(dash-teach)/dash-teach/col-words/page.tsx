"use client";
import { useState, useEffect } from "react";

interface Pair { id: string; left: string; right: string }
const KEY = "word_match";
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

// Random English words as decoys
const DECOYS = ["water","air","book","table","door","window","flower","moon","star","wind","fire","snow","cloud","sun","tree","fish"];

export default function WordMatch() {
    const [pairs, setPairs] = useState<Pair[]>([]);
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

    useEffect(() => {
        const s = localStorage.getItem(KEY);
        if (s) setPairs(JSON.parse(s));
    }, []);

    function save(p: Pair[]) { setPairs(p); localStorage.setItem(KEY, JSON.stringify(p)); }

    function addPair() {
        if (!leftA.trim() || !rightA.trim()) return;
        if (pairs.length >= 6) return alert("Maximum 6 pairs allowed");
        save([...pairs, { id: crypto.randomUUID(), left: leftA.trim(), right: rightA.trim() }]);
        setLeftA(""); setRightA("");
    }

    function startGame() {
        if (pairs.length < 5) return alert("Minimum 5 pairs required");
        // Exactly 5 pairs selected
        const picked = shuffle(pairs).slice(0, 5);
        const map: Record<string, string> = {};
        picked.forEach(p => { map[p.left] = p.id; map[p.right] = p.id; });

        // A decoy word not in the pairs
        const usedWords = new Set([...picked.map(p => p.left), ...picked.map(p => p.right)]);
        const decoy = DECOYS.find(d => !usedWords.has(d)) ?? "cloud";
        // Decoy has a special ID - won't match with anything
        map[decoy] = "decoy_" + decoy;

        setAnswerMap(map);
        setLeftCol(shuffle(picked.map(p => p.left)));           // 5 items
        setRightCol(shuffle([...picked.map(p => p.right), decoy])); // 6 items
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
            // Win = all 5 pairs matched
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

            <div className="flex gap-3">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                    Manage Pairs ({pairs.length}/6)
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
            </div>

            {won && <div className="text-2xl font-bold text-emerald-400 animate-bounce">🎉 Congratulations! All pairs matched!</div>}

            {leftCol.length > 0 && (
                <div className="flex gap-12 items-start">
                    {/* Left column - 5 items */}
                    <div className="flex flex-col gap-3">
                        {leftCol.map(word => (
                            <div key={word} onClick={() => handleSelect("left", word)}
                                 className={`px-6 py-3 rounded-xl border-2 text-center font-bold transition-all select-none min-w-[100px] ${wordStyle(word)}`}>
                                {word}
                            </div>
                        ))}
                    </div>

                    {/* Right column - 6 items */}
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
                     onClick={() => setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 max-h-[80vh]"
                         onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold shrink-0">Manage Pairs</h2>

                        <div className="flex gap-2 shrink-0">
                            <input value={leftA} onChange={e => setLeftA(e.target.value)}
                                   placeholder="Left word" className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none min-w-0" />
                            <input value={rightA} onChange={e => setRightA(e.target.value)}
                                   placeholder="Right word" onKeyDown={e => e.key === "Enter" && addPair()}
                                   className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none min-w-0" />
                            <button onClick={addPair} disabled={pairs.length >= 6}
                                    className="px-3 py-2 bg-indigo-600 rounded-lg text-sm disabled:opacity-40 shrink-0">+</button>
                        </div>

                        <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                            {pairs.map(p => (
                                <div key={p.id} className="flex items-center bg-gray-800 rounded-lg px-3 py-2 text-sm gap-2">
                                    <span className="text-indigo-300 flex-1 truncate text-left">{p.left}</span>
                                    <span className="text-gray-500 shrink-0">↔</span>
                                    <span className="text-emerald-300 flex-1 truncate text-left">{p.right}</span>
                                    <button onClick={() => save(pairs.filter(x => x.id !== p.id))}
                                            className="text-red-400 shrink-0 ml-1">✕</button>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowModal(false)}
                                className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm shrink-0">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}