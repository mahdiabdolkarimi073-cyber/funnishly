"use client";

import { useState, useRef, useEffect } from "react";
import { FiRotateCcw, FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";

const COLORS = [
    "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71",
    "#1abc9c", "#3498db", "#9b59b6", "#e91e63",
    "#00b894", "#fd79a8", "#6c5ce7", "#00cec9",
    "#fdcb6e", "#e17055", "#0984e3", "#a29bfe"
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

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalItems, setModalItems] = useState<string[]>([]);
    const [modalInput, setModalInput] = useState("");
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);

    // Load saved sets from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("spinWheelSets");
        if (saved) {
            try {
                setSavedSets(JSON.parse(saved));
            } catch (e) {
                console.error("Error loading saved sets:", e);
            }
        }
    }, []);

    // Save to localStorage
    const saveSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        localStorage.setItem("spinWheelSets", JSON.stringify(sets));
    };

    const addItem = () => {
        const v = input.trim();
        if (v) {
            setItems([...items, v]);
            setInput("");
        }
    };

    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

    const reset = () => {
        setItems([]);
        setWinner(null);
        setRotation(0);
        currentRotation.current = 0;
    };

    const spin = () => {
        if (spinning || items.length < 2) return;
        setSpinning(true);
        setWinner(null);

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

    // Modal functions
    const openModal = () => {
        setModalTitle("");
        setModalItems([]);
        setModalInput("");
        setShowModal(true);
        setShowSavedSets(false);
    };

    const addModalItem = () => {
        const v = modalInput.trim();
        if (v) {
            setModalItems([...modalItems, v]);
            setModalInput("");
        }
    };

    const removeModalItem = (i: number) => {
        setModalItems(modalItems.filter((_, idx) => idx !== i));
    };

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalItems.length === 0) return;

        const newSet: SavedSet = {
            id: Date.now().toString(),
            title: modalTitle.trim(),
            items: [...modalItems],
            createdAt: Date.now()
        };

        saveSets([...savedSets, newSet]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setItems(set.items);
        setWinner(null);
        setRotation(0);
        currentRotation.current = 0;
        setShowSavedSets(false);
        setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveSets(savedSets.filter(s => s.id !== id));
    };

    const cx = 200, cy = 200, r = 180;
    const seg = items.length > 0 ? 360 / items.length : 360;

    return (
        <div style={{
            minHeight: "100vh", background: "#1a1a2e", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            fontFamily: "sans-serif", color: "#fff", padding: 24, gap: 32,
        }}>
            {/* Input */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addItem()}
                    placeholder="New option..."
                    style={{
                        padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none",
                        minWidth: 200
                    }}
                />
                <button onClick={addItem} style={{
                    padding: "10px 14px", borderRadius: 12, border: "none",
                    background: "#3498db", color: "#fff", cursor: "pointer", fontSize: 18,
                }}>
                    <FiPlus size={18} />
                </button>
                <button onClick={openModal} style={{
                    padding: "10px 14px", borderRadius: 12, border: "none",
                    background: "#6c5ce7", color: "#fff", cursor: "pointer", fontSize: 18,
                }}>
                    <FiFolder size={18} />
                </button>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 420, justifyContent: "center" }}>
                {items.map((item, i) => (
                    <span key={i} style={{
                        background: COLORS[i % COLORS.length] + "33",
                        border: `1px solid ${COLORS[i % COLORS.length]}`,
                        borderRadius: 20, padding: "4px 12px", fontSize: 13,
                        display: "flex", alignItems: "center", gap: 6,
                    }}>
                        {item}
                        <FiX size={12} onClick={() => removeItem(i)} style={{ cursor: "pointer" }} />
                    </span>
                ))}
            </div>

            {/* Wheel */}
            <div style={{ position: "relative", width: "min(400px, 80vw)", height: "min(400px, 80vw)" }}>
                {/* Pointer - on the right side */}
                <div style={{
                    position: "absolute", top: "50%", right: -18, transform: "translateY(-50%)",
                    width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent",
                    borderRight: "24px solid #f1c40f", zIndex: 10,
                }} />
                <svg
                    viewBox="0 0 400 400"
                    style={{
                        width: "100%", height: "100%",
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? "transform 4s cubic-bezier(0.17,0.67,0.12,1)" : "none",
                        borderRadius: "50%", boxShadow: "0 0 40px rgba(0,0,0,0.5)",
                    }}
                >
                    {items.length === 0 ? (
                        <circle cx={cx} cy={cy} r={r} fill="#2c2c54" />
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
                                    stroke="#1a1a2e" strokeWidth={2}
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
                    <circle cx={cx} cy={cy} r={18} fill="#1a1a2e" stroke="#fff" strokeWidth={3} />
                </svg>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={spin} disabled={spinning || items.length < 2} style={{
                    padding: "14px 36px", borderRadius: 50, border: "none",
                    background: spinning || items.length < 2
                        ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "#fff", fontSize: 17, fontWeight: "bold",
                    cursor: spinning || items.length < 2 ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                }}>
                    {spinning ? "Spinning..." : "Spin"}
                </button>
                <button onClick={reset} disabled={spinning} title="Reset" style={{
                    padding: "14px 20px", borderRadius: 50, border: "none",
                    background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                    cursor: spinning ? "not-allowed" : "pointer", fontSize: 17,
                    transition: "all 0.2s",
                }}>
                    <FiRotateCcw size={20} />
                </button>
            </div>

            {/* Winner */}
            {winner && (
                <div style={{
                    padding: "16px 32px", borderRadius: 16,
                    background: "linear-gradient(135deg,#f093fb,#f5576c)",
                    fontSize: 20, fontWeight: "bold", textAlign: "center",
                    boxShadow: "0 8px 32px rgba(240,93,251,0.4)",
                }}>
                     {winner}
                </div>
            )}

            {/* Saved Sets Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        if (!showSavedSets) setShowModal(false);
                    }}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh]"
                        onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            // Add new set form
                            <>
                                <h2 className="text-xl font-bold shrink-0">Manage Sets</h2>

                                {/* Title input */}
                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="Set title (e.g., General Questions)"
                                    className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none shrink-0"
                                />

                                {/* Add items */}
                                <div className="flex gap-2 shrink-0">
                                    <input
                                        value={modalInput}
                                        onChange={e => setModalInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && addModalItem()}
                                        placeholder="New option..."
                                        className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none flex-1"
                                    />
                                    <button
                                        onClick={addModalItem}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Modal items list */}
                                <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
                                    {modalItems.length === 0 ? (
                                        <div className="text-gray-500 text-sm text-center py-4">
                                            No options added yet
                                        </div>
                                    ) : (
                                        modalItems.map((item, i) => (
                                            <div key={i} className="bg-gray-800 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                                                <span className="text-gray-400 shrink-0">{i + 1}.</span>
                                                <span className="flex-1 truncate">{item}</span>
                                                <button
                                                    onClick={() => removeModalItem(i)}
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
                                        disabled={modalTitle.trim() === "" || modalItems.length === 0}
                                        className={`flex-1 py-2 rounded-lg text-sm ${modalTitle.trim() === "" || modalItems.length === 0
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
                            // Show saved sets
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
                                                        {set.items.length} items • {new Date(set.createdAt).toLocaleDateString()}
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