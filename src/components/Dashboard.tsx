/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Shield, Sparkles, Zap, Plus, Search, Filter, 
  Calendar, MessageSquare, Briefcase, ChevronRight, FileText, 
  Download, Clock, AlertCircle, CheckCircle, Send, User, ChevronDown
} from 'lucide-react';
import { mockCandidates, mockJobs } from '../data/mockData';
import { Candidate, Job, ChatMessage } from '../types';

interface DashboardProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
}

export default function Dashboard({ searchQuery, setSearchQuery, isDarkMode }: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'matching' | 'contracts' | 'scheduler'>('matching');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [customJobSkills, setCustomJobSkills] = useState('');
  
  const [isMatchingInProgress, setIsMatchingInProgress] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  
  // Contracts state
  const [selectedContractCandidate, setSelectedContractCandidate] = useState<Candidate | null>(null);
  const [contractCountry, setContractCountry] = useState('Estonia');
  const [contractType, setContractType] = useState('Full-time EOR');
  const [contractSalary, setContractSalary] = useState('12500');
  const [contractGenerated, setContractGenerated] = useState<string | null>(null);

  // Scheduler state
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const [scheduleDate, setScheduleDate] = useState('2026-07-25');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleType, setScheduleType] = useState('Technical Screening');
  const [scheduledInterviews, setScheduledInterviews] = useState<any[]>([
    { id: '1', candidateName: 'Sarah Jenkins', date: '2026-07-22', time: '14:00', type: 'Design System Review', status: 'Confirmed' }
  ]);

  // Chat Widget state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'assistant', text: "Welcome to WorkNear Command. I am your sovereign AI workforce architect. You can ask me to write a job description, query EOR payroll liabilities in Germany, or suggest optimal salary ranges.", timestamp: '08:30' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync searchQuery from hero
  useEffect(() => {
    if (searchQuery) {
      // Find matching template or set custom
      const matched = mockJobs.find(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matched) {
        handleSelectJob(matched);
      } else {
        setCustomJobTitle(searchQuery);
        setSelectedJob(null);
        setCustomJobDesc(`Sourcing top talent with skill sets matching: ${searchQuery}.`);
      }
      setActiveSubTab('matching');
    }
  }, [searchQuery]);

  // Scroll chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCustomJobTitle(job.title);
    setCustomJobDesc(job.description);
    setCustomJobSkills(job.skills.join(', '));
  };

  // Run AI Sourcing Match using actual Express endpoint
  const handleRunSourcingMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobTitle) return;

    setIsMatchingInProgress(true);
    setCandidates([]); // Clear for animation effect

    try {
      const parsedSkills = customJobSkills.split(',').map(s => s.trim()).filter(Boolean);
      
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: customJobTitle,
          jobDescription: customJobDesc,
          skills: parsedSkills
        })
      });

      const data = await response.json();
      
      if (data && data.matches) {
        // Map scores and reasons back to mock candidates
        const updated = mockCandidates.map(c => {
          const matchItem = data.matches.find((m: any) => m.id === c.id);
          if (matchItem) {
            return {
              ...c,
              matchScore: matchItem.matchScore,
              matchReason: matchItem.matchReason
            };
          }
          return {
            ...c,
            matchScore: 65,
            matchReason: 'General tech compatibility aligned with organizational growth.'
          };
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        setCandidates(updated);
      } else {
        setCandidates(mockCandidates);
      }
    } catch (err) {
      console.error(err);
      setCandidates(mockCandidates);
    } finally {
      setIsMatchingInProgress(false);
    }
  };

  // Generate compliance contract PDF text representation
  const handleGenerateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContractCandidate) return;

    const docId = `WN-EOR-${Math.floor(100000 + Math.random() * 900000)}`;
    const text = `
--------------------------------------------------
WORKNEAR GLOBAL EMPLOYER OF RECORD (EOR) COVENANT
--------------------------------------------------
Document Reference: ${docId}
Execution Date: July 21, 2026
Effective Deployment Date: August 01, 2026

I. CONTRACTING PARTIES:
Employer: WorkNear EOR Services (acting on behalf of host organization)
Employee: ${selectedContractCandidate.name}
Deployment Country: ${contractCountry}

II. ROLES, COMPENSATION & TAX STRUCTURES:
Designation: ${selectedContractCandidate.role}
Employment Paradigm: ${contractType}
Agreed Base Gross Compensation: ${contractSalary} EUR / monthly
Local Statutory Payroll Taxes (EOR handled): Compliant with ${contractCountry} Ministry of Social Affairs.

III. INTELLECTUAL PROPERTY & COMPLIANCE DECREE:
All inventions, source code alignments, design tokens, and operational formulas generated by employee vest 100% in Host organization. Non-disclosure covenants are secured in perpetuity under reciprocal EU regulatory protocols.

Executed complies under strict international EOR jurisdiction laws.
--------------------------------------------------
    `;
    setContractGenerated(text);
  };

  // Schedule interview
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleCandidate) return;

    const newInterview = {
      id: `${Date.now()}`,
      candidateName: scheduleCandidate.name,
      date: scheduleDate,
      time: scheduleTime,
      type: scheduleType,
      status: 'Confirmed'
    };

    setScheduledInterviews([newInterview, ...scheduledInterviews]);
    setActiveSubTab('analytics'); // Go to analytics/calendar to view it!
  };

  // Send message to AI Chat Assistant
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Create request messages history
      const history = chatMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history
        })
      });

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `${Date.now() + 1}`,
        sender: 'assistant',
        text: data.text || "I was unable to complete reasoning. Please request again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const offlineMsg: ChatMessage = {
        id: `${Date.now() + 1}`,
        sender: 'assistant',
        text: "Error contacting our server engines. Please check your system configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, offlineMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Dashboard Top Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            WorkNear Command Hub
          </h1>
          <p className="text-sm text-white0 dark:text-slate-400 mt-1">
            Real-time candidate matching, global EOR deployment compliance, and analytics pipelines.
          </p>
        </div>

        {/* Workspace Segment Control */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl dark:bg-slate-900 w-fit shrink-0 border border-slate-200 dark:border-slate-800">
          {[
            { id: 'matching', label: 'AI Sourcing Match', icon: <Brain className="h-4 w-4" /> },
            { id: 'analytics', label: 'Team Analytics', icon: <Clock className="h-4 w-4" /> },
            { id: 'contracts', label: 'EOR Compliant Contracts', icon: <Shield className="h-4 w-4" /> },
            { id: 'scheduler', label: 'Interview Room', icon: <Calendar className="h-4 w-4" /> }
          ].map((subTab) => (
            <button
              key={subTab.id}
              id={`subtab-${subTab.id}`}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === subTab.id
                  ? 'bg-slate-50 text-teal-800 dark:bg-stone-850 dark:text-teal-400 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {subTab.icon}
              <span>{subTab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE VIEWPORTS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. MATCHING WORKSPACE */}
          {activeSubTab === 'matching' && (
            <div className="space-y-6" id="matching-workspace">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                  <span>Configure Active Requirement Profile</span>
                </h3>

                {/* Job open templates */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-white0 uppercase tracking-wider dark:text-slate-400 mb-2">
                    Or pre-load templates
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mockJobs.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        id={`job-template-${j.id}`}
                        onClick={() => handleSelectJob(j)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          selectedJob?.id === j.id
                            ? 'bg-teal-50 border-teal-700 text-teal-800 dark:bg-teal-950/30 dark:border-teal-500 dark:text-teal-400'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {j.logo} {j.title}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleRunSourcingMatch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Role Title *
                      </label>
                      <input
                        id="match-job-title"
                        type="text"
                        placeholder="e.g. Lead React Architect"
                        value={customJobTitle}
                        onChange={(e) => setCustomJobTitle(e.target.value)}
                        required
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Core Tech Tags (Comma Separated)
                      </label>
                      <input
                        id="match-job-skills"
                        type="text"
                        placeholder="React, TypeScript, AWS, Postgres"
                        value={customJobSkills}
                        onChange={(e) => setCustomJobSkills(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                      Operational Objective / Job Requirements
                    </label>
                    <textarea
                      id="match-job-desc"
                      rows={3}
                      placeholder="Detail what tasks they will prioritize, scaling concerns, or code quality paradigms..."
                      value={customJobDesc}
                      onChange={(e) => setCustomJobDesc(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <button
                    id="match-run-btn"
                    type="submit"
                    disabled={isMatchingInProgress}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-55 cursor-pointer shadow-md shadow-slate-900/10 dark:shadow-none"
                  >
                    {isMatchingInProgress ? (
                      <>
                        <div className="h-4 w-4 border-2 border-slate-50 border-t-transparent rounded-full animate-spin" />
                        <span>Querying Semantic AI Match Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4.5 w-4.5" />
                        <span>Initiate AI Sourcing Search</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Match Candidates Result Listing */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white0 uppercase tracking-wider">
                    Matched Candidates Shortlist {candidates.length > 0 && `(${candidates.length} profiles sorted)`}
                  </h4>
                  {isMatchingInProgress && (
                    <span className="text-xs text-teal-700 animate-pulse dark:text-teal-400 font-medium">Sorting by dimensional distance...</span>
                  )}
                </div>

                {candidates.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:border-slate-800">
                    <Brain className="h-8 w-8 mx-auto mb-3 text-slate-300 animate-pulse" />
                    <p className="text-sm">Initiate an AI Sourcing Search above to parse candidates and rank them instantly.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {candidates.map((c) => (
                      <div
                        key={c.id}
                        id={`candidate-card-${c.id}`}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40 relative overflow-hidden flex flex-col md:flex-row justify-between gap-4 transition hover:border-teal-700/30 dark:hover:border-teal-500/30 shadow-sm"
                      >
                        {/* Match Indicator Badge */}
                        {c.matchScore && (
                          <div className="absolute top-0 right-0 bg-teal-800 text-white dark:bg-teal-600 px-3 py-1 rounded-bl-xl text-xs font-extrabold tracking-tight">
                            {c.matchScore}% Match
                          </div>
                        )}

                        <div className="flex items-start space-x-4">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            className="h-14 w-14 rounded-full border border-slate-200/80 dark:border-slate-800 object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-extrabold text-blue-600 dark:text-white text-sm sm:text-base">{c.name}</h5>
                              <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-semibold uppercase">{c.status}</span>
                            </div>
                            <p className="text-xs text-teal-800 dark:text-teal-400 font-bold">{c.role}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{c.location} • {c.experience} yrs exp • {c.expectedSalary}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-lg">{c.bio}</p>

                            {/* Skills Row */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {c.skills.map((s, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">{s}</span>
                              ))}
                            </div>

                            {/* Dynamic AI Justification */}
                            {c.matchReason && (
                              <div className="mt-4 bg-teal-50/60 dark:bg-teal-950/20 p-3 rounded-xl border border-teal-100 dark:border-teal-900/50 flex items-start space-x-2">
                                <Sparkles className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-teal-900 dark:text-teal-300 italic">
                                  <strong>AI Assessment:</strong> {c.matchReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick action triggers */}
                        <div className="flex md:flex-col justify-end gap-2 shrink-0 md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-4 pt-3 md:pt-0">
                          <button
                            id={`action-hire-${c.id}`}
                            onClick={() => {
                              setSelectedContractCandidate(c);
                              setActiveSubTab('contracts');
                            }}
                            className="flex-1 md:flex-initial rounded-xl bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-center transition cursor-pointer"
                          >
                            Draft Contract
                          </button>
                          <button
                            id={`action-schedule-${c.id}`}
                            onClick={() => {
                              setScheduleCandidate(c);
                              setActiveSubTab('scheduler');
                            }}
                            className="flex-1 md:flex-initial rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-center transition"
                          >
                            Schedule Room
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. TEAM ANALYTICS WORKSPACE */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6" id="analytics-workspace">
              {/* Premium Analytics Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Active Workforce Payouts', value: '$12,450.00', change: '+12.4% MoM', trend: 'up' },
                  { title: 'Compliant EOR Deployments', value: '4 Active', change: 'Estonia, UK, Japan, UAE', trend: 'stable' },
                  { title: 'Interview Sprints', value: `${scheduledInterviews.length} Scheduled`, change: 'Next: Today 14:00', trend: 'up' }
                ].map((s, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                    <h5 className="text-xs font-bold text-white0 uppercase tracking-wider dark:text-slate-400">{s.title}</h5>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{s.value}</div>
                    <div className="text-xs text-teal-800 dark:text-teal-400 font-semibold mt-1 flex items-center space-x-1">
                      <span>{s.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic SVG Chart (Custom Vercel Style) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white0">Pipeline Performance Analytics</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Aggregated matched interview acceptances versus EOR deployment times.</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">Q3 2026</span>
                </div>

                <div className="h-64 w-full flex items-end justify-between px-2 pt-6 pb-2 relative border-b border-slate-200 dark:border-slate-800">
                  {/* Decorative Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-slate-900 w-full" />
                    <div className="border-b border-slate-900 w-full" />
                    <div className="border-b border-slate-900 w-full" />
                    <div className="border-b border-slate-900 w-full" />
                  </div>

                  {/* Bars representing weeks */}
                  {[
                    { label: 'Wk 27', value: 30, value2: 50 },
                    { label: 'Wk 28', value: 45, value2: 60 },
                    { label: 'Wk 29', value: 85, value2: 90 },
                    { label: 'Wk 30', value: 70, value2: 80 },
                    { label: 'Wk 31', value: 95, value2: 95 },
                  ].map((d, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 space-y-2 z-10">
                      <div className="flex space-x-1 w-full justify-center items-end h-40">
                        {/* Match Success Bar */}
                        <div 
                          style={{ height: `${d.value}%` }}
                          className="w-4 sm:w-6 bg-teal-700/80 rounded-t-md hover:bg-teal-600 transition-all cursor-pointer relative group"
                        >
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-100 text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 font-mono font-bold">
                            Matches: {d.value}%
                          </span>
                        </div>
                        {/* Compliance Deployment Bar */}
                        <div 
                          style={{ height: `${d.value2}%` }}
                          className="w-4 sm:w-6 bg-amber-500/85 rounded-t-md hover:bg-amber-400 transition-all cursor-pointer relative group"
                        >
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-100 text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 font-mono font-bold">
                            Compliance: {d.value2}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white0">{d.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6 text-xs font-semibold text-white0">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-3 w-3 bg-teal-700 rounded-sm" />
                    <span>AI Alignment Accept Rate</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="h-3 w-3 bg-amber-500 rounded-sm" />
                    <span>Global Payroll Setup Velocity</span>
                  </div>
                </div>
              </div>

              {/* Active Scheduled Interviews list */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white0 mb-4">Scheduled Sprints & Interviews</h3>
                <div className="space-y-3">
                  {scheduledInterviews.map((int) => (
                    <div key={int.id} className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl dark:border-slate-800 bg-slate-50 dark:bg-blue-600/40">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-white">{int.candidateName}</h4>
                          <p className="text-[10px] sm:text-xs text-white0">{int.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">{int.date}</span>
                        <span className="text-[10px] sm:text-xs text-slate-400">{int.time} UTC</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. EOR CONTRACTS COMPLIANCE ROOM */}
          {activeSubTab === 'contracts' && (
            <div className="space-y-6" id="contracts-workspace">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                  <span>Draft Global Compliant EOR Pacts</span>
                </h3>

                <form onSubmit={handleGenerateContract} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Target Candidate *
                      </label>
                      <select
                        id="contract-candidate-select"
                        value={selectedContractCandidate?.id || ''}
                        onChange={(e) => {
                          const cand = mockCandidates.find(c => c.id === e.target.value);
                          setSelectedContractCandidate(cand || null);
                        }}
                        required
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      >
                        <option value="">-- Choose Candidate --</option>
                        {mockCandidates.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Deployment Jurisdiction *
                      </label>
                      <select
                        id="contract-country-select"
                        value={contractCountry}
                        onChange={(e) => setContractCountry(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      >
                        {['Estonia', 'Germany', 'United Kingdom', 'Japan', 'United Arab Emirates', 'Singapore'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Contract Type
                      </label>
                      <select
                        id="contract-type-select"
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      >
                        {['Full-time EOR', 'Fractional Specialist (20h)', 'Independent Contractor'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Monthly Base Pay (EUR)
                      </label>
                      <input
                        id="contract-salary-input"
                        type="number"
                        value={contractSalary}
                        onChange={(e) => setContractSalary(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    id="contract-generate-btn"
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-slate-900/10 dark:shadow-none"
                  >
                    <Shield className="h-4.5 w-4.5" />
                    <span>Generate Compliant EOR Pact & Ingest Payout Parameters</span>
                  </button>
                </form>
              </div>

              {/* PDF simulation render */}
              {contractGenerated && (
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-blue-600/70" id="contract-pact-result">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold font-mono text-white0 flex items-center space-x-1.5">
                      <FileText className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                      <span>SECURE_COMPLIANCE_DOCKET.PDF</span>
                    </span>
                    <button
                      id="contract-download-btn"
                      onClick={() => {
                        const blob = new Blob([contractGenerated], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `WorkNear_EOR_Pact_${selectedContractCandidate?.name.replace(' ', '_')}.txt`;
                        link.click();
                      }}
                      className="text-xs font-bold text-teal-800 hover:underline dark:text-teal-400 flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download Certified Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-96">
                    {contractGenerated}
                  </pre>
                  <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle className="h-4 w-4" />
                    <span>Perfect alignment secured. Local benefits and tax files are locked for processing automatically under sovereign EOR covenants.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. INTERVIEW ROOM SCHEDULE */}
          {activeSubTab === 'scheduler' && (
            <div className="space-y-6" id="scheduler-workspace">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                  <span>Schedule AI Technical Screening or Review</span>
                </h3>

                <form onSubmit={handleScheduleInterview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Candidate *
                      </label>
                      <select
                        id="schedule-candidate-select"
                        value={scheduleCandidate?.id || ''}
                        onChange={(e) => {
                          const cand = mockCandidates.find(c => c.id === e.target.value);
                          setScheduleCandidate(cand || null);
                        }}
                        required
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      >
                        <option value="">-- Choose Candidate --</option>
                        {mockCandidates.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Interview Sprint Type
                      </label>
                      <select
                        id="schedule-type-select"
                        value={scheduleType}
                        onChange={(e) => setScheduleType(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      >
                        <option value="Technical Screening">Technical Screening (AI Assisted)</option>
                        <option value="Design System Review">Design System Review</option>
                        <option value="Sovereign Architecture Evaluation">Sovereign Architecture Evaluation</option>
                        <option value="Executive Pitch Room">Executive Pitch Room</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Target Date
                      </label>
                      <input
                        id="schedule-date-input"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                        Target Time (UTC)
                      </label>
                      <input
                        id="schedule-time-input"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    id="schedule-submit-btn"
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-slate-900/10 dark:shadow-none"
                  >
                    <Calendar className="h-4.5 w-4.5" />
                    <span>Secure Calendar & Lock AI Room Link</span>
                  </button>
                </form>
              </div>

              {/* Simple visual calendar scheduler layout */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-white0 uppercase tracking-wider mb-4">Workspace Calendar Layout (Mockup)</h4>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-bold text-slate-400 py-1">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, idx) => {
                    const dayNum = idx + 1;
                    const isInterviewDay = dayNum === 22 || dayNum === 25;
                    return (
                      <div 
                        key={dayNum} 
                        className={`py-3 rounded-lg border font-semibold ${
                          isInterviewDay 
                            ? 'bg-teal-50 border-teal-600 text-teal-800 dark:bg-teal-950/40 dark:border-teal-500 dark:text-teal-400 font-extrabold' 
                            : 'bg-slate-100 dark:bg-blue-600/20 border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {dayNum}
                        {isInterviewDay && <span className="block h-1 w-1 bg-teal-700 dark:bg-teal-400 rounded-full mx-auto mt-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: RECRUITMENT BOT ASSISTANT & COMPLIANCE CHAT */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col h-[580px] shadow-sm relative overflow-hidden" id="recruiter-bot-widget">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-amber-500" />
            
            {/* Widget Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-teal-700 text-white flex items-center justify-center dark:bg-teal-600">
                  <Brain className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-blue-600 dark:text-white">WorkNear AI Advisor</h4>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 flex items-center space-x-1 font-semibold">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-ping mr-1" />
                    <span>Operational (gemini-3.6-flash)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Body messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  id={`chat-msg-${msg.id}`}
                  className={`flex items-start space-x-2.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-slate-800 text-slate-100' : 'bg-teal-50 text-teal-800 dark:bg-teal-950/30 dark:text-teal-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-blue-600 rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 dark:bg-blue-600/40 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="block text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center space-x-2 text-slate-400 italic">
                  <div className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Sovereign engine formulating reasoning...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-blue-600/30 flex gap-2">
              <input
                id="bot-input-field"
                type="text"
                placeholder="Ask EOR laws, draft requirements, etc."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-stone-850 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
              />
              <button
                id="bot-send-btn"
                type="submit"
                className="h-8 w-8 rounded-xl bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition shrink-0 dark:bg-teal-600"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
