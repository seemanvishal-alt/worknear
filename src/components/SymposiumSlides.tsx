/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, Shield, Camera, VideoOff, ShieldCheck, FileText, 
  ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, Search, 
  Sparkles, Lock, Scale, Server, WifiOff, Database, 
  UserCheck, Award, HelpCircle, CheckCircle, Flame, ListFilter, Play, RefreshCw
} from 'lucide-react';

interface ChallengeItem {
  id: number;
  icon: React.ReactNode;
  category: 'Security' | 'AI' | 'Infrastructure' | 'Design';
  challenge: string;
  advantage: string;
  improvement: string;
  severity: 'High' | 'Medium' | 'Low';
}

export default function SymposiumSlides() {
  const [activeMode, setActiveMode] = useState<'slides' | 'matrix' | 'workflow' | 'pitch'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  // Slides configuration
  const slides = useMemo(() => [
    {
      title: "WORKNEAR",
      subtitle: "Challenges Transformed into Strategic Advantages",
      eyebrow: "College Symposium Presentation",
      description: "An AI-powered workforce intelligence platform that doesn't just match candidates with jobs — it also verifies trust and creates fully auditable security evidence.",
      themeColor: "from-blue-600 to-indigo-700",
      isCover: true,
    },
    {
      title: "🧠 Semantic Intelligence",
      eyebrow: "Advantage 1 / 6",
      challenge: "Traditional resume matching relies on simple keyword searches, which leads to high false negatives and easily manipulated applications.",
      advantage: "WorkNear looks beyond keyword matching by using high-dimensional semantic vectors to align true capabilities, contextual experience, and candidate background.",
      improvement: "Maintains a strict 'Human-in-the-Loop' workflow so that human intuition approves matches before finalizing high-sensitivity hiring.",
      badge: "Beyond Keyword Matching",
      bgGradient: "from-indigo-650 to-blue-650",
      accentIcon: <Brain className="h-16 w-16 text-indigo-200" />
    },
    {
      title: "🔐 Multi-Layer Trust",
      eyebrow: "Advantage 2 / 6",
      challenge: "Employers risk hiring unverified individuals, leading to security leaks, proxy candidates, or credential fraud during remote handshakes.",
      advantage: "Combines biometric telemetry, digital identity matching, and OTP challenges into a cohesive trust-verification chain before sensitive tasks are dispatched.",
      improvement: "Ensures privacy-preserving local cryptographic hashing and minimal data storage footprint to defend personal sensitive information.",
      badge: "Identity + MFA + OTP",
      bgGradient: "from-blue-650 to-teal-650",
      accentIcon: <ShieldCheck className="h-16 w-16 text-teal-250" />
    },
    {
      title: "📷 Smart Verification",
      eyebrow: "Advantage 3 / 6",
      challenge: "Total camera dependence can block workers on legacy hardware, or fail when camera hardware blocks due to environmental variables.",
      advantage: "Features intelligent depth scanning and QR handshakes, with an elegant 'Virtual Fallback' mechanism that secures verification via hardware-level OTP tokens.",
      improvement: "Dual-mode hardware options and Bluetooth beacon support to make physical site check-ins foolproof and inclusive.",
      badge: "Camera & Token Fallback",
      bgGradient: "from-teal-650 to-emerald-650",
      accentIcon: <Camera className="h-16 w-16 text-emerald-250" />
    },
    {
      title: "🛡️ Security Audit",
      eyebrow: "Advantage 4 / 6",
      challenge: "Enterprise security events are often siloed, unindexed, or too complex to filter and audit manually during fast hiring cycles.",
      advantage: "Consolidates all security handshakes and biometric events into a unified, filterable telemetry ledger that monitors anomalies in real-time.",
      improvement: "Generates tamper-resistant cryptographic hashes for every transaction log, ensuring long-term audit trail non-repudiation.",
      badge: "Filter, Sort & Track Logs",
      bgGradient: "from-purple-650 to-indigo-650",
      accentIcon: <Database className="h-16 w-16 text-purple-200" />
    },
    {
      title: "📄 Compliance Ready",
      eyebrow: "Advantage 5 / 6",
      challenge: "Preparing audits and regulatory compliance documents for enterprise recruitment usually takes weeks of human engineering hours.",
      advantage: "Compiles audit states, security logs, and verification reports instantly into a legally defensible Confidential Cryptographic Audit Report PDF.",
      improvement: "Integrates automatic PDF exports containing specific session snapshots, tamper proofs, and compliance seals with a single click.",
      badge: "Instant PDF Audits",
      bgGradient: "from-slate-700 to-slate-900",
      accentIcon: <FileText className="h-16 w-16 text-slate-300" />
    },
    {
      title: "⚖️ Human + AI Decision",
      eyebrow: "Advantage 6 / 6",
      challenge: "Fully autonomous AI recruitment platforms are prone to deep-seated systemic bias, hallucinations, and unexplainable selections.",
      advantage: "Positions AI as a supportive capability recommendation engine, presenting rich, transparent match scores to empower recruiters.",
      improvement: "Builds explainable score dashboards showing skill weights alongside a definitive manual toggle for ultimate human-authority override.",
      badge: "AI Assists, Humans Decide",
      bgGradient: "from-rose-600 to-orange-600",
      accentIcon: <Scale className="h-16 w-16 text-rose-200" />
    }
  ], []);

  // Matrix data of all 10 points
  const challengeMatrix: ChallengeItem[] = useMemo(() => [
    {
      id: 1,
      icon: <Lock className="h-5 w-5 text-rose-500" />,
      category: 'Security',
      challenge: 'Privacy concerns regarding biometric tracking and data leaks.',
      advantage: 'Identity and biometric verification creates stronger trust for sensitive hiring actions.',
      improvement: 'Use local cryptographic hashing, minimal data retention, and privacy-preserving processing.',
      severity: 'High'
    },
    {
      id: 2,
      icon: <Brain className="h-5 w-5 text-indigo-500" />,
      category: 'AI',
      challenge: 'AI matching mistakes and inaccurate skill associations.',
      advantage: 'High-dimensional semantic vectors search for capability and contextual overlap rather than rigid keywords.',
      improvement: 'Enforce strict Human-in-the-Loop reviews and explainable matching criteria.',
      severity: 'Medium'
    },
    {
      id: 3,
      icon: <VideoOff className="h-5 w-5 text-amber-500" />,
      category: 'Infrastructure',
      challenge: 'Total camera dependency blocking workers with hardware issues.',
      advantage: 'Dual-mode framework supports active webcam scans + virtual fallback tokens.',
      improvement: 'Fallback instantly to offline OTP authentication or security-key handshakes.',
      severity: 'High'
    },
    {
      id: 4,
      icon: <Server className="h-5 w-5 text-purple-500" />,
      category: 'Infrastructure',
      challenge: 'High implementation complexity of coordinating separate silos.',
      advantage: 'WorkNear unifies matching, identity checks, and security audits into a single workflow.',
      improvement: 'Keep individual micro-services modular to allow independent upgrades and low coupling.',
      severity: 'Medium'
    },
    {
      id: 5,
      icon: <Database className="h-5 w-5 text-blue-500" />,
      category: 'Infrastructure',
      challenge: 'High infrastructure and compute cost of specialized vector services.',
      advantage: 'Centralized platforms eliminate duplicated recruitment, compliance, and training pipelines.',
      improvement: 'Leverage serverless architectures and efficient edge computation to shrink running costs.',
      severity: 'Low'
    },
    {
      id: 6,
      icon: <UserCheck className="h-5 w-5 text-emerald-500" />,
      category: 'Security',
      challenge: 'False trust signals (candidates manipulating online records).',
      advantage: 'WorkNear verifies identity dynamically using biometric proof, location bounds, and live OTP keys.',
      improvement: 'Augment automated signals with actual verified project evidence and offline challenges.',
      severity: 'High'
    },
    {
      id: 7,
      icon: <Shield className="h-5 w-5 text-teal-500" />,
      category: 'Security',
      challenge: 'Data security risk of storing critical employer-employee contracts.',
      advantage: 'Centralized tamper-proof telemetry ledger flags and records all operations instantly.',
      improvement: 'Implement immutable logs, AES-255 encryption at rest, and granular RBAC schemas.',
      severity: 'High'
    },
    {
      id: 8,
      icon: <WifiOff className="h-5 w-5 text-slate-500" />,
      category: 'Infrastructure',
      challenge: 'Internet dependency causing dropouts during field verification.',
      advantage: 'Virtual scanner fallback permits light local handshakes when data connections stall.',
      improvement: 'Deploy local edge hashing to store check-ins offline, syncing them immediately on reconnect.',
      severity: 'Medium'
    },
    {
      id: 9,
      icon: <Scale className="h-5 w-5 text-orange-500" />,
      category: 'AI',
      challenge: 'AI bias favoring specific demographic subsets or keyword formatting.',
      advantage: 'Deep semantic matching analyzes experience mapping and real skill evidence over formatting quirks.',
      improvement: 'Incorporate explainable match weight dials and automated bias-testing cycles.',
      severity: 'High'
    },
    {
      id: 10,
      icon: <RefreshCw className="h-5 w-5 text-violet-500" />,
      category: 'Design',
      challenge: 'High long-term maintenance overhead of models and workflows.',
      advantage: 'Highly modular component framework ensures zero-downtime micro-updates.',
      improvement: 'Conduct automated test sweeps and establish automated drift alarms on ML models.',
      severity: 'Low'
    }
  ], []);

  // Filter matrix items based on category and search query
  const filteredMatrix = useMemo(() => {
    return challengeMatrix.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.challenge.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.advantage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.improvement.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [challengeMatrix, selectedCategory, searchQuery]);

  // Slideshow play/pause handler
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerProgress(prev => {
          if (prev >= 100) {
            setCurrentSlide(curr => (curr + 1) % slides.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 5 seconds per slide (50ms * 100)
    } else {
      setTimerProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setTimerProgress(0);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setTimerProgress(0);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Brand Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              <span>Symposium Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              WorkNear — Presentation Deck
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl">
              Equip your pitch to the judges with a highly interactive slide-deck showcasing WorkNear's robust Match-Verify-Audit-Report structure and strategic advantages.
            </p>
          </div>

          {/* Interactive Navigation Mode Controls */}
          <div className="flex flex-wrap gap-2 z-10 w-full md:w-auto">
            {[
              { id: 'slides', label: '📖 Slide Presenter', icon: <Play className="h-3.5 w-3.5" /> },
              { id: 'matrix', label: '🎛️ Challenge Matrix', icon: <Database className="h-3.5 w-3.5" /> },
              { id: 'workflow', label: '🔄 System Workflow', icon: <RefreshCw className="h-3.5 w-3.5" /> },
              { id: 'pitch', label: '🏆 Pitch Q&A', icon: <HelpCircle className="h-3.5 w-3.5" /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as any);
                  setIsPlaying(false);
                }}
                className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 md:flex-none ${
                  activeMode === mode.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15 border border-blue-500'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Frame */}
        <div className="min-h-[520px]">
          <AnimatePresence mode="wait">
            
            {/* 1. SLIDE SHOW PRESENTER MODE */}
            {activeMode === 'slides' && (
              <motion.div
                key="slideshow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              >
                {/* Master Controller Index */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Slide Index
                  </span>
                  <div className="space-y-1.5">
                    {slides.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlide(idx);
                          setIsPlaying(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                          currentSlide === idx
                            ? 'bg-blue-50/70 text-blue-700 border-blue-200 shadow-sm'
                            : 'bg-transparent text-slate-650 border-transparent hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{s.title}</span>
                        {currentSlide === idx && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col items-center space-y-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition ${
                        isPlaying 
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-slate-900 text-white hover:bg-black'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                          <span>Pause Autoplay</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 fill-current" />
                          <span>Autoplay Slides</span>
                        </>
                      )}
                    </button>
                    {isPlaying && (
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-rose-500 h-full transition-all duration-75"
                          style={{ width: `${timerProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Interactive Slide Box */}
                <div className="lg:col-span-3">
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[460px] relative">
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="p-8 sm:p-12 flex-1 flex flex-col justify-center text-left"
                      >
                        {slides[currentSlide].isCover ? (
                          /* COVER SLIDE */
                          <div className="space-y-6 max-w-2xl py-6">
                            <span className="text-[10px] sm:text-xs bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              {slides[currentSlide].eyebrow}
                            </span>
                            <div className="space-y-2">
                              <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none uppercase">
                                WORK<span className="text-blue-600">NEAR</span>
                              </h2>
                              <p className="text-lg sm:text-xl font-bold text-slate-650 leading-snug">
                                {slides[currentSlide].subtitle}
                              </p>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                              {slides[currentSlide].description}
                            </p>
                            
                            <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-100">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Core Architecture</span>
                                <span className="text-xs font-bold text-slate-700">Modular Microservice System</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Target Audience</span>
                                <span className="text-xs font-bold text-slate-700">College Symposium & Judges</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* CONTENT SLIDES (Six Advantages) */
                          <div className="space-y-8 relative">
                            {/* Graphic background accent icon */}
                            <div className="absolute right-0 top-0 opacity-10 pointer-events-none hidden sm:block">
                              {slides[currentSlide].accentIcon}
                            </div>

                            <div className="space-y-2.5">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] sm:text-xs bg-blue-50 border border-blue-100 text-blue-700 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                  {slides[currentSlide].eyebrow}
                                </span>
                                <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full uppercase">
                                  {slides[currentSlide].badge}
                                </span>
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                                {slides[currentSlide].title}
                              </h2>
                            </div>

                            {/* Challenge vs Advantage Split Card */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              
                              <div className="bg-rose-50/60 border border-rose-100/80 rounded-2xl p-5 space-y-2.5">
                                <div className="flex items-center space-x-1.5 text-rose-850">
                                  <Flame className="h-4 w-4 shrink-0" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">The Challenge</span>
                                </div>
                                <p className="text-xs sm:text-[13px] text-rose-700 font-semibold leading-relaxed">
                                  {slides[currentSlide].challenge}
                                </p>
                              </div>

                              <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-5 space-y-2.5">
                                <div className="flex items-center space-x-1.5 text-emerald-850">
                                  <Award className="h-4 w-4 shrink-0" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">WorkNear Advantage</span>
                                </div>
                                <p className="text-xs sm:text-[13px] text-emerald-700 font-semibold leading-relaxed">
                                  {slides[currentSlide].advantage}
                                </p>
                              </div>

                            </div>

                            {/* Best Improvement */}
                            <div className="bg-slate-55 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3.5">
                              <div className="p-2 rounded-xl bg-blue-100 text-blue-750 shrink-0">
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Best Improvement Strategy</span>
                                <p className="text-xs sm:text-[13px] text-slate-700 font-bold leading-relaxed">
                                  {slides[currentSlide].improvement}
                                </p>
                              </div>
                            </div>

                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Bottom Slide Controller Bar */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider">
                        SLIDE {currentSlide + 1} OF {slides.length}
                      </span>
                      
                      {/* Interactive slide indicator pips */}
                      <div className="hidden sm:flex items-center space-x-2">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentSlide(idx);
                              setIsPlaying(false);
                            }}
                            className={`h-2 rounded-full transition-all ${
                              currentSlide === idx ? 'bg-blue-600 w-6' : 'bg-slate-200 hover:bg-slate-350 w-2'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={prevSlide}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. CHALLENGE MATRIX GRID VIEW */}
            {activeMode === 'matrix' && (
              <motion.div
                key="matrix"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Search & Category Filter Toolbar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 mr-2 flex items-center space-x-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span>Filter:</span>
                    </span>
                    {['All', 'Security', 'AI', 'Infrastructure', 'Design'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar Input */}
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search challenges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Master list of 10 items */}
                  <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {filteredMatrix.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-semibold">
                        No matches found. Adjust your filters or query.
                      </div>
                    ) : (
                      filteredMatrix.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedChallengeId(item.id)}
                          className={`bg-white border rounded-2xl p-4 text-left transition-all cursor-pointer flex items-start space-x-4 ${
                            selectedChallengeId === item.id
                              ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/10'
                              : 'border-slate-200 hover:border-slate-350 hover:shadow-xs'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${
                            selectedChallengeId === item.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">
                                CHALLENGE #{item.id} • {item.category}
                              </span>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                item.severity === 'High'
                                  ? 'bg-rose-50 text-rose-700'
                                  : item.severity === 'Medium'
                                  ? 'bg-amber-50 text-amber-750'
                                  : 'bg-blue-50 text-blue-700'
                              }`}>
                                Severity: {item.severity}
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              {item.challenge}
                            </h4>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Detailed selected view */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-left h-fit sticky top-24">
                    {selectedChallengeId !== null ? (
                      (() => {
                        const activeItem = challengeMatrix.find(x => x.id === selectedChallengeId);
                        if (!activeItem) return null;
                        return (
                          <div className="space-y-6">
                            
                            {/* Header details */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                                  Audit Details #{activeItem.id}
                                </span>
                                <span className="text-[10px] bg-slate-150 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                                  {activeItem.category}
                                </span>
                              </div>
                              <h3 className="text-base font-black text-slate-950">
                                Detailed Risk Resolution
                              </h3>
                            </div>

                            {/* Section 1: The Challenge */}
                            <div className="space-y-1.5 pt-4 border-t border-slate-100">
                              <div className="flex items-center space-x-1.5 text-rose-650">
                                <Flame className="h-4 w-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Identified Risk / Challenge</span>
                              </div>
                              <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                                {activeItem.challenge}
                              </p>
                            </div>

                            {/* Section 2: WorkNear Advantage */}
                            <div className="space-y-1.5 pt-4 border-t border-slate-100">
                              <div className="flex items-center space-x-1.5 text-blue-650">
                                <Award className="h-4 w-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Platform Advantage</span>
                              </div>
                              <p className="text-xs text-slate-800 font-bold leading-relaxed">
                                {activeItem.advantage}
                              </p>
                            </div>

                            {/* Section 3: Strategic Improvement */}
                            <div className="space-y-1.5 pt-4 border-t border-slate-100">
                              <div className="flex items-center space-x-1.5 text-emerald-650">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Strategic Improvement</span>
                              </div>
                              <p className="text-xs text-slate-800 font-bold leading-relaxed bg-emerald-50/50 border border-emerald-100/50 p-3.5 rounded-xl">
                                {activeItem.improvement}
                              </p>
                            </div>

                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center text-slate-400 py-12">
                        Select an item on the left to review strategic details.
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* 3. CORE WORKFLOW DIAGRAM */}
            {activeMode === 'workflow' && (
              <motion.div
                key="workflow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Visual Flow Header */}
                <div className="bg-slate-900 text-white border border-slate-950 rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-3 max-w-2xl">
                    <span className="text-[10px] bg-blue-500 text-white font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      WorkNear Core Architecture
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                      MATCH → VERIFY → AUDIT → REPORT Flow
                    </h2>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Instead of disjointed vendor operations, WorkNear orchestrates a continuous, non-repudiation pipeline of workforce transactions. Click each step below to inspect its inner mechanics.
                    </p>
                  </div>
                </div>

                {/* Workflow Interactive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {[
                    {
                      step: "01",
                      title: "🧠 SEMANTIC MATCH",
                      desc: "Skill + Experience + Context evaluation replacing rigid keyword match. Uses deep neural models to align candidate true capacities with active gig requirements.",
                      color: "border-blue-200 hover:border-blue-500 bg-blue-50/20 text-blue-800",
                      icon: <Brain className="h-6 w-6 text-blue-600" />
                    },
                    {
                      step: "02",
                      title: "🔐 TRUST VERIFY",
                      desc: "Multi-layered validation requiring Biometric scan, GPS mesh checks, and OTP SMS verification. Provides robust, tamper-resistant digital handshakes.",
                      color: "border-teal-200 hover:border-teal-500 bg-teal-50/20 text-teal-850",
                      icon: <ShieldCheck className="h-6 w-6 text-teal-650" />
                    },
                    {
                      step: "03",
                      title: "🛡️ AUDIT LEDGER",
                      desc: "Maintains a secure event stream logging authentication logs, contract seal handshakes, and platform actions with unique block validation hashes.",
                      color: "border-purple-200 hover:border-purple-500 bg-purple-50/20 text-purple-850",
                      icon: <Database className="h-6 w-6 text-purple-650" />
                    },
                    {
                      step: "04",
                      title: "📄 PDF COMPLIANCE",
                      desc: "Instant single-click compiler transforming telemetry streams and verification metrics into legally verifiable, highly structured PDF exports.",
                      color: "border-slate-300 hover:border-slate-800 bg-slate-100/20 text-slate-800",
                      icon: <FileText className="h-6 w-6 text-slate-700" />
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-2xl p-6 text-left transition-all duration-200 space-y-4 hover:shadow-sm ${item.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black opacity-60">
                          PHASE {item.step}
                        </span>
                        {item.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-black tracking-wider">
                          {item.title}
                        </h3>
                        <p className="text-xs opacity-80 font-semibold leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Combined visual workflow connection statement */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-xs font-bold text-slate-550">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                    <span className="text-slate-900">Semantic Recruiter Core</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
                    <span className="text-slate-900">Multi-Layer Trust MFA</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
                    <span className="text-slate-900">Secure Audit Telemetry Logs</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 sm:rotate-0" />
                    <span className="text-slate-900">One-Click PDF Verification</span>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4. PITCH TRAINER & JUDGES FAQ */}
            {activeMode === 'pitch' && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                
                {/* 20 Second Elevator Pitch */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Award className="h-32 w-32 text-blue-600" />
                  </div>
                  <div className="space-y-1 z-10 relative">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-full border border-blue-200">
                      🎤 Elevator Pitch Trainer (20 Seconds)
                    </span>
                    <h3 className="text-base font-black text-slate-950">
                      If a judge asks: “What is the main advantage of WorkNear?”
                    </h3>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xs relative">
                    <span className="absolute -top-3.5 left-4 bg-blue-600 text-white font-mono text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
                      PITCH LOG
                    </span>
                    <p className="text-sm sm:text-base text-slate-800 font-bold leading-relaxed italic">
                      “The main advantage of WorkNear is that recruitment and security are combined in one platform. Our semantic AI finds candidates based on capabilities rather than only keywords. MFA and identity verification add a trust layer, while the audit ledger records important activities and can generate a compliance report. So WorkNear follows a simple workflow: Match, Verify, Audit and Report.”
                    </p>
                  </div>
                </div>

                {/* Frequently Asked Questions by Judges */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                      <span>Judge Q&A Simulation & Best Responses</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Prep answers for difficult questions concerning security, AI bias, or hardware fallbacks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {[
                      {
                        q: "How does WorkNear guarantee applicant privacy while capturing biometric telemetry?",
                        a: "We address privacy constraints through local decentralized hashing. Instead of raw biometric videos, we compute local 3D facial coordinate graphs and verify liveness without persisting raw biometric visuals on servers, complying with strict GDPR and security mandates."
                      },
                      {
                        q: "AI algorithms often inherit hiring bias. How does your semantic search resolve this?",
                        a: "Traditional matching is biased towards specific wording or resume formatting. Our high-dimensional semantic search focuses purely on skill clusters and verified transaction history. More importantly, we enforce a manual human-override gate so that AI strictly advises, and human recruiters decide."
                      },
                      {
                        q: "What occurs if a worker's internet drops out or their camera is broken?",
                        a: "WorkNear is designed for the real world. If camera access is unavailable, workers utilize our virtual verification token system (OTP/security keys). If they lose connectivity, local edge storage caches cryptographic timestamps to sync logs the moment service resumes."
                      },
                      {
                        q: "How is your audit trail protected from tampering or deletion?",
                        a: "Every single critical event recorded on the platform (e.g. checks, handshakes, contracts) is converted into an immutable log line. Each line generates a SHA-256 seal chain hash. This makes the database trace-sealed, meaning unauthorized modifications destroy the hash integrity instantly."
                      }
                    ].map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                        <div className="flex items-start space-x-2">
                          <span className="font-mono text-xs font-black text-blue-650 mt-0.5">Q:</span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                            {faq.q}
                          </h4>
                        </div>
                        <div className="flex items-start space-x-2 border-t border-slate-200/60 pt-3">
                          <span className="font-mono text-xs font-black text-emerald-650 mt-0.5">A:</span>
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
