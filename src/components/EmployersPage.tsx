/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Brain, Sparkles, Plus, Globe, CheckCircle, 
  MapPin, Clock, DollarSign, Calculator, UserCheck, Eye,
  Zap, Phone, QrCode, Sliders, Check, UserPlus, FileText, Lock,
  Search, Star, Filter, RotateCcw
} from 'lucide-react';

const talentPool = [
  {
    id: 'tp-1',
    name: 'Rahul Sharma',
    category: 'Hospitality',
    role: 'Premium Banquet Chef',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop&crop=face',
    distance: 1.5,
    hourlyRate: 450,
    rating: 4.9,
    gigsCompleted: 54,
    skills: ['Kitchen Logistics', 'Menu Scaling', 'HACCP Safety'],
    shifts: ['Morning', 'Afternoon'],
    verified: { aadhaar: true, police: true, liveness: true },
    phone: '+91 98450 12345'
  },
  {
    id: 'tp-2',
    name: 'Deepak Maurya',
    category: 'Skilled Trades',
    role: 'Licensed Industrial Electrician',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face',
    distance: 3.8,
    hourlyRate: 650,
    rating: 4.8,
    gigsCompleted: 29,
    skills: ['Industrial Wiring', 'Circuit Safety', 'OSHA Compliance'],
    shifts: ['Afternoon', 'Night'],
    verified: { aadhaar: true, police: true, liveness: false },
    phone: '+91 97321 88443'
  },
  {
    id: 'tp-3',
    name: 'Sunita Krishnan',
    category: 'Hospitality',
    role: 'Executive Guest Services Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    distance: 8.2,
    hourlyRate: 350,
    rating: 4.9,
    gigsCompleted: 82,
    skills: ['Guest Services', 'Shift Coordination', 'Front Desk'],
    shifts: ['Morning', 'Afternoon'],
    verified: { aadhaar: true, police: true, liveness: true },
    phone: '+91 96110 54321'
  },
  {
    id: 'tp-4',
    name: 'Arjun Verma',
    category: 'Warehouse & Logistics',
    role: 'High-Density Warehouse Loader',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    distance: 12.0,
    hourlyRate: 250,
    rating: 4.6,
    gigsCompleted: 14,
    skills: ['Inventory Loading', 'Heavy Lifting', 'Forklift Ops'],
    shifts: ['Night'],
    verified: { aadhaar: true, police: false, liveness: true },
    phone: '+91 95532 99123'
  },
  {
    id: 'tp-5',
    name: 'Priyanka Sen',
    category: 'Healthcare & Caregiving',
    role: 'Certified Geriatric Caregiver',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    distance: 4.5,
    hourlyRate: 500,
    rating: 4.9,
    gigsCompleted: 61,
    skills: ['Elder Care', 'First Aid / CPR', 'Vitals Tracking'],
    shifts: ['Morning', 'Night'],
    verified: { aadhaar: true, police: true, liveness: true },
    phone: '+91 94480 33221'
  },
  {
    id: 'tp-6',
    name: 'Vikram Rathore',
    category: 'Skilled Trades',
    role: 'HVAC & Air Conditioner Mechanic',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    distance: 2.1,
    hourlyRate: 400,
    rating: 4.7,
    gigsCompleted: 40,
    skills: ['HVAC Repair', 'Coolant Recharge', 'Circuit Safety'],
    shifts: ['Afternoon'],
    verified: { aadhaar: true, police: true, liveness: false },
    phone: '+91 91100 88776'
  },
  {
    id: 'tp-7',
    name: 'Meera Deshmukh',
    category: 'Professional Services',
    role: 'Local Event Coordinator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    distance: 6.7,
    hourlyRate: 550,
    rating: 4.8,
    gigsCompleted: 35,
    skills: ['Vendor Management', 'Event Planning', 'Guest Desk'],
    shifts: ['Afternoon', 'Night'],
    verified: { aadhaar: true, police: true, liveness: true },
    phone: '+91 92233 44556'
  },
  {
    id: 'tp-8',
    name: 'Rohan Gupta',
    category: 'Warehouse & Logistics',
    role: 'Fulfillment & Packing Associate',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    distance: 9.5,
    hourlyRate: 220,
    rating: 4.5,
    gigsCompleted: 18,
    skills: ['Picking & Packing', 'Inventory Auditing', 'Labeling'],
    shifts: ['Morning', 'Afternoon'],
    verified: { aadhaar: true, police: false, liveness: false },
    phone: '+91 93344 55667'
  }
];

