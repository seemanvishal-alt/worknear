/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Sparkles, Zap, ArrowRight, CheckCircle, 
  Check, AlertCircle, Quote, Star, Verified, HeartHandshake, Eye, ShieldCheck, Heart, MapPin, Phone, QrCode, Sliders,
  Mail
} from 'lucide-react';
import { mockFAQs } from '../data/mockData';

// Import our new premium modular sub-components
import HomeHero from './HomeHero';
import JobCategories from './JobCategories';
import FeaturedJobs from './FeaturedJobs';
import FeaturedCompanies from './FeaturedCompanies';
import LearningHub from './LearningHub';
import ReferralAndMobile from './ReferralAndMobile';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
}

export default function LandingPage({ setActiveTab, setSearchQuery }: LandingPageProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [faqCategory, setFaqCategory] = useState<'general' | 'employers' | 'workers'>('general');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Stats Counters
  const stats = [
    { value: '45,000+', label: 'Registered Workers' },
    { value: '3,400+', label: 'Active Employers Approved' },
    { value: '1,200+', label: 'Local Jobs Posted Today' },
    { value: '98%', label: 'Hiring Success Rate' }
  ];

  // Testimonials / Success Stories
  const successStories = [
    {
      quote: "WorkNear completely replaced our reliance on expensive local recruitment contractors. We matched with 12 catering helpers for our weekend wedding banquet, verified their Aadhaar profiles, and got in direct telephone contact in minutes.",
      author: "Elena Rostova",
      role: "Executive Banquet Chef",
      company: "Bloom Fine Catering",
      rating: 5
    },
    {
      quote: "As a licensed electrician, finding direct nearby commercial maintenance contracts without paying agency commissions was nearly impossible. With WorkNear, local hotels hire me directly. It's safe, immediate, and pays instantly!",
      author: "Marcus Chen",
      role: "Licensed Journeyman Electrician",
      company: "VoltTech Independent Partner",
      rating: 5
    }
  ];

  const handleSearchFilters = (filters: { title: string; company: string; location: string }) => {
    setSearchQuery(filters.title || filters.company || filters.location);
    setActiveTab('gig-marketplace');
  };

  const handlePostJobAction = () => {
    setActiveTab('gig-marketplace');
  };

  const handleCategorySourcing = (category: string) => {
    setSearchQuery(category);
    setActiveTab('gig-marketplace');
  };

  const handleAppliedTrigger = (jobTitle: string) => {
    setSearchQuery(jobTitle);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  const filteredFAQs = mockFAQs.filter(faq => faq.category === faqCategory);

  return (
    <div className="relative min-h-screen bg-white transition-colors duration-200">
      
      {/* 1. Full-screen Hero Section */}
      <HomeHero 
        onSearch={handleSearchFilters} 
        onPostJobClick={handlePostJobAction} 
        setActiveTab={setActiveTab}
      />

      {/* 2. Interactive Sourcing Statistics - Redesigned as dynamic royal blue marketing bar */}
      <section className="bg-blue-600 py-10 border-t border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 border-l border-white/20" id={`landing-stat-${idx}`}>
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-blue-100 font-mono tracking-wider uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Job Categories Grid */}
      <JobCategories onSelectCategory={handleCategorySourcing} />

      {/* 4. Featured Jobs List with Interactive filters */}
      <FeaturedJobs onApply={handleAppliedTrigger} />

      {/* 6. Featured Companies Cards */}
      <FeaturedCompanies />

      {/* 7. Why Choose Us Section */}
      <section className="py-20 bg-slate-50 text-left transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">BENEFIT COVENANTS</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
              Why Elite Teams Choose Us
            </h2>
            <p className="mt-3 text-slate-550 text-xs sm:text-sm">
              We eliminate traditional hiring delays and legal overhead, offering a bulletproof platform for high-velocity global growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Verified Job Postings",
                desc: "Every corporate requisition goes through double-factor employer verification, ensuring safe contract deployments.",
                icon: <Verified className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Pre-screened Recruiter Nodes",
                desc: "Connect only with active, hiring organizations backed by clear regional employee feedback loops.",
                icon: <ShieldCheck className="h-6 w-6 text-sky-500" />
              },
              {
                title: "Unified Sourcing Security",
                desc: "Experience sovereign contract enforcement and secure escrowed multi-currency payments.",
                icon: <HeartHandshake className="h-6 w-6 text-indigo-500" />
              },
              {
                title: "99.8% AI Matching Accuracy",
                desc: "Our cognitive algorithms parse exact talent capabilities, entirely bypassing obsolete syntax rules.",
                icon: <Sparkles className="h-6 w-6 text-blue-550" />
              },
              {
                title: "Instant One-Click Application",
                desc: "Dispatch your verified profile directly to hiring decision-makers with zero intermediate agent loops.",
                icon: <Zap className="h-6 w-6 text-indigo-600" />
              },
              {
                title: "Ultra-Fast Onboarding Speed",
                desc: "Complete pre-employment screening, EOR legal setup, and payroll alignment within 48 hours.",
                icon: <CheckCircle className="h-6 w-6 text-blue-500" />
              }
            ].map((benefit, i) => (
              <div 
                key={i} 
                id={`benefit-${i}`}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-start space-x-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 shrink-0 border border-slate-100">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{benefit.title}</h4>
                  <p className="text-[11px] text-slate-550 mt-1.5 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Learning Hub Suite */}
      <LearningHub />

      {/* 9. Employer Features Section (Easy to Understand Format) */}
      <section className="py-20 bg-white border-b border-slate-100 transition-colors duration-200 text-left" id="employer-features-summary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700">WORKNEAR FOR EMPLOYERS</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
              Simple. Direct. Verified.
            </h2>
            <p className="mt-3 text-slate-550 text-xs sm:text-sm">
              Avoid recruitment overhead and long interview cycles. WorkNear matches you with vetted local talent within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Highlight Left Panel */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-150 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-100/30 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative space-y-4">
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">Nearby Active Talent</span>
                <h3 className="text-sm font-extrabold text-slate-900">Immediate Proximity Match</h3>
                
                <div className="space-y-2.5">
                  {[
                    { name: 'Rahul S.', role: 'Banquet Chef', dist: '1.2 km away', rating: '4.9★', active: true },
                    { name: 'Amit K.', role: 'Certified Electrician', dist: '2.5 km away', rating: '4.8★', active: true },
                    { name: 'Deepak M.', role: 'Warehouse Assistant', dist: '4.1 km away', rating: '4.7★', active: false }
                  ].map((worker, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${worker.active ? 'bg-teal-600 animate-pulse' : 'bg-slate-350'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{worker.name}</p>
                          <p className="text-[10px] text-slate-500">{worker.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-teal-700">{worker.dist}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{worker.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('employers')}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-3 rounded-2xl transition text-center cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>Launch Employer Console</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Structured Features List Right Panel */}
            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  title: 'Hyperlocal Proximity Matching',
                  desc: 'Instantly find and sort candidates based on their current physical distance, certified credentials, and available shift schedules (Morning, Afternoon, Night).',
                  tag: 'Under 10 Minutes'
                },
                {
                  title: 'No Middlemen or Chat Delays',
                  desc: 'Bypass long message threads. When you accept an application, the candidate’s direct verified mobile phone number is immediately shared for phone calls or WhatsApp alignment.',
                  tag: 'Direct Connection'
                },
                {
                  title: 'Ironclad Compliance & Fast Payroll',
                  desc: 'Enjoy peace of mind with biometric Aadhaar card verification, live facial matches on-site, QR code shift check-ins, and automated instant UPI wage payments.',
                  tag: 'Safe & Verified'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 hover:bg-slate-50/50 rounded-2xl transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 shrink-0 text-teal-700 border border-teal-100 font-mono text-sm font-black">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h4 className="text-sm font-black text-slate-900 leading-none">{item.title}</h4>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{item.tag}</span>
                    </div>
                    <p className="text-[11px] text-slate-550 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 10. Referral Console & Mobile App Download */}
      <ReferralAndMobile />

      {/* 11. Success Stories / Testimonials */}
      <section className="py-20 bg-slate-50 transition-colors duration-200 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">TESTIMONIAL STORIES</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2 leading-none">
              Endorsed by Top Industry Leaders
            </h2>
            <p className="mt-3 text-slate-550 text-xs sm:text-sm">
              Read how candidates and corporate partners validate our high-dimensional matching framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-550 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-550" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-slate-100">
                  <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.author}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.role} • {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 13. Frequently Asked Questions Accordion */}
      <section className="py-20 bg-slate-50 border-t border-slate-100" id="faq-section text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">KNOWLEDGE BASE</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none mt-2">
              Frequently Answered Truths
            </h2>
            <p className="mt-3 text-slate-500 text-xs">
              Clear breakdowns of our billing, AI processing engines, and local compliance operations.
            </p>
          </div>

          {/* FAQ Category Toggles */}
          <div className="flex justify-center space-x-2 mb-8">
            {['general', 'employers', 'workers'].map((category) => (
              <button
                key={category}
                id={`faq-toggle-${category}`}
                onClick={() => {
                  setFaqCategory(category as any);
                  setActiveFaq(null);
                }}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
                  faqCategory === category
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4 text-left">
            {filteredFAQs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  id={`faq-item-container-${faq.id}`}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                >
                  <button
                    id={`faq-btn-${faq.id}`}
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
                  >
                    <span>{faq.question}</span>
                    <span className="text-blue-750 text-lg font-black">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100" id={`faq-answer-${faq.id}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* R&D & Institutional Partner Section */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100 text-left" id="homepage-rd-hub-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-150 inline-block">
                GLOBAL R&D & COORDINATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Our Engineering & Research Campus
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                WorkNear partners with premier technical institutes to coordinate high-dimensional AI workforce matching systems, conduct machine learning performance validation, and incubate next-generation developers.
              </p>
              <div className="pt-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Institutional Partner Hub</h4>
                    <p className="text-xs text-slate-500 font-medium">Sri Sai Ranganathan Engineering College, Coimbatore, India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic Sourcing Contact</h4>
                    <a href="mailto:seemanvishal@gmail.com" className="text-xs text-blue-600 hover:underline font-mono font-medium">
                      seemanvishal@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-6 shadow-sm text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">COORDINATOR IN CHARGE</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                  S
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Seeman</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Project Head & Lead Architect</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Directing the sovereign platform engineering, compliance integrations, and local workforce coordination networks. Reach out for engineering partner opportunities.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Active Region: Tamil Nadu</span>
                <a href="mailto:seemanvishal@gmail.com" className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                  <span>Connect</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Newsletter dispatch - Redesigned to stunning corporate blue gradient banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-750 via-blue-600 to-indigo-700 text-white p-8 sm:p-12 text-center shadow-xl border border-blue-800">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-sky-200 to-sky-400" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight max-w-xl mx-auto uppercase">
            Stay Optimized on AI-Workforce & Global Sourcing
          </h2>
          <p className="mt-4 text-blue-100 text-xs max-w-lg mx-auto">
            Join 45,000+ executives and designers subscribing to our bi-weekly dispatch of compliance strategies and job alerts.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto">
            <input
              id="newsletter-email-input"
              type="email"
              placeholder="Enter your executive email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-blue-200 focus:border-white font-medium"
            />
            <button
              id="newsletter-submit-btn"
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-white px-6 py-3 text-xs font-black text-blue-800 hover:bg-blue-50 transition shadow-sm shrink-0 whitespace-nowrap uppercase tracking-wider cursor-pointer"
            >
              Subscribe Updates
            </button>
          </form>

          {newsletterStatus === 'success' && (
            <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-sky-200 font-bold" id="newsletter-success-alert">
              <CheckCircle className="h-4 w-4" />
              <span>Perfect! You are registered for the premium WorkNear briefing.</span>
            </div>
          )}
          {newsletterStatus === 'error' && (
            <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-red-200 font-bold" id="newsletter-error-alert">
              <AlertCircle className="h-4 w-4" />
              <span>Please enter a valid corporate email address.</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
