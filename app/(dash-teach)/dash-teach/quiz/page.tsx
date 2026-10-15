"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiX, FiFolder, FiTrash2 } from "react-icons/fi";
import { HiSparkles, HiCheck } from "react-icons/hi";
import { MdQuiz } from "react-icons/md";
import { loadGameData, saveGameData } from "@/backend/actions/game/gameData.action";

interface QuizQuestion {
    id: string;
    question: string;
    answers: [string, string, string, string];
    correct: 0 | 1 | 2 | 3;
}

interface SavedSet {
    id: string;
    title: string;
    questions: QuizQuestion[];
    createdAt: number;
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function Quiz() {
    const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
    const [activeSetTitle, setActiveSetTitle] = useState<string>("");
    const [showModal, setShowModal] = useState(false);

    const [qText, setQText] = useState("");
    const [answers, setAnswers] = useState<[string, string, string, string]>(["", "", "", ""]);
    const [correct, setCorrect] = useState<0 | 1 | 2 | 3>(0);

    const [queue, setQueue] = useState<QuizQuestion[]>([]);
    const [current, setCurrent] = useState<QuizQuestion | null>(null);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [finished, setFinished] = useState(false);

    const [modalTitle, setModalTitle] = useState("");
    const [modalQuestions, setModalQuestions] = useState<QuizQuestion[]>([]);
    const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
    const [showSavedSets, setShowSavedSets] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGameData("QUIZ").then((data) => {
            if (data && data.sets) setSavedSets(data.sets);
            setLoading(false);
        });
    }, []);

    const persistSets = (sets: SavedSet[]) => {
        setSavedSets(sets);
        saveGameData("QUIZ", { sets });
    };

    const openModal = () => {
        setModalTitle(""); setModalQuestions([]); setQText("");
        setAnswers(["", "", "", ""]); setCorrect(0);
        setShowModal(true); setShowSavedSets(false);
    };

    const addModalQuestion = () => {
        if (!qText.trim() || answers.some(a => !a.trim())) return;
        setModalQuestions([...modalQuestions, {
            id: crypto.randomUUID(), question: qText.trim(),
            answers: [...answers] as [string, string, string, string], correct,
        }]);
        setQText(""); setAnswers(["", "", "", ""]); setCorrect(0);
    };

    const removeModalQuestion = (id: string) => setModalQuestions(modalQuestions.filter(q => q.id !== id));

    const saveCurrentSet = () => {
        if (modalTitle.trim() === "" || modalQuestions.length === 0) return;
        persistSets([...savedSets, { id: Date.now().toString(), title: modalTitle.trim(), questions: [...modalQuestions], createdAt: Date.now() }]);
        setShowModal(false);
    };

    const loadSet = (set: SavedSet) => {
        setActiveQuestions(set.questions); setActiveSetTitle(set.title);
        setShowSavedSets(false); setShowModal(false);
    };

    const deleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        persistSets(savedSets.filter(s => s.id !== id));
    };

    function startGame() {
        if (activeQuestions.length < 5) return alert("Minimum 5 questions required (load a set first)");
        const q = shuffle(activeQuestions);
        setQueue(q); setCurrent(q[0]);
        setQuestionIndex(0); setScore(0); setSelected(null); setFinished(false);
    }

    function handleAnswer(idx: number) {
        if (selected !== null) return;
        setSelected(idx);
        const isCorrect = idx === current!.correct;
        if (isCorrect) setScore(s => s + 1);
        setTimeout(() => {
            const next = questionIndex + 1;
            if (next >= queue.length) { setFinished(true); return; }
            setCurrent(queue[next]); setQuestionIndex(next); setSelected(null);
        }, 900);
    }

    function answerStyle(idx: number) {
        if (selected === null) return "bg-white border-slate-200 text-[#1a2151] hover:bg-pink-50 hover:border-pink-300 cursor-pointer";
        if (idx === current!.correct) return "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-200/50";
        if (idx === selected) return "bg-red-500 border-red-400 text-white";
        return "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
    }

    return (
        <div className="mx-auto max-w-[900px]" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 fn-fade-up">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 shadow-md shadow-pink-100/50">
                    <MdQuiz size={28}/>
                </div>
                <div>
                    <h2 className="font-black text-xl text-[#1a2151]">کوییز</h2>
                    <p className="text-slate-400 text-sm">ساخت و اجرای کوییز تعاملی</p>
                </div>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_40px_rgba(236,72,153,.08)] fn-fade-up fn-delay-1">
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-pink-50/40 blur-2xl"/>
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-purple-50/30 blur-2xl"/>

                <div className="relative flex flex-col items-center gap-5 p-6 md:p-10">
                    {activeSetTitle && (
                        <span className="flex items-center gap-1.5 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold text-pink-600">
                            <HiSparkles size={14}/> مجموعه: {activeSetTitle}
                        </span>
                    )}

                    {/* Action buttons */}
                    {!finished && !current && (
                        <div className="flex gap-3 flex-wrap justify-center" dir="ltr">
                            <button onClick={openModal} className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-purple-200/50">
                                <FiFolder size={16}/> مجموعه‌ها ({savedSets.length})
                            </button>
                            <button onClick={startGame} className="px-5 py-3 rounded-2xl bg-gradient-to-l from-pink-500 to-purple-500 text-white text-sm font-bold transition-all shadow-md shadow-pink-200/50 fn-btn-press">
                                شروع کوییز
                            </button>
                        </div>
                    )}

                    {/* Quiz progress + question */}
                    {!finished && current && (
                        <div className="flex flex-col gap-5 w-full max-w-md">
                            {/* Progress bar */}
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-gradient-to-l from-pink-500 to-purple-500 transition-all duration-500"
                                         style={{ width: `${((questionIndex) / queue.length) * 100}%` }}/>
                                </div>
                                <span className="text-xs font-bold text-slate-400 shrink-0">
                                    {questionIndex + 1} / {queue.length}
                                </span>
                                <span className="text-xs font-bold text-pink-500 shrink-0">
                                    امتیاز: {score}
                                </span>
                            </div>

                            {/* Question card */}
                            <div className="rounded-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/30 border border-pink-100 p-5 text-center">
                                <p className="text-lg font-black text-[#1a2151]">{current.question}</p>
                            </div>

                            {/* Answers */}
                            <div className="grid grid-cols-2 gap-3">
                                {current.answers.map((a, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        className={`rounded-2xl border-2 px-4 py-4 text-sm font-bold transition-all ${answerStyle(i)}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400 shrink-0">
                                                {["۱", "۲", "۳", "۴"][i]}
                                            </span>
                                            {a}
                                            {selected !== null && i === current.correct && (
                                                <HiCheck size={16} className="text-white"/>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Finished state */}
                    {finished && (
                        <div className="flex flex-col items-center gap-5 py-6 fn-fade-up">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-500 text-white shadow-xl shadow-emerald-200/50 fn-float-slow">
                                <HiCheck size={40}/>
                            </div>
                            <div className="text-2xl font-black text-emerald-600">🎉 کوییز تمام شد!</div>
                            <div className="flex items-center gap-2 rounded-2xl bg-pink-50 px-6 py-3">
                                <span className="text-slate-500 text-sm">امتیاز شما:</span>
                                <span className="text-pink-600 font-black text-xl">{score}</span>
                                <span className="text-slate-400 text-sm">از {queue.length}</span>
                            </div>
                            <button onClick={startGame} className="px-8 py-3 rounded-2xl bg-gradient-to-l from-pink-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-200/50 fn-btn-press">
                                بازی مجدد
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!finished && !current && loading && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-400 fn-float-slow">
                                <MdQuiz size={32}/>
                            </div>
                            <p className="text-slate-400 text-sm">در حال بارگذاری...</p>
                        </div>
                    )}

                    {!finished && !current && !loading && activeQuestions.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-400 fn-float-slow">
                                <MdQuiz size={32}/>
                            </div>
                            <p className="text-[#1a2151] font-bold text-base">هنوز کوییزی ساخته نشده</p>
                            <p className="text-slate-400 text-sm text-center max-w-xs">یک مجموعه سؤال بساز یا مجموعه ذخیره شده را انتخاب کن.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#1a2151]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                     onClick={() => { if (!showSavedSets) setShowModal(false); }}>
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-lg flex flex-col gap-4 max-h-[80vh] shadow-2xl border border-pink-50"
                         onClick={e => e.stopPropagation()}>

                        {!showSavedSets ? (
                            <>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                                        <FiFolder size={20}/>
                                    </div>
                                    <h2 className="text-lg font-black text-[#1a2151]">مدیریت مجموعه‌ها</h2>
                                </div>

                                <input
                                    value={modalTitle}
                                    onChange={e => setModalTitle(e.target.value)}
                                    placeholder="عنوان مجموعه (مثلاً: درس ۱)"
                                    className="rounded-2xl border-2 border-pink-100 bg-pink-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-pink-400 transition-colors shrink-0"
                                />

                                <div className="flex flex-col gap-2 shrink-0">
                                    <input value={qText} onChange={e => setQText(e.target.value)}
                                           placeholder="متن سؤال" className="rounded-2xl border-2 border-blue-100 bg-blue-50/20 px-4 py-3 text-sm text-[#1a2151] outline-none focus:border-blue-400 transition-colors" />
                                    <div className="grid grid-cols-2 gap-2">
                                        {answers.map((a, i) => (
                                            <label key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm border-2 cursor-pointer transition-all ${correct === i ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 bg-slate-50/30"}`}>
                                                <input type="radio" name="correct" checked={correct === i}
                                                       onChange={() => setCorrect(i as 0|1|2|3)} className="accent-emerald-500 shrink-0" />
                                                <input value={a} onChange={e => {
                                                    const n = [...answers] as [string,string,string,string];
                                                    n[i] = e.target.value; setAnswers(n);
                                                }} placeholder={`گزینه ${i + 1}`} className="bg-transparent outline-none flex-1 min-w-0 text-[#1a2151]" />
                                            </label>
                                        ))}
                                    </div>
                                    <button onClick={addModalQuestion} className="py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors">
                                        <FiPlus size={16}/> افزودن سؤال
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
                                    {modalQuestions.length === 0 ? (
                                        <div className="text-slate-400 text-sm text-center py-4">هنوز سؤالی اضافه نشده</div>
                                    ) : (
                                        modalQuestions.map((q, n) => (
                                            <div key={q.id} className="bg-slate-50 rounded-xl px-4 py-2.5 text-sm flex items-start gap-2 border border-slate-100">
                                                <span className="text-slate-400 shrink-0">{n + 1}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate text-left">{q.question}</div>
                                                    <div className="text-emerald-600 text-xs mt-0.5 truncate text-left flex items-center gap-1">
                                                        <HiCheck size={12}/> {q.answers[q.correct]}
                                                    </div>
                                                </div>
                                                <button onClick={() => removeModalQuestion(q.id)} className="text-red-400 hover:text-red-500 shrink-0">
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
                                            disabled={modalTitle.trim() === "" || modalQuestions.length === 0}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${modalTitle.trim() === "" || modalQuestions.length === 0 ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}>
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
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
                                                className="rounded-2xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-pink-50 transition-colors flex items-center justify-between group border border-slate-100 hover:border-pink-200">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-[#1a2151] truncate">{set.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">
                                                        {set.questions.length} سؤال • {new Date(set.createdAt).toLocaleDateString("fa-IR")}
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
                                    <button onClick={() => setShowSavedSets(false)} className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-xl text-sm font-bold text-white transition-colors">
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
