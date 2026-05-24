"use client";

import { useState } from "react";
import Image from "next/image";
import {
  questions,
  personalityTypes,
  quizTitle,
  quizSubtitle,
  type PersonalityKey,
} from "@/data/questions";

type Phase = "start" | "question" | "results";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<PersonalityKey[]>([]);

  const current = questions[currentIndex];
  const total = questions.length;
  const progress = (currentIndex / total) * 100;
  const isLast = currentIndex === total - 1;

  function handleStart() {
    setPhase("question");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
  }

  function handleNext() {
    if (selected === null) return;
    const chosenType = current.options[selected].type;
    const newAnswers = [...answers, chosenType];
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      setPhase("results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRestart() {
    setPhase("start");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
  }

  // Tally results
  const tally = answers.reduce<Record<PersonalityKey, number>>(
    (acc, key) => {
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0, E: 0 }
  );
  const maxCount = Math.max(...Object.values(tally));
  const topKeys = (Object.keys(tally) as PersonalityKey[]).filter(
    (k) => tally[k] === maxCount && maxCount > 0
  );
  const topTypes = personalityTypes.filter((t) => topKeys.includes(t.key));

  // ── Start Screen ──────────────────────────────────────────────
  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl shadow-indigo-100 overflow-hidden flex flex-col">
          {/* Hero image */}
          <div className="relative w-full h-52">
            <Image
              src="/quiz-hero.png"
              alt="Where do I fit?"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h1 className="text-2xl font-bold text-white drop-shadow">{quizTitle}</h1>
              <p className="text-sm text-white/80">{quizSubtitle}</p>
            </div>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              {personalityTypes.map((t) => (
                <div key={t.key} className="flex items-center gap-3 text-sm">
                  <span className="text-lg w-6 text-center">{t.emoji}</span>
                  <span className="font-semibold text-slate-700">{t.name}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-3 flex items-center justify-between text-sm">
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
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────
  if (phase === "results") {
    const isTie = topTypes.length > 1;

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl shadow-indigo-100 px-6 py-10 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Your result
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {isTie ? "You're a blend!" : topTypes[0].name}
            </h2>
          </div>

          {topTypes.map((t) => (
            <div
              key={t.key}
              className={`w-full rounded-2xl overflow-hidden border-2 ${t.borderColor}`}
            >
              {/* Illustration */}
              <div className="relative w-full h-44">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-base font-bold text-white drop-shadow">
                    {t.name}
                  </span>
                </div>
              </div>
              {/* Description */}
              <div className={`${t.lightColor} px-5 py-4`}>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}

          {/* Score breakdown */}
          <div className="w-full rounded-2xl bg-slate-50 p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Your breakdown
            </p>
            {personalityTypes.map((t) => {
              const count = tally[t.key];
              const pct = Math.round((count / total) * 100);
              return (
                <div key={t.key} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-center">{t.emoji}</span>
                  <span className="w-32 text-slate-600 truncate">{t.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${t.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-semibold text-slate-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700"
          >
            Take It Again
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ───────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 pt-8 pb-10">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="font-medium">
            <span className="text-indigo-600 font-bold">{currentIndex + 1}</span>{" "}
            / {total}
          </span>
          <span className="font-medium text-slate-400">{quizTitle}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-indigo-100 overflow-hidden">
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
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full rounded-2xl px-5 py-4 text-sm text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700 scale-[0.99]"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.98]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLast ? "See My Result →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
