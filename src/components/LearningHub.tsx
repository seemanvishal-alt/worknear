/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, HelpCircle, Laptop, GraduationCap, Award, PlayCircle, 
  Send, Brain, CheckCircle, Sparkles 
} from 'lucide-react';

export default function LearningHub() {
  const [activeHubTab, setActiveHubTab] = useState<'mock' | 'questions' | 'courses' | 'certs'>('mock');
  const [interviewQuestionIdx, setInterviewQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const mockInterviewQuestions = [
    {
      q: 'How do you handle a high-volume catering order where 3 kitchen helpers fail to check in 10 minutes before the event?',
      hint: 'Think about contingency workforce pooling, notifying local backup workers, and immediate direct call procedures.'
    },
    {
      q: 'What is the correct safety procedure when a customer reports an unexpected voltage surge on a residential service line?',
      hint: 'Reflect on Lock-Out/Tag-Out (LOTO) protocols, initial insulation resistance diagnosis, and standard service isolation.'
    }
  ];

  const handleEvaluateAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        rating: 'Operational Level (92/100)',
        constructive: 'Your answer is highly practical. To reach absolute perfection, explain how you would leverage WorkNear’s automated GPS check-ins to monitor replacement arrivals in real-time.',
        positives: 'Excellent understanding of contingency routing and safe LOTO safety protocols.'
      });
    }, 1200);
  };

  const handleNextQuestion = () => {
    setInterviewQuestionIdx(prev => (prev + 1) % mockInterviewQuestions.length);
    setUserAnswer('');
    setEvaluationResult(null);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-100 transition-colors duration-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">TALENT EMPOWERMENT</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
            Learning & Optimization Hub
          </h2>
          <p className="mt-3 text-slate-650 text-xs sm:text-sm">
            Accelerate your local job readiness. Pass real-world skill quizzes, solve mock interview scenarios, and earn verified occupational badges to stand out to nearby businesses.
          </p>
        </div>

        {/* Dashboard layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Hub switchers */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: 'mock', label: 'AI Mock Interviews', icon: <Brain className="h-5 w-5 text-blue-600" /> },
              { id: 'questions', label: 'Common Interview Questions', icon: <HelpCircle className="h-5 w-5 text-sky-500" /> },
              { id: 'courses', label: 'Skill Guides & Checklists', icon: <GraduationCap className="h-5 w-5 text-indigo-500" /> },
              { id: 'certs', label: 'Aadhaar & Skill Badges', icon: <Award className="h-5 w-5 text-blue-700" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`hub-tab-${tab.id}`}
                onClick={() => {
                  setActiveHubTab(tab.id as any);
                  setEvaluationResult(null);
                  setUserAnswer('');
                }}
                className={`w-full p-4 rounded-xl border text-left flex items-center space-x-3.5 transition-all cursor-pointer ${
                  activeHubTab === tab.id
                    ? 'bg-white border-blue-200 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-white/60'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 shadow-sm shrink-0 border border-slate-100">
                  {tab.icon}
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side: Tab contents */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {activeHubTab === 'mock' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 uppercase">
                    ACTIVE MOCK INTERVIEW
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-3 uppercase tracking-wider">
                    Question {interviewQuestionIdx + 1}:
                  </h4>
                  <p className="text-sm text-slate-800 mt-2 font-medium leading-relaxed">
                    {mockInterviewQuestions[interviewQuestionIdx].q}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-2 leading-normal">
                    💡 Hint: {mockInterviewQuestions[interviewQuestionIdx].hint}
                  </p>
                </div>

                <form onSubmit={handleEvaluateAnswer} className="space-y-3">
                  <textarea
                    rows={4}
                    placeholder="Type your structured operations answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-blue-500 text-slate-800"
                  />
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                    >
                      Skip / Next Question
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isEvaluating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-55 cursor-pointer shadow-md shadow-blue-600/10"
                    >
                      {isEvaluating ? 'Evaluating answer...' : 'Evaluate Answer'}
                    </button>
                  </div>
                </form>

                {/* Simulated Evaluation Results */}
                {evaluationResult && (
                  <div className="mt-6 pt-5 border-t border-slate-100 animate-fade-in space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">ANALYSIS RATING:</span>
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{evaluationResult.rating}</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start space-x-2.5">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-black text-emerald-850 uppercase tracking-wider">Identified Strengths</h5>
                        <p className="text-[11px] text-emerald-900 mt-1 leading-normal">{evaluationResult.positives}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-2.5">
                      <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">AI Optimization Suggestion</h5>
                        <p className="text-[11px] text-slate-650 mt-1 leading-normal">{evaluationResult.constructive}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeHubTab === 'questions' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Frequently Asked Practical Questions</h4>
                <div className="space-y-3">
                  {[
                    { q: 'How do you check for a proper electrical ground connection on residential panels?', a: 'Measure the AC voltage between the neutral and ground lines. It should ideally read less than 2 volts to confirm zero reference.' },
                    { q: 'What is the minimum holding temperature for keeping catering buffet foods safe?', a: 'Always maintain hot foods at 140°F (60°C) or higher to prevent bacteria growth and maintain sanitation compliance.' },
                    { q: 'How do you handle fragile glassware stacking in busy warehouse shipping boxes?', a: 'Utilize nested honeycomb dividers, wrap individual glass bodies in cell-wrap, and place heavier bases facing down.' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">Q: {item.q}</h5>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-normal">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeHubTab === 'courses' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Complimentary Training & Guides</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'ServSafe Kitchen Safety & Food Handling', tutor: 'Elena Rostova', lessons: '14 lessons', desc: 'Master commercial food safety, kitchen cross-contamination protocols, and temperature scales.' },
                    { title: 'Logistics & Forklift Operational Guide', tutor: 'Sarah Jenkins', lessons: '8 lessons', desc: 'Learn safe warehouse navigation, heavy cargo balance techniques, and logistics sheet structures.' }
                  ].map((crs, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-extrabold uppercase border border-blue-100">COURSE</span>
                        <h5 className="text-xs font-black text-slate-900 mt-2 uppercase tracking-wider">{crs.title}</h5>
                        <p className="text-[11px] text-slate-555 mt-1.5 leading-normal">{crs.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>By {crs.tutor}</span>
                        <span>{crs.lessons}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeHubTab === 'certs' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Occupational Skill Badge Suites</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Certified Commercial Hospitality Operator (CCHO)', code: 'WN-CERT-CCHO', duration: '60 mins', verified: '1,420 workers verified' },
                    { title: 'Licensed Residential Electrical Helper (LREH)', code: 'WN-CERT-LREH', duration: '45 mins', verified: '820 helpers certified' }
                  ].map((cert, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">{cert.title}</h5>
                        <div className="flex items-center space-x-2 mt-1.5 text-[10px] font-mono text-slate-400">
                          <span>{cert.code}</span>
                          <span>•</span>
                          <span>{cert.duration}</span>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-sm">
                        Start Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
