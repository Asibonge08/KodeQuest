import React, { useState } from 'react';
import { Challenge, ProveType, SupportedLanguage } from '../types';
import {
  X,
  BookOpen,
  Gamepad2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Database,
  MessageSquare,
  Send,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  GraduationCap,
  Code2,
  GripVertical
} from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';
import { executeStudentQuery, verifySqlQuery } from '../data/richfieldDatabase';

interface LearnPlayProveModalProps {
  challenge: Challenge;
  isCompleted: boolean;
  onClose: () => void;
  onComplete: (challengeId: string, earnedXp: number) => void;
}

const SUPPORTED_LANGUAGES: Array<{ id: SupportedLanguage; label: string; ext: string }> = [
  { id: 'javascript', label: 'JavaScript (Node/ES6)', ext: 'js' },
  { id: 'python', label: 'Python 3', ext: 'py' },
  { id: 'sql', label: 'SQL (Relational MySQL)', ext: 'sql' },
  { id: 'java', label: 'Java (Oracle JDK)', ext: 'java' },
  { id: 'csharp', label: 'C# (.NET Core)', ext: 'cs' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'php', label: 'PHP 8', ext: 'php' },
  { id: 'vbnet', label: 'VB.NET', ext: 'vb' },
  { id: 'html_css', label: 'HTML5 & CSS3', ext: 'html' }
];

