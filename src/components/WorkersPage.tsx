/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Shield, MapPin, Phone, MessageSquare, CheckCircle, 
  Award, Briefcase, Users, HelpCircle, ArrowRight, Check, Sparkles
} from 'lucide-react';

interface LocalJob {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  distance: string;
  pay: string;
  description: string;
  requirements: string[];
  ownerName: string;
  ownerPhone: string;
  ownerAvatar: string;
}

const LOCAL_NON_TECH_JOBS: LocalJob[] = [
  {
    id: 'job-coimbatore-1',
    title: 'Banquet Catering Helper',
    company: 'Royal Palace Caterers',
    category: 'Catering Services',
    location: 'Gandhipuram, Coimbatore',
    distance: '1.2 km away',
    pay: '₹800 / day',
    description: 'Urgent requirement for 5 banquet assistants for a premium wedding buffet tonight. Duties include serving food and helping the chef with kitchen set up. Dinner and refreshments provided.',
    requirements: [
      'Basic polite behavior & neat uniform (white shirt, black pants)',
      'Aadhaar verified profile',
      'Willingness to assist with high-volume wedding serving'
    ],
    ownerName: 'Ramanathan K.',
    ownerPhone: '+91 98402 11029',
    ownerAvatar: 'RK'
  },
  {
    id: 'job-chennai-1',
    title: 'Delivery Partner (Groceries)',
    company: 'FreshBasket Direct',
    category: 'Delivery & Logistics',
    location: 'OMR, Chennai',
    distance: '0.5 km away',
    pay: '₹120 / delivery + fuel',
    description: 'Immediate openings for delivery personnel with their own two-wheeler and driving license. Deliver fresh groceries in and around Thoraipakkam. Direct payout daily.',
    requirements: [
      'Two-wheeler with active registration',
      'Smartphone for navigation app',
      'Reliable timing & fast pickups'
    ],
    ownerName: 'Sujith Kumar',
    ownerPhone: '+91 97890 44321',
    ownerAvatar: 'SK'
  },
  {
    id: 'job-coimbatore-2',
    title: 'Warehouse Cargo Loader',
    company: 'SmartPack Logistics Hub',
    category: 'Warehouse & Loading',
    location: 'Singanallur, Coimbatore',
    distance: '2.4 km away',
    pay: '₹950 / shift',
    description: 'Loading and unloading carton boxes for an active regional logistics hub. Heavy lifting involved. Shift has regular tea breaks. Weekly payments made directly to your bank.',
    requirements: [
      'Physical stamina for lifting cargo boxes up to 25kg',
      'Strict adherence to warehouse safety guidelines',
      'Timely attendance for the evening shift'
    ],
    ownerName: 'Balasubramaniam S.',
    ownerPhone: '+91 94430 88762',
    ownerAvatar: 'BS'
  },
  {
    id: 'job-bengaluru-1',
    title: 'Office Assistant & Tea Maker',
    company: 'Creative Tech Labs',
    category: 'Housekeeping & Cleaning',
    location: 'Whitefield, Bengaluru',
    distance: '3.1 km away',
    pay: '₹750 / day',
    description: 'Looking for a general helper for office kitchen cleaning, preparing tea/coffee for staff twice a day, and assisting with simple file movements inside the office.',
    requirements: [
      'Polite communication skills',
      'Knowledge of basic tea and snack preparation',
      'Aadhaar compliance'
    ],
    ownerName: 'Anjali Nair',
    ownerPhone: '+91 80956 77112',
    ownerAvatar: 'AN'
  },
  {
    id: 'job-coimbatore-3',
    title: 'Event Security Guard',
    company: 'Surya Security Services',
    category: 'Security & Guarding',
    location: 'Peelamedu, Coimbatore',
    distance: '1.8 km away',
    pay: '₹1,000 / night',
    description: 'Night shift security guard needed for a premium electronics expo at Coimbatore Exhibition Grounds. Safe and sheltered venue. Duty starts at 8 PM and ends at 6 AM.',
    requirements: [
      'Height requirement: 5ft 8in or above',
      'Basic alertness and safety screening training',
      'Excellent track record & Aadhaar check verified'
    ],
    ownerName: 'Vikram Rathore',
    ownerPhone: '+91 91102 33445',
    ownerAvatar: 'VR'
  },
  {
    id: 'job-chennai-2',
    title: 'Commercial Cleaning Executive',
    company: 'BlueOasis Facility Solutions',
    category: 'Housekeeping & Cleaning',
    location: 'T-Nagar, Chennai',
    distance: '0.9 km away',
    pay: '₹650 / day',
    description: 'Immediate requirement for housekeeping staff for premium commercial retail showroom spaces in T-Nagar. Shifts available from 10:00 AM to 6:00 PM. Uniform provided.',
    requirements: [
      'Punctuality and neatness',
      'Basic knowledge of commercial cleaning tools',
      'Verifiable previous local references'
    ],
    ownerName: 'Priya Dharshini',
    ownerPhone: '+91 90031 22334',
    ownerAvatar: 'PD'
  }
];

