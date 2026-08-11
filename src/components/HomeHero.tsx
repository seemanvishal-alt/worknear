/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Building, ArrowRight, Sparkles, Code, Cpu, Shield, Globe } from 'lucide-react';

interface HomeHeroProps {
  onSearch: (filters: { title: string; company: string; location: string }) => void;
  onPostJobClick: () => void;
  setActiveTab?: (tab: string) => void;
}

export default function HomeHero({ onSearch, onPostJobClick, setActiveTab }: HomeHeroProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');

  const trendingKeywords = ['Catering Helper', 'Warehouse Loader', 'Packers & Movers', 'Journeyman Electrician', 'Delivery Boy', 'Event Crew'];
  const popularSearches = ['Event Staff & Service Boys', 'Hourly Warehouse Loaders', 'Licensed Electrician', 'Local Driver', 'Commercial Housekeeper'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ title, company, location });
  };

  const handleKeywordClick = (word: string) => {
    setTitle(word);
    onSearch({ title: word, company, location });
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      {/* Premium background gradient mashup with blue and light blue */}
      <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-200/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Elegant marketing badge */}
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-spin mr-1.5 text-sky-500" />
              <span>Next-Generation AI Sourcing & Compliance Network</span>
            </div>
            {setActiveTab && (
              <button 
                onClick={() => setActiveTab('gig-marketplace')} 
                className="inline-flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm cursor-pointer hover:bg-emerald-100 transition"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>New: Aadhaar-Verified Hyperlocal Gig Portal ⚡</span>
              </button>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] font-display text-slate-900">
            Match with Premium Jobs <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
              Directly and Compliantly.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Scale beyond borders instantly. WorkNear connects elite candidates with top-tier technology companies using high-dimensional semantic match algorithms, complete with built-in global payroll ledger capabilities.
          </p>

          {/* AI Search Box */}
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-blue-100 p-3 rounded-2xl shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-2.5 max-w-3xl"
          >
            {/* Title field */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-blue-600" />
              <input 
                type="text" 
                placeholder="Job Title, skill, keyword..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent pl-10 pr-3 py-2 text-xs text-slate-800 outline-none placeholder-slate-400 font-semibold"
              />
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

            {/* Company field */}
            <div className="relative flex-1 flex items-center">
              <Building className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hiring Company..." 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-transparent pl-10 pr-3 py-2 text-xs text-slate-800 outline-none placeholder-slate-400 font-semibold"
              />
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />

            {/* Location field */}
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-3.5 h-4.5 w-4.5 text-sky-500" />
              <input 
                type="text" 
                placeholder="City, region, or Remote..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent pl-10 pr-3 py-2 text-xs text-slate-800 outline-none placeholder-slate-400 font-semibold"
              />
            </div>

            {/* Sourcing CTAs */}
            <div className="flex space-x-2 pt-2 sm:pt-0 shrink-0">
              <button
                type="submit"
                className="flex-1 sm:flex-initial rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold text-white transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <span>Find Jobs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Popular searches / keywords */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-blue-700">Popular Searches:</span>
              {popularSearches.map((ps, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => handleKeywordClick(ps)}
                  className="bg-white border border-blue-100 hover:border-blue-400 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 font-medium transition shadow-sm"
                >
                  {ps}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold text-sky-600">Trending keywords:</span>
              {trendingKeywords.map((tk, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => handleKeywordClick(tk)}
                  className="hover:text-blue-600 font-mono text-[10px] font-semibold text-slate-600"
                >
                  #{tk} {idx !== trendingKeywords.length - 1 && '•'}
                </button>
              ))}
            </div>
          </div>

          {/* Sourcing CTAs below search */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onSearch({ title: '', company: '', location: '' })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Explore Latest Vacancies</span>
            </button>
            
            <button
              onClick={onPostJobClick}
              className="border border-blue-200 bg-blue-50/55 hover:bg-blue-50 text-blue-700 font-bold text-xs px-6 py-3.5 rounded-xl transition flex items-center space-x-2 cursor-pointer"
            >
              <Code className="h-4 w-4 text-blue-600" />
              <span>Post a Verified Role</span>
            </button>
          </div>

        </div>

        {/* Right Column: Premium High-Tech visual card - Redesigned to use beautiful light-blue themes */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          <div className="absolute inset-0 bg-blue-400/10 rounded-3xl blur-2xl pointer-events-none" />
          
          {/* Main Card with live metrics */}
          <div className="relative rounded-3xl bg-white border border-blue-100 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-mono text-slate-500">REALTIME_MATCH_ENGINE_V3</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-mono border border-blue-200/50 font-bold">CRAWL_READY</span>
            </div>

            {/* Simulated Live Match Stream */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ACTIVE JOB REQUISITION</span>
                  <span className="text-sky-600 font-bold">MATCH SCORE: 99.4%</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 mt-1">Licensed Journeyman Electrician (Onsite)</h4>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">VT</div>
                  <span className="text-[10px] text-slate-600 font-medium">VoltTech Repairs • Seattle, WA</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-pulse">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>OPTIMAL CANDIDATE MATCHED</span>
                  <span className="text-blue-600 font-bold">ALIGNED COMPLIANT</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                    alt="Marcus Chen Profile" 
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full border border-blue-100"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Marcus Chen</h5>
                    <p className="text-[9px] text-slate-500">Licensed Electrician • 6 Years Exp</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {['Wiring & Circuits', 'OSHA 30 Certified', 'Local Code Compliant'].map((tg, i) => (
                    <span key={i} className="bg-white text-[8px] text-blue-700 font-mono px-2 py-0.5 rounded border border-blue-100 font-semibold shadow-sm">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Sourcing Statistics */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center border-t border-slate-100">
              <div>
                <span className="block text-[10px] text-slate-400 font-mono">NODE_COUNT</span>
                <span className="text-xs font-black text-slate-900 mt-0.5 block">14,200+</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono">HIRE_VELOCITY</span>
                <span className="text-xs font-black text-blue-600 mt-0.5 block">1.8 days</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono">RELIABILITY</span>
                <span className="text-xs font-black text-sky-600 mt-0.5 block">99.8%</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
