import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import questionsData from '../data/questions.json';
import { Question } from '../types';

const DrivingTest: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | string[] }>({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [mode, setMode] = useState<'study' | 'exam' | 'menu'>('menu');

    useEffect(() => {
        // Load data (cast to unknown first if strict JSON import issues arise, but usually fine)
        setQuestions(questionsData as unknown as Question[]);
    }, []);

    const startExam = () => {
        // Random 35 questions for exam
        const shuffled = [...(questionsData as unknown as Question[])].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 35));
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setScore(0);
        setMode('exam');
    };

    const startStudy = () => {
        setQuestions(questionsData as unknown as Question[]);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setScore(0);
        setMode('study');
    };

    const handleOptionSelect = (optionKey: string) => {
        if (showResult) return; // Disable changing after submit in exam mode? Or maybe instant feedback in study?

        // For now, simple single choice selection or toggle for multiple if needed. 
        // The data has some array answers.
        const currentQ = questions[currentQuestionIndex];
        const isMultiple = Array.isArray(currentQ.answer);

        if (isMultiple) {
            // Toggle logic
            const currentSelected = (userAnswers[currentQ.id] as string[]) || [];
            if (currentSelected.includes(optionKey)) {
                setUserAnswers({
                    ...userAnswers,
                    [currentQ.id]: currentSelected.filter(k => k !== optionKey)
                });
            } else {
                setUserAnswers({
                    ...userAnswers,
                    [currentQ.id]: [...currentSelected, optionKey]
                });
            }
        } else {
            setUserAnswers({
                ...userAnswers,
                [currentQ.id]: optionKey
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishTest();
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const finishTest = () => {
        let newScore = 0;
        questions.forEach(q => {
            const uAns = userAnswers[q.id];
            const correct = q.answer;

            // Compare
            if (Array.isArray(correct)) {
                if (Array.isArray(uAns) &&
                    uAns.length === correct.length &&
                    uAns.every(val => correct.includes(val))) {
                    newScore++;
                }
            } else {
                if (uAns === correct) {
                    newScore++;
                }
            }
        });
        setScore(newScore);
        setShowResult(true);
    };

    if (mode === 'menu') {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <Link to="/" className="absolute top-4 left-4 text-cyan-400">&larr; Back to Hub</Link>
                <h1 className="text-4xl font-bold mb-8">Driving Test Simulator</h1>
                <div className="flex gap-8">
                    <button onClick={startStudy} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105">
                        📚 Study Mode
                        <p className="text-sm font-normal text-cyan-200 mt-2">Practice all {questionsData.length} questions</p>
                    </button>
                    <button onClick={startExam} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105">
                        ⏱️ Exam Mode
                        <p className="text-sm font-normal text-purple-200 mt-2">35 random questions, simulated test</p>
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) return <div>Loading...</div>;

    const currentQ = questions[currentQuestionIndex];
    const userAns = userAnswers[currentQ.id];

    // Determine validation colors if result shown OR if in Study mode (instant feedback?)
    // Let's do instant feedback for study mode?? No, keep it consistent for now.
    // Actually, study mode usually implies seeing the answer.

    const isCorrect = (optKey: string) => {
        if (!showResult && mode === 'exam') return false;

        // Show correct answers in Study Mode always? Or only after selection?
        // Let's only show results at end for Exam.
        // For Study, maybe we add a "Check Answer" button?

        // Simple verification visualization
        if (showResult) {
            if (Array.isArray(currentQ.answer)) {
                return currentQ.answer.includes(optKey);
            }
            return currentQ.answer === optKey;
        }
        return false;
    };

    const isSelected = (optKey: string) => {
        if (Array.isArray(userAns)) return userAns.includes(optKey);
        return userAns === optKey;
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white">Exit</button>
                    <div className="text-xl font-mono">
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </div>
                    {mode === 'exam' && <div className="text-purple-400">Exam Mode</div>}
                    {mode === 'study' && <div className="text-cyan-400">Study Mode</div>}
                </div>

                {/* Start Result View */}
                {showResult && (
                    <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 text-center">
                        <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                        <p className="text-xl">Your Score: <span className={score >= 30 ? "text-green-400" : "text-red-400"}>{score}</span> / {questions.length}</p>
                        <p className="text-slate-400 mt-2">{score >= 33 ? "PASSED" : "FAILED (Needs 33)"}</p>
                        <button onClick={() => setMode('menu')} className="mt-4 bg-slate-700 px-4 py-2 rounded hover:bg-slate-600">Return to Menu</button>
                    </div>
                )}

                {/* Question Card */}
                <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQ.question}</h2>

                    {/* Image */}
                    {currentQ.image && (
                        <div className="mb-6">
                            <img
                                src={`/${currentQ.image}`}
                                alt="Question Reference"
                                className="max-h-64 rounded-lg border border-slate-600 mx-auto"
                            />
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                        {Object.entries(currentQ.options).map(([key, text]) => {
                            const selected = isSelected(key);
                            const correct = isCorrect(key);

                            let bgClass = "bg-slate-700/50 hover:bg-slate-700";
                            if (selected) bgClass = "bg-cyan-600 text-white";
                            if (showResult) {
                                if (correct) bgClass = "bg-green-600 text-white";
                                else if (selected && !correct) bgClass = "bg-red-600 text-white";
                            }

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleOptionSelect(key)}
                                    className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-4 ${bgClass}`}
                                >
                                    <span className="font-mono opacity-50 uppercase">{key})</span>
                                    <span>{text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {!showResult ? (
                        <button
                            onClick={nextQuestion}
                            className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 font-bold"
                        >
                            {currentQuestionIndex === questions.length - 1 ? "Finish Test" : "Next"}
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="px-6 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Study Mode: Show correct answer toggle */}
                {mode === 'study' && !showResult && (
                    <div className="mt-4 text-center">
                        <details>
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-300">Show Answer</summary>
                            <div className="mt-2 p-4 bg-slate-800/50 rounded text-green-400">
                                Correct Answer: {Array.isArray(currentQ.answer) ? currentQ.answer.join(', ') : currentQ.answer}
                            </div>
                        </details>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DrivingTest;
