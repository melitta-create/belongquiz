"use client";

import { useState } from "react";
import { questions, quizTitle, quizSubtitle } from "@/data/questions";

type Phase = "start" | "question" | "results";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const current = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + (confirmed ? 1 : 0)) / total) * 100;
  const isLast = currentIndex === total - 1;

  function handleStart() {
    setPhase("question");
    setCurrentIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
  }

  function handleSelect(index: number) {
    if (confirmed) return;
    setSelected(index);
  }

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === current.correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selected;
    setAnswers(newAnswers);
    if (isCorrect) setScore((s) => s + 1);
    setConfirmed(true);
  }

  function handleNext() {
    if (isLast) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function handleRestart() {
    setPhase("start");
    setCurrentIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
  }

  const percentage = Math.round((score / total) * 100);

  function getScoreMessage() {
    if (percentage === 100) return "Perfect score! Excellent work! 🎉";
    if (percentage >= 80) return "Great job! Almost there!";
    if (percentage >= 60) return "Good effort! Keep practicing.";
    if (percentage >= 40) return "Keep studying, you'll get there!";
    return "More practice needed. Don't give up!";
  }

  function getOptionState(optionIndex: number) {
    if (!confirmed) {
      if (selected === optionIndex) return "selected";
      return "idle";
    }
    if (optionIndex === current.correctAnswer) return "correct";
    if (optionIndex === selected && selected !== current.correctAnswer)
      return "wrong";
    return "dimmed";
  }

  const optionStyles: Record<string, string> = {
    idle: "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98]",
    selected:
      "bg-indigo-50 border-2 border-indigo-500 text-indigo-700 scale-[0.99]",
    correct:
      "bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-semibold",
    wrong: "bg-red-50 border-2 border-red-400 text-red-700 line-through opacity-80",
    dimmed: "bg-slate-50 border-2 border-slate-150 text-slate-400 opacity-60",
  };

  // ── Start Screen ──────────────────────────────────────────────
  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl shadow-indigo-100 px-8 py-12 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-300">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{quizTitle}</h1>
            <p className="mt-1.5 text-sm text-slate-500">{quizSubtitle}</p>
          </div>
          <div className="w-full rounded-xl bg-indigo-50 px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Questions</span>
            <span className="font-bold text-indigo-600">{total}</span>
          </div>
          <button
            onClick={handleStart}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl shadow-indigo-100 px-8 py-10 flex flex-col items-center gap-6 text-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={percentage >= 60 ? "#6366f1" : "#f43f5e"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">
                {percentage}%
              </span>
              <span className="text-xs text-slate-400">score</span>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold text-slate-800">
              {getScoreMessage()}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              You got{" "}
              <span className="font-bold text-indigo-600">{score}</span> out of{" "}
              <span className="font-bold text-slate-700">{total}</span> correct
            </p>
          </div>

          {/* Per-question breakdown */}
          <div className="w-full rounded-2xl bg-slate-50 p-4 flex flex-col gap-2 text-left">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-600 leading-snug line-clamp-2">
                    Q{i + 1}: {q.question}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ───────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 pt-8 pb-10">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="font-medium">
            Question{" "}
            <span className="text-indigo-600 font-bold">{currentIndex + 1}</span>{" "}
            / {total}
          </span>
          <span className="font-medium">
            Score:{" "}
            <span className="text-indigo-600 font-bold">{score}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="rounded-3xl bg-white shadow-lg shadow-indigo-100 px-6 py-7">
          <p className="text-base font-semibold text-slate-800 leading-relaxed">
            {current.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {current.options.map((option, i) => {
            const state = getOptionState(i);
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={confirmed}
                className={`w-full rounded-2xl px-5 py-4 text-sm text-left transition-all duration-150 ${optionStyles[state]}`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 ${
                      state === "correct"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : state === "wrong"
                          ? "border-red-400 bg-red-400 text-white"
                          : state === "selected"
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-current bg-transparent"
                    }`}
                  >
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {confirmed && (
          <div
            className={`rounded-2xl px-5 py-4 text-sm font-medium flex items-center gap-3 ${
              selected === current.correctAnswer
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span className="text-xl">
              {selected === current.correctAnswer ? "✅" : "❌"}
            </span>
            <span>
              {selected === current.correctAnswer
                ? "Correct! Well done."
                : `The correct answer is: ${current.options[current.correctAnswer]}`}
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Confirm Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700"
          >
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