export default function WorkersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeJobDetails, setActiveJobDetails] = useState<LocalJob | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [callStatusMessage, setCallStatusMessage] = useState('');

  // Categories list
  const categories = [
    'All',
    'Catering Services',
    'Warehouse & Loading',
    'Delivery & Logistics',
    'Housekeeping & Cleaning',
    'Security & Guarding'
  ];

  // Filter jobs based on search query and category
  const filteredJobs = LOCAL_NON_TECH_JOBS.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleApply = (jobId: string) => {
    if (appliedJobIds.includes(jobId)) return;
    setAppliedJobIds((prev) => [...prev, jobId]);
  };

  const startSimulatedCall = (job: LocalJob) => {
    setIsCalling(true);
    setCallStatusMessage('Connecting Aadhaar-verified direct line...');
    setTimeout(() => {
      setCallStatusMessage(`Ringing ${job.ownerName}'s verified phone (${job.ownerPhone})...`);
    }, 1500);
  };

  const endSimulatedCall = () => {
    setIsCalling(false);
    setCallStatusMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10" id="talent-workers-root">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span>100% Aadhaar-Verified & Direct Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
          Find Local Non-Technical Jobs Near You
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-semibold">
          No complex profiles. No resumes required. Zero agent fees. Search nearby non-technical jobs, connect with verified owners directly, and start working tomorrow.
        </p>
      </div>

      {/* Simplified Benefits Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 flex items-start space-x-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-left space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Direct Access to Job Owners</h3>
            <p className="text-xs text-stone-500 leading-normal">Skip complex job applications. Directly get the phone number of the hiring manager to discuss pay and location details immediately.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5 flex items-start space-x-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-left space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Aadhaar-Verified Profiles Only</h3>
            <p className="text-xs text-stone-500 leading-normal">Every job owner on this portal is securely verified using their 12-digit Aadhaar Card, ensuring genuine local operations and prompt daily payments.</p>
          </div>
        </div>
      </div>

      {/* Main Search and Interactive Jobs Directory */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Search Input and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="talent-jobs-search-input"
              type="text"
              placeholder="Search by city, locality or skill (e.g. Coimbatore, Catering, OMR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-250 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-950 outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Quick Clear Button */}
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Categories Horizontal Tabs list */}
        <div className="overflow-x-auto pb-2 flex items-center space-x-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div 
                  key={job.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition relative overflow-hidden group"
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {job.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{job.distance}</span>
                      </span>
                    </div>

                    {/* Job Details */}
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-bold mt-1">
                      {job.company} • <span className="text-stone-400 font-medium">{job.location}</span>
                    </p>

                    {/* Salary / Pay rate */}
                    <div className="my-3.5 py-2.5 px-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-100">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">PAY RATE</span>
                      <span className="text-sm font-extrabold text-slate-950">{job.pay}</span>
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed font-semibold mb-4">
                      {job.description}
                    </p>

                    {/* Job Requirements bullet points */}
                    <div className="space-y-1.5 mb-5 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">REQUIREMENTS</span>
                      {job.requirements.map((req, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-xs text-stone-600 font-semibold">
                          <Check className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Owner Badge & Contact Button Section */}
                  <div className="border-t border-slate-100 pt-4 mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                          {job.ownerAvatar}
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-950">{job.ownerName}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Job Owner</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center space-x-0.5">
                        <Shield className="h-2.5 w-2.5 fill-emerald-50" />
                        <span>Aadhaar Verified</span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleApply(job.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-white border border-slate-250 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <span>Quick Apply</span>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveJobDetails(job)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-sm"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Contact Owner</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-stone-400">
              <Briefcase className="h-8 w-8 text-stone-300 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-stone-900">No jobs found nearby</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                No active jobs currently match your query or category. Try clearing the search query or typing Coimbatore/Chennai to fetch nearby opportunities.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Contact & Aadhaar Verification Modal Drawer */}
      <AnimatePresence>
        {activeJobDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs uppercase font-bold tracking-widest font-mono text-emerald-400">Aadhaar Secured Line</span>
                </div>
                <button 
                  onClick={() => { setActiveJobDetails(null); endSimulatedCall(); }}
                  className="text-slate-400 hover:text-white font-extrabold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body details */}
              <div className="p-6 space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block">DIRECT COMPLIANT CONNECT</span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {activeJobDetails.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-bold">
                    {activeJobDetails.company} • {activeJobDetails.location}
                  </p>
                </div>

                {/* Aadhaar checklist status box */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs">
                      {activeJobDetails.ownerAvatar}
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-emerald-800 flex items-center space-x-1">
                        <span>{activeJobDetails.ownerName}</span>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 fill-white shrink-0" />
                      </span>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-wider block">Identity Verified via National UIDAI</span>
                    </div>
                  </div>

                  <div className="border-t border-emerald-150 pt-2 text-[10px] text-emerald-700 leading-relaxed font-semibold">
                    This job owner has cleared government Aadhaar verification. Direct voice calls and chats are encrypted and monitored for mutual safety.
                  </div>
                </div>

                {/* Simulated Call Ringing panel */}
                {isCalling ? (
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold tracking-wider">{callStatusMessage}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Direct audio connection handshaking securely...</p>
                    <button
                      onClick={endSimulatedCall}
                      className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-300 underline block mx-auto cursor-pointer"
                    >
                      Disconnect Call
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-center">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">VERIFIED PHONE NUMBER</span>
                      <span className="text-base font-extrabold text-slate-950 font-mono tracking-wider">{activeJobDetails.ownerPhone}</span>
                    </div>

                    <p className="text-[11px] text-center text-stone-500 font-medium">
                      Call or WhatsApp the owner directly to agree on the start time and confirm your Aadhaar card details.
                    </p>
                  </div>
                )}

                {/* Direct Action triggers */}
                {!isCalling && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => startSimulatedCall(activeJobDetails)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Start Voice Call</span>
                    </button>

                    <a
                      href={`https://wa.me/${activeJobDetails.ownerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
