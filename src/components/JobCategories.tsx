/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Wrench, Truck, Car, Construction, Utensils, ClipboardCheck, ArrowRight,
  ShieldAlert, Sparkles, PiggyBank, Settings, HeartPulse
} from 'lucide-react';

interface JobCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export default function JobCategories({ onSelectCategory }: JobCategoriesProps) {
  const categories = [
    { name: 'Hospitality', icon: <ClipboardCheck className="h-5 w-5" />, count: '1,950 jobs' },
    { name: 'Construction', icon: <Construction className="h-5 w-5" />, count: '2,400 jobs' },
    { name: 'Driver', icon: <Car className="h-5 w-5" />, count: '3,800 jobs' },
    { name: 'Delivery', icon: <Truck className="h-5 w-5" />, count: '5,100 jobs' },
    { name: 'Electrician', icon: <Wrench className="h-5 w-5" />, count: '1,250 jobs' },
    { name: 'Catering', icon: <Utensils className="h-5 w-5" />, count: '940 jobs' },
    { name: 'Housekeeping', icon: <Sparkles className="h-5 w-5" />, count: '2,150 jobs' },
    { name: 'Retail Clerk', icon: <PiggyBank className="h-5 w-5" />, count: '3,100 jobs' },
    { name: 'Security Guard', icon: <ShieldAlert className="h-5 w-5" />, count: '1,450 jobs' },
    { name: 'Facilities Support', icon: <Settings className="h-5 w-5" />, count: '1,820 jobs' },
    { name: 'Caregiving', icon: <HeartPulse className="h-5 w-5" />, count: '2,300 jobs' }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-xl text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">DISCOVER SECTORS</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
              Explore Essential Categories
            </h2>
            <p className="mt-3 text-slate-650 text-xs sm:text-sm">
              Connecting you with essential, neighborhood general services and practical labor vacancies near you.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-extrabold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View all vacancy listings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Essential & General Services Grid */}
        <div className="text-left">
          <div className="flex items-center space-x-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Essential & General Services</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                id={`cat-card-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat.name)}
                className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-500 transition-all hover:shadow-md hover:-translate-y-0.5 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:scale-105 transition-all">
                  {cat.icon}
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-mono font-medium">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
