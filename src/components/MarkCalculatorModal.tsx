import React, { useState } from 'react';
import { X, Calculator, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { calculateRichfieldGrade } from '../data/richfieldCurriculum';

interface MarkCalculatorModalProps {
  onClose: () => void;
}

export const MarkCalculatorModal: React.FC<MarkCalculatorModalProps> = ({ onClose }) => {
  const [formative, setFormative] = useState<number>(65);
  const [summative, setSummative] = useState<number>(70);

  const result = calculateRichfieldGrade(formative, summative);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-lg bg-white dark:bg-[#0b1222] border border-[#14316B]/20 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#14316B] text-white px-6 py-4 flex items-center justify-between border-b border-[#3FA7B8]/30">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#3FA7B8]" />
            <div>
              <h3 className="font-heading uppercase text-base font-bold text-white tracking-wide">
                Richfield Mark Calculator
              </h3>
              <p className="text-[11px] text-slate-300">40% Formative + 60% Summative Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders & Inputs */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Formative Slider (40%) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#14316B] dark:text-white">
                <span>Formative Assessment (40% Weight)</span>
                <span className="text-base text-[#1C56A8] dark:text-[#3FA7B8] font-mono tabular-nums">{formative}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formative}
                onChange={(e) => setFormative(Number(e.target.value))}
                className="w-full accent-[#1C56A8] cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Includes tests, continuous coding assignments, and Moodle online quizzes throughout semester.
              </p>
            </div>

            {/* Summative Slider (60%) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#14316B] dark:text-white">
                <span>Summative Assessment (60% Weight)</span>
                <span className="text-base text-[#E24B3C] font-mono tabular-nums">{summative}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={summative}
                onChange={(e) => setSummative(Number(e.target.value))}
                className="w-full accent-[#E24B3C] cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Official 3-hour invigilated final examination paper.
              </p>
            </div>
          </div>

          {/* Outcome Card */}
          <div
            className={`p-5 rounded-xl border text-center space-y-3 ${
              result.passed
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                : result.allowsSupplementary
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/40 text-amber-900 dark:text-amber-100'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/40 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="text-4xl font-black font-heading tracking-tight tabular-nums">
              {result.finalMark}%
            </div>

            <div className="flex items-center justify-center gap-1.5 font-bold text-sm uppercase tracking-wider">
              {result.passed && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {result.allowsSupplementary && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {!result.passed && !result.allowsSupplementary && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              <span>{result.statusText}</span>
            </div>

            <div className="text-xs space-y-1 opacity-90 pt-1 border-t border-black/10 dark:border-white/10">
              <p>
                Formative Contribution: <strong>{result.breakdown.formativeContribution}%</strong> · Summative Contribution: <strong>{result.breakdown.summativeContribution}%</strong>
              </p>
              {result.allowsSupplementary && (
                <p className="font-semibold text-amber-700 dark:text-amber-300">
                  Qualifies for supplementary exam window (40% - 47%) under CHE accreditation standards.
                </p>
              )}
            </div>
          </div>

          {/* Institutional Policy Footnote */}
          <div className="p-3 bg-[#DCEBF3]/60 dark:bg-slate-900 rounded-lg border border-[#3FA7B8]/20 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-[#14316B] dark:text-slate-200">Official Richfield Assessment Standard:</p>
            <p>• Minimum final pass mark: 50%</p>
            <p>• Supplementary exam eligibility: 40% – 47% final mark</p>
            <p>• Distinction mark: 75%+</p>
          </div>
        </div>
      </div>
    </div>
  );
};
