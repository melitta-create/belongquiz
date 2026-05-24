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
  const [showStats, setShowStats] = useState(false);

  const current = questions[currentIndex];
  const total = questions.length;
  const progress = (currentIndex / total) * 100;
  const isLast = currentIndex === total - 1;

  function handleStart() {
    setPhase("question");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowStats(false);
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
    setShowStats(false);
  }

  const tally = answers.reduce<Record<PersonalityKey, number>>(
    (acc, key) => { acc[key] = (acc[key] || 0) + 1; return acc; },
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
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0d0520] px-5 py-10">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

          <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/60">
            <Image
              src="/unfiltered-2026.png"
              alt="Unfiltered 2026 Youth Fest"
              width={600}
              height={340}
              className="w-full object-cover"
              priority
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400 mb-2">
              Youth Fest 2026
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              {quizTitle}
            </h1>
            <p className="mt-2 text-base text-purple-300">{quizSubtitle}</p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-purple-900/60 border border-purple-700/50 px-4 py-4 text-center">
              <p className="text-3xl font-extrabold text-white">{total}</p>
              <p className="text-sm text-purple-300 mt-0.5">Questions</p>
            </div>
            <div className="rounded-2xl bg-purple-900/60 border border-purple-700/50 px-4 py-4 text-center">
              <p className="text-3xl font-extrabold text-white">5</p>
              <p className="text-sm text-purple-300 mt-0.5">Results</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95 hover:bg-orange-400"
          >
            Find Out Where I Fit →
          </button>

          <p className="text-sm text-purple-500 text-center">
            Select the answer that feels most like you
          </p>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────
  if (phase === "results") {
    const isTie = topTypes.length > 1;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0d0520] px-5 py-10">
        <div className="w-full max-w-sm flex flex-col items-center gap-5">

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400 mb-1">
              Your Result
            </p>
            <h2 className="text-3xl font-extrabold text-white">
              {isTie ? "You're a blend!" : topTypes[0].name}
            </h2>
          </div>

          {/* Primary type card(s) */}
          {topTypes.map((t) => (
            <div
              key={t.key}
              className="w-full rounded-3xl overflow-hidden shadow-xl shadow-purple-900/50 border border-purple-700/40"
            >
              <div className="relative w-full h-52">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520]/90 via-[#0d0520]/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
                  <span className="text-3xl">{t.emoji}</span>
                  <span className="text-xl font-extrabold text-white drop-shadow-lg">
                    {t.name}
                  </span>
                </div>
              </div>
              <div className="bg-purple-900/60 px-5 py-5 border-t border-purple-700/40">
                <p className="text-base text-purple-100 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}

          {/* Stats toggle link */}
          <button
            onClick={() => setShowStats((s) => !s)}
            className="text-sm font-semibold text-purple-400 underline underline-offset-4 hover:text-orange-400 transition-colors"
          >
            {showStats ? "Hide stats ↑" : "See my full breakdown →"}
          </button>

          {/* Collapsible breakdown */}
          {showStats && (
            <div className="w-full rounded-2xl bg-purple-900/40 border border-purple-700/40 p-5 flex flex-col gap-3">
              <p className="text-sm font-bold uppercase tracking-widest text-purple-400">
                Full Breakdown
              </p>
              {personalityTypes.map((t) => {
                const count = tally[t.key];
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={t.key} className="flex items-center gap-3">
                    <span className="w-6 text-center text-lg">{t.emoji}</span>
                    <span className="w-32 text-purple-200 text-sm truncate">{t.name}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-purple-800/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-5 text-right text-sm font-bold text-orange-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleRestart}
            className="w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95 hover:bg-orange-400"
          >
            Take It Again
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ───────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col bg-[#0d0520] px-5 pt-8 pb-10">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-5 flex-1">

        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-widest text-orange-400">
            {quizTitle}
          </span>
          <span className="text-sm font-semibold text-purple-400">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-purple-900/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="rounded-3xl bg-purple-900/60 border border-purple-700/40 px-6 py-7 shadow-lg">
          <p className="text-lg font-bold text-white leading-relaxed">
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
                className={`w-full rounded-2xl px-5 py-4 text-base text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-orange-500/20 border-2 border-orange-500 text-white scale-[0.99]"
                    : "bg-purple-900/40 border-2 border-purple-700/50 text-purple-100 hover:border-purple-500 hover:bg-purple-800/50 active:scale-[0.98]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-purple-600 text-purple-400"
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
          className="w-full rounded-2xl bg-orange-500 py-5 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLast ? "See My Result →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