export default function EmployersPage() {
  const [country, setCountry] = useState('Germany');
  const [salaryInput, setSalaryInput] = useState('140000');
  const [complianceSummary, setComplianceSummary] = useState<any | null>(null);

  // Sourcing Hub States
  const [sourcingSearch, setSourcingSearch] = useState('');
  const [sourcingCategory, setSourcingCategory] = useState('All');
  const [sourcingRadius, setSourcingRadius] = useState(15);
  const [sourcingMaxRate, setSourcingMaxRate] = useState(800);
  const [sourcingShift, setSourcingShift] = useState<string>('All');
  const [connectedTalentIds, setConnectedTalentIds] = useState<string[]>([]);
  const [activeVerificationCand, setActiveVerificationCand] = useState<any | null>(null);
  const [localToast, setLocalToast] = useState<string | null>(null);

  // Interactive Features states
  const [activeFeatureTab, setActiveFeatureTab] = useState<'search' | 'connect' | 'security' | 'payroll'>('search');
  const [distanceRadius, setDistanceRadius] = useState(5);
  const [isConnectClicked, setIsConnectClicked] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [secCheck1, setSecCheck1] = useState(true);
  const [secCheck2, setSecCheck2] = useState(true);
  const [secCheck3, setSecCheck3] = useState(false);
  const [secCheck4, setSecCheck4] = useState(false);

  // EOR calculations simulation
  const handleCalculateEOR = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNum = parseFloat(salaryInput) || 120000;
    
    // Simple mock calculation based on standard country overheads
    let taxOverheadRate = 0.22; // default Germany
    let healthBenefit = 2400;
    let complianceFee = 599;

    if (country === 'Estonia') {
      taxOverheadRate = 0.33;
      healthBenefit = 1800;
    } else if (country === 'Japan') {
      taxOverheadRate = 0.16;
      healthBenefit = 3200;
    } else if (country === 'Singapore') {
      taxOverheadRate = 0.08;
      healthBenefit = 4000;
    }

    const statutoryTaxes = Math.round(salaryNum * taxOverheadRate);
    const totalYearlyCost = Math.round(salaryNum + statutoryTaxes + healthBenefit + (complianceFee * 12));

    setComplianceSummary({
      statutoryTaxes,
      healthBenefit,
      complianceFee,
      totalYearlyCost,
      taxOverheadPercentage: Math.round(taxOverheadRate * 100),
      isCompliantLocalSetup: true
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12" id="employers-page">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 px-3 py-1 text-xs font-semibold text-teal-800 dark:text-teal-400 mb-4">
          <Shield className="h-3.5 w-3.5" />
          <span>Zero-Liability Global Employment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Deploy Local Talent Compliantly. Anywhere.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Avoid the legal friction of establishing global subsidiaries. WorkNear acts as your trusted Employer of Record (EOR), managing localized contracts, healthcare administration, pension liabilities, and multi-currency payroll under unified sovereign dockets.
        </p>
      </div>

      {/* Interactive Employer Features Showcase */}
      <section className="bg-slate-50/50 dark:bg-slate-900/10 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm" id="employer-features-showcase">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-400">DEMO PLATFORM WORKFLOW</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 leading-none">
            Core Employer Features — Made Simple
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white0 max-w-lg mx-auto">
            Interact with our simulated features panel to understand exactly how WorkNear accelerates, validates, and manages your hyperlocal workforce operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Easy visual tabs selector */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {[
              {
                id: 'search',
                icon: <Zap className="h-5 w-5" />,
                title: '1. Hyperlocal Match',
                tag: 'Distance Proximity',
                desc: 'Instantly query workers within minutes of your physical location, filtered by verified ratings, shift patterns, and technical/non-technical certifications.'
              },
              {
                id: 'connect',
                icon: <Phone className="h-5 w-5" />,
                title: '2. Instant Direct Call',
                tag: 'Zero Lag-time',
                desc: 'Skip tedious in-app messaging. Direct connections let you view and tap-to-call matching workers to lock in shifts instantly.'
              },
              {
                id: 'security',
                icon: <Shield className="h-5 w-5" />,
                title: '3. Aadhaar & Biometric Verification',
                tag: 'Full Safety Clearance',
                desc: 'Ensure total peace of mind. Every workforce profile is validated against government registry databases and on-site face recognition logs.'
              },
              {
                id: 'payroll',
                icon: <QrCode className="h-5 w-5" />,
                title: '4. GPS Check-in & UPI Payouts',
                tag: 'Integrated Payroll Ledger',
                desc: 'Generate shift-specific QR codes. Workers check in with GPS-fenced validation, and receive instant UPI bank payouts directly upon shift approval.'
              }
            ].map((tab) => {
              const isSelected = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`feature-tab-${tab.id}`}
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-teal-600/30 shadow-md shadow-teal-600/5 dark:bg-slate-900 dark:border-teal-500/30'
                      : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-200 dark:hover:bg-slate-900/30'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400'
                      : 'bg-slate-100 text-white0 dark:bg-stone-850 dark:text-slate-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-teal-800 dark:text-teal-300' : 'text-slate-850 dark:text-slate-300'}`}>
                        {tab.title}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-slate-800 dark:text-slate-400 scale-90">
                        {tab.tag}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 leading-relaxed ${isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-white0'}`}>
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Playground Panel */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm min-h-[360px]">
            
            {/* SEARCH PLAYGROUND */}
            {activeFeatureTab === 'search' && (
              <div className="space-y-4 text-left h-full flex flex-col justify-between" id="playground-search">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-400 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Interactive Live Simulator</span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Active Radius: <span className="text-teal-700 dark:text-teal-400 font-mono text-sm">{distanceRadius} km</span></span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Hyperlocal Search Radar</h3>
                  <p className="text-[10px] text-white0 leading-relaxed mt-0.5">
                    Drag the slider below to simulated-match registered candidates based on their current physical GPS distance from your venue.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-stone-850 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">
                    Set Matching Radius Target
                  </label>
                  <div className="flex items-center space-x-3">
                    <Sliders className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      value={distanceRadius}
                      onChange={(e) => setDistanceRadius(parseInt(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono font-black text-slate-800 dark:text-white shrink-0 w-8 text-right">{distanceRadius}km</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {[
                    { name: 'Rahul Sharma', role: 'Premium Banquet Chef', dist: 1.5, rating: '4.9★', count: '54 gigs' },
                    { name: 'Deepak Maurya', role: 'Licensed Industrial Electrician', dist: 3.8, rating: '4.8★', count: '29 gigs' },
                    { name: 'Sunita Krishnan', role: 'Executive Guest Services Lead', dist: 8.2, rating: '4.9★', count: '82 gigs' },
                    { name: 'Arjun Verma', role: 'High-Density Warehouse Loader', dist: 12.0, rating: '4.6★', count: '14 gigs' }
                  ].map((worker, idx) => {
                    const isMatched = distanceRadius >= worker.dist;
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isMatched 
                            ? 'bg-teal-50/40 border-teal-200 text-slate-900 dark:bg-teal-950/10 dark:border-teal-900/50' 
                            : 'bg-slate-50/50 border-slate-100 opacity-30 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${isMatched ? 'bg-teal-600 animate-pulse' : 'bg-slate-300'}`} />
                          <div>
                            <p className="text-xs font-bold">{worker.name}</p>
                            <p className="text-[10px] text-slate-550">{worker.role}</p>
                          </div>
                        </div>
                        <div className="text-right text-[10px]">
                          <p className="font-extrabold text-teal-700 dark:text-teal-400">{worker.dist} km away</p>
                          <p className="text-[9px] font-semibold">{worker.rating} • {worker.count}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONNECT PLAYGROUND */}
            {activeFeatureTab === 'connect' && (
              <div className="space-y-4 text-left h-full flex flex-col justify-between" id="playground-connect">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-400 flex items-center space-x-1 mb-2">
                    <Zap className="h-3 w-3" />
                    <span>Direct-Access Workflow</span>
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Eliminate Chat Latency</h3>
                  <p className="text-[10px] text-white0 leading-relaxed mt-0.5">
                    We do not force you to send messaging pings. Tap below to simulated-request the candidate's direct mobile verification docket.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 self-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      AK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Amit Kumar</h4>
                      <p className="text-[10px] text-white0">Certified AC Mechanic & HVAC Installer</p>
                      <div className="flex items-center space-x-2 mt-1 text-[9px] text-teal-700 dark:text-teal-400 font-extrabold">
                        <span>4.9 ★ Rating</span>
                        <span>•</span>
                        <span>42 Gigs Completed</span>
                      </div>
                    </div>
                  </div>

                  {!isConnectClicked ? (
                    <button 
                      onClick={() => setIsConnectClicked(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer transition shrink-0"
                    >
                      Connect Direct Phone
                    </button>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50 p-2.5 rounded-xl text-center">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Direct Line Dispatched</span>
                      <span className="block text-xs font-bold font-mono text-slate-800 dark:text-white mt-0.5">+91 98450 12345</span>
                    </div>
                  )}
                </div>

                {isConnectClicked && (
                  <div className="bg-blue-50/50 dark:bg-stone-850 p-3 rounded-xl border border-blue-100/50 text-[10px] text-blue-800 dark:text-blue-300 flex items-center space-x-2 animate-pulse">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                    <span><strong>Direct Action Recommendation:</strong> Call or WhatsApp Amit directly to align shift timings. WorkNear bypasses internal gatekeeping!</span>
                  </div>
                )}

                {isConnectClicked && (
                  <button 
                    onClick={() => setIsConnectClicked(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-650 text-center self-center cursor-pointer hover:underline"
                  >
                    Reset Connection Demo
                  </button>
                )}
              </div>
            )}

            {/* SECURITY PLAYGROUND */}
            {activeFeatureTab === 'security' && (
              <div className="space-y-4 text-left h-full flex flex-col justify-between" id="playground-security">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-400 flex items-center space-x-1 mb-2">
                    <Shield className="h-3 w-3" />
                    <span>Sovereign Identity & Compliance Audit</span>
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Ironclad Worker Verification</h3>
                  <p className="text-[10px] text-white0 leading-relaxed mt-0.5">
                    We eliminate corporate liability. Toggle our multi-step verification checks below to view the Trust Compliance score adjust.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 1, label: 'Aadhaar Biometric Check', checked: secCheck1, set: setSecCheck1 },
                    { id: 2, label: 'Face Photo Liveness Match', checked: secCheck2, set: setSecCheck2 },
                    { id: 3, label: 'Local Police Verification', checked: secCheck3, set: setSecCheck3 },
                    { id: 4, label: 'WorkNear Premium Gold Star', checked: secCheck4, set: setSecCheck4 }
                  ].map((check) => (
                    <button 
                      key={check.id}
                      onClick={() => check.set(!check.checked)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                        check.checked 
                          ? 'bg-teal-50/50 border-teal-200 text-teal-900 dark:bg-teal-950/10 dark:border-teal-900/50' 
                          : 'bg-slate-50 border-slate-150 text-white0'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold">{check.label}</span>
                      <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0 border ${
                        check.checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {check.checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Score bar */}
                <div className="bg-slate-50 dark:bg-stone-850 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-1.5">
                    <span className="text-slate-550">Trust Score Rating</span>
                    <span className="text-teal-700 dark:text-teal-400">
                      {Math.round(((secCheck1?1:0) + (secCheck2?1:0) + (secCheck3?1:0) + (secCheck4?1:0)) * 25)}% Compliance Rating
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 transition-all duration-300"
                      style={{ width: `${((secCheck1?1:0) + (secCheck2?1:0) + (secCheck3?1:0) + (secCheck4?1:0)) * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PAYROLL PLAYGROUND */}
            {activeFeatureTab === 'payroll' && (
              <div className="space-y-4 text-left h-full flex flex-col justify-between" id="playground-payroll">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-teal-400 flex items-center space-x-1 mb-2">
                    <QrCode className="h-3 w-3" />
                    <span>Real-Time On-Site Attendance</span>
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">GPS Check-In & One-Click Payouts</h3>
                  <p className="text-[10px] text-white0 leading-relaxed mt-0.5">
                    Generate the site QR and approve hourly shift wages via direct integrated instant UPI payouts safely.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-stone-850 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <div className="flex flex-col items-center shrink-0">
                    {!showQrCode ? (
                      <button 
                        onClick={() => setShowQrCode(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-3 rounded-xl cursor-pointer transition text-center"
                      >
                        Generate Site QR
                      </button>
                    ) : (
                      <div className="p-1 bg-white rounded-lg border border-slate-200 flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-900 flex flex-wrap items-center justify-center p-1.5 rounded relative">
                          <div className="w-full h-full border border-white flex flex-wrap">
                            <div className="w-4 h-4 bg-white m-0.5" />
                            <div className="w-4 h-4 bg-slate-900 m-0.5" />
                            <div className="w-4 h-4 bg-white m-0.5" />
                            <div className="w-4 h-4 bg-slate-900 m-0.5" />
                            <div className="w-4 h-4 bg-white m-0.5" />
                            <div className="w-4 h-4 bg-white m-0.5" />
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-white0 uppercase mt-1">Scan to Check-In</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 flex-grow w-full">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1 text-[11px]">
                      <span className="text-slate-550">Shift Timer</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">8 hours (Completed)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1 text-[11px]">
                      <span className="text-slate-550">GPS Status</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Match Verified (On-site)</span>
                    </div>
                    <div className="flex justify-between pb-1 text-[11px]">
                      <span className="text-slate-550">Wage Due</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹850</span>
                    </div>
                  </div>
                </div>

                {!isPaid ? (
                  <button 
                    onClick={() => {
                      setIsPaid(true);
                      setTimeout(() => setIsPaid(false), 3500);
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve & Release UPI Payout</span>
                  </button>
                ) : (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50 p-2.5 rounded-xl text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>₹850 routed instantly to worker's UPI wallet!</span>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Talent Sourcing Radar and Filtering Hub */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-stone-850 shadow-sm space-y-8 text-left" id="sourcing-radar-hub">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 px-3 py-1 text-xs font-semibold text-teal-800 dark:text-teal-400 mb-3">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>REAL-TIME HYPERLOCAL DISCOVERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Talent Sourcing Radar
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white0 dark:text-slate-400 max-w-2xl">
            Simulate a hiring manager’s live dashboard. Adjust proximity thresholds, specify certified skill categories, and dial in hourly pay ranges to discover matching active workers near your location.
          </p>
        </div>

        {localToast && (
          <div className="bg-teal-50 border border-teal-200 text-teal-950 dark:bg-teal-950/30 dark:border-teal-900/50 p-4 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{localToast}</span>
            </div>
            <button 
              onClick={() => setLocalToast(null)} 
              className="text-xs font-bold text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Sidebar Filters */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-blue-600 rounded-2xl p-5 border border-slate-200 dark:border-stone-850 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-stone-350 flex items-center space-x-1.5">
                <Filter className="h-3.5 w-3.5 text-teal-700" />
                <span>Active Filters</span>
              </span>
              <button
                onClick={() => {
                  setSourcingSearch('');
                  setSourcingCategory('All');
                  setSourcingRadius(15);
                  setSourcingMaxRate(800);
                  setSourcingShift('All');
                  setLocalToast('All filters restored to default.');
                }}
                className="text-[10px] font-bold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center space-x-1 transition cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* 1. Name Search */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Search Workers or Skills
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rahul, Chef, HVAC..."
                  value={sourcingSearch}
                  onChange={(e) => setSourcingSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            {/* 2. Job Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Job Category Filter
              </label>
              <select
                value={sourcingCategory}
                onChange={(e) => setSourcingCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
              >
                <option value="All">All Sectors & Gigs</option>
                <option value="Hospitality">Hospitality & F&B</option>
                <option value="Skilled Trades">Skilled Trades (Electrician, AC)</option>
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                <option value="Healthcare & Caregiving">Healthcare & Caregiving</option>
                <option value="Professional Services">Professional Services</option>
              </select>
            </div>

            {/* 3. Distance Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                <span>Location Radius</span>
                <span className="text-teal-700 dark:text-teal-400 font-mono text-xs font-black">{sourcingRadius} km</span>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={sourcingRadius}
                  onChange={(e) => setSourcingRadius(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold px-0.5">
                  <span>Immediate (2km)</span>
                  <span>Mid (12km)</span>
                  <span>Regional (25km)</span>
                </div>
              </div>
            </div>

            {/* 4. Pay Scale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                <span>Max Pay Scale</span>
                <span className="text-teal-700 dark:text-teal-400 font-mono text-xs font-black">₹{sourcingMaxRate}/hr</span>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={sourcingMaxRate}
                  onChange={(e) => setSourcingMaxRate(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold px-0.5">
                  <span>₹200/hr</span>
                  <span>₹600/hr</span>
                  <span>₹1000+/hr</span>
                </div>
              </div>
            </div>

            {/* 5. Shift Availability */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Preferred Shift Slot
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['All', 'Morning', 'Afternoon', 'Night'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSourcingShift(s)}
                    className={`py-1.5 px-1 rounded-lg text-[9px] font-black text-center border uppercase tracking-wider transition cursor-pointer ${
                      sourcingShift === s
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {s === 'All' ? 'Any' : s}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Results Grid/List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Sourcing Summary Feed */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-blue-600 px-4 py-3 rounded-xl border border-slate-200 dark:border-stone-850">
              <span className="text-xs font-bold text-slate-600 dark:text-stone-350">
                Sourcing Match: <span className="text-teal-700 dark:text-teal-400 font-black">{
                  talentPool.filter(cand => {
                    const matchSearch = cand.name.toLowerCase().includes(sourcingSearch.toLowerCase()) || 
                                        cand.role.toLowerCase().includes(sourcingSearch.toLowerCase()) ||
                                        cand.skills.some(s => s.toLowerCase().includes(sourcingSearch.toLowerCase()));
                    const matchCategory = sourcingCategory === 'All' || cand.category === sourcingCategory;
                    const matchDistance = cand.distance <= sourcingRadius;
                    const matchRate = cand.hourlyRate <= sourcingMaxRate;
                    const matchShift = sourcingShift === 'All' || cand.shifts.includes(sourcingShift);
                    return matchSearch && matchCategory && matchDistance && matchRate && matchShift;
                  }).length
                }</span> candidates found
              </span>
              <span className="text-[10px] text-slate-400 font-semibold italic">
                Simulating Delhi/NCR area feed
              </span>
            </div>

            {/* Candidates Loop */}
            {(() => {
              const filteredList = talentPool.filter(cand => {
                const matchSearch = cand.name.toLowerCase().includes(sourcingSearch.toLowerCase()) || 
                                    cand.role.toLowerCase().includes(sourcingSearch.toLowerCase()) ||
                                    cand.skills.some(s => s.toLowerCase().includes(sourcingSearch.toLowerCase()));
                const matchCategory = sourcingCategory === 'All' || cand.category === sourcingCategory;
                const matchDistance = cand.distance <= sourcingRadius;
                const matchRate = cand.hourlyRate <= sourcingMaxRate;
                const matchShift = sourcingShift === 'All' || cand.shifts.includes(sourcingShift);
                return matchSearch && matchCategory && matchDistance && matchRate && matchShift;
              });

              if (filteredList.length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredList.map((talent) => {
                      const isConnected = connectedTalentIds.includes(talent.id);
                      return (
                        <div
                          key={talent.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                          {/* Top profile part */}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <img
                                    src={talent.avatar}
                                    alt={talent.name}
                                    className="h-11 w-11 rounded-full object-cover border border-slate-200 dark:border-stone-750"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                                    <CheckCircle className="h-2.5 w-2.5" />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                                    <span>{talent.name}</span>
                                  </h3>
                                  <p className="text-[10px] text-white0 font-bold dark:text-slate-400">{talent.role}</p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <span className="text-[10px] font-black uppercase text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-100/30">
                                  ₹{talent.hourlyRate}/hr
                                </span>
                                <div className="flex items-center justify-end space-x-0.5 mt-1 text-[10px] font-bold text-amber-500">
                                  <Star className="h-3 w-3 fill-amber-500" />
                                  <span>{talent.rating}</span>
                                  <span className="text-slate-400">({talent.gigsCompleted})</span>
                                </div>
                              </div>
                            </div>

                            {/* Mid metadata tags */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-stone-850 text-slate-550 dark:text-slate-400 flex items-center space-x-1">
                                <MapPin className="h-2 w-2 text-slate-400" />
                                <span>{talent.distance} km</span>
                              </span>
                              
                              {talent.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Shifts */}
                            <div className="text-[9px] font-semibold text-slate-450 dark:text-slate-400 flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span>Shift Availability:</span>
                              <div className="flex space-x-1">
                                {talent.shifts.map((s) => (
                                  <span
                                    key={s}
                                    className="text-[8px] font-black bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-1.5 rounded uppercase"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action block bottom */}
                          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => {
                                if (isConnected) {
                                  setConnectedTalentIds(prev => prev.filter(id => id !== talent.id));
                                  setLocalToast(`Disconnected from ${talent.name}.`);
                                } else {
                                  setConnectedTalentIds(prev => [...prev, talent.id]);
                                  setLocalToast(`Direct Line Granted! Call ${talent.name} directly at ${talent.phone}.`);
                                }
                              }}
                              className={`w-full text-[9px] font-black uppercase tracking-wider py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1 border ${
                                isConnected
                                  ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <Phone className="h-3 w-3 shrink-0" />
                              <span>{isConnected ? 'Dial Now' : 'Connect Direct'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveVerificationCand(talent);
                              }}
                              className="w-full text-[9px] font-black uppercase tracking-wider py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-stone-850 dark:border-stone-750 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center space-x-1"
                            >
                              <Shield className="h-3 w-3 text-teal-600" />
                              <span>Audit File</span>
                            </button>
                          </div>

                          {/* Display Connection Number inside Card if Connected */}
                          {isConnected && (
                            <div className="absolute top-12 left-0 right-0 bg-teal-600 text-white text-center py-1 text-[10px] font-mono font-black tracking-widest uppercase animate-slide-down">
                              Direct Line: {talent.phone}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 dark:text-white0 bg-white dark:bg-slate-900 flex flex-col justify-center items-center">
                    <Sliders className="h-8 w-8 text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">No Local Candidates Match</p>
                    <p className="text-xs mt-1 text-white0 max-w-xs mx-auto">
                      Try broadening your location radius, adjusting the max pay filter, or switching to "All Sectors".
                    </p>
                    <button
                      onClick={() => {
                        setSourcingSearch('');
                        setSourcingCategory('All');
                        setSourcingRadius(25);
                        setSourcingMaxRate(1000);
                        setSourcingShift('All');
                        setLocalToast('All filters broadened to max settings.');
                      }}
                      className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Broaden All Filters
                    </button>
                  </div>
                );
              }
            })()}

          </div>

        </div>

        {/* Detailed Audit Verification modal */}
        {activeVerificationCand && (
          <div className="mt-6 bg-slate-50 dark:bg-blue-600 rounded-2xl p-5 border border-teal-600/30 space-y-4 animate-fade-in relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-teal-600 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 dark:text-white">
                  Compliance Audit File: {activeVerificationCand.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveVerificationCand(null)}
                className="text-[10px] font-black uppercase text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer"
              >
                Close Audit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Aadhaar check */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-300">Aadhaar KYC Docket</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    activeVerificationCand.verified.aadhaar 
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : 'bg-rose-50 text-rose-800'
                  }`}>
                    {activeVerificationCand.verified.aadhaar ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <p className="text-[10px] text-white0 leading-relaxed">
                  Matched with government biometric registry database. Liveness checks matched with unique Aadhaar Number on file.
                </p>
                <div className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 dark:bg-blue-600 p-1.5 rounded">
                  Status Code: OK_AADHAAR_200
                </div>
              </div>

              {/* Police check */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-300">Police Check & Background</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    activeVerificationCand.verified.police 
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-450'
                  }`}>
                    {activeVerificationCand.verified.police ? 'Cleared' : 'Sponsor Pending'}
                  </span>
                </div>
                <p className="text-[10px] text-white0 leading-relaxed">
                  {activeVerificationCand.verified.police 
                    ? 'Criminal registry checked. Zero active incident entries found.' 
                    : 'Local police verification pending. Sponsor ₹150 to run immediate automated background check.'}
                </p>
                {!activeVerificationCand.verified.police && (
                  <button 
                    onClick={() => {
                      activeVerificationCand.verified.police = true;
                      setLocalToast(`Sponsorship successful! Cleared police check docket for ${activeVerificationCand.name}.`);
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg transition"
                  >
                    Sponsor Police Check (₹150)
                  </button>
                )}
              </div>

              {/* Face Liveness check */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-300">Face Recognition Liveness</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    activeVerificationCand.verified.liveness 
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-450'
                  }`}>
                    {activeVerificationCand.verified.liveness ? 'Active Liveness' : 'Verification Required'}
                  </span>
                </div>
                <p className="text-[10px] text-white0 leading-relaxed">
                  Real-time photo compared with on-site GPS logs at past shift check-ins to prevent proxy attendance risks.
                </p>
                <div className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 dark:bg-blue-600 p-1.5 rounded">
                  Trust Score Factor: {activeVerificationCand.verified.liveness ? '98.4%' : '65.0% (Action Required)'}
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

      {/* Interactive Sizing EOR Cost Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Calculator Form */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40 shadow-sm">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-teal-700 dark:text-teal-400" />
            <span>Operational EOR Overhead Calculator</span>
          </h3>
          <p className="text-xs text-white0 mb-4">
            Simulate the complete compliance liability and overhead costs of hiring remote candidates before deploying contracts.
          </p>

          <form onSubmit={handleCalculateEOR} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                Worker Deployment Jurisdiction
              </label>
              <select
                id="employer-country-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
              >
                {['Germany', 'Estonia', 'Japan', 'Singapore'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider dark:text-slate-400 mb-1.5">
                Target Annual Gross Salary (EUR)
              </label>
              <input
                id="employer-salary-input"
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-700 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>

            <button
              id="employer-calc-submit"
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Calculator className="h-4.5 w-4.5" />
              <span>Perform EOR Sizing Analysis</span>
            </button>
          </form>
        </div>

        {/* Calculator Result Overview */}
        <div className="space-y-6">
          {complianceSummary ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm" id="employer-calc-results">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white0 mb-4">Compliance Payout Breakdown</h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Jurisdiction</span>
                  <span className="font-extrabold text-blue-600 dark:text-slate-100">{country}</span>
                </div>
                
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Base Salary</span>
                  <span className="font-bold text-blue-600 dark:text-slate-100">€{parseFloat(salaryInput).toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Statutory Tax Overhead ({complianceSummary.taxOverheadPercentage}%)</span>
                  <span className="font-bold text-blue-600 dark:text-slate-100">€{complianceSummary.statutoryTaxes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">Country Mandatory Health & Benefits</span>
                  <span className="font-bold text-blue-600 dark:text-slate-100">€{complianceSummary.healthBenefit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="text-slate-600 dark:text-slate-400">WorkNear Platform Compliant Management Fee</span>
                  <span className="font-bold text-blue-600 dark:text-slate-100">€{(complianceSummary.complianceFee * 12).toLocaleString()} / yr</span>
                </div>

                <div className="flex justify-between pt-3 text-sm font-black border-t-2 border-stone-350 dark:border-stone-850">
                  <span className="text-slate-900 dark:text-white">Estimated Total Annual Deployment Cost</span>
                  <span className="text-teal-800 dark:text-teal-400">€{complianceSummary.totalYearlyCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-1.5 text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                <span>Regulatory classification verified. Zero misclassification risk with direct global IP preservation covenants.</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:border-slate-800 h-full flex flex-col justify-center items-center">
              <Calculator className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">No Overhead Analysis Run</p>
              <p className="text-xs mt-1 text-white0 max-w-xs mx-auto">
                Perform a sizing study to review statutory employer tax overheads and benefits instantly.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