export const LearnPlayProveModal: React.FC<LearnPlayProveModalProps> = ({
  challenge,
  isCompleted,
  onClose,
  onComplete
}) => {
  // Stages: 1 = Learn, 2 = Play, 3 = Gate, 4 = Prove
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);

  // Learn Stage: Swipeable One-Idea Cards State (Card 0..3)
  const [learnCardIndex, setLearnCardIndex] = useState(0);

  // Play Stage State
  const [orderedItems, setOrderedItems] = useState<string[]>(
    challenge.play.scrambledItems ? challenge.play.scrambledItems.map((i) => i.id) : []
  );
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [toggledBits, setToggledBits] = useState<number[]>([1, 1, 0, 0, 0, 0, 0, 0]); // for subnet builder
  const [playChecked, setPlayChecked] = useState(false);
  const [playPassed, setPlayPassed] = useState(false);
  const [itemFeedbackMap, setItemFeedbackMap] = useState<Record<string, boolean>>({});
  const [whyExplanation, setWhyExplanation] = useState<string | null>(null);

  // Conceptual Gate Code State
  const [enteredGateAnswer, setEnteredGateAnswer] = useState('');
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // Prove Stage State
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    challenge.proveType === 'sql' ? 'sql' : 'javascript'
  );
  const [code, setCode] = useState(challenge.starterCode || '');
  const [sqlCode, setSqlCode] = useState(challenge.sqlTask?.starterSql || '');
  const [sqlResults, setSqlResults] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Dialogue Simulation State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; isUser: boolean }>>([
    {
      sender: challenge.dialogueTask?.stakeholderName || 'Stakeholder',
      text: challenge.dialogueTask?.initialGreeting || 'Hello. Let us discuss the system specifications.',
      isUser: false
    }
  ]);
  const [studentInput, setStudentInput] = useState('');
  const [dialogueMood, setDialogueMood] = useState<string>(challenge.dialogueTask?.personaMood || 'Impatient');
  const [dialogueTurnCount, setDialogueTurnCount] = useState(1);
  const [dialogueFinished, setDialogueFinished] = useState(false);
  const [dialogueDebrief, setDialogueDebrief] = useState<any | null>(null);

  // 3-Step Hint Ladder (-10, -20, -30 XP)
  const [revealedHints, setRevealedHints] = useState<number>(0);

  const calculateDeduction = () => {
    let d = 0;
    if (revealedHints >= 1) d += 10;
    if (revealedHints >= 2) d += 20;
    if (revealedHints >= 3) d += 30;
    return d;
  };

  const potentialXp = Math.max(10, challenge.points - calculateDeduction());

  // ------------------ PLAY VALIDATION WITH PER-ITEM FEEDBACK ------------------
  const handleCheckPlay = () => {
    setPlayChecked(true);

    if (
      challenge.play.type === 'order_lines' ||
      challenge.play.type === 'bpmn_sort' ||
      challenge.play.type === 'sql_clause_order'
    ) {
      const correctOrder = challenge.play.correctOrder || [];
      const itemMap: Record<string, boolean> = {};

      orderedItems.forEach((id, idx) => {
        itemMap[id] = correctOrder[idx] === id;
      });
      setItemFeedbackMap(itemMap);

      const isAllCorrect = JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
      if (isAllCorrect) {
        setPlayPassed(true);
        setWhyExplanation(
          challenge.play.explanation ||
            'Each step executes in strict logical dependency order so downstream components receive valid state.'
        );
      } else {
        setWhyExplanation('Inspect the items highlighted in red. Reorder them according to execution order.');
      }
    } else if (challenge.play.type === 'tap_bug') {
      const line = challenge.play.codeLines?.find((l) => l.lineNumber === selectedBugLine);
      if (line && line.isBug) {
        setPlayPassed(true);
        setWhyExplanation(`Correct! ${line.fixHint}`);
      } else {
        setWhyExplanation('That line is syntactically sound. Look for sign reversal, off-by-one, or boundary bugs.');
      }
    } else if (challenge.play.type === 'subnet_builder') {
      const sum = toggledBits.reduce((acc, bit, idx) => acc + (bit ? Math.pow(2, 7 - idx) : 0), 0);
      if (sum === 192) {
        setPlayPassed(true);
        setWhyExplanation('Subnet mask 255.255.255.192 provides 2 bits for subnets and 6 bits for 62 usable hosts.');
      } else {
        setWhyExplanation(`Current 4th octet is ${sum}. For /26 you must turn on bits 128 and 64 (128 + 64 = 192).`);
      }
    } else if (challenge.play.type === 'predict_output' || challenge.play.type === 'spot_vulnerability') {
      if (selectedOption === challenge.play.correctOptionIndex) {
        setPlayPassed(true);
        setWhyExplanation(challenge.play.explanation || 'Option matches execution evaluation.');
      } else {
        setWhyExplanation('Review operator precedence and branch condition.');
      }
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orderedItems.length) return;
    const newItems = [...orderedItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setOrderedItems(newItems);
    setPlayChecked(false);
  };

  // ------------------ CONCEPTUAL GATE CODE VALIDATION ------------------
  // Rather than mindlessly copying, gate tests understanding derived from the play stage
  const expectedGateAnswer = challenge.play.secretGateCode.trim().toUpperCase();

  const handleVerifyGateAnswer = () => {
    const entered = enteredGateAnswer.trim().toUpperCase();
    if (entered === expectedGateAnswer || entered.includes(expectedGateAnswer)) {
      setGateUnlocked(true);
      setGateError(null);
      setCurrentStage(4);
    } else {
      setGateError(`Answer incorrect. Review the Play stage outcome: Hint answer is "${challenge.play.secretGateCode}"`);
    }
  };

  // ------------------ PROVE STAGE EXECUTION ------------------
  const handleExecuteProve = () => {
    setIsEvaluating(true);

    if (challenge.proveType === 'code') {
      setTimeout(() => {
        if (!challenge.testCases) {
          setIsEvaluating(false);
          return;
        }

        // Run client test cases
        const results = challenge.testCases.map((tc) => {
          try {
            const outcome = tc.check(code);
            return { id: tc.id, name: tc.name, passed: outcome.passed, message: outcome.message };
          } catch (err: any) {
            return { id: tc.id, name: tc.name, passed: false, message: `Runtime error: ${err.message}` };
          }
        });

        setTestResults(results);
        setIsEvaluating(false);

        const allPassed = results.every((r) => r.passed);
        if (allPassed && !isCompleted) {
          fireSuccessConfetti();
          onComplete(challenge.id, potentialXp);
        }
      }, 300);
    } else if (challenge.proveType === 'sql' && challenge.sqlTask) {
      setTimeout(() => {
        const queryOutcome = verifySqlQuery(sqlCode, challenge.sqlTask!.expectedQuery);
        setSqlResults(queryOutcome);
        setIsEvaluating(false);

        if (queryOutcome.passed && !isCompleted) {
          fireSuccessConfetti();
          onComplete(challenge.id, potentialXp);
        }
      }, 300);
    }
  };

  // BA Stakeholder Dialogue turn
  const handleSendDialogue = async () => {
    if (!studentInput.trim() || !challenge.dialogueTask) return;
    const text = studentInput.trim();
    setStudentInput('');

    const newTurns = [...chatMessages, { sender: 'You (Lead BA)', text, isUser: true }];
    setChatMessages(newTurns);
    const nextTurn = dialogueTurnCount + 1;
    setDialogueTurnCount(nextTurn);

    try {
      const res = await fetch('/api/ai/ba-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: { brief: challenge.dialogueTask.scenarioBrief },
          stakeholder: {
            name: challenge.dialogueTask.stakeholderName,
            role: challenge.dialogueTask.stakeholderRole,
            mood: dialogueMood
          },
          turnCount: nextTurn,
          studentMessage: text,
          chatHistory: newTurns.slice(-4)
        })
      });

      const data = await res.json();
      setDialogueMood(data.mood || 'Cooperative');
      setChatMessages((prev) => [
        ...prev,
        { sender: challenge.dialogueTask!.stakeholderName, text: data.reply, isUser: false }
      ]);

      if (data.isFinished || nextTurn >= 4) {
        setDialogueFinished(true);
        setDialogueDebrief(data.debrief || {
          youAsked: 'Addressed DHET compliance, eligibility verification, and audit logs.',
          youMissed: 'Ensure POPIA data retention consent rules are stated.',
          strongerVersion: 'Draft user story using: As a [role], I want [action], So that [business benefit].'
        });

        if (!isCompleted) {
          fireSuccessConfetti();
          onComplete(challenge.id, potentialXp);
        }
      }
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: challenge.dialogueTask!.stakeholderName,
          text: 'Understood. Please provide the acceptance criteria in Given-When-Then format.',
          isUser: false
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col w-full max-w-5xl h-[94vh] bg-white dark:bg-[#0b1222] border border-[#14316B]/20 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#14316B] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#3FA7B8]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3FA7B8]/20 border border-[#3FA7B8]/50 flex items-center justify-center text-[#3FA7B8] font-bold text-xs">
              {challenge.moduleCode.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading uppercase text-xs sm:text-sm font-bold tracking-wider text-white">
                  {challenge.moduleCode} · {challenge.title}
                </span>
                {isCompleted && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-sky-200">
                <span>{challenge.yearLevel}</span>
                <span>·</span>
                <span>NQF {challenge.nqfLevel}</span>
                <span>·</span>
                <span className="text-[#3FA7B8] font-semibold">{challenge.ditCredits} Credits</span>
                <span>·</span>
                <span className="text-[#E24B3C] font-bold tabular-nums">+{potentialXp} XP Available</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Stage Stepper Ribbon */}
        <div className="bg-[#DCEBF3] dark:bg-slate-900 border-b border-[#3FA7B8]/20 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 sm:gap-6 font-semibold">
            {/* Stage 1: LEARN */}
            <button
              onClick={() => setCurrentStage(1)}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStage === 1
                  ? 'text-[#1C56A8] dark:text-[#3FA7B8] font-bold border-b-2 border-[#1C56A8] dark:border-[#3FA7B8] pb-0.5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#14316B]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. LEARN</span>
            </button>

            {/* Stage 2: PLAY */}
            <button
              onClick={() => setCurrentStage(2)}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStage === 2
                  ? 'text-[#1C56A8] dark:text-[#3FA7B8] font-bold border-b-2 border-[#1C56A8] dark:border-[#3FA7B8] pb-0.5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#14316B]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>2. PLAY {playPassed && '✓'}</span>
            </button>

            {/* Stage 3: GATE */}
            <button
              onClick={() => setCurrentStage(3)}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStage === 3
                  ? 'text-[#1C56A8] dark:text-[#3FA7B8] font-bold border-b-2 border-[#1C56A8] dark:border-[#3FA7B8] pb-0.5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#14316B]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>3. GATE {gateUnlocked && '🔓'}</span>
            </button>

            {/* Stage 4: PROVE */}
            <button
              onClick={() => (gateUnlocked ? setCurrentStage(4) : setCurrentStage(3))}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStage === 4
                  ? 'text-[#1C56A8] dark:text-[#3FA7B8] font-bold border-b-2 border-[#1C56A8] dark:border-[#3FA7B8] pb-0.5'
                  : !gateUnlocked
                  ? 'text-slate-400 opacity-60 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#14316B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4. PROVE</span>
            </button>
          </div>

          {/* Hint Ladder Deductions */}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="hidden sm:inline">Hint Ladder:</span>
            <span className="font-bold text-[#E24B3C] font-mono">{revealedHints}/3</span>
            {revealedHints > 0 && <span className="text-[11px] text-rose-500 font-bold">(-{calculateDeduction()} XP)</span>}
          </div>
        </div>

        {/* Stage Content Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* ================= STAGE 1: LEARN (SWIPEABLE ONE-IDEA CARDS) ================= */}
          {currentStage === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-[#3FA7B8]">
                  Step-by-Step Concept Cards (Card {learnCardIndex + 1} of 4)
                </span>
                <h2 className="text-xl sm:text-2xl font-heading uppercase font-bold text-[#14316B] dark:text-white">
                  {challenge.learn.headline}
                </h2>
              </div>

              {/* Progress Dots Indicator */}
              <div className="flex justify-center items-center gap-2">
                {[0, 1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setLearnCardIndex(dot)}
                    className={`h-2 rounded-full transition-all ${
                      learnCardIndex === dot ? 'w-8 bg-[#1C56A8]' : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* One-Idea Card 0: Plain English Intuition */}
              {learnCardIndex === 0 && (
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-[#1C56A8]/30 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#1C56A8] dark:text-[#3FA7B8]">
                      Card 1 · Core Principle in Plain English
                    </span>
                    <span className="text-xs font-mono text-slate-400">~2 min read</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
                    {challenge.learn.plainEnglishExplanation}
                  </p>

                  <div className="p-3 bg-[#DCEBF3]/60 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                    💡 <strong>Takeaway:</strong> Focus on understanding why the computer requires this structure before looking at any syntax.
                  </div>
                </div>
              )}

              {/* One-Idea Card 1: South African Real-World Analogy */}
              {learnCardIndex === 1 && (
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-[#3FA7B8]/40 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#3FA7B8]">
                      Card 2 · South African Everyday Analogy
                    </span>
                    <span className="text-xl">🇿🇦</span>
                  </div>

                  <blockquote className="text-sm sm:text-base italic text-slate-800 dark:text-slate-200 leading-relaxed pl-4 border-l-4 border-[#3FA7B8]">
                    &ldquo;{challenge.learn.realWorldAnalogy}&rdquo;
                  </blockquote>

                  <p className="text-xs text-slate-500">
                    Relating technical computing mechanics to everyday operations makes architecture intuitive.
                  </p>
                </div>
              )}

              {/* One-Idea Card 2: Worked Example & Visual Walkthrough */}
              {learnCardIndex === 2 && (
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#14316B] dark:text-white">
                      Card 3 · {challenge.learn.workedExample.title}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Architecture</span>
                  </div>

                  <pre className="p-4 bg-slate-950 text-[#3FA7B8] font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                    {challenge.learn.workedExample.codeOrDiagram}
                  </pre>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {challenge.learn.workedExample.explanation}
                  </p>
                </div>
              )}

              {/* One-Idea Card 3: Exam Cheatsheet & Refresher */}
              {learnCardIndex === 3 && (
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                      Card 4 · Richfield Exam Cheat Sheet
                    </span>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold font-mono">
                      High Yield
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                    {challenge.learn.refresher.quickNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#3FA7B8] font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 bg-slate-900 text-sky-300 font-mono text-xs rounded-xl border border-slate-800">
                    <code>{challenge.learn.refresher.cheatSheet}</code>
                  </div>
                </div>
              )}

              {/* Slide Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setLearnCardIndex((prev) => Math.max(0, prev - 1))}
                  disabled={learnCardIndex === 0}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Card</span>
                </button>

                {learnCardIndex < 3 ? (
                  <button
                    onClick={() => setLearnCardIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    <span>Next Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStage(2)}
                    className="px-6 py-2.5 bg-[#E24B3C] hover:bg-[#c93f31] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Stage 2: Play</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= STAGE 2: PLAY (DRAG HANDLES & PER-ITEM FEEDBACK) ================= */}
          {currentStage === 2 && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-[#3FA7B8]">
                  Stage 2 · Interactive Mini-Game
                </span>
                <h2 className="text-xl sm:text-2xl font-heading uppercase font-bold text-[#14316B] dark:text-white mt-1">
                  Solve Puzzle to Derive Verification Answer
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {challenge.play.prompt}
                </p>
              </div>

              {/* Variant 1: Scrambled Steps with Drag Handles ⠿ and Per-Item Feedback */}
              {(challenge.play.type === 'order_lines' ||
                challenge.play.type === 'bpmn_sort' ||
                challenge.play.type === 'sql_clause_order') && (
                <div className="space-y-2">
                  {orderedItems.map((itemId, idx) => {
                    const item = challenge.play.scrambledItems?.find((i) => i.id === itemId);
                    const isItemCorrect = itemFeedbackMap[itemId];

                    return (
                      <div
                        key={itemId}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors shadow-sm ${
                          playChecked
                            ? isItemCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/60 text-rose-800 dark:text-rose-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="cursor-grab text-slate-400 hover:text-slate-600 select-none">
                            <GripVertical className="w-4 h-4" />
                          </span>
                          <span className="w-6 h-6 rounded-full bg-[#1C56A8]/10 text-[#1C56A8] dark:text-[#3FA7B8] font-bold text-[11px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-xs">{item?.text}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {playChecked && (
                            <span className="text-[10px] font-bold uppercase tracking-wider mr-2">
                              {isItemCorrect ? '✓ Correct' : '✗ Misplaced'}
                            </span>
                          )}
                          <button
                            onClick={() => moveItem(idx, 'up')}
                            disabled={idx === 0 || playPassed}
                            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveItem(idx, 'down')}
                            disabled={idx === orderedItems.length - 1 || playPassed}
                            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Variant 2: Tap the Bug */}
              {challenge.play.type === 'tap_bug' && (
                <div className="space-y-2">
                  {challenge.play.codeLines?.map((line) => {
                    const isSelected = selectedBugLine === line.lineNumber;
                    return (
                      <button
                        key={line.lineNumber}
                        onClick={() => {
                          setSelectedBugLine(line.lineNumber);
                          setPlayChecked(false);
                        }}
                        className={`w-full p-3 text-left rounded-xl border font-mono text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1C56A8]/10 border-[#1C56A8] text-[#14316B] dark:text-white font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-[11px] w-6">{line.lineNumber}.</span>
                          <span>{line.text}</span>
                        </div>
                        {isSelected && <span className="text-[10px] uppercase font-bold text-[#E24B3C]">Flagged</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Variant 3: Subnet Builder */}
              {challenge.play.type === 'subnet_builder' && (
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Toggle the 8 bits of the 4th octet to synthesize the exact /26 mask:
                  </p>
                  <div className="flex justify-center items-center gap-2">
                    {[128, 64, 32, 16, 8, 4, 2, 1].map((weight, idx) => (
                      <button
                        key={weight}
                        onClick={() => {
                          if (playPassed) return;
                          const next = [...toggledBits];
                          next[idx] = next[idx] === 1 ? 0 : 1;
                          setToggledBits(next);
                          setPlayChecked(false);
                        }}
                        className={`w-10 h-12 rounded-lg border flex flex-col items-center justify-center font-mono transition-colors ${
                          toggledBits[idx] === 1
                            ? 'bg-[#1C56A8] text-white border-[#1C56A8]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-sm font-bold">{toggledBits[idx]}</span>
                        <span className="text-[9px] opacity-70">{weight}</span>
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    Current Octet Value: <strong>{toggledBits.reduce((acc, bit, idx) => acc + (bit ? Math.pow(2, 7 - idx) : 0), 0)}</strong>
                  </div>
                </div>
              )}

              {/* Variant 4: Predict Output / Spot Vulnerability */}
              {(challenge.play.type === 'predict_output' || challenge.play.type === 'spot_vulnerability') && (
                <div className="space-y-4">
                  {challenge.play.snippet && (
                    <pre className="p-4 bg-slate-950 text-[#3FA7B8] font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                      {challenge.play.snippet}
                    </pre>
                  )}
                  <div className="space-y-2">
                    {challenge.play.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedOption(i);
                          setPlayChecked(false);
                        }}
                        className={`w-full p-3 text-left rounded-xl border text-xs transition-colors flex items-center justify-between ${
                          selectedOption === i
                            ? 'bg-[#1C56A8]/10 border-[#1C56A8] text-[#14316B] dark:text-white font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOption === i && <span className="text-[#1C56A8] font-bold">Selected</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* "Why" Explanation Panel */}
              {whyExplanation && (
                <div
                  className={`p-4 rounded-xl text-xs leading-relaxed border ${
                    playPassed
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/40 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <p className="font-bold mb-1">
                    {playPassed ? '✓ Correct! Architectural Why:' : '⚠️ Why this failed:'}
                  </p>
                  <p>{whyExplanation}</p>
                  {playPassed && (
                    <p className="mt-2 font-mono text-[11px] text-[#1C56A8] dark:text-[#3FA7B8] font-semibold">
                      Derived Gate Key: &ldquo;{challenge.play.secretGateCode}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStage(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
                >
                  Back to Learn
                </button>

                <div className="flex items-center gap-3">
                  {!playPassed ? (
                    <button
                      onClick={handleCheckPlay}
                      className="px-5 py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors"
                    >
                      Check Answer & View &ldquo;Why&rdquo;
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEnteredGateAnswer(challenge.play.secretGateCode);
                        setCurrentStage(3);
                      }}
                      className="px-6 py-2.5 bg-[#E24B3C] hover:bg-[#c93f31] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <span>Proceed to Stage 3: Gate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: CONCEPTUAL GATE ================= */}
          {currentStage === 3 && (
            <div className="max-w-md mx-auto py-8 space-y-6 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-[#1C56A8]/10 dark:bg-[#3FA7B8]/10 border-2 border-[#1C56A8] dark:border-[#3FA7B8] flex items-center justify-center mx-auto text-[#1C56A8] dark:text-[#3FA7B8]">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-heading uppercase font-bold text-[#14316B] dark:text-white">
                  Verification Gate
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Confirm your conceptual understanding derived from Stage 2 to unlock Stage 4: Prove.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={`Type answer (e.g. ${challenge.play.secretGateCode})`}
                  value={enteredGateAnswer}
                  onChange={(e) => setEnteredGateAnswer(e.target.value)}
                  className="w-full text-center py-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl font-mono text-base tracking-widest text-[#14316B] dark:text-white uppercase focus:outline-none focus:border-[#1C56A8]"
                />

                {gateError && (
                  <p className="text-xs text-rose-500 font-semibold">{gateError}</p>
                )}

                <button
                  onClick={handleVerifyGateAnswer}
                  className="w-full py-3 bg-[#E24B3C] hover:bg-[#c93f31] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Stage 4: Prove</span>
                </button>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentStage(2)}
                    className="text-xs text-slate-500 hover:text-[#1C56A8] dark:hover:text-[#3FA7B8]"
                  >
                    Return to Play Stage
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 4: PROVE (MULTI-LANGUAGE & HINT LADDER) ================= */}
          {currentStage === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Prove Header & 3-Step Hint Ladder */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#3FA7B8]">
                    Stage 4 · Final Proof
                  </span>
                  <h2 className="text-xl font-heading uppercase font-bold text-[#14316B] dark:text-white">
                    {challenge.proveType === 'code' && 'Solve & Run Automated Test Suite'}
                    {challenge.proveType === 'sql' && 'Relational Database SQL Playground'}
                    {challenge.proveType === 'dialogue' && 'Stakeholder Elicitation Dialogue'}
                  </h2>
                </div>

                {/* 3-Step Hint Ladder */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRevealedHints((prev) => Math.min(3, prev + 1))}
                    disabled={revealedHints >= 3 || isCompleted}
                    className="px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold hover:bg-amber-500/20 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      {revealedHints === 0 && 'Hint 1: Nudge (-10 XP)'}
                      {revealedHints === 1 && 'Hint 2: Direction (-20 XP)'}
                      {revealedHints === 2 && 'Hint 3: Pseudocode (-30 XP)'}
                      {revealedHints >= 3 && 'All 3 Hints Revealed'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hint Ladder Display Box */}
              {revealedHints > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs space-y-2 text-amber-900 dark:text-amber-200">
                  {revealedHints >= 1 && <p><strong>Hint 1 (Nudge):</strong> {challenge.hints.nudge}</p>}
                  {revealedHints >= 2 && <p><strong>Hint 2 (Direction):</strong> {challenge.hints.direction}</p>}
                  {revealedHints >= 3 && (
                    <div className="space-y-1">
                      <strong>Hint 3 (Pseudocode):</strong>
                      <pre className="p-2 bg-slate-900 text-amber-300 font-mono text-[11px] rounded">
                        {challenge.hints.pseudocode}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- PROVE TYPE 1: CODE WITH MULTI-LANGUAGE PICKER ---------------- */}
              {challenge.proveType === 'code' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Code Editor */}
                  <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden min-h-[380px]">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      
                      {/* Language Picker Dropdown */}
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#3FA7B8]" />
                        <select
                          value={selectedLang}
                          onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                          className="bg-slate-800 text-white py-1 px-2.5 rounded text-xs border border-slate-700 font-mono focus:outline-none"
                        >
                          {SUPPORTED_LANGUAGES.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => setCode(challenge.starterCode || '')}
                        className="hover:text-white flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>

                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                      className="flex-1 p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    />

                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={handleExecuteProve}
                        disabled={isEvaluating}
                        className="px-5 py-2 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isEvaluating ? 'Running Tests...' : 'Run Automated Tests'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Test Cases Output */}
                  <div className="lg:col-span-5 space-y-3">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                      Automated Assessment Test Suite
                    </h4>
                    {!testResults && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500">
                        Click &ldquo;Run Automated Tests&rdquo; to execute the test suite against your code.
                      </div>
                    )}
                    {testResults && (
                      <div className="space-y-2">
                        {testResults.map((t) => (
                          <div
                            key={t.id}
                            className={`p-3 rounded-xl border text-xs ${
                              t.passed
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/40 text-rose-800 dark:text-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{t.name}</span>
                              <span>{t.passed ? '✓ PASSED' : '✗ FAILED'}</span>
                            </div>
                            <p className="mt-1 text-[11px] opacity-80">{t.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---------------- PROVE TYPE 2: SQL PLAYGROUND ---------------- */}
              {challenge.proveType === 'sql' && challenge.sqlTask && (
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-[#14316B] dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#3FA7B8]" />
                      <span>Task Description</span>
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300">{challenge.sqlTask.taskDescription}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{challenge.sqlTask.schemaHint}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* SQL Editor */}
                    <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden min-h-[300px]">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono">query.sql</span>
                        <button
                          onClick={() => setSqlCode(challenge.sqlTask?.starterSql || '')}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>
                      <textarea
                        value={sqlCode}
                        onChange={(e) => setSqlCode(e.target.value)}
                        spellCheck={false}
                        className="flex-1 p-4 bg-transparent text-sky-300 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                      />
                      <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={handleExecuteProve}
                          disabled={isEvaluating}
                          className="px-5 py-2 bg-[#3FA7B8] hover:bg-[#328e9d] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-2"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>{isEvaluating ? 'Executing SQL...' : 'Run & Verify SQL'}</span>
                        </button>
                      </div>
                    </div>

                    {/* SQL Result Table View */}
                    <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="px-4 py-2 bg-[#DCEBF3] dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-[#14316B] dark:text-white">
                        Result Table Set
                      </div>
                      <div className="flex-1 p-3 overflow-auto max-h-[280px]">
                        {!sqlResults && (
                          <p className="text-xs text-slate-500 text-center py-8">
                            Click &ldquo;Run & Verify SQL&rdquo; to execute query against in-memory Richfield database.
                          </p>
                        )}
                        {sqlResults && (
                          <div className="space-y-2">
                            <div
                              className={`p-2 rounded text-xs font-semibold ${
                                sqlResults.passed
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {sqlResults.message}
                            </div>
                            {sqlResults.studentRows && sqlResults.studentRows.length > 0 && (
                              <table className="w-full text-left text-[11px] border border-slate-200 dark:border-slate-800">
                                <thead className="bg-[#3FA7B8] text-white">
                                  <tr>
                                    {Object.keys(sqlResults.studentRows[0]).map((col) => (
                                      <th key={col} className="p-1.5 font-mono">{col}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {sqlResults.studentRows.map((r: any, idx: number) => (
                                    <tr key={idx} className="border-t border-slate-200 dark:border-slate-800">
                                      {Object.values(r).map((val: any, i) => (
                                        <td key={i} className="p-1.5">{String(val)}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- PROVE TYPE 3: DIALOGUE SIMULATION ---------------- */}
              {challenge.proveType === 'dialogue' && challenge.dialogueTask && (
                <div className="space-y-4">
                  {/* Scenario Card with Stakeholder Mood Meter */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#14316B] dark:text-white uppercase tracking-wider">
                        Scenario: {challenge.dialogueTask.scenarioBrief}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Stakeholder Mood:</span>
                        <span className="px-2 py-0.5 rounded font-bold bg-[#DCEBF3] dark:bg-slate-800 text-[#1C56A8] dark:text-[#3FA7B8]">
                          {dialogueMood}
                        </span>
                        <span className="text-slate-400 font-mono">Turn {dialogueTurnCount}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Stream */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-3 rounded-xl text-xs max-w-[85%] ${
                            m.isUser
                              ? 'bg-[#1C56A8] text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="font-bold block text-[10px] opacity-75 mb-0.5">{m.sender}</span>
                          <p>{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Debrief Card when finished */}
                  {dialogueFinished && dialogueDebrief && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs space-y-2">
                      <h5 className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        BA Dialogue Simulation Debrief Cards:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">You Asked:</span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300">{dialogueDebrief.youAsked}</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">You Missed:</span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300">{dialogueDebrief.youMissed}</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] uppercase font-bold text-[#1C56A8] dark:text-[#3FA7B8] block mb-1">Stronger Version:</span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300">{dialogueDebrief.strongerVersion}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Pinned */}
                  {!dialogueFinished && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={studentInput}
                        onChange={(e) => setStudentInput(e.target.value)}
                        placeholder="Ask stakeholder an elicitation question or specify INVEST criteria..."
                        className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1C56A8]"
                      />
                      <button
                        onClick={handleSendDialogue}
                        className="px-4 py-2 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors flex items-center gap-1.5"
                      >
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
