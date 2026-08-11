/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Eye, Users, FileText, CheckCircle, 
  Trash2, DollarSign, MapPin, Search, Filter, ShieldCheck, 
  ArrowRight, Briefcase, Sparkles, Map, Bell, Send, Star
} from 'lucide-react';
import GigNearbyMap from './GigNearbyMap';

interface JobPosting {
  id: string;
  title: string;
  category: string;
  location: string;
  salary: number;
  openings: number;
  status: 'active' | 'filled' | 'pending';
  applicantsCount: number;
  datePosted: string;
  description: string;
}

export default function JobOwnerPage() {
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  
  const mockWorkers = [
    {
      id: 'w-1',
      name: 'Ramesh Kumar',
      avatar: '',
      category: 'security' as const,
      skills: ['Biometric Check', 'CCTV monitoring'],
      experience: 5,
      phone: '+91 98765 43210',
      distanceKm: 1.2,
      aiTrustScore: 98,
      rating: 4.8,
      reviewsCount: 24,
      aadhaarStatus: 'verified' as const,
      locationName: 'Nungambakkam, Chennai',
      lat: 13.0587,
      lng: 80.2417,
      bio: 'Professional safety controller and gate compliance auditor.'
    },
    {
      id: 'w-2',
      name: 'Priya Sundaram',
      avatar: '',
      category: 'catering' as const,
      skills: ['South Indian Buffet', 'Event Safety'],
      experience: 4,
      phone: '+91 98765 12345',
      distanceKm: 2.8,
      aiTrustScore: 99,
      rating: 4.9,
      reviewsCount: 38,
      aadhaarStatus: 'verified' as const,
      locationName: 'Guindy, Chennai',
      lat: 13.0067,
      lng: 80.2206,
      bio: 'Experienced corporate chef specializing in large-scale buffet setups.'
    }
  ];

  const handleInviteWorker = (worker: any) => {
    if (!invitedIds.includes(worker.id)) {
      setInvitedIds([...invitedIds, worker.id]);
    }
  };

  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: 'job-101',
      title: 'Premium Hospitality Chef',
      category: 'Hospitality',
      location: 'Nungambakkam, Chennai',
      salary: 500,
      openings: 2,
      status: 'active',
      applicantsCount: 5,
      datePosted: '2026-08-01',
      description: 'Prepare and execute high-profile buffet dining for executive corporate guests.'
    },
    {
      id: 'job-102',
      title: 'Licensed Industrial Electrician',
      category: 'Skilled Trades',
      location: 'Ambattur Industrial Estate, Chennai',
      salary: 700,
      openings: 1,
      status: 'active',
      applicantsCount: 3,
      datePosted: '2026-08-04',
      description: 'Review industrial circuit boards, perform routine preventative maintenance on motor control nodes.'
    },
    {
      id: 'job-103',
      title: 'Fulfillment & Sorting Associate',
      category: 'Warehouse & Logistics',
      location: 'Guindy, Chennai',
      salary: 300,
      openings: 10,
      status: 'filled',
      applicantsCount: 12,
      datePosted: '2026-07-28',
      description: 'Fast-paced loading, sorting, and scanning of retail inventory logs.'
    }
  ]);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Hospitality');
  const [newLocation, setNewLocation] = useState('Chennai');
  const [newSalary, setNewSalary] = useState('');
  const [newOpenings, setNewOpenings] = useState('1');
  const [newDesc, setNewDesc] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('job-101');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSalary) return;

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      location: newLocation,
      salary: Number(newSalary),
      openings: Number(newOpenings),
      status: 'active',
      applicantsCount: 0,
      datePosted: new Date().toISOString().split('T')[0],
      description: newDesc || 'No details provided.'
    };

    setJobs([newJob, ...jobs]);
    setIsPostModalOpen(false);
    setSelectedJobId(newJob.id);

    // Reset fields
    setNewTitle('');
    setNewSalary('');
    setNewOpenings('1');
    setNewDesc('');
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    if (selectedJobId === id) {
      setSelectedJobId(jobs[0]?.id || null);
    }
  };

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-slate-50 min-h-screen text-slate-800 transition-colors duration-200"
      id="job-owner-page-container"
    >
      {/* Upper Navigation / Information Banner */}
      <section className="bg-white border-b border-slate-200/80 py-12 text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:16px_16px] opacity-30" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-3">
              Job Owner Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
              Deploy Gigs & Verify Labor
            </h1>
            <p className="mt-3 text-slate-500 text-xs sm:text-sm max-w-xl">
              Post hyperlocal hourly tasks, trace Aadhaar-verified candidate nodes in real time on our Google APK color theme, and approve daily micro-payroll settlements.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="inline-flex items-center space-x-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/10 active:scale-[0.98] self-start md:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Job Post</span>
          </button>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Job Postings List (5 cols) */}
          <section className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Your Job Postings</h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-bold font-mono">
                  {jobs.length} total
                </span>
              </div>

              {/* Jobs List */}
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                      selectedJobId === job.id
                        ? 'bg-blue-50/40 border-blue-400/80 shadow-md shadow-blue-100/30'
                        : 'bg-white border-slate-150 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                          {job.category}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-1 leading-tight">
                          {job.title}
                        </h3>
                      </div>
                      
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        job.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-bold font-mono">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="text-slate-800">
                        ₹{job.salary}/hr
                      </span>
                    </div>

                    {/* Applicants info */}
                    <div className="mt-3 pt-3 border-t border-slate-100/60 flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold">
                        <Users className="h-3.5 w-3.5" />
                        <span>{job.applicantsCount} applicants</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Delete this posting"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 text-left">
              <div className="flex items-center space-x-2 text-blue-700 font-black text-xs uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                <span>Smart Match Assistance</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                Our cognitive matching nodes analyze the geo-coordinates and specific skills of local talent to recommend candidates within a 15km radius. Ensure your salary packages are aligned with Chennai standard indices.
              </p>
            </div>
          </section>

          {/* Right Column: Active Job Details, Applicants & Map (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            {activeJob ? (
              <div className="space-y-6 text-left">
                
                {/* Details Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                        {activeJob.category}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1 leading-tight">
                        {activeJob.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-semibold flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Posted on {activeJob.datePosted}</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-right">
                      <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Hourly Payrate</span>
                      <span className="text-lg font-black text-blue-600 font-mono">₹{activeJob.salary}</span>
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Job Specifications</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                      {activeJob.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[11px] font-mono font-bold">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase font-black">Region Node</span>
                        <span className="text-slate-800">{activeJob.location}</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase font-black">Compliance Check</span>
                        <span className="text-emerald-700">Aadhaar Mandate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Real-Time Talent Tracking View (Google APK Color Scheme) */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Map className="h-4 w-4" />
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Hyperlocal Talent Map Nodes</h3>
                    </div>
                    
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-black tracking-widest border border-blue-100 animate-pulse uppercase">
                      Chennai Network Active
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    View active candidates within 10km who match your job skills. Green markers denote Aadhaar card and facial liveness compliance passed.
                  </p>

                  <div className="h-[280px] rounded-2xl border border-slate-200 overflow-hidden shadow-inner relative">
                    <GigNearbyMap 
                      workers={mockWorkers}
                      selectedCategory={activeJob?.category.toLowerCase() === 'hospitality' ? 'catering' : 'security'}
                      centerAddress={activeJob?.location || 'Chennai'}
                      onInviteWorker={handleInviteWorker}
                      invitedWorkerIds={invitedIds}
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-sm text-center">
                <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">No Active Job Selected</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Select a job posting from the left sidebar or create a new post to coordinate workers.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* POST NEW JOB MODAL */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl relative text-left"
            >
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                Post Hyperlocal Gig
              </h2>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Gig Post Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Licensed Industrial Electrician"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="Hospitality">Hospitality</option>
                      <option value="Skilled Trades">Skilled Trades</option>
                      <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                      <option value="Healthcare & Caregiving">Healthcare & Caregiving</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Region Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Guindy, Chennai"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Hourly Salary (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Total Openings
                    </label>
                    <input
                      type="number"
                      required
                      value={newOpenings}
                      onChange={(e) => setNewOpenings(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Gig Description Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detail the daily operational shifts, safety standards, and matching criteria."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none resize-none"
                  />
                </div>

                <div className="pt-3 flex space-x-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer text-center shadow-md shadow-blue-600/10"
                  >
                    Post Gig Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
