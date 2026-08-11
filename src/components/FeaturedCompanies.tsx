/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Eye, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function FeaturedCompanies() {
  const [followedCompanies, setFollowedCompanies] = useState<string[]>([]);

  const companiesData = [
    {
      id: 'comp-1',
      name: 'WorkNear Premium Lodging',
      logo: '🏨',
      rating: 4.8,
      reviewsCount: 1250,
      openPositions: 14,
      employeesCount: '800+',
      about: 'A premier network of boutique hotels, hospitality suites, and corporate lodging centers.'
    },
    {
      id: 'comp-2',
      name: 'VoltTech Repairs',
      logo: '⚡',
      rating: 4.9,
      reviewsCount: 380,
      openPositions: 6,
      employeesCount: '120+',
      about: 'Leading regional electrical repairs, industrial wiring diagnostics, and facility maintenance.'
    },
    {
      id: 'comp-3',
      name: 'Bloom Fine Catering',
      logo: '🍳',
      rating: 4.7,
      reviewsCount: 620,
      openPositions: 9,
      employeesCount: '450+',
      about: 'High-volume corporate banqueting, seasonal menu engineering, and kitchen staffing solutions.'
    },
    {
      id: 'comp-4',
      name: 'CoreStack Logistics',
      logo: '📦',
      rating: 4.5,
      reviewsCount: 2900,
      openPositions: 22,
      employeesCount: '1,500+',
      about: 'A highly-optimized network of regional cargo dispatch hubs, warehousing, and fleet routing.'
    }
  ];

  const toggleFollow = (id: string) => {
    setFollowedCompanies(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200/50 dark:border-stone-800/50 transition-colors duration-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400">PARTNER CORPORATIONS</span>
          <h2 className="text-3xl font-black tracking-tight text-stone-900 dark:text-white mt-2 leading-none">
            Featured Global Companies
          </h2>
          <p className="mt-3 text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Connect directly with verified teams leading the future of remote engineering, product design, and general operations.
          </p>
        </div>

        {/* Company Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companiesData.map((company) => {
            const isFollowing = followedCompanies.includes(company.id);

            return (
              <div
                key={company.id}
                id={`company-card-${company.id}`}
                className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-850 dark:bg-stone-900/60 flex flex-col justify-between hover:border-teal-500/20 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-2xl border border-stone-200/80 dark:border-stone-750 font-black shadow-sm">
                      {company.logo}
                    </div>
                    
                    <button
                      onClick={() => toggleFollow(company.id)}
                      id={`btn-follow-${company.id}`}
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                        isFollowing
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 dark:bg-stone-950 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                      <span>{company.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </h3>
                    
                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-1 mt-1 text-xs">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-stone-800 dark:text-stone-200">{company.rating}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-400 font-semibold">{company.reviewsCount} employee reviews</span>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 leading-relaxed">
                      {company.about}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span className="bg-stone-50 dark:bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-100 dark:border-stone-800/60 font-bold text-teal-700 dark:text-teal-400">
                    {company.openPositions} Open Positions
                  </span>
                  
                  <span className="flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5 text-stone-400" />
                    <span>{company.employeesCount}</span>
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
