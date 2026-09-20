"use client";
import { useState, useEffect } from "react";

interface Question {
    id: string;
    question: string;
    answers: [string, string, string, string];
    correct: 0 | 1 | 2 | 3;
}

const KEY = "quiz_questions";
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function Quiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showModal, setShowModal] = useState(false);

    // form state
    const [qText, setQText] = useState("");
    const [answers, setAnswers] = useState<[string, string, string, string]>(["", "", "", ""]);
    const [correct, setCorrect] = useState<0 | 1 | 2 | 3>(0);

    // game state
    const [queue, setQueue] = useState<Question[]>([]);
    const [current, setCurrent] = useState<Question | null>(null);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const s = localStorage.getItem(KEY);
        if (s) setQuestions(JSON.parse(s));
    }, []);

    function save(q: Question[]) {
        setQuestions(q);
        localStorage.setItem(KEY, JSON.stringify(q));
    }

    function addQuestion() {
        if (!qText.trim() || answers.some(a => !a.trim())) return alert("Please fill in all fields");
        save([...questions, { id: crypto.randomUUID(), question: qText.trim(), answers, correct }]);
        setQText(""); setAnswers(["", "", "", ""]); setCorrect(0);
    }

    function startGame() {
        if (questions.length < 5) return alert("Minimum 5 questions required");
        const q = shuffle(questions);
        setQueue(q);
        setCurrent(q[0]);
        setQuestionIndex(0);
        setScore(0);
        setSelected(null);
        setFinished(false);
    }

    function handleAnswer(idx: number) {
        if (selected !== null) return;
        setSelected(idx);
        const isCorrect = idx === current!.correct;
        if (isCorrect) setScore(s => s + 1);
        setTimeout(() => {
            const next = questionIndex + 1;
            if (next >= queue.length) { setFinished(true); return; }
            setCurrent(queue[next]);
            setQuestionIndex(next);
            setSelected(null);
        }, 900);
    }

    function answerStyle(idx: number) {
        if (selected === null) return "bg-gray-700 hover:bg-gray-600 cursor-pointer";
        if (idx === current!.correct) return "bg-emerald-600 border-emerald-400";
        if (idx === selected) return "bg-red-600 border-red-400";
        return "bg-gray-700 opacity-50";
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-3xl font-bold">Quiz</h1>

            <div className="flex gap-3">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                    Manage Questions ({questions.length}/5+)
                </button>
                <button onClick={startGame} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                    Start Game
                </button>
            </div>

            {/* game area */}
            {!finished && current && (
                <div className="flex flex-col gap-4 w-full max-w-md">
                    <div className="text-sm text-gray-400 text-left">
                        Question {questionIndex + 1} of {queue.length} | Score: {score}
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-5 text-lg font-bold text-center">
                        {current.question}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {current.answers.map((a, i) => (
                            <button key={i} onClick={() => handleAnswer(i)}
                                    className={`rounded-xl border-2 border-transparent px-4 py-3 text-sm font-medium transition-all ${answerStyle(i)}`}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {finished && (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl font-bold text-emerald-400">🎉 Quiz Complete!</div>
                    <div className="text-xl">Score: {score} out of {queue.length}</div>
                    <button onClick={startGame} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg">
                        Play Again
                    </button>
                </div>
            )}

            {/* modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                     onClick={() => setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh]"
                         onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold shrink-0">Manage Questions</h2>

                        {/* add form */}
                        <div className="flex flex-col gap-2 shrink-0">
                            <input value={qText} onChange={e => setQText(e.target.value)}
                                   placeholder="Question text" className="bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none" />
                            <div className="grid grid-cols-2 gap-2">
                                {answers.map((a, i) => (
                                    <label key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border-2 cursor-pointer transition-all ${correct === i ? "border-emerald-500 bg-emerald-900/30" : "border-gray-700 bg-gray-800"}`}>
                                        <input type="radio" name="correct" checked={correct === i}
                                               onChange={() => setCorrect(i as 0|1|2|3)} className="accent-emerald-500" />
                                        <input value={a} onChange={e => {
                                            const n = [...answers] as [string,string,string,string];
                                            n[i] = e.target.value; setAnswers(n);
                                        }} placeholder={`Option ${i + 1}`} className="bg-transparent outline-none flex-1 min-w-0" />
                                    </label>
                                ))}
                            </div>
                            <button onClick={addQuestion} className="py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm">
                                Add Question
                            </button>
                        </div>

                        {/* list */}
                        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                            {questions.map((q, n) => (
                                <div key={q.id} className="bg-gray-800 rounded-lg px-3 py-2 text-sm flex items-start gap-2">
                                    <span className="text-gray-400 shrink-0">{n + 1}.</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-left">{q.question}</div>
                                        <div className="text-emerald-400 text-xs mt-0.5 truncate text-left">✓ {q.answers[q.correct]}</div>
                                    </div>
                                    <button onClick={() => save(questions.filter(x => x.id !== q.id))}
                                            className="text-red-400 shrink-0">✕</button>
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