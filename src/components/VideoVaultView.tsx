import React, { useState } from 'react';
import {
  Youtube,
  Search,
  ExternalLink,
  Play,
  CheckCircle2,
  Award,
  BookOpen,
  Filter,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';

interface VideoVaultViewProps {
  onAwardXp: (amount: number, reason: string) => void;
}

interface CuratedChannel {
  name: string;
  handle: string;
  searchUrl: string;
  specialty: string;
  recommendedFor: string[];
  color: string;
}

const CURATED_CHANNELS: CuratedChannel[] = [
  {
    name: 'Bro Code',
    handle: '@BroCodez',
    searchUrl: 'https://www.youtube.com/@BroCodez/search?query=',
    specialty: 'Clear, fast-paced Full Courses in Python, Java, C++, C#, and Web Tech',
    recommendedFor: ['PROG511', 'PROG512', 'PROG621', 'WEB511'],
    color: '#E24B3C'
  },
  {
    name: 'freeCodeCamp.org',
    handle: '@freecodecamp',
    searchUrl: 'https://www.youtube.com/@freecodecamp/search?query=',
    specialty: 'Comprehensive zero-to-hero certifications across all software engineering disciplines',
    recommendedFor: ['SEN600', 'SEN700', 'WEB512', 'PROG731'],
    color: '#14316B'
  },
  {
    name: 'Programming with Mosh',
    handle: '@programmingwithmosh',
    searchUrl: 'https://www.youtube.com/@programmingwithmosh/search?query=',
    specialty: 'High-production programming tutorials focusing on clean code and design patterns',
    recommendedFor: ['PROG511', 'PROG621', 'PROG622'],
    color: '#1C56A8'
  },
  {
    name: 'Corey Schafer',
    handle: '@coreyms',
    searchUrl: 'https://www.youtube.com/@coreyms/search?query=',
    specialty: 'Deep-dive Python tutorials, OOP, standard libraries, and Linux terminal skills',
    recommendedFor: ['PROG511', 'PROG512', 'OPS600'],
    color: '#3FA7B8'
  },
  {
    name: 'Caleb Curry',
    handle: '@CalebTheVideoMaker2',
    searchUrl: 'https://www.youtube.com/@CalebTheVideoMaker2/search?query=',
    specialty: 'Beginner-friendly database design, relational schemas, SQL, and C++ fundamentals',
    recommendedFor: ['DBS621', 'DBS622', 'DBS600'],
    color: '#55305A'
  },
  {
    name: 'Alex The Analyst',
    handle: '@AlexTheAnalyst',
    searchUrl: 'https://www.youtube.com/@AlexTheAnalyst/search?query=',
    specialty: 'Practical SQL queries, Power BI portfolios, Tableau, and enterprise data analytics',
    recommendedFor: ['DBS621', 'DAT500', 'DMV600'],
    color: '#0284c7'
  },
  {
    name: "Jeremy's IT Lab",
    handle: '@JeremysITLab',
    searchUrl: 'https://www.youtube.com/@JeremysITLab/search?query=',
    specialty: 'Gold-standard Cisco CCNA training, packet tracer labs, subnetting, and routing protocols',
    recommendedFor: ['NET511', 'NET512', 'NET621', 'NET731'],
    color: '#16a34a'
  },
  {
    name: 'NetworkChuck',
    handle: '@NetworkChuck',
    searchUrl: 'https://www.youtube.com/@NetworkChuck/search?query=',
    specialty: 'Engaging, energetic networking, cybersecurity labs, Linux, and cloud computing demos',
    recommendedFor: ['NET511', 'CYB700', 'CLD600'],
    color: '#ea580c'
  },
  {
    name: 'Professor Messer',
    handle: '@professormesser',
    searchUrl: 'https://www.youtube.com/@professormesser/search?query=',
    specialty: 'CompTIA Network+, Security+, and A+ modular training for certification badges',
    recommendedFor: ['NET511', 'CYB700', 'SYS500'],
    color: '#4f46e5'
  },
  {
    name: 'StatQuest with Josh Starmer',
    handle: '@statquest',
    searchUrl: 'https://www.youtube.com/@statquest/search?query=',
    specialty: 'Visual step-by-step clarity on Machine Learning algorithms, Neural Nets, and Statistics',
    recommendedFor: ['ML600', 'ML700', 'SDS600'],
    color: '#db2777'
  },
  {
    name: '3Blue1Brown',
    handle: '@3blue1brown',
    searchUrl: 'https://www.youtube.com/@3blue1brown/search?query=',
    specialty: 'Intuitive animations for Linear Algebra, Calculus, Neural Networks, and Cryptography',
    recommendedFor: ['MAT511', 'MAT512', 'AI700'],
    color: '#0d9488'
  }
];

// 3-Question comprehension checks
const SAMPLE_COMPREHENSION_CHECKS: Record<string, Array<{ q: string; options: string[]; answer: number; explanation: string }>> = {
  default: [
    {
      q: 'Under Richfield assessment policy, what is the weighting split between Formative and Summative assessments?',
      options: ['50% Formative / 50% Summative', '40% Formative / 60% Summative', '30% Formative / 70% Summative', '100% Summative Exam'],
      answer: 1,
      explanation: 'Richfield uses 40% Continuous Formative Assessment (tests/assignments) and 60% Summative Examination.'
    },
    {
      q: 'Which layer of the OSI model handles end-to-end reliability and flow control via TCP?',
      options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
      answer: 2,
      explanation: 'Layer 4 (Transport) is responsible for end-to-end communication, segmentation, and reliability.'
    },
    {
      q: 'In relational database SQL, which clause filters aggregated group results?',
      options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
      answer: 2,
      explanation: 'HAVING filters aggregated groups (e.g. HAVING COUNT(*) > 5), whereas WHERE filters individual rows before grouping.'
    }
  ]
};

export const VideoVaultView: React.FC<VideoVaultViewProps> = ({ onAwardXp }) => {
  const [searchTopic, setSearchTopic] = useState('Subnetting');
  const [pastedVideoUrl, setPastedVideoUrl] = useState('');
  const [embeddedVideoId, setEmbeddedVideoId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Comprehension Check State
  const [showCheck, setShowCheck] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checkSubmitted, setCheckSubmitted] = useState(false);

  // Extract YouTube ID from pasted link
  const handleLoadPastedVideo = () => {
    if (!pastedVideoUrl.trim()) return;
    try {
      const url = pastedVideoUrl.trim();
      let videoId = null;

      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = new URL(url).searchParams.get('v');
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0];
      }

      if (videoId && videoId.length === 11) {
        setEmbeddedVideoId(videoId);
        setShowCheck(true);
        setCheckSubmitted(false);
        setAnswers({});
      } else {
        alert('Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=...)');
      }
    } catch (e) {
      alert('Could not parse YouTube URL.');
    }
  };

  const handleVerifyCheck = () => {
    setCheckSubmitted(true);
    const questions = SAMPLE_COMPREHENSION_CHECKS.default;
    const correctCount = questions.filter((q, idx) => answers[idx] === q.answer).length;

    if (correctCount === questions.length) {
      fireSuccessConfetti();
      onAwardXp(50, 'Passed Video Vault 3-Question Comprehension Check (+50 XP)');
    }
  };

  const filteredChannels = CURATED_CHANNELS.filter((ch) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'NETWORKING') return ch.name.includes('Jeremy') || ch.name.includes('Chuck') || ch.name.includes('Messer');
    if (selectedFilter === 'PROGRAMMING') return ch.name.includes('Bro') || ch.name.includes('Mosh') || ch.name.includes('Corey') || ch.name.includes('freeCodeCamp');
    if (selectedFilter === 'DATA') return ch.name.includes('Alex') || ch.name.includes('Caleb') || ch.name.includes('StatQuest');
    if (selectedFilter === 'MATH') return ch.name.includes('3Blue1Brown');
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-[#14316B] text-white rounded-2xl border border-[#3FA7B8]/30 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-[#3FA7B8] mb-1">
              CURATED LEARNING PATHWAYS
            </div>
            <h1 className="text-2xl md:text-3xl font-heading uppercase font-bold tracking-tight text-white flex items-center gap-2.5">
              <Youtube className="w-8 h-8 text-rose-500 fill-rose-500/20" />
              <span>Richfield Video Vault</span>
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
              Curated, peer-reviewed computer science channels mapped to your DIT and BSc IT syllabus. Search any topic across verified channels or paste any YouTube lecture to unlock a 3-question comprehension check.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-xs space-y-1 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-sky-200 block font-bold">
              Comprehension Reward
            </span>
            <p className="text-white font-bold text-base flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>+50 XP per video check</span>
            </p>
            <span className="text-[10px] text-sky-300 block">Zero fake video IDs policy</span>
          </div>
        </div>
      </div>

      {/* Paste Video URL Player & Topic Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Paste & Watch Any Lecture */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-heading uppercase font-bold tracking-wider text-[#14316B] dark:text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-[#E24B3C]" />
              <span>Watch Lecture & Unlock 3-Question Check</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Paste any tutorial from YouTube (e.g. from the curated channels below) to embed it here:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={pastedVideoUrl}
              onChange={(e) => setPastedVideoUrl(e.target.value)}
              className="flex-1 py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1C56A8]"
            />
            <button
              onClick={handleLoadPastedVideo}
              className="px-4 py-2 bg-[#E24B3C] hover:bg-[#c93f31] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors shrink-0"
            >
              Load Video
            </button>
          </div>

          {/* Video Player Box */}
          <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {embeddedVideoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${embeddedVideoId}`}
                title="Curriculum Lecture Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-6 text-slate-500 text-xs space-y-2">
                <Youtube className="w-10 h-10 text-slate-600 mx-auto" />
                <p>Paste a YouTube URL above or click a channel deep-link to find videos</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: 3-Question Comprehension Check */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-heading uppercase font-bold tracking-wider text-[#14316B] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3FA7B8]" />
                <span>3-Question Comprehension Check</span>
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-bold font-mono">
                +50 XP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verify your key takeaways to cement the concept into long-term memory.
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {SAMPLE_COMPREHENSION_CHECKS.default.map((q, idx) => {
              const selectedAns = answers[idx];
              const isCorrect = checkSubmitted && selectedAns === q.answer;
              const isWrong = checkSubmitted && selectedAns !== undefined && selectedAns !== q.answer;

              return (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                >
                  <p className="font-bold text-[#14316B] dark:text-slate-100">
                    {idx + 1}. {q.q}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => !checkSubmitted && setAnswers((prev) => ({ ...prev, [idx]: optIdx }))}
                        className={`w-full p-2 text-left rounded-lg text-[11px] transition-colors flex items-center justify-between border ${
                          selectedAns === optIdx
                            ? 'bg-[#1C56A8] text-white border-[#1C56A8] font-semibold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {checkSubmitted && optIdx === q.answer && (
                          <span className="text-emerald-400 font-bold">✓ Correct</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {checkSubmitted && (
                    <p className={`text-[11px] font-medium ${isCorrect ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleVerifyCheck}
            disabled={Object.keys(answers).length < 3 || checkSubmitted}
            className="w-full py-2.5 bg-[#1C56A8] hover:bg-[#14316B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-colors disabled:opacity-40"
          >
            {checkSubmitted ? '✓ Answers Graded' : 'Submit Comprehension Check'}
          </button>
        </div>
      </div>

      {/* Curated Channel Directory with Instant Deep-Links */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-heading uppercase font-bold text-[#14316B] dark:text-white">
              Curated YouTube Creators & Deep-Link Search
            </h2>
            <p className="text-xs text-slate-500">
              Click any channel to deep-link directly into their verified video library for your topic.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['ALL', 'PROGRAMMING', 'NETWORKING', 'DATA', 'MATH'].map((filt) => (
              <button
                key={filt}
                onClick={() => setSelectedFilter(filt)}
                className={`px-3 py-1.5 rounded-lg font-heading uppercase font-bold tracking-wider transition-colors ${
                  selectedFilter === filt
                    ? 'bg-[#14316B] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {filt}
              </button>
            ))}
          </div>
        </div>

        {/* Search Topic Field */}
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="Search topic (e.g. Subnetting, SQL Joins, OOP)..."
              className="w-full py-2 pl-9 pr-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#1C56A8]"
            />
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map((ch) => {
            const deepLink = `${ch.searchUrl}${encodeURIComponent(searchTopic)}`;
            return (
              <div
                key={ch.name}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading uppercase font-bold text-sm text-[#14316B] dark:text-white">
                      {ch.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ch.handle}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {ch.specialty}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {ch.recommendedFor.map((mod) => (
                      <span
                        key={mod}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#DCEBF3] dark:bg-slate-800 text-[#1C56A8] dark:text-[#3FA7B8] font-mono font-bold"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>

                  <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-[#1C56A8] hover:text-white text-[#14316B] dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Search &ldquo;{searchTopic}&rdquo; on {ch.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
