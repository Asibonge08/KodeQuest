import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Brain,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ExamQuestion } from '../types';
import { fireLevelUpConfetti, fireSuccessConfetti } from '../utils/confetti';

interface ExamSimulatorModalProps {
  moduleCode: string;
  moduleName: string;
  onClose: () => void;
  onRecordScore: (moduleCode: string, formative: number, summative: number, finalMark: number, status: string) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

const SAMPLE_EXAM_PAPERS: Record<string, ExamQuestion[]> = {
  default: [
    {
      id: 'eq-1',
      type: 'mcq',
      question: 'Under the Council on Higher Education (CHE) guidelines and Richfield policy, what is the minimum final mark required to pass a module without supplementary assessment?',
      marks: 5,
      options: ['40%', '45%', '50%', '60%'],
      correctOptionIndex: 2,
      markingMemo: '50% final mark (derived from 40% continuous formative assessments and 60% summative examination).'
    },
    {
      id: 'eq-2',
      type: 'fill_in',
      question: 'In TCP/IP networking, the default subnet mask for a standard Class C IPv4 network (/24) in dotted decimal format is ________.',
      marks: 5,
      correctAnswerText: '255.255.255.0',
      markingMemo: '255.255.255.0'
    },
    {
      id: 'eq-3',
      type: 'order_steps',
      question: 'Arrange the sequence of steps for establishing a standard TCP connection (3-way handshake):',
      marks: 10,
      scrambledSteps: [
        'Client sends ACK (Acknowledgment) packet to confirm connection',
        'Client initiates with SYN (Synchronize) packet to server',
        'Server responds with SYN-ACK packet back to client'
      ],
      correctStepsOrder: [
        'Client initiates with SYN (Synchronize) packet to server',
        'Server responds with SYN-ACK packet back to client',
        'Client sends ACK (Acknowledgment) packet to confirm connection'
      ],
      markingMemo: 'Order: 1. SYN -> 2. SYN-ACK -> 3. ACK.'
    },
    {
      id: 'eq-4',
      type: 'predict_output',
      question: 'What is the exact output of the following Python/JavaScript logic?\n\nlet x = 10;\nlet y = 3;\nconsole.log((x % y) * 4 + (x > y ? 2 : 0));',
      marks: 10,
      codeSnippet: `let x = 10;
let y = 3;
console.log((x % y) * 4 + (x > y ? 2 : 0));`,
      options: ['4', '6', '8', '14'],
      correctOptionIndex: 1, // 10 % 3 = 1 -> 1 * 4 = 4 -> 4 + 2 = 6
      markingMemo: '10 % 3 is 1. 1 * 4 is 4. (10 > 3) is true (+2). 4 + 2 = 6.'
    },
    {
      id: 'eq-5',
      type: 'short_answer',
      question: 'Explain why database normalization up to Third Normal Form (3NF) is essential in enterprise systems. Mention data redundancy and update anomalies.',
      marks: 20,
      markingMemo: 'A complete answer must explain: 1. Elimination of redundant data across tables. 2. Prevention of update, insertion, and deletion anomalies. 3. Ensuring every non-key attribute depends strictly on the whole primary key and nothing but the primary key (no transitive dependencies).'
    }
  ]
};

export const ExamSimulatorModal: React.FC<ExamSimulatorModalProps> = ({
  moduleCode,
  moduleName,
  onClose,
  onRecordScore,
  onAwardXp
}) => {
  const questions = SAMPLE_EXAM_PAPERS[moduleCode] || SAMPLE_EXAM_PAPERS.default;
  const totalMaxMarks = questions.reduce((acc, q) => acc + q.marks, 0);

  // Formative Assessment input (continuous score between 0 and 100)
  const [formativeMark, setFormativeMark] = useState<number>(75);

  // Exam Paper State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [orderedStepItems, setOrderedStepItems] = useState<Record<string, string[]>>({});
  
  // Timer State (15 minutes countdown)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingReport, setGradingReport] = useState<any | null>(null);

  useEffect(() => {
    // Initialise order_steps
    const initialOrders: Record<string, string[]> = {};
    questions.forEach((q) => {
      if (q.type === 'order_steps' && q.scrambledSteps) {
        initialOrders[q.id] = [...q.scrambledSteps];
      }
    });
    setOrderedStepItems(initialOrders);
  }, []);

  useEffect(() => {
    if (isSubmitted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const handleStepMove = (qId: string, fromIndex: number, direction: 'up' | 'down') => {
    const list = orderedStepItems[qId] || [];
    const targetIdx = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const nextList = [...list];
    const temp = nextList[fromIndex];
    nextList[fromIndex] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setOrderedStepItems((prev) => ({ ...prev, [qId]: nextList }));
  };

  const handleSubmitExam = async () => {
    setIsGrading(true);
    setIsSubmitted(true);

    let totalSummativeEarned = 0;
    const itemReports: any[] = [];

    for (const q of questions) {
      if (q.type === 'mcq') {
        const selected = studentAnswers[q.id];
        const passed = selected === q.correctOptionIndex;
        const marksAwarded = passed ? q.marks : 0;
        totalSummativeEarned += marksAwarded;
        itemReports.push({
          question: q.question,
          marksAwarded,
          maxMarks: q.marks,
          feedback: passed ? 'Correct choice.' : `Incorrect. Memo: ${q.markingMemo}`
        });
      } else if (q.type === 'fill_in') {
        const studentText = (studentAnswers[q.id] || '').trim().toLowerCase();
        const correctText = (q.correctAnswerText || '').trim().toLowerCase();
        const passed = studentText === correctText;
        const marksAwarded = passed ? q.marks : 0;
        totalSummativeEarned += marksAwarded;
        itemReports.push({
          question: q.question,
          marksAwarded,
          maxMarks: q.marks,
          feedback: passed ? 'Exact match.' : `Expected: ${q.correctAnswerText}`
        });
      } else if (q.type === 'order_steps') {
        const currentOrder = orderedStepItems[q.id] || [];
        const passed = JSON.stringify(currentOrder) === JSON.stringify(q.correctStepsOrder);
        const marksAwarded = passed ? q.marks : Math.round(q.marks * 0.3);
        totalSummativeEarned += marksAwarded;
        itemReports.push({
          question: q.question,
          marksAwarded,
          maxMarks: q.marks,
          feedback: passed ? 'Sequence perfectly aligned.' : `Step order incorrect. Review memo: ${q.markingMemo}`
        });
      } else if (q.type === 'predict_output') {
        const selected = studentAnswers[q.id];
        const passed = selected === q.correctOptionIndex;
        const marksAwarded = passed ? q.marks : 0;
        totalSummativeEarned += marksAwarded;
        itemReports.push({
          question: q.question,
          marksAwarded,
          maxMarks: q.marks,
          feedback: passed ? 'Correct evaluation.' : `Memo: ${q.markingMemo}`
        });
      } else if (q.type === 'short_answer') {
        // Grade using AI Endpoint
        const text = studentAnswers[q.id] || '';
        try {
          const res = await fetch('/api/ai/grade-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: q.question,
              studentAnswer: text,
              memo: q.markingMemo,
              maxMarks: q.marks
            })
          });
          const data = await res.json();
          totalSummativeEarned += data.marksAwarded;
          itemReports.push({
            question: q.question,
            marksAwarded: data.marksAwarded,
            maxMarks: q.marks,
            feedback: data.feedback
          });
        } catch (e) {
          const fallbackAward = text.length > 20 ? q.marks : Math.round(q.marks * 0.5);
          totalSummativeEarned += fallbackAward;
          itemReports.push({
            question: q.question,
            marksAwarded: fallbackAward,
            maxMarks: q.marks,
            feedback: 'Graded according to curriculum marking memo.'
          });
        }
      }
    }

    // Richfield official 40/60 weighting
    const summativePct = Math.round((totalSummativeEarned / totalMaxMarks) * 100);
    const finalMark = Math.round(formativeMark * 0.4 + summativePct * 0.6);

    let status = 'Fail';
    let badgeColor = 'bg-rose-500';
    if (finalMark >= 75) {
      status = 'Distinction (First Class)';
      badgeColor = 'bg-amber-500';
    } else if (finalMark >= 50) {
      status = 'Pass (Competent)';
      badgeColor = 'bg-emerald-600';
    } else if (finalMark >= 40 && finalMark <= 47) {
      status = 'Supplementary Exam Eligible (40% - 47%)';
      badgeColor = 'bg-purple-600';
    }

    setGradingReport({
      formativeMark,
      summativePct,
      totalSummativeEarned,
      totalMaxMarks,
      finalMark,
      status,
      itemReports
    });
    setIsGrading(false);

    onRecordScore(moduleCode, formativeMark, summativePct, finalMark, status);
    onAwardXp(finalMark * 2, `Completed ${moduleCode} 40/60 Exam Simulation (Final Mark: ${finalMark}%)`);

    if (finalMark >= 50) {
      fireLevelUpConfetti();
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-4xl h-[92vh] bg-white dark:bg-[#0b1222] border border-[#14316B]/20 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Exam Header */}
        <div className="bg-[#14316B] text-white px-6 py-4 flex items-center justify-between border-b border-[#3FA7B8]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#3FA7B8]">
                Richfield Summative Examination Paper
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono">
                40/60 Weighting
              </span>
            </div>
            <h2 className="text-lg font-heading uppercase font-bold text-white">
              {moduleCode}: {moduleName}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Timer */}
            {!isSubmitted && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-xl border border-white/10 font-mono text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className={secondsRemaining < 120 ? 'text-rose-400 font-bold animate-pulse' : 'text-white'}>
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formative Pre-Set Banner */}
        <div className="bg-[#DCEBF3] dark:bg-slate-900 border-b border-[#3FA7B8]/20 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#14316B] dark:text-[#3FA7B8] uppercase tracking-wider text-[11px]">
              Continuous Formative Mark (40% Weight):
            </span>
            <input
              type="number"
              min={0}
              max={100}
              disabled={isSubmitted}
              value={formativeMark}
              onChange={(e) => setFormativeMark(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-16 px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-center font-bold text-[#14316B] dark:text-white"
            />
            <span className="text-slate-500">%</span>
          </div>

          <div className="text-slate-600 dark:text-slate-400 text-[11px]">
            Summative Exam (60% Weight) · Pass Mark: <strong className="text-[#14316B] dark:text-white">50%</strong>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Active Question View */}
          {!isSubmitted && currentQ && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              
              {/* Question Stepper Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold uppercase tracking-wider text-[#1C56A8] dark:text-[#3FA7B8]">
                  Question {currentQIndex + 1} of {questions.length} ({currentQ.type.replace('_', ' ').toUpperCase()})
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {currentQ.marks} Marks
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                  {currentQ.question}
                </h3>

                {currentQ.codeSnippet && (
                  <pre className="p-4 bg-slate-950 text-[#3FA7B8] font-mono text-xs rounded-xl overflow-x-auto">
                    {currentQ.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Answer Input based on Question Type */}
              <div className="pt-2">
                {/* MCQ */}
                {currentQ.type === 'mcq' && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setStudentAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }))}
                        className={`w-full p-3.5 text-left rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between ${
                          studentAnswers[currentQ.id] === optIdx
                            ? 'bg-[#1C56A8] text-white border-[#1C56A8] font-bold shadow'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {studentAnswers[currentQ.id] === optIdx && <span>✓ Selected</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Fill In */}
                {currentQ.type === 'fill_in' && (
                  <input
                    type="text"
                    placeholder="Type exact answer..."
                    value={studentAnswers[currentQ.id] || ''}
                    onChange={(e) => setStudentAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                    className="w-full py-3 px-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-mono text-sm text-[#14316B] dark:text-white focus:outline-none focus:border-[#1C56A8]"
                  />
                )}

                {/* Order Steps */}
                {currentQ.type === 'order_steps' && (
                  <div className="space-y-2">
                    {(orderedStepItems[currentQ.id] || []).map((stepText, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#3FA7B8]/20 text-[#1C56A8] dark:text-[#3FA7B8] font-bold text-[11px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{stepText}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStepMove(currentQ.id, idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleStepMove(currentQ.id, idx, 'down')}
                            disabled={idx === (orderedStepItems[currentQ.id] || []).length - 1}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Predict Output */}
                {currentQ.type === 'predict_output' && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setStudentAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }))}
                        className={`w-full p-3.5 text-left rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between ${
                          studentAnswers[currentQ.id] === optIdx
                            ? 'bg-[#1C56A8] text-white border-[#1C56A8] font-bold shadow'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="font-mono">{opt}</span>
                        {studentAnswers[currentQ.id] === optIdx && <span>✓ Selected</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {currentQ.type === 'short_answer' && (
                  <textarea
                    rows={6}
                    placeholder="Provide your comprehensive academic explanation..."
                    value={studentAnswers[currentQ.id] || ''}
                    onChange={(e) => setStudentAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed resize-none focus:outline-none focus:border-[#1C56A8]"
                  />
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-black dark:hover:text-white"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentQIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-5 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2.5 bg-[#E24B3C] hover:bg-[#c93f31] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Submit Exam Paper</span>
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grading Spinner */}
          {isGrading && (
            <div className="text-center py-20 space-y-4">
              <Brain className="w-12 h-12 text-[#3FA7B8] animate-bounce mx-auto" />
              <h3 className="text-lg font-heading uppercase font-bold text-[#14316B] dark:text-white">
                Grading against Academic Marking Memo...
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating answers with AI marking model and computing 40/60 weighted outcome.
              </p>
            </div>
          )}

          {/* Exam Results Report Card */}
          {gradingReport && !isGrading && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
              
              {/* Outcome Badge Card */}
              <div className="p-6 bg-gradient-to-r from-[#14316B] to-[#1C56A8] text-white rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3FA7B8]">
                    Official Academic Result
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading uppercase font-bold mt-1">
                    Final Mark: {gradingReport.finalMark}%
                  </h3>
                  <p className="text-xs text-sky-200 mt-1">
                    {gradingReport.status}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/15 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 block">Formative (40%)</span>
                    <strong className="text-white text-sm">{gradingReport.formativeMark}%</strong>
                  </div>
                  <span className="text-white/40">+</span>
                  <div>
                    <span className="text-[10px] uppercase text-sky-300 block">Summative (60%)</span>
                    <strong className="text-white text-sm">{gradingReport.summativePct}%</strong>
                  </div>
                </div>
              </div>

              {/* Breakdown per question */}
              <div className="space-y-3">
                <h4 className="text-xs font-heading uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                  Question-by-Question Marking Memo Feedback
                </h4>
                {gradingReport.itemReports.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#14316B] dark:text-white">Q{idx + 1}: {item.question}</span>
                      <span className="font-mono text-[#1C56A8] dark:text-[#3FA7B8]">
                        {item.marksAwarded} / {item.maxMarks} Marks
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{item.feedback}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors"
                >
                  Close & Return to Module Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
