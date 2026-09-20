"use client";
import { useState, useEffect } from "react";

interface Word { id: string; text: string }
const KEY = "wordsquare_words";
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function WordSquare() {
    const [words, setWords] = useState<Word[]>([]);
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

    useEffect(() => {
        const s = localStorage.getItem(KEY);
        if (s) setWords(JSON.parse(s));
    }, []);

    function save(w: Word[]) { setWords(w); localStorage.setItem(KEY, JSON.stringify(w)); }

    function addWord() {
        const t = input.trim();
        if (t.length !== gridSize) return alert(`Word must be exactly ${gridSize} letters`);
        if (words.some(w => w.text === t)) return alert("This word already exists");
        save([...words, { id: crypto.randomUUID(), text: t }]);
        setInput("");
    }

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

        setGrid(newGrid);
        setHints(newHints);
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

        if (dragging.from === "pool") {
            newPool[dragging.idx] = null;
        } else {
            newGrid[dragging.row][dragging.col] = null;
        }

        if (displaced) {
            const ei = newPool.findIndex(x => x === null);
            if (ei !== -1) newPool[ei] = displaced; else newPool.push(displaced);
        }

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
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-4" dir="ltr">
            <h1 className="text-3xl font-bold">Word Square</h1>

            <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                    Manage Words ({words.filter(w => w.text.length === gridSize).length})
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
                <button onClick={() => setShowSizeModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm">
                    Grid Size: {gridSize}x{gridSize}
                </button>
            </div>

            {won && <div className="text-2xl font-bold text-emerald-400 animate-bounce">🎉 Congratulations! All words complete!</div>}

            {inGame && (
                <>
                    {/* Show word hints */}
                    <div className="text-sm text-gray-400 text-center">
                        Arrange each row from LEFT to RIGHT to form the correct words
                    </div>

                    {/* Dynamic Grid - LTR */}
                    <div 
                        className="grid gap-1 p-2 bg-gray-900 rounded-2xl border-2 border-gray-700 w-full max-w-[90vw] sm:max-w-xs"
                        style={{ 
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            direction: "ltr"
                        }}
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
                                    className={`aspect-square w-full flex items-center justify-center text-lg sm:text-xl font-bold rounded-xl border-2 transition-all
                                        ${completed[r] ? "bg-emerald-600 border-emerald-400" :
                                        hints[r][c] ? "bg-amber-800 border-amber-600 cursor-default" :
                                        cell ? "bg-gray-700 border-gray-500 cursor-grab" :
                                        "bg-gray-900 border-gray-700 border-dashed"}`}
                                    style={{ 
                                        direction: "ltr"
                                    }}
                                >
                                    {cell || "·"}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Shared Pool - LTR */}
                    <div
                        className="flex flex-wrap gap-2 justify-start max-w-xs p-3 bg-gray-800 rounded-xl border border-gray-600 min-h-[4rem]"
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
                                    className="w-12 h-12 flex items-center justify-center bg-indigo-700 border border-indigo-500 rounded-lg text-lg font-bold cursor-grab"
                                >
                                    {letter}
                                </div>
                            ) : null
                        )}
                    </div>
                </>
            )}

            {/* Size Selection Modal */}
            {showSizeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSizeModal(false)}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-80 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold">Select Grid Size</h2>
                        <div className="flex flex-col gap-2">
                            {[3, 4, 5, 6, 7, 8].map(size => {
                                const count = words.filter(w => w.text.length === size).length;
                                return (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setGridSize(size);
                                            setShowSizeModal(false);
                                        }}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center
                                            ${gridSize === size ? 'bg-indigo-600 border-2 border-indigo-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                                    >
                                        <span>{size}x{size}</span>
                                        <span className="text-xs text-gray-400">{count} words available</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowSizeModal(false)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Word Management Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-96 flex flex-col gap-4 max-h-[80vh]" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold">Manage Words ({gridSize} letters)</h2>
                        
                        <div className="text-sm text-gray-400">
                            Words: {words.filter(w => w.text.length === gridSize).length} / 
                            Available sizes: {[...new Set(words.map(w => w.text.length))].sort().join(', ')}
                        </div>
                        
                        <div className="flex gap-2">
                            <input 
                                value={input} 
                                onChange={e => setInput(e.target.value)} 
                                onKeyDown={e => e.key === "Enter" && addWord()}
                                placeholder={`${gridSize}-letter word...`} 
                                className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none" 
                            />
                            <button onClick={addWord} className="px-3 py-2 bg-indigo-600 rounded-lg text-sm">+</button>
                        </div>
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {words.filter(w => w.text.length === gridSize).map(w => (
                                <div key={w.id} className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2 text-sm">
                                    <span className="text-left">{w.text}</span>
                                    <button onClick={() => save(words.filter(x => x.id !== w.id))} className="text-red-400">✕</button>
                                </div>
                            ))}
                            {words.filter(w => w.text.length === gridSize).length === 0 && (
                                <div className="text-gray-500 text-sm text-center py-4">
                                    No {gridSize}-letter words added yet
                                </div>
                            )}
                        </div>
                        <button onClick={() => setShowModal(false)} className="py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}