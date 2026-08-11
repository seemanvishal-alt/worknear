/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Sparkles, Star, CheckCircle, ShieldAlert } from 'lucide-react';

interface FeaturedJobsProps {
  onApply: (jobTitle: string) => void;
}

export default function FeaturedJobs({ onApply }: FeaturedJobsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'latest' | 'remote' | 'government' | 'private' | 'internship' | 'part-time' | 'freelance' | 'wfh' | 'ai-recommended'>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Realistic mock jobs matching the prompt requirements
  const jobsData = [
    {
      id: 'job-1',
      title: 'Hospitality & Operations Supervisor',
      company: 'WorkNear Premium Lodging',
      logo: '🏨',
      location: 'San Francisco, CA (Onsite)',
      type: 'Full-time',
      salary: '$62k - $74k',
      tags: ['latest', 'onsite', 'private', 'ai-recommended'],
      verified: true,
      orgType: 'Private'
    },
    {
      id: 'job-2',
      title: 'Licensed Journeyman Electrician',
      company: 'VoltTech Repairs',
      logo: '⚡',
      location: 'Seattle, WA (Onsite)',
      type: 'Full-time',
      salary: '$78k - $92k',
      tags: ['onsite', 'private', 'ai-recommended'],
      verified: true,
      orgType: 'Private'
    },
    {
      id: 'job-3',
      title: 'Municipal Facilities Support Lead',
      company: 'Municipal District Operations',
      logo: '🏛️',
      location: 'Washington, DC (Onsite)',
      type: 'Full-time',
      salary: '$52k - $64k',
      tags: ['latest', 'government'],
      verified: true,
      orgType: 'Government'
    },
    {
      id: 'job-4',
      title: 'Executive Catering Chef',
      company: 'Bloom Fine Catering',
      logo: '🍳',
      location: 'Austin, TX (Onsite)',
      type: 'Full-time',
      salary: '$68k - $82k',
      tags: ['latest', 'onsite', 'private'],
      verified: true,
      orgType: 'Private'
    },
    {
      id: 'job-5',
      title: 'Warehouse Logistics Coordinator',
      company: 'CoreStack Logistics',
      logo: '📦',
      location: 'Austin, TX (Onsite)',
      type: 'Contract',
      salary: '$30 - $42 / hr',
      tags: ['contract', 'onsite'],
      verified: true,
      orgType: 'Private'
    },
    {
      id: 'job-6',
      title: 'Part-Time Delivery & Dispatch Rider',
      company: 'Supaspeed Logistics',
      logo: '🛵',
      location: 'New York, NY (Onsite)',
      type: 'Part-time',
      salary: '$22 - $28 / hr',
      tags: ['part-time', 'latest'],
      verified: false,
      orgType: 'Private'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Jobs' },
    { id: 'latest', label: 'Latest' },
    { id: 'onsite', label: 'Onsite / Nearby' },
    { id: 'government', label: 'Government' },
    { id: 'private', label: 'Private Sector' },
    { id: 'contract', label: 'Contract / Gigs' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'ai-recommended', label: 'AI Recommended' }
  ];

  const filteredJobs = activeFilter === 'all' 
    ? jobsData 
    : jobsData.filter(job => job.tags.includes(activeFilter) || job.type.toLowerCase() === activeFilter || job.orgType.toLowerCase() === activeFilter);

  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleOneClickApply = (id: string, title: string) => {
    if (appliedJobIds.includes(id)) return;
    setAppliedJobIds(prev => [...prev, id]);
    onApply(title);
  };

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">ACTIVE OPPORTUNITIES</span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
            Featured Vacancies
          </h2>
          <p className="mt-3 text-slate-500 text-xs sm:text-sm">
            Discover real-time, verified local gig listings and essential operations positions near you.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 pb-2 border-b border-slate-200">
          {filters.map((flt) => (
            <button
              key={flt.id}
              id={`filter-tab-${flt.id}`}
              onClick={() => setActiveFilter(flt.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all border whitespace-nowrap cursor-pointer ${
                activeFilter === flt.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {flt.id === 'ai-recommended' && <Sparkles className="h-3 w-3 inline mr-1 text-sky-500 animate-pulse" />}
              {flt.label}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-2xl shadow-sm">
                      {job.logo}
                    </div>

                    <div className="flex items-center space-x-2">
                      {job.verified && (
                        <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-500/10">
                          VERIFIED
                        </span>
                      )}
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        id={`btn-save-job-${job.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                      >
                        <Star className={`h-4 w-4 ${isSaved ? 'text-amber-500 fill-amber-550' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-left">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight hover:text-blue-600 transition cursor-pointer">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{job.company}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-600">
                    <span className="flex items-center space-x-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-sky-500" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
                      <DollarSign className="h-3.5 w-3.5 text-blue-600" />
                      <span>{job.salary}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{job.type}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                    DEPLOYER: {job.orgType}
                  </span>
                  
                  <button
                    onClick={() => handleOneClickApply(job.id, job.title)}
                    id={`btn-apply-${job.id}`}
                    disabled={isApplied}
                    className={`rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isApplied 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <span>One-Click Apply</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
