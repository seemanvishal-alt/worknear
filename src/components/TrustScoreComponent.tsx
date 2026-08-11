/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Info, X, Award, CheckCircle, TrendingUp, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

interface TrustScoreProps {
  initialCompletionRate: number; // 0-100
  initialCancellationRate: number; // 0-100
  initialFeedbackScore: number; // 0-100 (percentage of positive reviews)
  gigsCompleted: number;
  workerName: string;
}

export default function TrustScoreComponent({
  initialCompletionRate,
  initialCancellationRate,
  initialFeedbackScore,
  gigsCompleted,
  workerName
}: TrustScoreProps) {
  const [isOpen, setIsOpen] = useState(false);

  // States to allow live interactive calculation simulations
  const [completionRate, setCompletionRate] = useState(initialCompletionRate);
  const [cancellationRate, setCancellationRate] = useState(initialCancellationRate);
  const [feedbackScore, setFeedbackScore] = useState(initialFeedbackScore);

  // Weight definitions
  const completionWeight = 0.5;
  const cancellationWeight = 0.3;
  const feedbackWeight = 0.2;

  // Calculate dynamically
  const computedScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        completionRate * completionWeight +
          (100 - cancellationRate) * cancellationWeight +
          feedbackScore * feedbackWeight
      )
    )
  );

  // Determine risk category and styling
  let riskLabel = 'Very Low Risk';
  let riskColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-150';
  let ringColor = 'text-teal-600';

  if (computedScore < 80) {
    riskLabel = 'Attention Required / Medium Risk';
    riskColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-150';
    ringColor = 'text-amber-500';
  } else if (computedScore < 90) {
    riskLabel = 'Good Reliability / Low Risk';
    riskColor = 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-150';
    ringColor = 'text-blue-600';
  }

  // Circular progress dimensions
  const radius = 22;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (computedScore / 100) * circumference;

  return (
    <div className="relative inline-block text-left" id={`trust-score-wrapper-${workerName.replace(/\s+/g, '-').toLowerCase()}`}>
      
      {/* Trigger Area containing the visual circular progress ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 p-1.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all text-left group cursor-pointer focus:outline-none"
        title="Click to view full reliability audit dossier"
        id={`trust-score-trigger-${workerName.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="h-12 w-12 transform -rotate-90">
            {/* Background circle track */}
            <circle
              className="text-slate-100 dark:text-slate-800"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
            {/* Foreground progress circle */}
            <circle
              className={`${ringColor} transition-all duration-300`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
          </svg>
          {/* Central percentage label */}
          <span className="absolute text-[10px] font-black text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-all">
            {computedScore}%
          </span>
        </div>

        <div className="text-left leading-tight">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">AI Trust Score</span>
          <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 group-hover:underline">
            Vetted Profile <Info className="h-3 w-3 shrink-0" />
          </span>
        </div>
      </button>

      {/* Dynamic Overlay / Dropdown Dossier */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 z-40 text-left"
            id={`trust-score-dossier-${workerName.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Reliability Registry Audit
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
                id={`close-dossier-${workerName.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* General Description */}
            <div className="mt-3">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                {workerName}'s Reliability Matrix
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                Calculated dynamically using real-time coordinate handshakes, punctuality tracking, and verified employer checkout logs.
              </p>
            </div>

            {/* Score Ring Display inside the card */}
            <div className="my-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 font-mono text-xs font-black">
                  {computedScore}%
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block">Computed Risk Index</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border inline-block ${riskColor}`}>
                    {riskLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-mono">GIGS COMPLETED</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">✓ {gigsCompleted} Gigs</span>
              </div>
            </div>

            {/* Core Calculations Breakdown */}
            <div className="space-y-3.5">
              
              {/* Metric 1: Completion Rate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Completion Rate</span>
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">{completionRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                  <span>Weight: 50%</span>
                  <span>Factor Score: {(completionRate * completionWeight).toFixed(1)}/50</span>
                </div>
              </div>

              {/* Metric 2: Cancellation Rate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Cancellation Rate</span>
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">{cancellationRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${cancellationRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                  <span>Weight: 30% (Inverse)</span>
                  <span>Factor Score: {((100 - cancellationRate) * cancellationWeight).toFixed(1)}/30</span>
                </div>
              </div>

              {/* Metric 3: Previous Feedback Rating */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span>Employer Feedback</span>
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">{feedbackScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${feedbackScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                  <span>Weight: 20%</span>
                  <span>Factor Score: {(feedbackScore * feedbackWeight).toFixed(1)}/20</span>
                </div>
              </div>

            </div>

            {/* Interactive Simulator Sliders */}
            <div className="mt-5 pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
              <span className="text-[9px] font-black font-mono text-blue-600 uppercase tracking-widest block">
                🛠️ Trust Index Simulator Playground
              </span>
              <p className="text-[9px] text-slate-400 leading-normal">
                Adjust the sliders below to simulate reliability shifts and watch the circular progress ring update live.
              </p>

              {/* Slider 1: Completion */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <span>Completion Rate</span>
                  <span>{completionRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={completionRate}
                  onChange={(e) => setCompletionRate(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider 2: Cancellation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <span>Cancellation Rate</span>
                  <span>{cancellationRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={cancellationRate}
                  onChange={(e) => setCancellationRate(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider 3: Feedback */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <span>Feedback Quality</span>
                  <span>{feedbackScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={feedbackScore}
                  onChange={(e) => setFeedbackScore(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCompletionRate(initialCompletionRate);
                    setCancellationRate(initialCancellationRate);
                    setFeedbackScore(initialFeedbackScore);
                  }}
                  className="text-[9px] text-blue-600 font-black uppercase hover:underline cursor-pointer"
                >
                  Reset to Vetted Audit
                </button>
                <span className="text-[8px] font-mono text-slate-400">Formula: Weighted Additive Index</span>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
