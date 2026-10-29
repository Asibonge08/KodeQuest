export type ProgrammeId = 'DIT' | 'BSc_IT';

export interface ProgrammeInfo {
  id: ProgrammeId;
  name: string;
  fullName: string;
  saqaId: string;
  nqfLevel: number;
  totalCredits: number;
  durationYears: number;
  accreditation: string;
  specialisations: string[];
  description: string;
}

export type DITFocusArea = 
  | 'programming'
  | 'networking'
  | 'business_analysis'
  | 'cybersecurity'
  | 'emerging_tech'
  | 'databases'
  | 'mathematics';

export interface FocusAreaMeta {
  id: DITFocusArea;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgLight: string;
  prospectusModuleCode: string;
  electiveStream: string;
  careerPaths: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FrameworkLesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
  conceptSummary: string;
  codeSnippet: string;
  keyPoints: string[];
  quiz?: QuizQuestion;
}

export interface FrameworkTrack {
  id: string;
  name: string;
  focusArea: DITFocusArea;
  category: string;
  partnerBadge: string;
  level: 'Foundational' | 'Specialist' | 'Mastery';
  totalXp: number;
  description: string;
  badgeIcon: string;
  lessons: FrameworkLesson[];
}

export type DITYearLevel = 'Year 1' | 'Year 2' | 'Year 3';

export interface CurriculumModule {
  code: string;
  name: string;
  year: 1 | 2 | 3;
  semester: 1 | 2;
  nqfLevel: number;
  credits: number;
  isElective?: boolean;
  specialisation?: string;
  programme: ProgrammeId;
  description: string;
  badgePartner?: string;
}

export interface LearnContent {
  headline: string;
  estimatedMinutes: number;
  plainEnglishExplanation: string;
  realWorldAnalogy: string;
  workedExample: {
    title: string;
    codeOrDiagram: string;
    explanation: string;
  };
  refresher: {
    topic: string;
    quickNotes: string[];
    cheatSheet: string;
  };
}

export type PlayGameType = 
  | 'order_lines'
  | 'tap_bug'
  | 'match_osi'
  | 'subnet_builder'
  | 'bpmn_sort'
  | 'spot_vulnerability'
  | 'predict_output'
  | 'sql_clause_order';

export interface PlayMiniGame {
  type: PlayGameType;
  prompt: string;
  secretGateCode: string; // Revealed upon passing (e.g. "LOOP-7421")
  // For order_lines or bpmn_sort
  scrambledItems?: Array<{ id: string; text: string }>;
  correctOrder?: string[];
  // For tap_bug
  codeLines?: Array<{ lineNumber: number; text: string; isBug: boolean; fixHint: string }>;
  // For match_osi or match_terms
  matchPairs?: Array<{ left: string; right: string }>;
  // For subnet_builder
  targetSubnet?: { prefix: number; targetMask: string; hostBitsNeeded: number };
  // For predict_output
  snippet?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
}

export type ProveType = 'code' | 'sql' | 'dialogue';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  expectedOutput: string;
  check: (code: string) => { passed: boolean; message: string };
}

export interface SqlVerification {
  taskDescription: string;
  schemaHint: string;
  starterSql: string;
  expectedQuery: string; // for comparing query results or execution
  forbiddenKeywords?: string[];
  mustIncludeKeywords?: string[];
}

export interface DialogueTurn {
  speaker: string;
  role: string;
  message: string;
  avatar?: string;
}

export interface DialogueSimulation {
  stakeholderName: string;
  stakeholderRole: string;
  scenarioBrief: string;
  personaMood: 'Impatient' | 'Skeptical' | 'Enthusiastic' | 'Demanding' | 'Confused';
  initialGreeting: string;
  sampleElicitationQuestions: string[];
  evalCriteria: {
    elicitationScore: number;
    investScore: number;
    scopeManagementScore: number;
  };
  expertDebrief: string;
}

export interface Challenge {
  id: string;
  title: string;
  programme: ProgrammeId | 'BOTH';
  focusArea: DITFocusArea;
  yearLevel: DITYearLevel;
  moduleCode: string;
  moduleName: string;
  nqfLevel: number;
  ditCredits: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  framework: string;
  industryPartner?: 'AWS' | 'Cisco' | 'IBM' | 'Oracle' | 'Fortinet' | 'CIMA' | 'Microsoft' | 'Salesforce';
  
  // 3-Stage Learn -> Play -> Prove Architecture
  learn: LearnContent;
  play: PlayMiniGame;
  proveType: ProveType;
  
  // Prove task data
  starterCode?: string;
  testCases?: TestCase[];
  sqlTask?: SqlVerification;
  dialogueTask?: DialogueSimulation;
  sampleSolution: string;
  solutionExplanation: string;
  
  // 3-Step Hint Ladder (-10, -20, -30 XP)
  hints: {
    nudge: string;       // -10 XP
    direction: string;   // -20 XP
    pseudocode: string;  // -30 XP
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: DITFocusArea | 'General';
  partner?: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requiredModule?: string;
}

export type CampusName = 
  | 'Bryanston'
  | 'Newtown Junction'
  | 'Pretoria'
  | 'Centurion'
  | 'Polokwane'
  | 'Cape Town'
  | 'Umhlanga'
  | 'Musgrave'
  | 'Distance Learning';

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  handle: string;
  campus: CampusName;
  programme: ProgrammeId;
  stream: string;
  points: number;
  challengesSolved: number;
  streakDays: number;
  avatarSeed: string;
  isCurrentUser?: boolean;
}

export type SupportedLanguage = 
  | 'javascript'
  | 'python'
  | 'sql'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'php'
  | 'vbnet'
  | 'html_css';

export interface TeachBackGap {
  id: string;
  moduleCode: string;
  topic: string;
  dateAdded: string;
  resolved: boolean;
}

export interface SourceVaultDoc {
  id: string;
  moduleCode: string;
  title: string;
  rawText: string;
  youtubeUrl?: string;
  uploadedAt: string;
  summary?: string;
  flashcards?: Array<{ question: string; answer: string; citation: string }>;
}

export interface ExamQuestion {
  id: string;
  type: 'mcq' | 'fill_in' | 'order_steps' | 'predict_output' | 'short_answer';
  question: string;
  marks: number;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  scrambledSteps?: string[];
  correctStepsOrder?: string[];
  codeSnippet?: string;
  markingMemo: string;
}

export interface UserProfileState {
  name: string;
  handle: string;
  studentId: string;
  campus: CampusName;
  programme: ProgrammeId;
  stream: string;
  currentYear: 1 | 2 | 3;
  totalPoints: number;
  currentLevel: number;
  levelProgressXp: number;
  nextLevelXp: number;
  streakDays: number;
  generatorFuel: number; // Streak Freeze tokens against load-shedding
  generatorActive: boolean;
  completedChallengeIds: string[];
  passedPlayStages: string[]; // Challenge IDs where play stage passed
  unlockedBadgeIds: string[];
  weakTopics: string[]; // Spaced repetition review list
  teachBackGaps: TeachBackGap[];
  moduleReadiness: Record<string, { formative: number; summative: number; readinessPct: number }>;
  examScores: Record<string, { score: number; maxMarks: number; date: string; statusText: string }>;
  pointsHistory: Array<{ date: string; points: number; reason: string }>;
}
